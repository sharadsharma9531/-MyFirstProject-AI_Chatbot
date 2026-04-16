import express from "express";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  console.log("User prompt:", prompt);

  try {
    const response = await axios.post(
      "https://api.cohere.com/v2/chat",
      {
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ],
        temperature: 0.3,
        model: "command-a-03-2025"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    console.log("RAW REPLY:", response.data.message.content);

    // ❗ SAFE REPLY PARSE (Cohere crashes without this)
    const replyText =
      response.data?.message?.content?.[0]?.text ||
      "⚠ No response from AI.";

    res.json({ reply: replyText });

  } catch (err) {
    console.error("Full Error:", err.response?.status, err.response?.data || err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, '0.0.0.0', () => console.log("Backend running on 3000"));
