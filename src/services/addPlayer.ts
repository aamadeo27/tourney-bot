import { Player } from "db/models/player"
import { MongoServerError } from "mongodb"

export default async function addPlayer(
  name: string,
  timezone: string,
  reject: (s: string) => void,
  resolve: (s: string) => void,
){
  try {
    if (!timezone.match(/GMT(-|\+)\d\d?/) || Math.abs(parseInt(timezone.replace(/^..../g,''))) > 12) {
      reject(`Invalid timezone ${timezone}`)
      return 
    }

    const player = new Player({ id: name, tz: timezone })
    await player.save()
    resolve(`Player ${name} created`)

  } catch (error) {
    console.error(error)
    const mErr = error as MongoServerError

    if(mErr.message.match(/E11000 duplicate key error collection/)){
      reject(`Player ${name} is already registered`)
    } else {
      reject(`There was an error trying to create the player ${name}`)
    }
  }
}
