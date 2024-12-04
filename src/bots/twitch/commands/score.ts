import getLastGames from "services/getLastGames"
import { delay } from "utils"


export default async function score(say: (comment: string) => void, name: string) {
  const games = await getLastGames(name)

  for (const g of games) {
    say(`[${g.winner === g.playerTeam ? 'WIN' : 'LOSS'}] ${name} & ${g.teammate} vs ${g.enemyTeam} - ${g.date.toUTCString()}`)
    await delay(2000)
  }
}