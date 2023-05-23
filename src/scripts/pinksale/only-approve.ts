import { ethers } from 'hardhat'

import {
  ERC20Tradeable__factory,
  PinkSaleClaim__factory,
} from '../../../typechain-types'
import { BSC } from '../../constants/BSC'
import { NetworkName } from '../../models/NetworkName'
import { requireNetwork } from '../../utils/requireNetwork'

const AMOUNT_TO_APPROVE = 0

const main = async () => {
  requireNetwork(NetworkName.BSC)

  const signer = await ethers.getSigners().then((signers) => signers[0])

  const pinkSaleClaim = PinkSaleClaim__factory.connect(
    BSC.PINKSALE_CLAIM,
    signer,
  )

  const { token: tokenAddress } = await pinkSaleClaim.poolSettings()
  const token = ERC20Tradeable__factory.connect(tokenAddress, signer)
  console.log('token address', tokenAddress)

  const decimals = await token.decimals()
  console.log('decimals', decimals)

  const amountIn = ethers.utils.parseUnits(
    AMOUNT_TO_APPROVE.toString(),
    decimals,
  )
  console.log('amount to approve', AMOUNT_TO_APPROVE, amountIn)

  await token.approve(BSC.PANCAKE_ROUTER, amountIn).then((tx) => tx.wait(1))
}

main()
