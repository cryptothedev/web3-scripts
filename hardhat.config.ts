import '@nomicfoundation/hardhat-toolbox'
import { HardhatUserConfig } from 'hardhat/config'

import { ConfigService } from './src/services/config.service'

const config: HardhatUserConfig = {
  solidity: '0.8.18',
  typechain: {
    externalArtifacts: ['./abis/*.json'],
  },
  networks: {
    eth: {
      url: 'https://eth.llamarpc.com',
      accounts: {
        mnemonic: ConfigService.getMnemonic(),
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 31,
      },
    },
    zk: {
      url: 'https://mainnet.era.zksync.io',
      accounts: {
        mnemonic: ConfigService.getMnemonic(),
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 31,
      },
    },
    arbitrum: {
      url: 'https://evocative-small-wave.arbitrum-mainnet.discover.quiknode.pro/7e16177013dd55e962aa2c83e4520c4e90e44ee5/',
      accounts: [ConfigService.getSecretKey()],
    },
    bsc: {
      url: 'https://bsc-dataseed1.binance.org/',
      accounts: [ConfigService.getSecretKey()],
    },
  },
}

export default config
