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
  return next();
}

function pegarBalanco(extrato) {
  const balanco = extrato.reduce((acumulador, operacao) => {
    if (operacao.tipo === "credito") {
      return acumulador + operacao.valor;
    } else {
      return acumulador - operacao.valor;
    }
  }, 0);

  return balanco;
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
  const { cliente } = request;

  return response.json(cliente.extrato);
});

app.post("/deposito", verificarSeExisteCPFNaConta, (request, response) => {
  const { descricao, valor } = request.body;

  const { cliente } = request;

  const extratoDeOperacao = {
    descricao,
    valor,
    criadoEm: new Date(),
    tipo: "credito",
  };

  cliente.extrato.push(extratoDeOperacao);

  return response.status(201).send();
});

app.post("/saque", verificarSeExisteCPFNaConta, (request, response) => {
  const { valor } = request.body;
  const { cliente } = request;

  const balanco = pegarBalanco(cliente.extrato);

  if (balanco < valor) {
    return response.status(400).json({ error: "Saldo insuficiente!" });
  }
  const extratoDeOperacao = {
    valor,
    criadoEm: new Date(),
    tipo: "debito",
  };

  cliente.extrato.push(extratoDeOperacao);

  return response.status(201).send();
});

app.get("/extrato/data", verificarSeExisteCPFNaConta, (request, response) => {
  const { cliente } = request;
  const { data } = request.query;

  const formatoData = new Date(data + " 00:00");

  const extrato = cliente.extrato.filter(
    (extrato) =>
      extrato.criadoEm.toDateString() === new Date(formatoData).toDateString()
  );

  return response.json(extrato);
});

app.put("/conta", verificarSeExisteCPFNaConta, (request, response) => {
  const { nome } = request.body;
  const { cliente } = request;

  cliente.nome = nome;

  return response.status(201).send();
});

app.get("/conta", verificarSeExisteCPFNaConta, (request, response) => {
  const { cliente } = request;

  return response.json(cliente);
});

app.delete("/conta", verificarSeExisteCPFNaConta, (request, response) => {
  const {cliente} = request;

  clientes.splice(cliente, 1);

  return response.status(200).json(clientes)
})

app.get("/balanco", verificarSeExisteCPFNaConta, (request, response) => {
  const {cliente} = request;

  const balanco = pegarBalanco(cliente.extrato);

  return response.json(balanco)
})

app.listen(3333);
