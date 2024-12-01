import delGame from "services/delGame"
import { CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js"

export async function execute(interaction: CommandInteraction){
  const idOption = interaction.options.get('id', true)

  await delGame(
    idOption.value as string,
    (s) => interaction.reply({
      content: s, ephemeral: true
    }),
    (s) => interaction.reply(s))
}

export const data = new SlashCommandBuilder()
  .setName('delgame')
  .setDescription('`game` <id> Deletes the game')
  .addStringOption((option) =>
    option.setName('id')
      .setDescription('Id of the game')
      .setRequired(true)
  )