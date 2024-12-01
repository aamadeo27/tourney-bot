import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export async function execute(interaction: CommandInteraction){
  interaction.reply({
    content: [
      '/addplayer Admins only',
      '/delplayer Admins only',
      '/setgame Admins only',
      '/delgame Admins only',
      '/stats'
    ].join('\n'),
    ephemeral: true
  })
}

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('List of commands')