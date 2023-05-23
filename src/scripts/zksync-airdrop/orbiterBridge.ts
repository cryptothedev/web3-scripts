import { ethers } from 'hardhat'

import { NetworkName } from '../../models/NetworkName'
import { requireNetwork } from '../../utils/requireNetwork'
import { wait } from '../../utils/wait'

enum ChainCode {
  ZKEra = 9014,
  StarkNet = 9004,
}

// need config
const FROM = NetworkName.ARBITRUM
const TO = ChainCode.ZKEra
const ETH_AMOUNT = '0.00550000000000'

// no need to change
const CONTRACT_ADDRESS = '0x80c67432656d59144ceff962e8faf8926599bcf8'
export const orbiterBridge = async () => {
  requireNetwork(FROM)

  if (ETH_AMOUNT.split('.')[1].length !== 14) {
    throw new Error('eth amount is invalid')
  }

  const ethAmount = ethers.utils.parseEther(ETH_AMOUNT + TO.toString())

  const signers = await ethers.getSigners()
  for (const signer of signers) {
    const { address } = signer
    try {
      console.log('bridging', address)
      await signer.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: ethAmount,
      })
    } catch (e) {
      console.error('failed to bridge', address)
    } finally {
      console.error('bridged', address)
      await wait(1)
    }
  }
}

orbiterBridge()
