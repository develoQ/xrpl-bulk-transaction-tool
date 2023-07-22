import secureStorage from '../secureStorage'
import { derive, sign, generate } from 'xrpl-accountlib'

export default {
  create() {
    const account = generate.mnemonic()
    const mnemonic = account.secret!.mnemonic!
    const address = account.address!
    secureStorage.set(address, mnemonic)

    return { address }
  },
  delete(address: string) {
    secureStorage.delete(address)
    return
  },
  getAll() {
    return secureStorage.keys()
  },
  sign(address: string, txjson: any) {
    const mnemonic = secureStorage.get(address)
    const account = derive.mnemonic(mnemonic)
    return sign(txjson, account)
  },
  bulksign(address: string, txjsons: any[]) {
    const mnemonic = secureStorage.get(address)
    const account = derive.mnemonic(mnemonic)
    return txjsons.map((txjson) => {
      const result = sign(txjson, account)
      return {
        txJson: result.txJson,
        txBlob: result.signedTransaction,
        hash: result.id
      }
    })
  }
}
