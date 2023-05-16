import { checkRunningAddresses } from '../../utils/checkRunningAddresses'
// import { swapUSDCOnSyncSwap } from './swapUSDCOnSyncSwap'

const main = async () => {
  await checkRunningAddresses()
  // await swapUSDCOnSyncSwap()
}

main()
