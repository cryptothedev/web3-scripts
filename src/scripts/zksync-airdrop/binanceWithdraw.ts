import { MainClient, WithdrawParams } from 'binance'
import { ethers } from 'hardhat'

import { ConfigService } from '../../services/config.service'
import { wait } from '../../utils/wait'

export const binanceWithdraw = async () => {
  const signers = await ethers.getSigners()

  for (const signer of signers) {
    const address = signer.address
    try {
      console.log(address, 'withdrawing')

      const client = new MainClient({
        api_key: ConfigService.getBinanceApiKey(),
        api_secret: ConfigService.getBinanceApiSecret(),
      })

      const params = {
        network: 'ETH',
        amount: 0.15,
        address,
        coin: 'ETH',
      } as WithdrawParams

      console.log(params)

      await client.withdraw(params)

      console.log(address, 'withdrawn')
    } catch (e) {
      console.error(address, 'failed to transfer from binance', e)
    } finally {
      await wait(3)
    }
  }
}
