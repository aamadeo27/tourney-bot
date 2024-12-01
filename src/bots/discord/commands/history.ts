import getPlayerHistory from "services/getPlayerHistory"
import { CommandInteraction, EmbedBuilder, Interaction, SlashCommandBuilder } from "discord.js"


function embedTeamMatch(heroTeam: string, enemyTeam: string, matchData: any){
  return new EmbedBuilder()
    .setColor(0x00FF99)
    .setTitle(`${heroTeam} vs ${enemyTeam}`)
    .addFields([
      { name: 'Wins', value: matchData.playerWins.toString(), inline: true },
      { name: 'Losses', value: matchData.enemyWins.toString(), inline: true },
      { name: 'Status', value: matchData.status.toString(), inline: true },
    ])
}

export async function execute(interaction: CommandInteraction){
  const nameOption = interaction.options.get('name', true)

  try {
    const history = await getPlayerHistory(nameOption.value as string)

    const embeds = []
    let chunk = []
    Object.keys(history).forEach(teammate => {
      history[teammate].forEach((match) => {
        chunk.push(embedTeamMatch(
          `${nameOption.value} & ${teammate}`,
          match.players.join(' & '),
          match
        ))

        if (chunk.length === 0) {
          embeds.push(chunk)
          chunk = []
        }
      })
    })

    if (chunk.length > 0) embeds.push(chunk)

    await interaction.deferReply()

    for (const chunk of embeds) {
      await interaction.followUp({ embeds: chunk, content: '\`/history ' + nameOption.value + '\`' });
    }
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'Internal Error', 
      ephemeral: true
    })
  }
  
}

export const data = new SlashCommandBuilder()
  .setName('history')
  .setDescription('`history` <name> See the teams and enemies this player played with')
  .addStringOption((option) =>
    option.setName('name')
      .setDescription('Name of the player')
      .setRequired(true)
  )