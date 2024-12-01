import 'dotenv/config'
import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import { requireEnv } from 'utils'
import commands from './commands'

const discordToken = requireEnv('DISCORD_TOKEN')
const discordAppId = requireEnv('DISCORD_APP_ID')
const discordGuildId = requireEnv('DISCORD_GUILD_ID')

const restClient = new REST({ version: '10' }).setToken(discordToken)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]})

const allowedChannels = requireEnv('DISCORD_CHANNELS').split(',')

const adminCommands = [
  'addplayer',
  'delplayer',
  'setgame',
  'delgame'
]
const admins = requireEnv('ADMINS').split(',')

/**
 * Commands
 * - /stats
 * - /games [PLAYER]
 * - /dog PLAYER
 * - /setResult P1 P2 P3 P4 W1 W2 -- ADMIN
 * - /delResult P1 P2 P3 P4 -- ADMIN
 * - /teams PLAYER => who played with player and who hasn't yet
 */

function registerCommands() {

  restClient.put(Routes.applicationGuildCommands(discordAppId, discordGuildId), { 
    body: Object.entries(commands.data).map(([_,data]) => data) 
  })

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return
  
    if (!allowedChannels.includes(interaction.channelId)) {
      console.error(`Channnel: ${interaction.channelId}\nAllowed Channels: ${allowedChannels}`)
      await interaction.reply({ content: `Commands can't be used in this channel`, ephemeral: true })
      return
    }

    if ( adminCommands.includes(interaction.commandName) &&
         !admins.includes(interaction.user.username) ){
      
        await interaction.reply({
          content: `Only admins can run this command: ${interaction.commandName}`,
          ephemeral: true
        })
        return
    }
  
    const cmd = commands.library[interaction.commandName]
  
    if (!cmd) {
      return
    }
  
    try {
      await cmd(interaction)
    } catch(error){
      console.error(error)
      await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true })
    }
  })
}

export default function start() {
  client.on(Events.ClientReady, async () => {
    console.log('Registering Commands')
    registerCommands() 
    console.log('Discord Bot Started')
  })

  client.login(discordToken)
}