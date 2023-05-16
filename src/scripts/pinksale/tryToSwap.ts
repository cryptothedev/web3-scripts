import {ERC20Tradeable, PancakeRouter} from "../../../typechain-types";
import {BigNumber} from "ethers";
import {BSC} from "../../constants/BSC";
import {getDeadline} from "../../utils/getDeadline";

export const tryToSwap = async (
    token: ERC20Tradeable,
    pancakeRouter: PancakeRouter,
    amountIn: BigNumber,
    amountOutMin: string,
    tokenAddress: string,
    myAddress: string,
) => {
    if (await token.tradingEnabled().catch(() => true)) {
        const tx =
            await pancakeRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
                amountIn,
                amountOutMin,
                [tokenAddress, BSC.BNB],
                myAddress,
                getDeadline(),
            )
        console.log('swapped successfully')
        console.log(tx)
        process.exit()
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