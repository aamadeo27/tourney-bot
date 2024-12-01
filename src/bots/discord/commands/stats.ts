import getStats from "bots/services/getStats";
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

const AVATARS = [
  'https://i.imgur.com/iKAySrY.png',
  'https://i.imgur.com/ZIgPp8G.png',
  'https://i.imgur.com/gt2slI7.png',
  'https://i.imgur.com/fdtfmvv.png',
  'https://i.imgur.com/G4ZK8KK.png',
  'https://i.imgur.com/Hl4QxCt.png',
  'https://i.imgur.com/qZ95sqn.png',
  'https://i.imgur.com/leoLMvl.png'
]

function img(name: string) {
  let hash = 0
  for ( const char of name) {
    hash = (hash + char.charCodeAt(0)) % AVATARS.length
  }

  return AVATARS[hash]
}

function embedPlayer(stat: any) {
  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(stat.player)
    .setThumbnail(img(stat.player))
    .addFields([
      { value: stat.rank.toString(), name: 'Rank', inline: true },
      { value: stat.points.toString(), name: 'Points', inline: true },
      { value: stat.sets.toString(), name: 'Sets', inline: true },
    ])
}

export async function execute(interaction: CommandInteraction){
  const name = interaction.options.get('name', false)?.value.toString().toLowerCase()

  try {
    let stats = (await getStats()).map((stat,i) => ({ rank: i+1, ...stat }))
    
    if (name) {
      stats = stats.filter((p,i) => name === p.player)
    }

    await interaction.deferReply()

    const embedsList = []
    let tmp = []
    stats.forEach((stat) => {
      tmp.push(embedPlayer(stat))

      if (tmp.length === 10) {
        embedsList.push(tmp)
        tmp = []
      }
    })

    if (tmp.length > 0) {
      embedsList.push(tmp)
    }

    for (const embeds of embedsList) {
      await interaction.followUp({ embeds, content: '\`/stats ' + (name ?? '') + '\`' });
    }

  } catch(error) {
    console.error('[ERROR]', error)
    interaction.reply({
      content: 'Internal Error', 
      ephemeral: true
    })
  }
}

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('`stats` [name] League Stats')
  .addStringOption((option) =>
    option.setName('name')
      .setDescription('Name of the player, or leave it empty for all players')
      .setRequired(false)
  )