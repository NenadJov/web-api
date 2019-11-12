const express = require('express');
const actions = require('./actions');
const {emailValidator} = require('../helper');
const {checkIsOlderThan18} = require('../helper');

const routes = express.Router();

routes.get('/users', actions.getAllUsers);
routes.get('/users/:id', actions.getSpecificUser);
routes.post('/users', emailValidator, checkIsOlderThan18, actions.createUser);
routes.put('/users/:id', actions.changeUser);
// routes.patch('/users/:id', actions.changePartUser);
routes.delete('/users/:id', actions.deleteUser);

routes.post('/login', actions.loginUser);

module.exports = routes;