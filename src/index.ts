import startDiscordBot from "bots/discord"
import startTwitchBot from "bots/twitch"
import { connectDB } from "db"

async function startBots(){
  console.log('Connecting DB')
  await connectDB()

  console.log('Connecting to Discord')
  startDiscordBot()
  startTwitchBot()
}

startBots()