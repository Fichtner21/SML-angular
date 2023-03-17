const Discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');

const client = new Discord.Client();
const channelID = '716723662337605663';
const exec = require('child_process').exec;

const serverIP = '35.246.195.175';
const gamePath = 'C:/MOHAA/moh_spearhead.exe';

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login('MTA3NzMzNDUyNDE1NDg3NjAyNg.G55S-W.Stp-4Djx1S2ofAQZ7Frm9RkIkWIPFcJ61r3M9A');

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

module.exports = { getVoiceMembers, moveUsersToChannels };