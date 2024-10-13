const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI("AIzaSyCOginESKyDer1vp-lDDQ4PGBeh9u4UwjM");

async function GeminiApiCall(req, res) {
    const location = req.body.location;

    try {
        // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate the prompt dynamically based on the location
        const prompt = `What is the best crop to plant in ${location}?`;

        // Send the prompt to the AI model
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = response.text();

        // Render the EJS template with the AI response
        res.render('geminiApi/geminiApi', { response: text ,path:'/location-crop-predict',
            pageTitle: 'Predict Crop'});
    } catch (error) {
        console.error('Error calling Google Generative AI API:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
}

module.exports = { GeminiApiCall };
