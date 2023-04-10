const { Configuration, OpenAIApi } = require("openai");

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
      max_tokens: 600,
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
      "Return Six days including breakfast, morning snacks, lunch, evening snacks and dinner per day plan without ingredients and cooking instructions as a JSON object created using my preferences." +
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
      "Return Instructions for a Recipe as a JSON object created using given meal." + sanitized;
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
      "Return a list of Ingredients  as a JSON object created using given meal." + sanitized;
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



module.exports = { generaterMealPlans, generateRecipe, generateListOfIngredients };

// prompt: "Return Six days including breakfast, lunch, evening snacks and dinner per day plan without ingredients and cooking instructions as a JSON object created using my preferences." + prompt,
