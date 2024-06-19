require('dotenv').config();
const express = require('express');
const fs = require('fs');
const app = express();
const ngrok = require('@ngrok/ngrok');
app.use(express.json());

const detranSCResponses = require('./responses/detran_sc');
const detranMTResponses = require('./responses/detran_mt');
const detranMSResponses = require('./responses/detran_ms');

const logFilePath = './call_logs.json';

// Função para ler os logs do arquivo
function readLogs() {
  if (fs.existsSync(logFilePath)) {
    const data = fs.readFileSync(logFilePath);
    return JSON.parse(data);
  }
  return { totalCalls: 0, totalValue: 0, calls: [] };
}

// Função para escrever os logs no arquivo
function writeLogs(logs) {
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
}

// Função para registrar uma chamada
function registerCall(endpoint, params, code) {
  const logs = readLogs();
  logs.totalCalls += 1;
  logs.totalValue += 3.89;
  logs.calls.push({ endpoint, params, code });
  writeLogs(logs);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Parâmetros: ${JSON.stringify(params)}`);
  console.log(`Código da resposta: ${code}`);
  console.log(`Total de chamadas: ${logs.totalCalls}`);
  console.log(`Valor total: ${logs.totalValue.toFixed(2)}`);
}

app.get('/apidatasync/v2/consulta/detran/sc/veiculo', (req, res) => {
  const { placa, renavam, token } = req.query;
  if (!placa || !renavam || !token) {
    const code = 400;
    registerCall('/apidatasync/v2/consulta/detran/sc/veiculo', { placa, renavam, token }, code);
    return res.status(code).json({ message: 'Parâmetros faltando' });
  }

  let responseData = detranSCResponses.getResponse(placa, renavam, token);

  registerCall('/apidatasync/v2/consulta/detran/sc/veiculo', { placa, renavam, token }, responseData.code);
  res.status(responseData.code).json(responseData);
});

app.get('/apidatasync/v2/consulta/detran/mt/veiculo', (req, res) => {
  const { placa, renavam, cpf, token } = req.query;
  if (!placa || !renavam || !cpf || !token) {
    const code = 400;
    registerCall('/apidatasync/v2/consulta/detran/mt/veiculo', { placa, renavam, cpf, token }, code);
    return res.status(code).json({ message: 'Parâmetros faltando' });
  }

  let responseData = detranMTResponses.getResponse(placa, renavam, cpf, token);

  registerCall('/apidatasync/v2/consulta/detran/mt/veiculo', { placa, renavam, cpf, token }, responseData.code);
  res.status(responseData.code).json(responseData);
});

app.get('/apidatasync/v2/consulta/detran/ms/veiculo', (req, res) => {
  const { placa, token } = req.query;
  if (!placa || !token) {
    const code = 400;
    registerCall('/apidatasync/v2/consulta/detran/ms/veiculo', { placa, token }, code);
    return res.status(code).json({ message: 'Parâmetros faltando' });
  }

  let responseData = detranMSResponses.getResponse(placa, token);

  registerCall('/apidatasync/v2/consulta/detran/ms/veiculo', { placa, token }, responseData.code);
  res.status(responseData.code).json(responseData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
   Inicia o ngrok após o servidor estar rodando
   ngrok.connect({ addr: PORT, authtoken: process.env.NGROK_AUTHTOKEN })
    .then(listener => console.log(`Ingress established at: ${listener.url()}`))
    .catch(error => console.error('Error establishing ngrok connection:', error));
});
