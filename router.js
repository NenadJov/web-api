var express = require('express');
var userRouter = require('./users/routes');
var postRouter = require('./posts/routes');

const appRouter = express.Router();

appRouter.use(userRouter);
appRouter.use(postRouter);

module.exports = appRouter;