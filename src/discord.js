const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login('MTA3NzMzNDUyNDE1NDg3NjAyNg.GLV3pj.RPAovzUTCcezSqvAhRDb3TNTWr6GEr6YzHcbMg');

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

const moveUsersToChannels = async (users1, users2, channel1Id, channel2Id) => {
  const channel1 = client.channels.cache.get(channel1Id);
  const channel2 = client.channels.cache.get(channel2Id);

  if (!channel1 || !channel2) {
    throw new Error('Channel not found.');
  }

  if (channel1.type !== 'voice' || channel2.type !== 'voice') {
    throw new Error('Channel is not a voice channel.');
  }

  // Move users from the first array to channel 1
  for (const user of users1) {
    const member = await channel1.guild.members.fetch(user.id);
    if (!member.voice.channel) {
      throw new Error('User is not in a voice channel.');
    }
    await member.voice.setChannel(channel1);
  }

  // Move users from the second array to channel 2
  for (const user of users2) {
    const member = await channel2.guild.members.fetch(user.id);
    if (!member.voice.channel) {
      throw new Error('User is not in a voice channel.');
    }
    await member.voice.setChannel(channel2);
  }
};


module.exports = { getVoiceMembers, moveUsersToChannels };