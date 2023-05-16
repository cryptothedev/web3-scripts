import { ethers } from 'hardhat'

import { wait } from '../../utils/wait'

export const generateWallets = async () => {
  while (true) {
    const wallet = ethers.Wallet.createRandom().connect(ethers.provider)
    const { address, mnemonic } = wallet
    const lowercaseAddress = address.toLowerCase()
    const balance = await wallet
      .getBalance()
      .then((balance) => balance.toNumber())
    console.log(lowercaseAddress, 'balance:', balance)
    if (balance > 0) {
      console.log(mnemonic.phrase)
      break
    }
    if (
      lowercaseAddress.endsWith('999999') ||
      lowercaseAddress.endsWith('888888') ||
      lowercaseAddress.endsWith('777777') ||
      lowercaseAddress.endsWith('999999') ||
      lowercaseAddress.includes('precha999') ||
      lowercaseAddress.includes('ruy999') ||
      lowercaseAddress.includes('kvyrai') ||
      lowercaseAddress.includes('kvy999') ||
      lowercaseAddress.includes('dev888') ||
      lowercaseAddress.includes('dev999') ||
      lowercaseAddress.includes('bukkub') ||
      lowercaseAddress.endsWith('696969')
    ) {
      console.log(mnemonic.phrase)
      break
    }
    await wait(1)
  }
}

generateWallets()
