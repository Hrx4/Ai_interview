import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const parseJson = (text) => {
  const match = text.match(/```json([\s\S]*?)```/);
  if (match) {
    return JSON.parse(match[1].trim());
  }

  // fallback: try to find any valid JSON in string
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    return JSON.parse(braceMatch[0]);
  }

  throw new Error("No JSON found in response");
}


app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  try {
    console.log("Received prompt:", prompt);
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.1:latest",
      prompt,
      stream: false,
    });

    console.log("LLM response:", response.data.response);

    res.json(parseJson(response.data.response));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/api/summary", async (req, res) => {
  const { prompt } = req.body;
  try {
    console.log("Received prompt:", prompt);
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.1:latest",
      prompt,
      stream: false,
    });

    console.log("LLM response:", response.data.response);

    res.json(parseJson(response.data.response));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/" , (req, res) => {
    res.send("Hello World");
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
