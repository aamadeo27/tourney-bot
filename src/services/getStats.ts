import { Game } from "db/models/game";
import { Player } from "db/models/player";
import { ITeam, Team } from "db/models/teams";


function updatePlayerStat(stats: Map<string, any>, id: string, points: number, setkey: string){
  let stat = stats.get(id) 

  stat.sets.add(setkey)
  stat.points += points

  console.log(setkey, id, points)
}

export default async function getStats() {
  const games = await Game.find({}).sort({ t1: 1, t2: 1 })
  const sets = {}
  const stats = new Map()

  const players = await Player.find({})
  players.forEach((p) => stats.set(p.id, { sets: new Set(), points: 0 }))

  const teams = await Team.find({})
  const teamMap = new Map<string, ITeam>()
  teams.forEach((t) => teamMap.set(t.id, t))

  games.forEach((g) => {
    let winnerId = g.winner === 1 ? g.t1 : g.t2
    console.log({
      t1: `${teamMap.get(g.t1).p1}+${teamMap.get(g.t1).p2}`,
      t2: `${teamMap.get(g.t2).p1}+${teamMap.get(g.t2).p2}`,
      winner: g.winner,
      id: g.id,
    })

    const setKey = g.t1 < g.t2 ? `${g.t1}v${g.t2}` : `${g.t2}v${g.t1}`
    const set = sets[setKey] = sets[setKey] ?? { 
      t1: g.t1,
      t2: g.t2,
      t1Wins: 0,
      t2Wins: 0,
      closed: false
    }

    if (winnerId === set.t1) {
      set.t1Wins++
    } else {
      set.t2Wins++
    }
    
    const t1 = teamMap.get(set.t1)
    const t2 = teamMap.get(set.t2)

    // Team 1 Update
    updatePlayerStat(stats, t1.p1, winnerId === set.t1 ? 1 : 0, setKey)
    updatePlayerStat(stats, t1.p2, winnerId === set.t1 ? 1 : 0, setKey)

    // Team 2 Update
    updatePlayerStat(stats, t2.p1, winnerId === set.t2 ? 1 : 0, setKey)
    updatePlayerStat(stats, t2.p2, winnerId === set.t2 ? 1 : 0, setKey)
  })
  
  const result = Array.from(stats, ([player, stat]) => ({ player, ...stat, sets: stat.sets.size }))

  return result.sort((a,b) => b.points - a.points).map((stat,i) => ({ rank: i+1, ...stat }))
}