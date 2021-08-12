const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const clientes = [];

//Middleware

function verificarSeExisteCPFNaConta(request, response, next) {
  const { cpf } = request.headers;

  const cliente = clientes.find((cliente) => cliente.cpf === cpf);

  if (!cliente) {
    return response.status(400).json({ error: "Cliente não encontrado" });
  }

  request.cliente = cliente;
  return next()
}

/**
 * cpf - string
 * nome - string
 * id - uuid
 * estado []
 */
app.post("/conta", (request, response) => {
  const { cpf, nome } = request.body;

  const clienteJaExiste = clientes.some((cliente) => cliente.cpf === cpf);

  if (clienteJaExiste) {
    return response.status(400).json({ error: "Cliente já existe!" });
  }

  clientes.push({
    cpf,
    nome,
    id: uuidv4(),
    extrato: [],
  });

  return response.status(201).json({ message: "cadastrado" });
});

//app.use(verificarSeExisteCPFNaConta);

app.get("/extrato", verificarSeExisteCPFNaConta, (request, response) => {
  const {cliente} = request;

  return response.json(cliente.extrato);
});

app.listen(3333);
