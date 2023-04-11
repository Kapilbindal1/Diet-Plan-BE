const { Configuration, OpenAIApi } = require("openai");
const PDFDocument = require("pdfkit");
const Mailjet = require("node-mailjet");
const { Base64Encode } = require("base64-stream");

async function generateResponsesFromOpenAI(prompt) {
  const { OPENAI_API_KEY } = process.env;
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.05,
      max_tokens: 700,
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
      "Return Seven days including breakfast, morning snacks, lunch, evening snacks and dinner per day plan without ingredients and cooking instructions as a JSON object created using my preferences." +
      sanitized;
    const response = await generateResponsesFromOpenAI(prompt);

    // Log the raw response for debugging
    console.log("Raw response:", response.data.choices[0].text);

    const formattedData = formatData(response.data.choices[0].text);
    console.log(formattedData, "formatted data");

    // Remove consecutive colons from the response
    // const formattedResponse = removeConsecutiveColons(
    //   response.data.choices[0].text
    // );

    // Remove the first three characters (usually "Q: " or "A: ")
    // const trimmedResponse = formattedResponse.slice(2).trim();

    // Log the formatted response for debugging
    // console.log("Formatted response:", trimmedResponse);
    const trimmedResponse = formattedData;

    // Return the trimmed response
    return trimmedResponse;
  } catch (err) {
    throw err;
  }
}

async function generateRecipe(meal) {
  try {
    console.log(meal);
    const sanitized = meal;
    const prompt =
      "Return Instructions for a Recipe as a JSON object created using given meal." +
      sanitized;
    const response = await generateResponsesFromOpenAI(prompt);

    // Log the raw response for debugging
    console.log("Raw response:", response.data.choices[0].text);

    const formattedData = formatData(response.data.choices[0].text);
    console.log(formattedData, "formatted data");

    // Remove consecutive colons from the response
    // const formattedResponse = removeConsecutiveColons(
    //   response.data.choices[0].text
    // );

    // Remove the first three characters (usually "Q: " or "A: ")
    // const trimmedResponse = formattedResponse.slice(2).trim();

    // Log the formatted response for debugging
    // console.log("Formatted response:", trimmedResponse);
    const trimmedResponse = formattedData;

    // Return the trimmed response
    return trimmedResponse;
  } catch (err) {
    throw err;
  }
}

async function generateListOfIngredients(meal) {
  try {
    // console.log(meal);
    const sanitized = meal;
    const prompt =
      "Return a list of Ingredients  as a JSON object created using given meal." +
      sanitized;
    const response = await generateResponsesFromOpenAI(prompt);

    // Log the raw response for debugging
    console.log("Raw response:", response.data.choices[0].text);

    const formattedData = formatData(response.data.choices[0].text);
    console.log(formattedData, "formatted data");

    // Remove consecutive colons from the response
    // const formattedResponse = removeConsecutiveColons(
    //   response.data.choices[0].text
    // );

    // Remove the first three characters (usually "Q: " or "A: ")
    // const trimmedResponse = formattedResponse.slice(2).trim();

    // Log the formatted response for debugging
    // console.log("Formatted response:", trimmedResponse);
    const trimmedResponse = formattedData;

    // Return the trimmed response
    return trimmedResponse;
  } catch (err) {
    throw err;
  }
}

async function generatePdf(dietPlan) {
  // console.log(dietPlan, "generate pdf");
  

  return new Promise((resolve, reject) => {
    console.time("pdf");
    const doc = new PDFDocument();
    const stream = doc.pipe(new Base64Encode());
    let finalString = "";
    doc
      .fontSize(24)
      .text("Your Personalised Diet plan built using Innow8 Diet Planner!")
      .lineGap(1)
      .fontSize(16)
      .text(JSON.stringify(dietPlan))
      .end();

    stream.on("data", (chunk) => {
      finalString += chunk;
    });

    stream.on("end", () => {
      resolve(finalString);
    });

    stream.on("error", (err) => {
      reject(err);
    })
  })
}

async function sendEmail(dietPlan, userEmailAddress) {
  const mailjet = Mailjet.apiConnect(
    process.env.MAIL_JET_API_KEY,
    process.env.MAIL_JET_SECRET_KEY
  );

  const pdfContent = await generatePdf(dietPlan)

  console.log(pdfContent, "pdfContent");

  return new Promise((resolve, reject) => {
    const result = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "aidrisi@innow8apps.com",
            Name: "Innow8",
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
              ContentType: "application/pdf",
              FileName: "diet-plan.pdf",
              Base64Content: pdfContent
            }
          ],
        },
      ],
    });
    result
      .then((res) => {
        resolve(res.body);
      })
      .catch((err) => {
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

// prompt: "Return Six days including breakfast, lunch, evening snacks and dinner per day plan without ingredients and cooking instructions as a JSON object created using my preferences." + prompt,
