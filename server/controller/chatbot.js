const Groq = require("groq-sdk");
const Listing = require("../models/listing");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
module.exports.chatWithBot = async (req, res) => {
  try {
    const { messages } = req.body;
    const hotels = await Listing.find()
      .limit(15)
      .select("title description location price rating ");
    const systemPrompt = `
      You are a helpful travel concierge assistant for a hotel booking platform.
      
      ## Your ONLY job:
      1. Recommend hotels/listings based on user preferences
      2. Recommend destinations/locations based on user interests

      ## Available Listings on our Platform:
      ${JSON.stringify(hotels, null, 2)}

      ## How to recommend:
      - Ask about their budget, travel dates, number of guests if not mentioned
      - Suggest listings from our platform that match their needs
      - For destinations, suggest popular locations and explain why they are great
      - Always mention the hotel name, location, price and why it suits them

      ## Rules:
      - ONLY talk about listing and destination recommendations
      - If asked anything else (bookings, cancellations, rooms etc.), politely say 
        "I can only help with listing and destination recommendations right now!"
      - Keep responses short and friendly
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 1024,
      temperature: 0.7,
    });

    
    return res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Groq Error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
