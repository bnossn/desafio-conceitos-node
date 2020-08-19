const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // List all repositories

  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // !!! Create a new repository
  const { title, url, techs } = request.body

  if ( !title || !url || !techs ){
    return response.status(400).json({ error: "Request must contain: title, url and techs" });
  }

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  // Update title, url and techs of a specific repository "id"
  const { id } = request.params;
  const { title, url, techs } = request.body;


  if (!isUuid(id)){
    return response.status(400).json({ error: "Project ID is invalid!" });
  }

  // if ( !title || !url || !techs ){
  //   return response.status(400).json({ error: "Request must contain: title, url and techs" });
  // };

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({ error: "Project ID not found" });
  }

  previousRepo = repositories[repositoryIndex];

  repositories[repositoryIndex] = {
    id,
    title,
    url,
    techs,
    likes: previousRepo.likes
  };

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  // Delete Repository
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: "Project ID is invalid!" });
  }

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({ error: "Project ID not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  // Increase the num of likes of repo id by 1
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: "Project ID is invalid!" });
  };

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({ error: "Project ID not found" })
  };

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
