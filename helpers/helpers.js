const { Configuration, OpenAIApi } = require("openai");
const Mailjet = require("node-mailjet");
const puppeteer = require("puppeteer");
const fs = require('fs');

const htmlTemplate = `
<html>
  <head>
    <title>PDF Document</title>
  </head>
  <body>
    <h1>Dynamic Data:</h1>
    <p id="dynamicData"></p>
  </body>
</html>
`;

async function generateResponsesFromOpenAI(prompt) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.05,
      max_tokens: 500,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return response;
  } catch (err) {
    console.log(err, "err");
    return err;
  }
}

function createPrompt(inputs) {
  let prompt = "";
  for (const key in inputs) {
    prompt += `${key}:${inputs[key]}/n`;
  }
  return prompt;
}

function formatData(data) {
  let cleanedResponse = data.trim().replace(/\r?\n|\r/g, "");
  cleanedResponse.replace(/\\/g, "");
  return JSON.parse(cleanedResponse);
}

async function generaterMealPlans(dietPlan) {
  try {
    const sanitized = createPrompt(dietPlan);
    const prompt =
      // "Return  breakfast, morning snacks, lunch, evening snacks and dinner meal plan without ingredients and cooking instructions as a JSON object created using my preferences." + sanitized
      // 'create a diet plan with breakfast, morning snacks, lunch, evening snacks and dinner with nutritional value details and total calories per meal and give substitute resources for proteins, fats and carbs Write in a valid JSON format with the following keys "dietPlan", "breakfast", "lunch", "morning_snack", "evening_snack" and "dinner". also for nutrition values in "nutrition" key value format make sure value is string.' +
      'Return a diet plan using provided user preferences in following JSON format makes sure every key & value are a javascript string {"dietPlan": {"breakfast": {"meal": value, "nutrition": { "proteins": value, "fats": value, "carbs": value, "calories": value}}}, {"morning_snack": {"meal": value, "nutrition": {"proteins": value, "fats": value, "carbs": value, "calories": value}}}, {"lunch": {"meal": value, "nutrition": {"proteins": value, "fats": value, "carbs": value, "calories": value}}}, {"evening_snack": {"meal": value, "nutrition": { "proteins": value, "fats": value, "carbs": value, "calories": value}}}, {"dinner": {"meal": value, "nutrition": {"proteins": value, "fats": value, "carbs": value, "calories": value}}} } ' + sanitized;
    const response = await generateResponsesFromOpenAI(prompt);
    console.log(response.data.choices[0].text, "promtp response");
    // Log the raw response for debugging

    const formattedData = formatData(response.data.choices[0].text);
    return formattedData;
  } catch (err) {
    throw err;
  }
}

async function generateRecipe(meal) {
  try {
    const sanitized = meal;
    const prompt =
      'Return Instructions for a Recipe using given meal following JSON format make sure every key & value are a javascript string. { "name" : value, "ingredients": [value], "instructions": [ 1. value ] }' +
      sanitized;
    const response = await generateResponsesFromOpenAI(prompt);

    // Log the raw response for debugging

    const formattedData = formatData(response.data.choices[0].text);

    // Remove consecutive colons from the response
    // const formattedResponse = removeConsecutiveColons(
    //   response.data.choices[0].text
    // );

    // Remove the first three characters (usually "Q: " or "A: ")
    // const trimmedResponse = formattedResponse.slice(2).trim();

    // Log the formatted response for debugging
    const trimmedResponse = formattedData;

    // Return the trimmed response
    return trimmedResponse;
  } catch (err) {
    throw err;
  }
}

async function generateListOfIngredients(meal) {
  try {
    const sanitized = meal;
    const prompt =
      "Return a list of Ingredients  as a JSON object created using given meal." +
      sanitized;
    const response = await generateResponsesFromOpenAI(prompt);

    // Log the raw response for debugging

    const formattedData = formatData(response.data.choices[0].text);

    // Remove consecutive colons from the response
    // const formattedResponse = removeConsecutiveColons(
    //   response.data.choices[0].text
    // );

    // Remove the first three characters (usually "Q: " or "A: ")
    // const trimmedResponse = formattedResponse.slice(2).trim();

    // Log the formatted response for debugging
    const trimmedResponse = formattedData;

    // Return the trimmed response
    return trimmedResponse;
  } catch (err) {
    throw err;
  }
}


const textFormatting = (str) =>
  str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();

function convertObjectIntoString(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively convert nested object to string and add key name
      acc += `${
        key === "nutrition" ? "Macronutrients Breakup" : textFormatting(key).replace("_"," ") 
      }: ${convertObjectIntoString(value)} \n`;
    } else {
      // Convert non-object values to string and add key name
      acc += `${key === "meal" ? "Dish Name" : textFormatting(key).replace("_"," ") }: ${value} \n `;
    }
    return acc;
  }, "\n");
}

async function generatePdf(dietPlan) {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlTemplate);
  const pdf = await page.pdf();
  await browser.close();

  return pdf.toString('base64');
}

async function sendEmail(dietPlan, userEmailAddress) {
  const mailjet = Mailjet.apiConnect(
    process.env.MAIL_JET_API_KEY,
    process.env.MAIL_JET_SECRET_KEY
  );

  const pdfBuffer = await generatePdf(dietPlan);
  return new Promise((resolve, reject) => {
    const result = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "aidrisi@innow8apps.com",
            Name: "Diet Planner",
          },
          To: [
            {
              Email: userEmailAddress,
              Name: "User",
            },
          ],
          Subject: "Your Diet Plan",
          TextPart: "Dear receiver. Here's your diet plan.",
          Attachments: [
            {
              ContentType: 'application/pdf',
              Filename: 'document.pdf',
              Base64Content: pdfBuffer,
            },
          ],
        },
      ],
    });
    result
      .then((res) => {
        resolve(res.body);
      })
      .catch((err) => {
        console.error(err, "<====== error");
        reject(err);
      });
  });
}

module.exports = {
  generaterMealPlans,
  generateRecipe,
  generateListOfIngredients,
  sendEmail,
  generatePdf,
};

