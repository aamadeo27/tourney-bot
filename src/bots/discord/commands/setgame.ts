import setGame from "services/setGame";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export async function execute(interaction: CommandInteraction){
  const playerIDs = []
  for (let i = 1; i <= 4; i ++) {
    playerIDs.push(interaction.options.get(`p${i}`, true).value)
  }
  const winner = interaction.options.get('winner', true).value as number

  await setGame(
    playerIDs,
    winner,
    (s) => interaction.reply({
      content: s, ephemeral: true
    }),
    (s) => interaction.reply(s)
  )
}

export const data = new SlashCommandBuilder()
  .setName('setgame')
  .setDescription('`setgame` <p1> <p2> <p3> <p4> <winner> Stores the result of a game')
  .addStringOption((option) =>
    option.setName('p1')
      .setDescription('Name of the player 1')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('p2')
      .setDescription('Name of the player 2')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('p3')
      .setDescription('Name of the player 3')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('p4')
      .setDescription('Name of the player 4')
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option.setName('winner')
      .setDescription('Winner Team of the game.')
      .setChoices(
        { name: 'Team 1', value: 1 },
        { name: 'Team 2', value: 2 }
      )
      .setRequired(true)
  )