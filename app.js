require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
require("./passport");

const isLoggedIn = require("./middleware/auth");
const User = require("./model/user.model");
const DietPlanner = require("./model/diet.planner.model");
const { generaterMealPlans } = require("./helpers/helpers");

const app = express();

// app.use(
//   session({
//     secret: "keyboard not cat",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.get("/login", (req, res) => {
//   res.status(200).send('<button><a href="/auth" >Login With Google</a>');
// });

// app.get(
//   "/auth",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// app.get(
//   "/auth/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect("/auth/callback/success");
//   }
// );

// app.get("/auth/callback/success", async (req, res) => {
//   if (!req.user) {
//     res.redirect("/auth/callback/failure");
//   }
//   try {
//     const existingUser = await User.findOne({
//       email: req.user.emails[0].value,
//     });
//     if (existingUser) return res.send(existingUser);

//     try {
//       const { name, emails } = req.user;
//       const userCreated = await User.create({
//         name: `${name.givenName} ${name.familyName}`,
//         email: emails[0].value,
//       });

//       res.status(200).json(userCreated);
//     } catch (err) {
//       res.status(500).send(err.message);
//     }
//   } catch (err) {
//     res.status(500).send(err.message);
//   }

//   // res.redirect("/");
// });

// app.get("/auth/callback/failure", (req, res) => {
//   res.send("Error");
// });


app.post("/user-inputs", async (req, res) => {
  try {
    // const { userInputs, userId } = req.body;
    const { userInputs } = req.body;
    // try{
    //   // const dietPlanExist = await DietPlanner.findOne({userId: userId });

    //   // if(dietPlanExist){
    //   //   dietPlanExist = {...dietPlanExist._data, [userInput]: userInput};
    //   //   await dietPlanExist.update();
    //   //   res.send(200).json(dietPlanExist);
    //   // } else {
    //   //   const newDietPlan = DietPlanner.create({
    //   //     [userInput]: userInput
    //   //   })
    //   // }
    // } catch(err){
    //   res.status(500).send(err.message);
    // }

    const dietPlan = await DietPlanner.create({ ...userInputs });
    res.status(200).json(dietPlan);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/generate-mealPlans", async (req, res) => {
  try {
    // const { userId } = req.body;
    // const dietPlan = await DietPlanner.findOne({ userId: userId });

    // if (!dietPlan) {
    //   return res.status(400).send("User preferences does not exist");
    // }

    try {
      const recipe = await generaterMealPlans({
        age: 26,
        bmi: 60,
        weight: 72,
        height: 178,
        dietaryPreference: "non vegetarian",
        allergies: "none",
        cookingMethods: "any",
        fitnessGoals: "lean",
      });
      res.status(200).json(recipe);
    } catch (err) {
      res.status(500).send(err.message);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Logic goes here

module.exports = app;
