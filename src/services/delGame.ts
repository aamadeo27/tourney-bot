import { Game } from "db/models/game"

export default async function delGame(
  gameId: string,
  reject: (s: string) => void,
  resolve: (s: string) => void,
){
  try {
    const r = await Game.deleteOne({ id: gameId })

    if (r.deletedCount === 0) {
      reject(`Game ${gameId} doesn't exist`)
      return 
    }
    
    resolve(`Game ${gameId} deleted`)
    
  } catch (error) {
    console.error(error)
    reject(`There was an error trying to delete the game ${gameId}`)
  }
}
