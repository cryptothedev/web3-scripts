import { ethers } from 'hardhat'

export const checkRunningAddresses = async () => {
  const signers = await ethers.getSigners()
  for (const signer of signers) {
    console.log(signer.address)
  }
}
