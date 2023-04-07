const { Configuration, OpenAIApi } = require("openai");

function createPrompt(inputs) {
    let prompt = "";
  for (const key in inputs) {
    prompt += `${key}:${inputs[key]}/n`
  }
  return prompt;
}

function formatData(data){
  let cleanedResponse = data.trim().replace(/\r?\n|\r/g, "");
  cleanedResponse.replace(/\\/g, "");
  return JSON.parse(cleanedResponse);
}

async function generaterMealPlans(dietPlan) {
  const { OPENAI_API_KEY } = process.env;
  console.log(OPENAI_API_KEY);
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const prompt = createPrompt(dietPlan);
  console.log(prompt, "prompt");

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Return Six days including breakfast, morning snacks, lunch, evening snacks and dinner per day plan without ingredients and cooking instructions as a JSON object created using my preferences." + prompt,
      temperature: 0.05,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Log the raw response for debugging
    console.log("Raw response:", response.data.choices[0].text);

    const formattedData =  formatData(response.data.choices[0].text);
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
  const { OPENAI_API_KEY } = process.env;
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Return Recipe as a JSON object created using given meal." + prompt,
      temperature: 0.05,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Log the raw response for debugging
    console.log("Raw response:", response.data.choices[0].text);

    const formattedData =  formatData(response.data.choices[0].text);
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

module.exports = {generaterMealPlans, generateRecipe};



// prompt: "Return Six days including breakfast, lunch, evening snacks and dinner per day plan without ingredients and cooking instructions as a JSON object created using my preferences." + prompt,
