import '@nomicfoundation/hardhat-toolbox'
import { HardhatUserConfig } from 'hardhat/config'

import { ConfigService } from './src/services/config.service'

const accounts = {
  mnemonic: ConfigService.getMnemonic(),
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 33,
}

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  typechain: {
    externalArtifacts: ['./abis/*.json'],
  },
  networks: {
    eth: {
      url: 'https://eth.llamarpc.com',
      accounts,
    },
    zk: {
      url: 'https://mainnet.era.zksync.io',
      accounts,
    },
    arbitrum: {
      url: 'https://evocative-small-wave.arbitrum-mainnet.discover.quiknode.pro/7e16177013dd55e962aa2c83e4520c4e90e44ee5/',
      accounts,
    },
    bsc: {
      url: 'https://bsc-dataseed1.binance.org/',
      accounts,
    },
  },
}

export default config
