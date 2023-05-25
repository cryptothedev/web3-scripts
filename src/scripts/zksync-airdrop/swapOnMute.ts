import { ethers } from 'hardhat'

import { MUTE__factory } from '../../../typechain-types'
import { ZKSYNC } from '../../constants/ZKSYNC'
import { NetworkName } from '../../models/NetworkName'
import { getDeadline } from '../../utils/getDeadline'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

export const swapOnMute = async () => {
  requireNetwork(NetworkName.ZK)

  const signers = await ethers.getSigners()

  for (const signer of signers) {
    const address = signer.address

    try {
      console.log(address, 'swapping')
      const contract = MUTE__factory.connect(ZKSYNC.MUTE, signer)
      const tx =
        await contract.swapExactETHForTokensSupportingFeeOnTransferTokens(
          '44681',
          [
            '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
            '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
          ],
          address,
          getDeadline(),
          [false, false],
          {
            value: ethers.utils.parseEther('0.001'),
            gasPrice: ZKSYNC.GasPrice,
            gasLimit: ZKSYNC.GasLimit,
          },
        )
      console.log('hash', tx.hash, tx.blockHash, tx.blockNumber)
      console.log(address, 'swapped')
    } catch (e) {
      console.error(address, 'failed to swap', e)
    } finally {
      await wait(2)
    }
  }
}
