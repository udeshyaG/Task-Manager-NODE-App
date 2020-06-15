//Set up a route for POST request and grab the data
const express = require("express");
const app = express();

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

//connect mongodb
require("./db/mongoose");

//Middleware for parsing incoming JSON data
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server started at port ${port}`));
