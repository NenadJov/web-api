var express = require('express');
var userRouter = require('./users/routes');
var postsRouter = require('./posts/routes');

const appRouter = express.Router();

appRouter.use(userRouter);
appRouter.use(postsRouter);

module.exports = appRouter;