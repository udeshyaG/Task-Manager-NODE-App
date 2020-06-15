const express = require("express");
const router = express.Router();

//remove dest property to access data in route handler
const multer = require("multer");
const sharp = require("sharp");

const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

const User = require("../models/User");
const Task = require("../models/Task");

const auth = require("../middleware/auth");

//Sign Up a user
router.post("/users", async (req, res) => {
  //Create a new instance of User model
  const user = new User(req.body);

  try {
    await user.save();

    sendWelcomeEmail(user.email, user.name);

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//THe second argument is middleware
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];

  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((updateItem) =>
    allowedUpdates.includes(updateItem)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  const id = req.user._id;

  try {
    updates.forEach(
      (updateItem) => (req.user[updateItem] = req.body[updateItem])
    );

    await req.user.save();
    res.send(req.user);

    //findbyID.. bypasses mongoose...So we cannot get access to middleware
    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    //   useFindAndModify: false,
    // });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Delete a User
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();

    sendCancelationEmail(req.user.email, req.user.name);

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

//login a user
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//logout a user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tt) => tt.token !== req.token);

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//logout a user from all devices (remove all tokens)
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//upload user avatar image
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();

    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);

//delete a user's profile picture
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

//get the image of user avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
