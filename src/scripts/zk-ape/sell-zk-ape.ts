import { ethers } from 'hardhat'

import { ERC20__factory, SyncSwap__factory } from '../../../typechain-types'
import { ZKSYNC } from '../../constants/ZKSYNC'
import { NetworkName } from '../../models/NetworkName'
import { getDeadline } from '../../utils/getDeadline'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

export const claimZkApe = async () => {
  requireNetwork(NetworkName.ZK)

  const signers = await ethers.getSigners()

  for (const signer of signers) {
    const address = signer.address

    try {
      const zkApeClaim = ERC20__factory.connect(ZKSYNC.ZKApe, signer)
      const amountIn = await zkApeClaim
        .balanceOf(address)
        .then((balance) => balance.toString())

      const zyncSwap = SyncSwap__factory.connect(ZKSYNC.SYNCSWAP, signer)

      await zyncSwap.swap(
        [
          {
            steps: [
              {
                pool: '0x2A936038B695F48b68a560cf01C4Cf8899616C5c',
                data: ethers.utils.defaultAbiCoder.encode(
                  ['address', 'address', 'uint8'],
                  [
                    ZKSYNC.ZKApe,
                    '0x80115c708E12eDd42E504c1cD52Aea96C547c05c',
                    '0',
                  ],
                ),
                callback: ZKSYNC.ZERO,
                callbackData: '0x',
              },
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
            tokenIn: ZKSYNC.ZKApe,
            amountIn: amountIn,
          },
        ],
        '1',
        getDeadline(),
      )
    } catch (e) {
      console.error('failed to sell', address, e)
    } finally {
      await wait(1)
    }
  }
}

claimZkApe()
