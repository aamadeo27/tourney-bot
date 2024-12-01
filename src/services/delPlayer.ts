import { Player } from "db/models/player"

export default async function delPlayer(
  name: string,
  reject: (s: string) => void,
  resolve: (s: string) => void,
){
  try {
    const r = await Player.deleteOne({ id: name })

    if (r.deletedCount === 0) {
      reject(`Player ${name} doesn't exist`)
      return 
    }
    
    resolve(`Player ${name} deleted`)
    
  } catch (error) {
    console.error(error)
    reject(`There was an error trying to delete the player ${name}`)
  }
}
