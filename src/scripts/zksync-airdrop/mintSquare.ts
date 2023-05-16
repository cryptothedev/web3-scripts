import { ethers } from 'hardhat'

import { MINTSQUARE__factory } from '../../../typechain-types'
import { ZKSYNC } from '../../constants/ZKSYNC'
import { NetworkName } from '../../models/NetworkName'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

const mintSquare = async () => {
  requireNetwork(NetworkName.ZK)

  const signers = await ethers.getSigners()

  for (const signer of signers) {
    const address = signer.address

    try {
      console.log(address, 'minting')
      const mintContract = MINTSQUARE__factory.connect(
        ZKSYNC.MINTSQUARE,
        signer,
      )
      const tx = await mintContract.mint('')
      console.log('hash', tx.hash, tx.blockHash, tx.blockNumber)
      console.log(address, 'minted')
    } catch (e) {
      console.error('failed to approve', address, e)
    } finally {
      await wait(1)
    }
  }
}
