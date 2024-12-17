import getLastGames from "services/getLastGames"
import getStats from "services/getStats"
import { delay } from "utils"


export default async function score(say: (comment: string) => void) {

  const stats = await getStats()

  const ranking = stats.slice(0,10).map((s,i) => `${i+1}. ${s.player} (${s.points}/${s.sets})`).join(' ')

  return say(ranking)
}