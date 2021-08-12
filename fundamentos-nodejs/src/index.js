const express = require("express");

const app = express();

app.use(express.json())

/**
 * Tipos de parametros
 *
 * Route params => Identificar um recurso editar/deletar/buscar
 * Query params => Paginação / Filtros
 * Body  params => Os objetos de inserção/alteração (JSON)
 */

app.get("/cursos", (request, response) => {
  const query = request.query;
  console.log(query);
  return response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/cursos", (request, response) => {
    const body = request.body;
    console.log(body);
  return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
});

app.put("/cursos/:id", (request, response) => {
  const { id } = request.params;
  console.log(id);
  return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"]);
});

app.patch("/cursos/:id", (request, response) => {
  return response.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"]);
});

app.delete("/cursos/:id", (request, response) => {
  return response.json(["Curso 6", "Curso 7", "Curso 4"]);
});

app.listen(3333);
