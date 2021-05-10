const express = require('express');
const app = express();
const morgan = require('morgan');
const axios = require('axios');

require('dotenv').config();

console.log(`Trying to start server on : ${process.env.PORT}`);

app.use(morgan('tiny'));
app.use(express.static('./public'));


app.get('/color', async (req, res) => {
  const accessToken = await axios.get('http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net', {
    Headers: {
      Metadata: 'true'
    }
  }).data.access_token;

  const secret = await axios.get(`http://${process.env.VAULTURL}/secrets/${process.env.VAULTSECRETNAME}?api-version=2016-10-01`, {
    Headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).data.value

  res.send({
    color: process.env.BGCOLOR,
    secret: secret
  })
});

app.listen(process.env.PORT, () => {
  console.log('server running on port : ' + process.env.PORT);
});
