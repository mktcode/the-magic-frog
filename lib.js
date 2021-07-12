import { utils as ethUtils } from 'web3'

export function getPotAmount (sponsors) {
  const potAmount = sponsors.reduce((value, sponsor) => (value + BigInt(sponsor.value)), BigInt(0))
  return Number(ethUtils.fromWei(potAmount.toString(), 'ether')) * 0.75
}

export function getPotAmountFirst (sponsors) {
  return (getPotAmount(sponsors) * 0.5).toFixed(6).replace(/0+$/, '')
}

export function getPotAmountSecond (sponsors) {
  return (getPotAmount(sponsors) * 0.3).toFixed(6).replace(/0+$/, '')
}

export function getPotAmountThird (sponsors) {
  return (getPotAmount(sponsors) * 0.2).toFixed(6).replace(/0+$/, '')
}
