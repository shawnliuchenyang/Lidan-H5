const express = require('express');
const config = require('./config');
const { getHtmlByConfig } = require('./html');

const app = express();
const port = config.env.port;
const html = getHtmlByConfig(JSON.stringify(config));

app.get('/healthz', (_, res) => {
  res.send('OK');
});

app.use(express.static('dist'));

app.get('/*', (_, res) => {
  res.send(html);
});

app.listen(port, () => console.log(`> Server is running on 127.0.0.1:${port}`));
