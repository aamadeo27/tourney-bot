import getPlayers from "bots/services/getPlayers";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export async function execute(interaction: CommandInteraction){
  try {
    const term = interaction.options.get('term', false)?.value as string | undefined

    const players = await getPlayers(term)
    await interaction.reply({
      content: `\`search\` ${term}:\n${players.join('\n')}`,
      ephemeral: true,
    })
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'Internal Error', 
      ephemeral: true
    })
  }
  
}

export const data = new SlashCommandBuilder()
  .setName('search')
  .setDescription('`search` <term> Search for players that match the string')
  .addStringOption((option) =>
    option.setName('term')
      .setDescription('Term to match the player')
      .setRequired(false)
  )