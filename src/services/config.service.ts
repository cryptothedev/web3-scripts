import dotenv from 'dotenv'

dotenv.config()

export class ConfigService {
  static getSecretKey() {
    return process.env['SECRET_KEY'] as string
  }

  static getMnemonic() {
    return process.env['MNEMONIC'] as string
  }

  static getBinanceApiKey() {
    return process.env['BINANCE_API_KEY'] as string
  }

  static getBinanceApiSecret() {
    return process.env['BINANCE_API_SECRET'] as string
  }
}
