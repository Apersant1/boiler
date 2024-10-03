export default (projectName) => 
`
import express from "express";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";

const swaggerDocument = YAML.load("./openapi.yaml");
const app = express();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:4000', 'http://localhost:80']
};

const swaggerOptions = {
  explorer: true,
  customCss: '#swagger-ui .topbar { background-color: rgb(44, 44, 44); }',
  customSiteTitle: '${projectName}',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument,swaggerOptions));

app.listen(4000, () => {
  console.log('Документация доступна по адресу  http://localhost:4000/docs');
});

`