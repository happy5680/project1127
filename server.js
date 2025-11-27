// server.js
import express from "express";
import fetch from "node-fetch"; // Node.js fetch
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🌈 啟用 CORS，允許前端呼叫
app.use(cors());

// 🚀 YouTube 搜尋 API 路由
app.get("/api/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "請提供搜尋關鍵字" });

  const API_KEY = process.env.YT_KEY; // 後端安全放 API_KEY
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(q)}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data.items); // 只回傳影片列表
  } catch (error) {
    console.error("YouTube API 錯誤：", error);
    res.status(500).json({ error: "YouTube API 連線失敗" });
  }
});

app.listen(PORT, () => console.log(`後端啟動成功：http://localhost:${PORT}`));
