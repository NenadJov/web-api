const express = require("express");
const actions = require("./actions");

const routes = express.Router;

routes.get('/users/:userId/posts', actions.getAllPosts);
routes.get('/users/:userId/posts/:postId', actions.getSpecificPost);
routes.post('/users/:userId/posts', actions.createPost);
routes.put('/users/:userId/posts/:postId', actions.updatePost);
// routes.delete('/users/:userId/posts/:postId', actions.deletePost);

module.exports = routes;