import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

const tones = [
  "dark",
  "blunt",
  "cold",
  "existential",
  "sarcastic",
  "harsh",
  "ominous",
  "unsettling"
];

const topics = [
  "doomscrolling",
  "wasting your night on your phone",
  "avoiding your real life by scrolling",
  "procrastinating through short videos",
  "numbing yourself with endless content",
  "using scrolling to escape responsibility"
];

const styles = [
  "Write one sentence only.",
  "Keep it under 14 words.",
  "Make it feel like a warning.",
  "Make it sound like the app is calling the user out.",
  "Make it feel personal.",
  "Make it hit hard."
];

app.post("/generate", async (req, res) => {
  try {
    const seed = Math.floor(Math.random() * 1000000);
    const tone = tones[Math.floor(Math.random() * tones.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];

    const prompt = `
${style}
Write a ${tone} one-line message about ${topic}.
Do not use hashtags.
Do not use quotation marks.
Make it original.
Seed: ${seed}
    `.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 1.3
      })
    });

    const data = await response.json();
    console.log("OPENAI RESPONSE:", JSON.stringify(data));

    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return res.json({ message: `Fallback seed ${seed}: keep scrolling, nothing changes.` });
    }

    res.json({ message: text, seed });
  } catch (err) {
    console.error(err);
    res.json({ message: "Fallback: you are still scrolling." });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
