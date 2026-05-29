// 네이버 쇼핑 검색 API를 이용해 상품 정보를 크롤링하는 스크립트입니다.
const axios = require("axios");
const fs = require("fs");

const CLIENT_ID = "5DgxgJOvjrFz_6aDCduK";
const CLIENT_SECRET = "d1rEt11WS8";

async function searchShopping(query) {
  const res = await axios.get("https://openapi.naver.com/v1/search/shop.json", {
    params: { query, display: 20, sort: "sim" },
    headers: {
      "X-Naver-Client-Id": CLIENT_ID,
      "X-Naver-Client-Secret": CLIENT_SECRET,
    },
  });
  return res.data.items.map((item) => ({
    name: item.title.replace(/<[^>]+>/g, ""),
    price: item.lprice,
    image: item.image,
    link: item.link,
    category: item.category1,
    brand: item.brand,
    query,
  }));
}

async function main() {
  const queries = [
    // 과일
    "사과",
    "바나나",
    "딸기",
    "포도",
    "배",
    "귤",
    "수박",
    "복숭아",
    "망고",
    "블루베리",
    // 채소
    "양파",
    "당근",
    "감자",
    "고구마",
    "토마토",
    "오이",
    "파프리카",
    "브로콜리",
    "시금치",
    "대파",
    // 단백질
    "계란",
    "닭가슴살",
    "두부",
    "삼겹살",
    "소고기",
    "새우",
    "연어",
    "참치캔",
    // 유제품/음료
    "우유",
    "요거트",
    "치즈",
    "두유",
    "오렌지주스",
    // 곡물/가공
    "쌀",
    "현미",
    "오트밀",
    "라면",
    "파스타",
    //기타
    "만두",
    "생수",
    "과자",
    "라면",
    "밀키트",
    "라면",
  ];
  const all = [];

  for (const q of queries) {
    console.log(`크롤링 중: ${q}`);
    const items = await searchShopping(q);
    all.push(...items);
    await new Promise((r) => setTimeout(r, 300)); // 요청 간격
  }

  fs.writeFileSync("products.json", JSON.stringify(all, null, 2));
  console.log(`✅ 완료! 총 ${all.length}개 저장 → products.json`);
}

main().catch(console.error);
