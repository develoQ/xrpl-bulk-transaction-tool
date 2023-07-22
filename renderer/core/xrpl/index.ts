import { utils, XrplClient } from 'xrpl-accountlib'

const client = new XrplClient()

export default {
  txValues: async (address: string) => {
    const result = await utils.accountAndLedgerSequence(client, address)
    return result.txValues
  },
  networkInfo: async (address: string) => {
    const result = await utils.accountAndLedgerSequence(client, address)
    return result.networkInfo
  },
  submit: async (txBlob: string) => {
    return await client.send({
      command: 'submit',
      tx_blob: txBlob
    })
  }
}
