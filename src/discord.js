const Discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

const { MessageEmbed, Intents, Client } = require('discord.js');
const { prefix } = require('./config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

// const client = new Discord.Client();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const channelID = '716723662337605663';
const exec = require('child_process').exec;

const serverIP = '35.246.195.175';
const gamePath = 'C:/MOHAA/moh_spearhead.exe';

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login('MTA3NzMzNDUyNDE1NDg3NjAyNg.Gtrxkr.ad__E6H7Wuyg9jIx1B3sXeawCBmDzS8rAQdGGs');

const getVoiceMembers = async (channelId) => {
  const channel = client.channels.cache.get(channelId);
  if (!channel) {
    throw new Error('Channel not found.');
  }

  if (channel.type !== 'voice') {
    throw new Error('Channel is not a voice channel.');
  }

  const voiceMembers = await channel.members;
  const membersList = voiceMembers.map((member) => ({
    username: member.user.username,
    nickname: member.nickname,
    id: member.user.id,
  }));

  return membersList;
};

const moveUsersToChannels = async (users1, users2, channel1Id, channel2Id, channel3Id, channel4Id) => {
  let channel1, channel2;
  if (channel1Id && channel2Id) {
    channel1 = client.channels.cache.get(channel1Id);
    channel2 = client.channels.cache.get(channel2Id);
    if (!channel1 || !channel2) {
      throw new Error('Channel not found.');
    }
    if (channel1.type !== 'voice' || channel2.type !== 'voice') {
      throw new Error('Channel is not a voice channel.');
    }
  }
  
  let channel3, channel4;
  if (channel3Id && channel4Id) {
    channel3 = client.channels.cache.get(channel3Id);
    channel4 = client.channels.cache.get(channel4Id);
    if (!channel3 || !channel4) {
      throw new Error('Channel not found.');
    }
    if (channel3.type !== 'voice' || channel4.type !== 'voice') {
      throw new Error('Channel is not a voice channel.');
    }
  }

  // Move users from the first array to channel 1 or channel 3
  if (users1 && (channel1 && channel2)) {
    for (const user of users1) {
      const member = await channel1.guild.members.fetch(user.id);
      if (!member.voice.channel) {
        throw new Error('User is not in a voice channel.');
      }
      await member.voice.setChannel(channel1);
    }
  } else if (users1 && (channel3 && channel4)) {
    for (const user of users1) {
      const member = await channel3.guild.members.fetch(user.id);
      if (!member.voice.channel) {
        throw new Error('User is not in a voice channel.');
      }
      await member.voice.setChannel(channel3);
    }
  }

  // Move users from the second array to channel 2 or channel 4
  if (users2 && (channel1 && channel2)) {
    for (const user of users2) {
      const member = await channel2.guild.members.fetch(user.id);
      if (!member.voice.channel) {
        throw new Error('User is not in a voice channel.');
      }
      await member.voice.setChannel(channel2);
    }
  } else if (users2 && (channel3 && channel4)) {
    for (const user of users2) {
      const member = await channel4.guild.members.fetch(user.id);
      if (!member.voice.channel) {
        throw new Error('User is not in a voice channel.');
      }
      await member.voice.setChannel(channel4);
    }
  }
};

const doc = new GoogleSpreadsheet('1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo');
const players = [];

async function getPlayers() {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),   
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  rows.forEach(row => players.push(row.Player));  
}

getPlayers();

const formEmbed = new MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Formularz')
  .setDescription('Wypełnij formularz');
const team1Fields = [];
const team2Fields = [];

for (let i = 0; i < 7; i++) {
  team1Fields.push({
    name: `Gracz ${i+1} drużyna 1`,
    type: 'SELECT_MENU',
    options: players.map(player => ({ label: player, value: player })),
  });

  team2Fields.push({
    name: `Gracz ${i+1} drużyna 2`,
    type: 'SELECT_MENU',
    options: players.map(player => ({ label: player, value: player })),
  });
}

