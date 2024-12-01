import { Game } from "db/models/game"
import { Player } from "db/models/player"
import { Team } from "db/models/teams"
import { genId, teamId } from "utils"

export default async function setGame(
  playerIDs: string [],
  winner: number,
  reject: (s: string) => void,
  resolve: (s: string) => void,
){
  if (winner !== 1 && winner !== 2) {
    reject('Winner has to be 1 or 2')
    return
  }

  try {
    const players = await Promise.all(playerIDs.map( (id) => Player.find({ id })))

    const errors = []
    players.forEach((p,i) => {
      if (p.length === 0) errors.push(`Player ${playerIDs[i]} not found`)
    })
    
    if (errors.length > 0) {
      reject(errors.join('\n'))
      return
    }

    const createTeam = async (t: 0 | 1) => {
      const id = teamId(playerIDs[t*2], playerIDs[t*2+1])

      const team = await Team.findOne({ id })
      if (team) return team

      console.log('Creating Team ',t+1)
      const newTeam = new Team({ id, p1: playerIDs[t*2], p2: playerIDs[t*2 + 1] })
      await newTeam.save()

      return newTeam
    }

    const t1 = await createTeam(0)
    const t2 = await createTeam(1)
    
    const t1Games = await Game.find({ $or: [{ t1: t1.id }, { t2: t1.id }]})
    const t2Games = await Game.find({ $or: [{ t1: t2.id }, { t2: t2.id }]})
    
    const rivals = { t1: {}, t2: {} }
    const increase = (obj, key) => {
      if (!obj[key]) obj[key] = 0
      obj[key]++
    }

    t1Games.forEach((g) => increase(rivals.t1, g.t1 === t1.id ? g.t2 : g.t1))
    t2Games.forEach((g) => increase(rivals.t2, g.t1 === t2.id ? g.t2 : g.t1))

    if (Object.keys(rivals.t1).length === 2 && !rivals.t1[t2.id]) {
      errors.push(`Team 1 can not play together more than 2 sets`)
    }

    if (rivals.t1[t2.id] === 3) {
      errors.push(`Team 1 can only play 1 bo3 set vs Team 2`)
    }

    if (Object.keys(rivals.t2).length === 2 && !rivals.t2[t1.id]) {
      errors.push(`Team 2 can not play together more than 2 sets`)
    }
    
    if(errors.length > 0){
      reject( errors.join('\n'))
      return
    }

    const game = new Game({
      id: genId(),
      t1: t1.id,
      t2: t2.id,
      winner
    })

    await game.save()

    resolve(`The game ${playerIDs[0]} & ${playerIDs[1]} vs ${playerIDs[2]} ${playerIDs[3]} - winner Team ${winner} has been stored: ${game.id}`)
  } catch (error) {
    console.error(error)
    reject(`There was an error trying to store the game`)
  }
}
