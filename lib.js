const { utils: ethUtils } = require('web3')

const getPotAmount = (sponsors) => {
  const potAmount = sponsors.reduce((value, sponsor) => (value + BigInt(sponsor.value)), BigInt(0))
  return Number(ethUtils.fromWei(potAmount.toString(), 'ether')) * 0.75
}

const getPotAmountFirst = (sponsors) => {
  return (getPotAmount(sponsors) * 0.5).toFixed(6).replace(/0+$/, '')
}

const getPotAmountSecond = (sponsors) => {
  return (getPotAmount(sponsors) * 0.3).toFixed(6).replace(/0+$/, '')
}

const getPotAmountThird = (sponsors) => {
  return (getPotAmount(sponsors) * 0.2).toFixed(6).replace(/0+$/, '')
}

const getUsersFromStory = (storyString) => {
  const regEx = /<story-part username="([A-Za-z0-9_]{1,15})"/g
  const usernames = [...storyString.matchAll(regEx)].map(match => match[1])
  return usernames
}

module.exports = {
  getPotAmount,
  getPotAmountFirst,
  getPotAmountSecond,
  getPotAmountThird,
  getUsersFromStory
}
