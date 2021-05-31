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

  const metadataResponse = await axios.get('http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fmanagement.azure.com%2F', 
    {
      headers: {
        Metadata: true
      }
    }
  ).data;

  console.log(`Fetched metadata endpoint : ${metadataResponse}`);
  
  const accessToken = metadataResponse.access_token;
  
  const vaultResponse = await axios.get(`http://${process.env.VAULTURL}/secrets/${process.env.VAULTSECRETNAME}?api-version=2016-10-01`, {
    Headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).data
  
  console.log(`Fetched Key Vault endpoint : ${vaultResponse}`);
  const secret = vaultResponse.value;

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
