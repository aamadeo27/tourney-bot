import { Player } from "db/models/player";

export default async function getPlayers(search?: string){
  const players = await Player.find()

  return players
    .filter((p) => !search || p.id.match(search))
    .map((p) => p.id)
}