formEmbed.addFields(
  ...team1Fields,
  { name: 'Wygrane rundy drużyna 1', type: 'NUMBER' },
  ...team2Fields,
  { name: 'Wygrane rundy drużyna 2', type: 'NUMBER' },
);

const filter = i => i.customId.startsWith('form-');

// client.on('interactionCreate', async interaction => {
//   console.log('interaction', interaction)
//   if (!interaction.isCommand()) return;

//   if (interaction.commandName === 'formularz') {
//     console.log('FORMUALRZ ok')
//     const message = await interaction.reply({ embeds: [formEmbed], fetchReply: true });
//     const collector = message.createMessageComponentCollector({ filter, time: 15000 });

//     collector.on('collect', async interaction => {
//       const [fieldName, team, index] = interaction.customId.split('-');

//       if (interaction.isSelectMenu()) {
//         const player = interaction.values[0];
//         const field = formEmbed.fields.find(f => f.name === fieldName);

//         field.value = `${player} - Ranking: 10`; // pobierz ranking gracza z bazy danych

//         await interaction.update({ embeds: [formEmbed] });
//       }

//       if (interaction.isButton()) {
//         const team1Wins = formEmbed.fields.find(f => f.name === 'Wygrane rundy drużyna 1').value;
//         const team2Wins = formEmbed.fields.find(f => f.name === 'Wygrane rundy drużyna 2').value;

//         // zapisz wartości do bazy danych
//         console.log(`Drużyna 1: ${team1Wins} wygranych rund`);
//         console.log(`Drużyna 2: ${team2Wins} wygranych rund`);
//       }
//     });
//   }
// });

client.on('interactionCreate', async interaction => {
  console.log('interaction', interaction)
  if (interaction.isButton() || interaction.isSelectMenu()) {
    const [fieldName, team, index] = interaction.customId.split('-');

    if (interaction.isSelectMenu()) {
      const player = interaction.values[0];
      const field = formEmbed.fields.find(f => f.name === fieldName);

      field.value = `${player} - Ranking: 10`; // pobierz ranking gracza z bazy danych

      await interaction.update({ embeds: [formEmbed] });
    }

    if (interaction.isButton()) {
      const team1Wins = formEmbed.fields.find(f => f.name === 'Wygrane rundy drużyna 1').value;
      const team2Wins = formEmbed.fields.find(f => f.name === 'Wygrane rundy drużyna 2').value;

      // zapisz wartości do bazy danych
      console.log(`Drużyna 1: ${team1Wins} wygranych rund`);
      console.log(`Drużyna 2: ${team2Wins} wygranych rund`);
      }
      }

      if (!interaction.isCommand()) return;

      if (interaction.commandName === 'formularz') {
      console.log('FORMULARZ ok')
      const message = await interaction.reply({ embeds: [formEmbed], fetchReply: true });
      const collector = message.createMessageComponentCollector({ filter, time: 15000 });


      collector.on('collect', async interaction => {
        const [fieldName, team, index] = interaction.customId.split('-');
      
        if (interaction.isSelectMenu()) {
          const player = interaction.values[0];
          const field = formEmbed.fields.find(f => f.name === fieldName);
      
          field.value = `${player} - Ranking: 10`; // pobierz ranking gracza z bazy danych
      
          await interaction.update({ embeds: [formEmbed] });
        }
      
        if (interaction.isButton()) {
          const team1Wins = formEmbed.fields.find(f => f.name === 'Wygrane rundy drużyna 1').value;
          const team2Wins = formEmbed.fields.find(f => f.name === 'Wygrane rundy drużyna 2').value;
      
          // zapisz wartości do bazy danych
          console.log(`Drużyna 1: ${team1Wins} wygranych rund`);
          console.log(`Drużyna 2: ${team2Wins} wygranych rund`);
        }
      });
    }
  });

module.exports = { getVoiceMembers, moveUsersToChannels };