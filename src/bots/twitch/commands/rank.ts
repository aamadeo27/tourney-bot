import getLastGames from "services/getLastGames"
import getStats from "services/getStats"
import { delay } from "utils"


export default async function rank(say: (comment: string) => void, name: string) {
  const stats = await getStats()

  const stat = stats.find((s) => s.player === name)

  say(`${stat.rank} - ${stat.player} ${stat.points}pts in ${stat.sets} sets`)
}