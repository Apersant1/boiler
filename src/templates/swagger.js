const express = require('express');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');
const cors = require('cors');
const app = express();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:4000', 'http://localhost:80']
};

const swaggerOptions = {
  explorer: true,
  customCss: '#swagger-ui .topbar { background-color: rgb(44, 44, 44); }',
  customSiteTitle: 'Интерактивная документация',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument,swaggerOptions));

app.listen(4000, () => {
  console.log('Документация доступна по адресу\nhttp://localhost:4000/docs');
});