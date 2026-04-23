import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.2
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Fallback";

    res.json({ message: text });

  } catch (err) {
    res.json({ message: "Fallback message" });
  }
});

app.listen(3000, () => console.log("Server running"));
