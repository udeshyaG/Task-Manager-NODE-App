const routes = require("express").Router();
const Task = require("../models/Task");

const auth = require("../middleware/auth");

routes.post("/tasks", auth, async (req, res) => {
  //Create a new instance of Task model
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc
routes.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true" ? true : false;
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
  }

  try {
    //const tasks = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: "tasks",
        match: match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sort,
        },
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
  // Task.find({})
  //   .then((tasks) => res.send(tasks))
  //   .catch((error) => res.status(500).send(error));
});

//get one task using ID
routes.get("/tasks/:id", auth, async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

//update tasks
routes.patch("/tasks/:id", auth, async (req, res) => {
  const allowedUpdates = ["completed", "desc"];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((updateItem) => {
    return allowedUpdates.includes(updateItem);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(400).send();
    }

    updates.forEach((updateItem) => {
      return (task[updateItem] = req.body[updateItem]);
    });

    await task.save();
    res.send(task);

    // const task = await Task.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete a task using id
routes.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (error) {
    res.send(500).send(error);
  }
});

module.exports = routes;
