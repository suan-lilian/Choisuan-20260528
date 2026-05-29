# 장보기 AI

AI가 사용자 성향을 파악하여 장바구니를 자동으로 구성하고, 자연어 채팅으로 수정할 수 있는 식료품 쇼핑 웹 애플리케이션입니다.

## 데모

https://choisuan-20260528.vercel.app

## 핵심 기능

### 1. AI 사전 장바구니 자동 구성

- 첫 방문 시 온보딩(가족 구성, 예산 성향, 알레르기)을 통해 사용자 프로필 생성
- AI가 프로필 기반으로 장바구니를 자동 구성
- 각 상품마다 선택 이유 표시 ("최저가 · 닭가슴살 식재료" 등)

### 2. 채팅으로 장바구니 수정 (ChatGPT API)

- 자연어로 장바구니 수정 요청
- 전체 재구성: "냉면 먹을거라서 다시 짜줘"
- 개별 교체: "계란 다른 걸로 바꿔줘"
- 예산 변경: "이번엔 싸게 구성해줘" / "신선도 우선으로 바꿔줘"
- 상품 추가: "채소 더 추가해줘"

### 3. 식료품 브라우징

- 네이버 쇼핑 크롤링 데이터 880개 상품 제공
- 카테고리 필터 (과일 / 채소 / 단백질 / 유제품 / 음료 / 곡물)
- 상품 검색 및 직접 담기

## 기술 스택

| 구분         | 기술                                 |
| ------------ | ------------------------------------ |
| Frontend     | React 19, Vite                       |
| Backend (AI) | Vercel Serverless Function (Node.js) |
| AI           | OpenAI GPT-4o-mini                   |
| 데이터       | 네이버 쇼핑 크롤링 (Cheerio + Axios) |
| 호스팅       | Vercel                               |

## 프로젝트 구조

```
├── frontend/               # React 앱 (Vercel 배포)
│   ├── api/
│   │   └── chat.js         # ChatGPT API 서버리스 함수
│   ├── public/
│   │   └── products.json   # 크롤링된 식료품 데이터 (880개)
│   └── src/
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── OnboardingModal.jsx
│       │   ├── ProductGrid.jsx
│       │   ├── ProductCard.jsx
│       │   ├── CartPanel.jsx
│       │   ├── CartItem.jsx
│       │   └── ChatAgent.jsx
│       └── utils/
│           └── aiCartUtils.js  # AI 장바구니 로직
├── backend/                # 백엔드 (로컬 개발용 Express)
│   ├── server.js
│   └── data/products.json
└── product-crawl/          # 크롤링 스크립트
    ├── crawl.js
    └── products.json
```

## 로컬 실행

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

### 백엔드 (로컬 ChatGPT API 테스트용)

```bash
cd backend
cp .env.example .env
# .env에 OPENAI_API_KEY 입력
npm install
npm run dev
```

### 크롤링

```bash
cd product-crawl
npm install
node crawl.js
```

## 환경 변수

| 변수명           | 설명                                    |
| ---------------- | --------------------------------------- |
| `OPENAI_API_KEY` | OpenAI API 키 (Vercel 환경 변수로 설정) |

## 배포

Vercel에 `frontend/` 디렉토리를 루트로 설정하여 배포합니다.

```bash
cd frontend
vercel --prod
```

Vercel 프로젝트 설정:

- Root Directory: `frontend`
- Framework Preset: Vite
- Environment Variable: `OPENAI_API_KEY`

## 과제 구현 설명

- 과제1 MVP 내용을 Claude에게 txt로 정리를 부탁한 다음 md파일로 넣어두었습니다.
- Claude code를 사용하였으며, bkit를 활용하였습니다.
- 배포는 Vercel을 활용했습니다.

- AI Agent가 장바구니를 미리 채워두고, 이를 사용자가 확인한 뒤 수정 또는 바로 결재하는 프로세스를 보여주고자 했습니다.
- 사용자들이 온라인 쇼핑을 휴대전화에서 한다는 점을 고려한다면, 해당 기능은 웹보다는 앱으로 구현되는게 훨씬 사용자에게 도움이 될 것으로 생각합니다.
- 실제 쿠팡 상품을 크롤링하고 싶었으나 제한에 걸려 실패하였습니다.
