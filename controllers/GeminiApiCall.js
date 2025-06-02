const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI("AIzaSyCOginESKyDer1vp-lDDQ4PGBeh9u4UwjM");

async function GeminiApiCall(req, res) {
    const location = req.body.location;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Generate a JSON-formatted list of five commonly grown crops in ${location}. 
        Each crop entry should include the crop name, 
        a brief explanation of why it is suitable for the region, and 
        relevant factors such as climate adaptability, soil requirements, and economic significance. 
        Ensure the output is in clean and properly structured JSON format without additional text or explanations.
        The response should be a valid JSON array containing objects with the following structure:
        {
            "crop": "crop name",
            "suitability": "suitability description",
            "factors": {
                "climate": "climate requirements",
                "soil": "soil requirements",
                "economic": "economic significance"
            }
        }`;

        // Send the prompt to the AI model
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = response.text();

        // Clean the response text to ensure it's valid JSON
        let jsonText = text.trim();
        // Remove any markdown code block indicators if present
        jsonText = jsonText.replace(/```json\n?|\n?```/g, '');
        // Remove any leading/trailing whitespace
        jsonText = jsonText.trim();

        // Parse the JSON to validate it
        const jsonData = JSON.parse(jsonText);
        
        // Render the template with the parsed JSON data
        res.render('geminiApi/geminiApi', { 
            response: JSON.stringify(jsonData),
            path: '/location-crop-predict',
            pageTitle: 'Predict Crop'
        });
    } catch (error) {
        console.error('Error calling Google Generative AI API:', error);
        res.status(500).render('geminiApi/geminiApi', {
            response: null,
            path: '/location-crop-predict',
            pageTitle: 'Predict Crop',
            error: 'An error occurred while processing your request. Please try again.'
        });
    }
}

module.exports = { GeminiApiCall };
