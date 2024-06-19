const express = require('express');
const app = express();
app.use(express.json());

const detranSCResponses = require('./responses/detran_sc');
const detranMTResponses = require('./responses/detran_mt');

app.get('/apidatasync/v2/consulta/detran/sc/veiculo', (req, res) => {
  const { placa, renavam, token } = req.query;
  if (!placa || !renavam || !token) {
    return res.status(400).json({ message: 'Parâmetros faltando' });
  }

  let responseData = detranSCResponses.getResponse(placa, renavam, token);

  res.status(responseData.code).json(responseData);
});

app.get('/apidatasync/v2/consulta/detran/mt/veiculo', (req, res) => {
  const { placa, renavam, cpf, token } = req.query;
  if (!placa || !renavam || !cpf || !token) {
    return res.status(400).json({ message: 'Parâmetros faltando' });
  }

  let responseData = detranMTResponses.getResponse(placa, renavam, cpf, token);

  res.status(responseData.code).json(responseData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
