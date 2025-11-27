document.getElementById("searchBtn").addEventListener("click", () => {
  const keyword = document.getElementById("keyword").value.trim();
  if (!keyword) return alert("請輸入搜尋關鍵字！");

  searchYouTube(keyword);
});

function searchYouTube(keyword) {
  fetch(`/api/search?q=${encodeURIComponent(keyword)}`)
    .then(res => res.json())
    .then(data => {
      showResults(data);
    })
    .catch(err => {
      console.error("錯誤：", err);
      alert("後端 API 連線失敗");
    });
}

function showResults(videos) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  videos.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${v.snippet.thumbnails.medium.url}" />
      <h3>${v.snippet.title}</h3>
    `;

    container.appendChild(card);
  });
}
