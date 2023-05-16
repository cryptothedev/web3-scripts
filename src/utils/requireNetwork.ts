import hre from 'hardhat'

import { NetworkName } from '../models/NetworkName'

export const requireNetwork = (networkName: NetworkName) => {
  if (hre.network.name !== networkName) {
    throw new Error(`please run on ${networkName} network`)
  }
}
