import axios from 'axios'
import { ethers } from 'hardhat'

import { ZKApeClaim__factory } from '../../../typechain-types'
import { ZKSYNC } from '../../constants/ZKSYNC'
import { NetworkName } from '../../models/NetworkName'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

export const claimZkApe = async () => {
  requireNetwork(NetworkName.ZK)

  const signers = await ethers.getSigners()

  for (const signer of signers) {
    const address = signer.address

    try {
      console.log(address, 'claiming')
      const zkApeClaim = ZKApeClaim__factory.connect(ZKSYNC.ZKApeClaim, signer)
      const { deadline, nonce, owner, value, v, r, s } = await axios
        .post('https://zksync-ape-apis.zkape.io/airdrop/index/getcertificate', {
          address: signer.address,
        })
        .then((res) => res.data.Data)
      console.log({ deadline, nonce, owner, value, v, r, s })
      await zkApeClaim.claim(owner, value, nonce, deadline, v, r, s)
      console.log(address, 'claimed')
    } catch (e) {
      console.error('failed to claim', address, e)
    } finally {
      await wait(1)
    }
  }
}

claimZkApe()
