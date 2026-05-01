const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate task description, priority, and checklist using AI
// @route   POST /api/ai/generate-task
// @access  Private (Admin)
const generateTaskDetails = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a project management assistant. Given a task title, generate professional task details.

Task Title: "${title}"

Return ONLY a valid JSON object with no extra text, no markdown, no code blocks:
{
  "description": "A clear 2-3 sentence description of what this task involves",
  "priority": "High or Medium or Low",
  "checklist": ["step 1", "step 2", "step 3", "step 4", "step 5"]
}

Rules:
- priority must be exactly one of: High, Medium, Low
- checklist must have exactly 5 actionable steps
- Return only the JSON, nothing else`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.description || !parsed.priority || !Array.isArray(parsed.checklist)) {
      return res.status(500).json({ message: "AI returned invalid structure" });
    }

    res.status(200).json(parsed);
  } catch (error) {
    console.error("AI generation error:", error.message);
    res.status(500).json({ message: "AI generation failed", error: error.message });
  }
};

module.exports = { generateTaskDetails };
