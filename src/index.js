const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if(!user){
    return response.status(404).json({error: "Invalid not found!"});
  }
  request.user = user;
   return next();
}

app.post('/users', (request, response) => {
  // Complete aqui  
  const { name, username} = request.body;
  const userAlreadyExists = users.some((user) => user.username === username);
  if(userAlreadyExists){
    return response.status(400).json({error: "User already exists!"});
  }
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });
  
    return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  // const results = username
  // ? users.filter((user) => user.username.includes(username))
  // : users;
  return response.json(user.todos);
  
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline} = request.body;
  const { user } = request;
  const todosTarefa = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }
  user.todos.push(todosTarefa);
  return response.status(201).json(todosTarefa);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;
  const todo = user.todos.find((user) => user.id === id);
  if(!todo){
    return response.status(404).json({error: "Todo not found!"});
  }
  todo.title = title;
  todo.deadline = new Date(deadline);
  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  const todo = user.todos.find((user) => user.id === id);
  if(!todo){
    return response.status(404).json({error: "Todo not found!"});
  }
  todo.done = true;
  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  const todoIndex = user.todos.findIndex((user) => user.id === id);
  if(todoIndex < 0){
    return response.status(404).json({error: "todoIndex not found!"});
  }
  user.todos.splice(todoIndex, 1);
  return response.status(204).json();
});

module.exports = app;