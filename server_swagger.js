const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-docs-swagger.json');
const app = express();

app.use(express.json());

const detranSCResponses = require('./responses/detran_sc');
const detranMTResponses = require('./responses/detran_mt');
const detranMSResponses = require('./responses/detran_ms');

function logRequest(endpoint, params, code) {
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Parâmetros: ${JSON.stringify(params)}`);
  console.log(`Código da resposta: ${code}`);
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/apidatasync/v2/consulta/detran/sc/veiculo', (req, res) => {
  const { placa, renavam, token } = req.query;
  if (!placa || !renavam || !token) {
    const code = 400;
    logRequest('/apidatasync/v2/consulta/detran/sc/veiculo', { placa, renavam, token }, code);
    return res.status(code).json({ message: 'Parâmetros faltando' });
  }

  let responseData = detranSCResponses.getResponse(placa, renavam, token);

  logRequest('/apidatasync/v2/consulta/detran/sc/veiculo', { placa, renavam, token }, responseData.code);
  res.status(responseData.code).json(responseData);
});

app.get('/apidatasync/v2/consulta/detran/mt/veiculo', (req, res) => {
  const { placa, renavam, cpf, token } = req.query;
  if (!placa || !renavam || !cpf || !token) {
    const code = 400;
    logRequest('/apidatasync/v2/consulta/detran/mt/veiculo', { placa, renavam, cpf, token }, code);
    return res.status(code).json({ message: 'Parâmetros faltando' });
  }

  let responseData = detranMTResponses.getResponse(placa, renavam, cpf, token);

  logRequest('/apidatasync/v2/consulta/detran/mt/veiculo', { placa, renavam, cpf, token }, responseData.code);
  res.status(responseData.code).json(responseData);
});

app.get('/apidatasync/v2/consulta/detran/ms/veiculo', (req, res) => {
  const { placa, token } = req.query;
  if (!placa || !token) {
    const code = 400;
    logRequest('/apidatasync/v2/consulta/detran/ms/veiculo', { placa, token }, code);
    return res.status(code).json({ message: 'Parâmetros faltando' });
  }

  let responseData = detranMSResponses.getResponse(placa, token);

  logRequest('/apidatasync/v2/consulta/detran/ms/veiculo', { placa, token }, responseData.code);
  res.status(responseData.code).json(responseData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`O Servidor ApiDataSync está rodando na porta ${PORT}`);
  console.log(`A documentação Swagger do Servidor ApiDataSync está disponível em http://localhost:${PORT}/api-docs`);
});
