import { BigNumber } from 'ethers'

import { ERC20Tradeable, PancakeRouter } from '../../../typechain-types'
import { BSC } from '../../constants/BSC'
import { getDeadline } from '../../utils/getDeadline'

export const tryToSwap = async (
  token: ERC20Tradeable,
  pancakeRouter: PancakeRouter,
  amountIn: BigNumber,
  amountOutMin: string,
  tokenAddress: string,
  myAddress: string,
) => {
  if (await token.tradingEnabled().catch(() => true)) {
    try {
      const tx =
        await pancakeRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          [tokenAddress, BSC.BNB],
          myAddress,
          getDeadline(),
        )
      console.log(tx)
      console.log('swapped successfully')
      return
    } catch (e) {
      console.log(e)
    }
  }

  await tryToSwap(
    token,
    pancakeRouter,
    amountIn,
    amountOutMin,
    tokenAddress,
    myAddress,
  )
}
