import { Game } from "db/models/game"
import { ITeam, Team } from "db/models/teams"

export default async function getLastGames(name: string) {
  const teams = await Team.find({ $or: [{ p1: name }, { p2: name }]})
  const team = teams.reduce((newest, t) => {
    if (!newest) return t

    return newest.createdAt < t.createdAt ? t : newest
  }, null) as ITeam

  console.log('Last Team', team)

  const games = await Game.find({ $or: [{ t1: team.id }, { t2: team.id }] })

  const playerGames = games.map((g) => ({ 
    id: g.id,
    teammate: team.p1 === name ? team.p2 : team.p1,
    enemyTeam: team.id === g.t1 ? g.t2 : g.t1,
    playerTeam: team.id,
    winner: g.winner === 1 ? g.t1 : g.t2,
    date: new Date(g.createdAt)
  }))

  const enemyTeams = await Team.find({ id: { $in: playerGames.map((pg) => pg.enemyTeam ) }})
  const enemyMap = {}
  
  enemyTeams.forEach((et) => {
    enemyMap[et.id] = [et.p1, et.p2]
  })

  playerGames.forEach((pg) => {
    pg.enemyTeam = enemyMap[pg.enemyTeam].join(' & ')
  })

  return playerGames
}