import { checkRunningAddresses } from '../../utils/checkRunningAddresses'
import { approveUSDC } from './approveUSDC'

const main = async () => {
  await checkRunningAddresses()
  await approveUSDC()
}

main()
