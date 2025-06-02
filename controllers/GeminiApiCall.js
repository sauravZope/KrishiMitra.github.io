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
        Ensure the output is in clean and properly structured JSON format without additional text or explanations.`;

        
        // Send the prompt to the AI model
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = response.text();

     
        let final = text.slice(7, -5).trim();
        
        let jsonData=JSON.parse(final);
        console.log(jsonData);

        console.log(text,final);
        // Render the EJS template with the AI response
        res.render('geminiApi/geminiApi', { response: text ,path:'/location-crop-predict',
            pageTitle: 'Predict Crop'});
    } catch (error) {
        console.error('Error calling Google Generative AI API:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
}

module.exports = { GeminiApiCall };
