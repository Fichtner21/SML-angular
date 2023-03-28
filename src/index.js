const express = require('express');
const bodyParser = require('body-parser');
const { getVoiceMembers, moveUsersToChannels } = require('./discord');

const app = express();

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/voice-members', async (req, res) => {
  try {
    const membersList = await getVoiceMembers('851888778409672756');
    res.json(membersList);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/move-users-to-channels', async (req, res) => {
  try {
    const users1 = req.body.users1;
    const users2 = req.body.users2;
    const channel1Id = req.body.channel1Id;
    const channel2Id = req.body.channel2Id;
    const channel3Id = req.body.channel3Id;
    const channel4Id = req.body.channel4Id;

    await moveUsersToChannels(users1, users2, channel1Id, channel2Id, channel3Id, channel4Id);

    res.sendStatus(200);
  } catch (err) {    
    res.status(500).send(err.message);
    }
});

app.post('/test-post', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});