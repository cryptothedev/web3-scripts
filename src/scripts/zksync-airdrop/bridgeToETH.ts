import { ethers } from 'hardhat'

import { ZKWithdraw__factory } from '../../../typechain-types'
import { ZKSYNC } from '../../constants/ZKSYNC'
import { NetworkName } from '../../models/NetworkName'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

export const bridgeToETH = async () => {
  requireNetwork(NetworkName.ZK)

  const signers = await ethers.getSigners()
  const ethAmount = ethers.utils.parseEther('0.001')

  for (const signer of signers) {
    const address = signer.address
    try {
      console.log(address, 'bridging to eth')
      const bridgeContract = ZKWithdraw__factory.connect(
        ZKSYNC.L2EthToken,
        signer,
      )
      const tx = await bridgeContract.withdraw(address, { value: ethAmount })
      console.log('hash', tx.hash, tx.blockHash, tx.blockNumber)
      console.log(address, 'bridged to eth')
    } catch (e) {
      console.error(address, 'failed to bridge to eth', e)
    } finally {
      await wait(1)
    }
  }
}
