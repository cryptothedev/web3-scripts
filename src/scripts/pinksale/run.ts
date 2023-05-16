import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'

import {
  ERC20Tradeable,
  ERC20Tradeable__factory,
  PancakeRouter,
  PancakeRouter__factory,
  PinkSaleClaim__factory,
} from '../../../typechain-types'
import { BSC } from '../../constants/BSC'
import { NetworkName } from '../../models/NetworkName'
import { getDeadline } from '../../utils/getDeadline'
import { requireNetwork } from '../../utils/requireNetwork'

const tryToSwap = async (
  token: ERC20Tradeable,
  pancakeRouter: PancakeRouter,
  amountIn: BigNumber,
  amountOutMin: string,
  tokenAddress: string,
  myAddress: string,
) => {
  if (await token.tradingEnabled().catch(() => true)) {
    const tx =
      await pancakeRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
        amountIn,
        amountOutMin,
        [tokenAddress, BSC.BNB],
        myAddress,
        getDeadline(),
      )
    console.log('swapped successfully')
    console.log(tx)
    return
  }

  await tryToSwap(
    token,
    pancakeRouter,
    amountIn,
    amountOutMin,
    tokenAddress,
    myAddress,
  )
}

const main = async () => {
  requireNetwork(NetworkName.BSC)

  const signer = await ethers.getSigners().then((signers) => signers[0])
  const myAddress = signer.address

  const pinkSaleClaim = PinkSaleClaim__factory.connect(
    BSC.PINKSALE_CLAIM,
    signer,
  )

  const { token: tokenAddress } = await pinkSaleClaim.poolSettings()
  const token = ERC20Tradeable__factory.connect(tokenAddress, signer)
  const pancakeRouter = PancakeRouter__factory.connect(
    BSC.PANCAKE_ROUTER,
    signer,
  )

  const wssProvider = new ethers.providers.WebSocketProvider(BSC.WSS_PROVIDER)
  const pinkSaleClaimWSS = PinkSaleClaim__factory.connect(
    BSC.PINKSALE_CLAIM,
    wssProvider,
  )
  const finalizedFilter = pinkSaleClaimWSS.filters.Finalized()
  pinkSaleClaimWSS.on(finalizedFilter, async () => {
    // claim
    await pinkSaleClaim.claim()

    const amountIn = await token.balanceOf(myAddress)
    const amountOutMin = '0'

    // approve
    await token.approve(BSC.PANCAKE_ROUTER, amountIn)

    // swap token to BNB
    await tryToSwap(
      token,
      pancakeRouter,
      amountIn,
      amountOutMin,
      tokenAddress,
      myAddress,
    )
  })
}

main()
