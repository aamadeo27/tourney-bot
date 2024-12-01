import { Game } from "db/models/game";
import { Player } from "db/models/player";
import { ITeam, Team } from "db/models/teams";

export default async function getPlayerHistory(name: string) {
  const teams = await Team.find({ $or: [{ p1: name }, { p2: name }]})
  const playerGames = (await Promise.all( teams.map(async (t) => {
    if (t.p1 !== name && t.p2 !== name) return Promise.resolve(null)

    const games = await Game.find({ $or: [{ t1: t.id }, { t2: t.id }] })

    return games.map((g) => ({ 
      id: g.id,
      teammate: t.p1 === name ? t.p2 : t.p1,
      enemyTeam: t.id === g.t1 ? g.t2 : g.t1,
      playerTeam: t.id,
      winner: g.winner === 1 ? g.t1 : g.t2
    }))

  }))).filter((g) => !!g).flat()
  
  const gamesPerTeam = {}
  playerGames.forEach((g) => {
    const tGames = gamesPerTeam[g.playerTeam] = gamesPerTeam[g.playerTeam] ?? {
      teammate: g.teammate,
      gamesVs: {}
    }

    const gamesVsTeam = tGames.gamesVs[g.enemyTeam] =  tGames.gamesVs[g.enemyTeam] ?? {
      enemyWins: 0,
      playerWins: 0,
      status: 'ongoing'
    }

    if (!gamesVsTeam.finished) {
      gamesVsTeam.playerWins += g.winner === g.playerTeam ? 1 : 0
      gamesVsTeam.enemyWins += g.winner === g.enemyTeam ? 1 : 0

      if (gamesVsTeam.playerWins === 2){
        gamesVsTeam.status = 'won'
      } else if (gamesVsTeam.enemyWins === 2) {
        gamesVsTeam.status = 'lost'
      }
    }
  })

  // console.log('Games Per team: ',JSON.stringify(gamesPerTeam, null, 2))

  const history = {}
  const otherPlayers = await Player.find({ id: { $ne: name }})
  otherPlayers.forEach((p) => history[p.id] = [])

  Object.keys(gamesPerTeam).forEach((tid) => {
    const data = gamesPerTeam[tid]
    history[data.teammate] = Object.keys(data.gamesVs).map(
      (vs) => ({ vs, ...data.gamesVs[vs] })
    )
  })

  await Promise.all(Object.keys(history).map(async (teammate) => {
    if (history[teammate].length === 0) return
    
    let team = await Team.findOne({ id: history[teammate][0].vs })
    history[teammate][0].players = [team.p1, team.p2]
  
    if (!history[teammate][1]) return
    team = await Team.findOne({ id: history[teammate][1].vs })
    history[teammate][1].players = [team.p1, team.p2]

  }))

  // console.log('Player History', JSON.stringify(history, null, 2))

  return history
}