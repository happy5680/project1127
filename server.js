// server.js
import express from "express";
import fetch from "node-fetch"; // Node.js fetch
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // 引入 path 模組來處理檔案路徑
import { fileURLToPath } from 'url'; // 引入處理 ES Module 路徑的工具

// 處理 ES Module 中 __dirname 不存在的問題
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🌈 啟用 CORS，允許前端呼叫
app.use(cors());

// ==========================================================
// ⭐ 關鍵修改：設置靜態文件目錄，讓 Express 服務 index.html
// ==========================================================
// 假設 index.html 和 app.js 都在 project/ 根目錄下
app.use(express.static(path.join(__dirname))); 

// 確保根路徑 '/' 返回 index.html
// 即使沒有這段，app.use(express.static) 也會自動查找並服務 index.html
// 但加上這段可以確保即使其他路徑也找不到，也會導向 index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
// ==========================================================

// 🚀 YouTube 搜尋 API 路由
app.get("/api/search", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "請提供搜尋關鍵字" });

    // 請注意，您之前設定的變數可能是 YT_KEY 或其他名稱，請確保一致
    const API_KEY = process.env.YT_KEY; 
    
    // 檢查 API KEY 是否存在，提升錯誤訊息可讀性
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