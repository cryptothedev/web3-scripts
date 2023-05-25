import { ethers } from 'hardhat'

import { SyncSwap__factory } from '../../../typechain-types'
import { ZKSYNC } from '../../constants/ZKSYNC'
import { NetworkName } from '../../models/NetworkName'
import { getDeadline } from '../../utils/getDeadline'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

/** swap 0.2 eth to usdc on syncswap */
export const swapUSDCOnSyncSwap = async () => {
  requireNetwork(NetworkName.ZK)

  const signers = await ethers.getSigners()

  for (const signer of signers) {
    const address = signer.address

    try {
      console.log(address, 'swapping')
      const ethAmount = ethers.utils.parseEther('0.002')
      const contract = SyncSwap__factory.connect(ZKSYNC.SYNCSWAP, signer)
      const tx = await contract.swap(
        [
          {
            steps: [
              {
                pool: '0x80115c708E12eDd42E504c1cD52Aea96C547c05c',
                data: ethers.utils.defaultAbiCoder.encode(
                  ['address', 'address', 'uint8'],
                  [ZKSYNC.ETH, address, '2'],
                ),
                callback: ZKSYNC.ZERO,
                callbackData: '0x',
              },
            ],
            tokenIn: ZKSYNC.ZERO,
            amountIn: ethAmount,
          },
        ],
        '2327219',
        getDeadline(),
        {
          value: ethAmount,
          gasPrice: ZKSYNC.GasPrice,
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
