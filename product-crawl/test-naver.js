const axios = require("axios");

async function searchNaverShopping(query) {
  try {
    const res = await axios.get(
      "https://openapi.naver.com/v1/search/shop.json",
      {
        params: { query, display: 20, sort: "sim" },
        headers: {
          "X-Naver-Client-Id": "5DgxgJOvjrFz_6aDCduK",
          "X-Naver-Client-Secret": "d1rEt11WS8",
        },
      },
    );
    console.log("✅ 성공!");
    console.log("총 결과:", res.data.total);
    res.data.items.slice(0, 3).forEach((item, i) => {
      console.log(
        `[${i + 1}] ${item.title.replace(/<[^>]+>/g, "")} - ${item.lprice}원`,
      );
    });
  } catch (err) {
    console.log(
      "❌ Error:",
      err.response?.status,
      err.response?.data || err.message,
    );
  }
}

searchNaverShopping("사과");
