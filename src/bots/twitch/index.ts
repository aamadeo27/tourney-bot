import tmi from 'tmi.js'
import { requireEnv } from 'utils'
import * as commands from './commands'

const identity = {
  username: requireEnv('TWITCH_USERNAME'),
  password: requireEnv('TWITCH_PASSWORD')
}

const client = tmi.Client({
  identity,
  channels: requireEnv('TWITCH_CHANNELS').split(',')
})

export default async function start(){
  await client.connect()
  console.log('Connected to Twitch. Channels:', requireEnv('TWITCH_CHANNELS').split(','))

  client.on('message', async (channel, tags, message, self) => {
    if (self || !message) return
    if(!message.match(/^!/)) return

    const args = message.slice(1).split(' ')
    const command = args.shift()

    if(!commands[command]) return

    try {
      await commands[command]((s: string) => {
        console.log('nabbot: ',s)
        if (!s) return

        client.say(channel, s)
      }, args.join(' '))
    } catch (error) {
      console.error(`${channel}: ${message} : ${tags.username} : ${error}`)
    }
  })
}
