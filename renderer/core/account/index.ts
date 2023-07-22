import wallet from '../../../main/libs/wallet'

export default class Account {

  constructor(public address: string) { }

  static create() {
    const { address } = wallet.create()
    return new this(address)
  }
  static getAll() {
    const addresses = wallet.getAll()
    return addresses.map(address => new this(address))
  }

  sign(txjson: string) {
    return wallet.sign(this.address, txjson)
  }
  bulkSign(txjsons: string[]) {
    return wallet.bulksign(this.address, txjsons)
  }
}
