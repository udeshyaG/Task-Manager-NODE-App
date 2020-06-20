const request = require("supertest");
const Task = require("../src/models/Task");
const app = require("../src/app");
const {
  userOne,
  userOneId,
  setUpDatabase,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
} = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      desc: "From my test file",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();

  expect(task.completed).toEqual(false);
});

test("Should fetch user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test("Should not delete other users task", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(400);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
