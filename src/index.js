//Set up a route for POST request and grab the data
const express = require("express");
const app = express();

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

//connect mongodb
require("./db/mongoose");

//Middleware for parsing incoming JSON data
app.use(express.json());

//Simple message for base url
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my NodeJS backend application",
    info:
      "Please visit my github repo to view information on how to use this app",
  });
});

app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server started at port ${port}`));
