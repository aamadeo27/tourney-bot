import addPlayer from "services/addPlayer";
import { CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { MongoServerError } from "mongodb";

export async function execute(interaction: CommandInteraction){
  const nameOption = interaction.options.get('name', true)
  const tzOption = interaction.options.get('timezone', true)
  
  console.log(interaction.user.username,'is creating player', nameOption, tzOption)
  const timezone = tzOption.value.toString().replace(/ /g,'').toUpperCase()
  const name = nameOption.value.toString().toLowerCase()

  await addPlayer(
    name,
    timezone,
    (s) => interaction.reply({
      content: s, ephemeral: true
    }),
    (s) => interaction.reply(s)
  )
}

export const data = new SlashCommandBuilder()
  .setName('addplayer')
  .setDescription('`addplayer` <name> <timezone> Adds the player to the tournament')
  .addStringOption((option) =>
    option.setName('name')
      .setDescription('Name of the player')
      .setRequired(true)
  )
  .addStringOption((option) => 
    option.setName('timezone')
      .setDescription('Timezone of the player. GMT-X or GMT+X')
      .setRequired(true)
  )