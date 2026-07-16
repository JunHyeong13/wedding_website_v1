# 우리결혼, 현실가이드

20대 후반~30대 중반 사회 초년생이 결혼을 준비할 때 필요한 현실적인 예산, 스몰웨딩 비용과 준비 단계, 상견례 예절을 한곳에서 확인할 수 있는 한국어 웹사이트입니다.

## 서비스 바로가기

- 배포 사이트: https://real-wedding-guide.sez35.chatgpt.site

## 주요 기능

- 지역, 준비 스타일, 하객 수에 따른 일반 결혼 예산 계산
- 10~100명 스몰웨딩 전용 비용 계산과 항목별 견적
- 스몰웨딩 D-180 7단계 로드맵과 계약 전 체크 질문
- 서울·경기 공공·한옥·공원형 예식 공간 필터와 장소 목록
- 네이버 Maps JavaScript API 기반 장소 마커와 지도 이동
- 상견례 당일 순서와 자리·호칭·비용·선물 예절 안내
- D-365 준비 체크리스트 및 브라우저 자동 저장
- 데스크톱·태블릿·모바일 반응형 화면

## 네이버 지도 연결

1. 네이버 클라우드 플랫폼에서 Maps 애플리케이션을 생성합니다.
2. Maps JavaScript API를 선택하고 Web 서비스 URL에 로컬 주소와 배포 주소를 등록합니다.
3. `.env.example`을 복사해 `.env.local`을 만든 뒤 Client ID를 입력합니다.

```bash
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=발급받은_CLIENT_ID
```

** Client ID가 비어 있어도 장소 목록은 작동하며 지도 영역에는 연결 안내가 표시됩니다. ** 

## 로컬 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm run install:ci
npm run dev
```

## 빌드 및 검증

```bash
npm run lint
npm run build
npm run validate:artifact
```

## 주요 파일

```text
app/page.tsx                         화면 구성과 예산 계산·체크리스트 로직
app/components/NaverVenueMap.tsx    장소 데이터·필터·네이버 지도 연동
app/globals.css                     전체 디자인과 반응형 스타일
public/                              일러스트와 정적 이미지
```

## 참고

- [한국소비자원 참가격 결혼서비스 통계](https://www.price.go.kr/tprice/portal/wedding/areaStatistic.do)
- [서울시 서울마이웨딩 안내](https://familyseoul.or.kr/node/25845)
- [네이버 Maps JavaScript API](https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html)

예산 계산 결과와 장소 정보는 탐색을 돕기 위한 참고 자료입니다. 실제 계약 전에는 운영 기관을 통해 지역·날짜·최소 보증 인원·추가 비용·취소 규정을 다시 확인해야 합니다.
