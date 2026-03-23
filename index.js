const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// তোমার Gemini API Key সরাসরি বসিয়ে দিলাম
const GEMINI_API_KEY = "AIzaSyCX0frSYzHEtZoTkna4O9Pgw-zM3Q1MbHk";

app.post('/webhook', async (req, res) => {
    // AutoResponder for WA থেকে আসা মেসেজ 'query' নামে থাকে
    const userMsg = req.body.query;

    if (!userMsg) {
        return res.json({ replies: [{ message: "মামা, কিছু তো বলো!" }] });
    }

    try {
        // Gemini AI এর সাথে কানেক্ট হচ্ছে
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: userMsg }] }]
            }
        );

        // AI এর উত্তরটা বের করে আনা
        const aiReply = response.data.candidates[0].content.parts[0].text;

        // AutoResponder যেভাবে উত্তর চায় সেই ফরম্যাটে পাঠানো
        res.json({
            replies: [
                {
                    message: aiReply
                }
            ]
        });

    } catch (error) {
        console.error("Error with Gemini:", error.message);
        res.json({
            replies: [
                {
                    message: "মামা, ইন্টারনেটে একটু সমস্যা হচ্ছে, পরে ট্রাই করো!"
                }
            ]
        });
    }
});

// পোর্ট সেটআপ (Render এর জন্য জরুরি)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
