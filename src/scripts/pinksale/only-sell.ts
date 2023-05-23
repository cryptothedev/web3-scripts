import { ethers } from 'hardhat'

import {
  ERC20Tradeable__factory,
  PancakeRouter__factory,
  PinkSaleClaim__factory,
} from '../../../typechain-types'
import { BSC } from '../../constants/BSC'
import { NetworkName } from '../../models/NetworkName'
import { requireNetwork } from '../../utils/requireNetwork'
import { tryToSwap } from './try-to-swap'

const main = async () => {
  requireNetwork(NetworkName.BSC)

  const signer = await ethers.getSigners().then((signers) => signers[0])

  const myAddress = signer.address

  const pinkSaleClaim = PinkSaleClaim__factory.connect(
    BSC.PINKSALE_CLAIM,
    signer,
  )

  const { token: tokenAddress } = await pinkSaleClaim.poolSettings()
  console.log('tokenAddress', tokenAddress)
  const token = ERC20Tradeable__factory.connect(tokenAddress, signer)
  const pancakeRouter = PancakeRouter__factory.connect(
    BSC.PANCAKE_ROUTER,
    signer,
  )
  const amountIn = await token.balanceOf(myAddress)
  console.log('amount in', amountIn)
  const amountOutMin = '0'

  await tryToSwap(
    token,
    pancakeRouter,
    amountIn,
    amountOutMin,
    tokenAddress,
    myAddress,
  )
}

main()
