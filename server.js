// server.js
import express from "express";
import fetch from "node-fetch"; 
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; 
import { fileURLToPath } from 'url'; 

// 處理 ES Module 中 __dirname 不存在的問題
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🌈 啟用 CORS，允許前端呼叫
app.use(cors());

// ==========================================================
// ⭐ 強制靜態文件服務優先：確保根路徑 '/' 返回 index.html
// 即使其他地方有衝突的根路由，此處也會優先處理
// ==========================================================
// 1. 優先處理 / 路徑，回覆 index.html
app.get("/", (req, res) => {
    // 檢查是否是瀏覽器請求 (防止被其他服務誤判)
    if (req.accepts('html')) {
        return res.sendFile(path.join(__dirname, "index.html"));
    }
    // 如果不是 HTML 請求，繼續到下一個路由 (讓 API 路由處理)
    return next();
});

// 2. 處理所有靜態文件 (如 app.js, CSS, 圖片等)
app.use(express.static(path.join(__dirname))); 
// ==========================================================

// 🚀 YouTube 搜尋 API 路由
app.get("/api/search", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "請提供搜尋關鍵字" });

    const API_KEY = process.env.YT_KEY; 
    
    if (!API_KEY) {
        return res.status(500).json({ error: "API 金鑰未設定 (YT_KEY is missing)" });
    }

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