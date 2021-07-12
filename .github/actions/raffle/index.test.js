const { getUsersFromStory } = require('../../../lib')

const testStory = `
<story-part username="mkt">there was a wizard...</story-part>

<story-part username="mkt" image="https://i.imgur.com/uJaJeTn.png">who had to run some errands to plan a surprise party for his little frog friend.</story-part>

<story-part username="hennifant">what caught the attention of the high council of suspicious and insatiable storks in the neighborhood</story-part>`

test('get users from story string', async () => {
  const users = getUsersFromStory(testStory)
  expect(users).toEqual(['mkt', 'mkt', 'hennifant'])
})