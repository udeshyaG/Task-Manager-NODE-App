const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");
const Task = require("../../src/models/Task");
const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Henry",
  email: "gunner@ars.com",
  password: "abcd1234",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "Rooney",
  email: "rooney@manu.com",
  password: "abcde1234",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  desc: "Testing task ONE",
  completed: false,
  owner: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  desc: "Testing task TWO",
  completed: true,
  owner: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  desc: "Testing task THREE",
  completed: true,
  owner: userTwoId,
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  const user1 = new User(userOne);
  await user1.save();

  const user2 = new User(userTwo);
  await user2.save();

  const task1 = new Task(taskOne);
  await task1.save();

  const task2 = new Task(taskTwo);
  await task2.save();

  const task3 = new Task(taskThree);
  await task3.save();
};

module.exports = {
  setUpDatabase,
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
};
