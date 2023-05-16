import { ethers } from 'hardhat'

import { ETHZKSyncBridge__factory } from '../../../typechain-types'
import { ETH } from '../../constants/ETH'
import { NetworkName } from '../../models/NetworkName'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

export const bridgeToZk = async () => {
  requireNetwork(NetworkName.ETH)

  const signers = await ethers.getSigners()
  const ethAmount = ethers.utils.parseEther('0.14210571850805748')
  const l2Value = '141401616683393064'

  for (const signer of signers) {
    const address = signer.address
    try {
      console.log(address, 'bridging')
      const bridgeContract = ETHZKSyncBridge__factory.connect(
        ETH.ETHBRIDGETOZK,
        signer,
      )
      const tx = await bridgeContract.requestL2Transaction(
        address,
        l2Value,
        '0x',
        '742563',
        '800',
        [],
        address,
        { value: ethAmount, gasPrice: signer.getGasPrice() },
      )
      console.log('hash', tx.hash, tx.blockHash, tx.blockNumber)
      console.log(address, 'bridged')
    } catch (e) {
      console.error(address, 'failed to bridge', e)
    } finally {
      await wait(3)
    }
  }
}
