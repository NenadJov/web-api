const express = require('express');
const bodyParser = require('body-parser');
const appRouter = require('./router');
const middleware = require('./middlewares/common');
require('dotenv/config');
// const jwt = require('express-jwt');

const app = express();

app.use(middleware.logger);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const publicRoutes = ['/login'];
// app.use(jwt({secret: 'abcd'}).unless({path: publicRoutes}));

app.use(appRouter);

app.use(middleware.errRoute);

app.use(middleware.errHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started at port ${PORT}`));