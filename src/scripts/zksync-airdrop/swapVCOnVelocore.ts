import { ethers } from 'hardhat'

import { VELOCORE__factory } from '../../../typechain-types'
import { ZKSYNC } from '../../constants/ZKSYNC'
import { NetworkName } from '../../models/NetworkName'
import { getDeadline } from '../../utils/getDeadline'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

export const swapVCOnVelocore = async () => {
  requireNetwork(NetworkName.ZK)

  const signers = await ethers.getSigners()
  const ethAmount = 0.03
  const gasPriceGwei = 0.25

  for (const signer of signers) {
    const address = signer.address

    try {
      console.log(address, 'swapping')
      const contract = VELOCORE__factory.connect(ZKSYNC.VELOCORE, signer)
      const tx = await contract.swapExactETHForTokens(
        '10', // slippage 100%
        [
          {
            from: ZKSYNC.ETH,
            to: ZKSYNC.VC,
            stable: false,
          },
        ],
        address,
        getDeadline(),
        {
          value: ethers.utils.parseEther(ethAmount.toString()),
          gasPrice: ethers.utils.parseUnits(gasPriceGwei.toString(), 'gwei'),
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
