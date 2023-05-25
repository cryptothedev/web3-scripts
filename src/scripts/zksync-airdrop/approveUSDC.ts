import { ethers } from 'hardhat'

import { ERC20__factory } from '../../../typechain-types'
import { ZKSYNC } from '../../constants/ZKSYNC'
import { NetworkName } from '../../models/NetworkName'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

export const approveUSDC = async () => {
  requireNetwork(NetworkName.ZK)

  const signers = await ethers.getSigners()

  for (const signer of signers) {
    const address = signer.address

    try {
      console.log(address, 'approving')
      const usdcContract = ERC20__factory.connect(ZKSYNC.USDC, signer)
      await usdcContract.approve(
        ZKSYNC.MUTE,
        ethers.utils.parseUnits('300', 6),
        { gasPrice: ZKSYNC.GasPrice },
      )
      console.log(address, 'approved')
    } catch (e) {
      console.error('failed to approve', address, e)
    } finally {
      await wait(1)
    }
  }
}
