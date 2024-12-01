import * as addplayer from './addplayer'
import * as delplayer from './delplayer'
import * as setgame from './setgame'
import * as delgame from './delgame'
import * as stats from './stats'
import * as help from './help'
import * as history from './history'

const discordCommands = { library: {}, data: {} }

const commands = {
  addplayer,
  delplayer,
  setgame,
  delgame,
  stats,
  history,
  help
}

Object.entries(commands).forEach(([key, cmd]) => {
  discordCommands.library[key] = cmd.execute,
  discordCommands.data[key] = cmd.data
})

export default discordCommands