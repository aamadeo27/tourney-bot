import delPlayer from "bots/services/delPlayer"
import { CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js"

export async function execute(interaction: CommandInteraction){
  const nameOption = interaction.options.get('name', true)

  await delPlayer(
    nameOption.value as string,
    (s) => interaction.reply({
      content: s, ephemeral: true
    }),
    (s) => interaction.reply(s))
}

export const data = new SlashCommandBuilder()
  .setName('delplayer')
  .setDescription('`delplayer` <name> Removes the player to the tournament')
  .addStringOption((option) =>
    option.setName('name')
      .setDescription('Name of the player')
      .setRequired(true)
  )