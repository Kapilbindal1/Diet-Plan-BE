require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const passport = require("passport");
// const session = require("express-session");
// require("./passport");

// const isLoggedIn = require("./middleware/auth");
const User = require("./model/user.model");
const DietPlanner = require("./model/diet.planner.model");
const {
  generaterMealPlans,
  generateRecipe,
  generateListOfIngredients,
  sendEmail,
  generatePdf,
} = require("./helpers/helpers");

const app = express();

app.use(cors());

const jsonParser = bodyParser.json();

app.get("/keep-alive", async (req, res) => {
  res.status(200).send("Alive");
});

app.post("/user-inputs", jsonParser, async (req, res) => {
  try {
    const userInputs = req.body;
    const dietPlan = await DietPlanner.create({ ...userInputs });
    res.status(200).json(dietPlan);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/generate-mealPlans/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const dietPlan = await DietPlanner.findById(userId);
    if (!dietPlan) {
      return res.status(400).send("User preferences does not exist");
    }

    let preferences = { ...dietPlan }._doc;

    delete preferences["_id"];

    try {
      const recipe = await generaterMealPlans({ dietPlan });
      res.status(200).json(recipe);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/generate-recipe", jsonParser, async (req, res) => {
  try {
    const { meal } = req.body;

    try {
      const recipe = await generateRecipe(meal);
      res.status(200).json(recipe);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/generate-a-list-of-ingredients", jsonParser, async (req, res) => {
  try {
    const { meal } = req.body;

    try {
      const recipe = await generateListOfIngredients(meal);
      res.status(200).json(recipe);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/send-mail-with-generated-pdf", jsonParser, async (req, res) => {
  try {
    const { dietPlan, userEmailAddress, userId } = req.body;

    const dietPlanExist = await DietPlanner.findById(userId);
    const userExist = await User.findOne({ email: userEmailAddress });

    if (!dietPlanExist) {
      return res.status(404).send("User preferences does not exist");
    }

    try {
      const response = await sendEmail(dietPlan, userEmailAddress);
      dietPlanExist.userEmailAddress = userEmailAddress;
      await dietPlanExist.updateOne(dietPlanExist);

      !userExist && (await User.create({ email: userEmailAddress, name: dietPlanExist.name }));

      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/generate-pdf", jsonParser, async (req, res) => {
  try {
    const { dietPlan } = req.body;

    try {
      const response = await generatePdf(dietPlan);
      res.status(200).send(response);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = app;
