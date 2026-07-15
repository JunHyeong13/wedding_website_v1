# 우리결혼, 현실가이드

20대 후반~30대 중반 사회 초년생이 결혼을 준비할 때 필요한 현실적인 예산, 상견례 예절, 준비 순서를 한곳에서 확인할 수 있는 한국어 웹사이트입니다.

## 서비스 바로가기

- 배포 사이트: https://real-wedding-guide.sez35.chatgpt.site

## 주요 기능

- 예식 지역, 준비 스타일, 하객 수에 따른 예상 결혼 예산 계산
- 신혼집 비용 포함/제외 비교
- 예식장·식대, 스드메, 신혼여행, 혼수, 예물·예단 항목별 비용 표시
- 상견례 당일 순서와 자리·호칭·비용·선물 예절 안내
- D-365 결혼 준비 체크리스트
- 체크한 준비 항목의 브라우저 자동 저장
- 데스크톱·태블릿·모바일 반응형 화면

## 기술 구성

- React 19
- Next.js 16 호환 API
- Vinext + Vite
- TypeScript
- Tailwind CSS 4
- Cloudflare Worker 배포 구조

## 로컬 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm run install:ci
npm run dev
```

개발 서버가 시작되면 터미널에 표시되는 주소로 접속합니다.

## 빌드 및 검증

```bash
npm run build
npm run validate:artifact
```

`npm run build`는 배포용 Worker 결과물을 생성하고 필수 파일을 함께 검증합니다.

## 주요 파일

```text
app/page.tsx          화면 구성과 예산 계산·체크리스트 로직
app/globals.css       전체 디자인과 반응형 스타일
public/               일러스트와 정적 이미지
worker/index.ts       Cloudflare Worker 진입점
tests/                렌더링 검증 테스트
```

## 변경 관리 권장 방식

1. 기능별 브랜치를 생성합니다. 예: `feature/budget-calculator`
2. 수정 후 `npm run build`로 확인합니다.
3. Pull Request를 생성해 변경 내용을 검토합니다.
4. 확인된 변경만 `main` 브랜치에 병합합니다.

Pull Request와 `main` 브랜치 업데이트 시 GitHub Actions가 자동으로 빌드를 검사합니다.

## 참고 데이터

- [한국소비자원 참가격 결혼서비스 통계](https://www.price.go.kr/tprice/portal/wedding/areaStatistic.do)
- [듀오 결혼비용 실태보고서](https://m.duo.co.kr/duostory/humanlife_list.asp)

예산 계산 결과는 평균 계약금액을 바탕으로 한 참고용 추정치입니다. 실제 계약 전에는 지역·날짜·보증인원·추가 옵션·취소 규정을 확인해야 합니다.
