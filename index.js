const express = require('express');
const app = express();
const morgan = require('morgan');
const axios = require('axios');

require('dotenv').config();

console.log(`Trying to start server on : ${process.env.PORT}`);

app.use(morgan('tiny'));
app.use(express.static('./public'));

app.get('/secret', async(req, res) => {
  console.log(`Vault URL : ${process.env.VAULTURL}`);
  console.log(`Secret Name : ${process.env.VAULTSECRETNAME}`);

  const metadataResponse = await axios.get('http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://vault.azure.net', 
    {
      headers: {
        Metadata: true
      }
    }
  );

  const accessToken = metadataResponse.data.access_token;

  console.log('Access Token : ' + accessToken);

  const vaultResponse = await axios.get(`https://${process.env.VAULTURL}.vault.azure.net/secrets/${process.env.VAULTSECRETNAME}?api-version=2016-10-01`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  
  const secret = vaultResponse.data.value;

  console.log('Token Secret : ' + secret);

  res.send({
    secret: secret
  })
});

app.get('/color', async (req, res) => {
  res.send({
    color: process.env.BGCOLOR
  })
});

app.listen(process.env.PORT, () => {
  console.log('server running on port : ' + process.env.PORT);
});
