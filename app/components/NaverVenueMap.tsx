"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Venue = {
  id: string;
  name: string;
  area: "서울" | "경기";
  district: string;
  type: "공공" | "민간";
  setting: "공공공간" | "한옥" | "공원·야외" | "호텔" | "컨벤션" | "하우스·채플";
  address: string;
  capacity: string;
  note: string;
  search: string;
  lat?: number;
  lng?: number;
};

type VenueSeed = [string, string, Venue["area"], string, Venue["type"], Venue["setting"], string, number?, number?];

const notes: Record<Venue["setting"], string> = {
  "공공공간": "대관 범위와 예식 허용 여부, 식음료 반입 조건을 먼저 확인하세요.",
  "한옥": "전통적인 분위기와 마당 동선이 장점이며 우천 대안을 함께 살펴보세요.",
  "공원·야외": "계절감이 좋지만 우천·전기·음향·화장실 조건을 꼭 비교하세요.",
  "호텔": "연회 품질과 접근성이 좋으며 최소 보증 인원과 식대 조건이 중요해요.",
  "컨벤션": "하객 동선과 주차가 편리하며 홀 사용료와 식대 패키지를 비교해 보세요.",
  "하우스·채플": "소규모 연출에 어울리며 단독 사용 시간과 외부 업체 반입을 확인하세요.",
};

const venueSeeds: VenueSeed[] = [
  ["citizens", "시민청 태평홀", "서울", "중구", "공공", "공공공간", "서울 중구 세종대로 110", 37.56636, 126.97794],
  ["namsan", "남산골한옥마을", "서울", "중구", "공공", "한옥", "서울 중구 퇴계로34길 28", 37.55929, 126.99442],
  ["oil", "문화비축기지", "서울", "마포구", "공공", "공공공간", "서울 마포구 증산로 87", 37.57105, 126.89497],
  ["dream", "북서울꿈의숲", "서울", "강북구", "공공", "공원·야외", "서울 강북구 월계로 173", 37.62023, 127.04151],
  ["women", "서울여성플라자", "서울", "동작구", "공공", "공공공간", "서울 동작구 여의대방로54길 18", 37.51119, 126.92763],
  ["nodeul", "노들섬", "서울", "용산구", "공공", "공원·야외", "서울 용산구 양녕로 445"],
  ["seoul-forest", "서울숲", "서울", "성동구", "공공", "공원·야외", "서울 성동구 뚝섬로 273"],
  ["botanic", "서울식물원", "서울", "강서구", "공공", "공원·야외", "서울 강서구 마곡동로 161"],
  ["seonyudo", "선유도공원", "서울", "영등포구", "공공", "공원·야외", "서울 영등포구 선유로 343"],
  ["worldcup", "월드컵공원 평화의공원", "서울", "마포구", "공공", "공원·야외", "서울 마포구 증산로 32"],
  ["children", "서울어린이대공원", "서울", "광진구", "공공", "공원·야외", "서울 광진구 능동로 216"],
  ["citizen-forest", "매헌시민의숲", "서울", "서초구", "공공", "공원·야외", "서울 서초구 매헌로 99"],
  ["yongsan-park", "용산가족공원", "서울", "용산구", "공공", "공원·야외", "서울 용산구 서빙고로 137"],
  ["seoul-hanbang", "서울한방진흥센터", "서울", "동대문구", "공공", "한옥", "서울 동대문구 약령중앙로 26"],
  ["university", "서울시립대학교 자작마루", "서울", "동대문구", "공공", "공공공간", "서울 동대문구 서울시립대로 163"],
  ["maru180", "서울창업허브 공덕", "서울", "마포구", "공공", "공공공간", "서울 마포구 백범로31길 21"],
  ["namsan-library", "남산도서관 야외정원", "서울", "용산구", "공공", "공원·야외", "서울 용산구 소월로 109"],
  ["seoul-museum", "서울역사박물관 광장", "서울", "종로구", "공공", "공원·야외", "서울 종로구 새문안로 55"],
  ["platform-l", "문화역서울284", "서울", "중구", "공공", "공공공간", "서울 중구 통일로 1"],
  ["dongdaemun", "서울한방진흥센터 한옥마당", "서울", "동대문구", "공공", "한옥", "서울 동대문구 약령중앙로 26"],
  ["shilla", "서울신라호텔", "서울", "중구", "민간", "호텔", "서울 중구 동호로 249"],
  ["plaza", "더 플라자", "서울", "중구", "민간", "호텔", "서울 중구 소공로 119"],
  ["lotte-seoul", "롯데호텔 서울", "서울", "중구", "민간", "호텔", "서울 중구 을지로 30"],
  ["westin", "웨스틴 조선 서울", "서울", "중구", "민간", "호텔", "서울 중구 소공로 106"],
  ["four-seasons", "포시즌스 호텔 서울", "서울", "종로구", "민간", "호텔", "서울 종로구 새문안로 97"],
  ["grand-hyatt", "그랜드 하얏트 서울", "서울", "용산구", "민간", "호텔", "서울 용산구 소월로 322"],
  ["banyan", "반얀트리 클럽 앤 스파 서울", "서울", "중구", "민간", "호텔", "서울 중구 장충단로 60"],
  ["conrad", "콘래드 서울", "서울", "영등포구", "민간", "호텔", "서울 영등포구 국제금융로 10"],
  ["fairmont", "페어몬트 앰배서더 서울", "서울", "영등포구", "민간", "호텔", "서울 영등포구 여의대로 108"],
  ["jw", "JW 메리어트 호텔 서울", "서울", "서초구", "민간", "호텔", "서울 서초구 신반포로 176"],
  ["intercontinental", "그랜드 인터컨티넨탈 서울 파르나스", "서울", "강남구", "민간", "호텔", "서울 강남구 테헤란로 521"],
  ["walkerhill", "그랜드 워커힐 서울", "서울", "광진구", "민간", "호텔", "서울 광진구 워커힐로 177"],
  ["mayfield", "메이필드호텔 서울", "서울", "강서구", "민간", "호텔", "서울 강서구 방화대로 94"],
  ["stanford", "스탠포드호텔 서울", "서울", "마포구", "민간", "호텔", "서울 마포구 월드컵북로58길 15"],
  ["63", "63컨벤션센터", "서울", "영등포구", "민간", "컨벤션", "서울 영등포구 63로 50"],
  ["eltower", "엘타워", "서울", "서초구", "민간", "컨벤션", "서울 서초구 강남대로 213"],
  ["thek", "더케이호텔서울", "서울", "서초구", "민간", "호텔", "서울 서초구 바우뫼로12길 70"],
  ["atforest", "aT포레", "서울", "서초구", "민간", "하우스·채플", "서울 서초구 강남대로 27"],
  ["bottega", "보테가마지오", "서울", "성동구", "민간", "하우스·채플", "서울 성동구 서울숲2길 32-14"],
  ["laum", "라움아트센터", "서울", "강남구", "민간", "하우스·채플", "서울 강남구 언주로 564"],
  ["heritz", "헤리츠컨벤션", "서울", "강남구", "민간", "컨벤션", "서울 강남구 논현로 662"],
  ["novotel-gangnam", "노보텔 앰배서더 서울 강남", "서울", "강남구", "민간", "호텔", "서울 강남구 봉은사로 130"],
  ["park-hyatt", "파크 하얏트 서울", "서울", "강남구", "민간", "호텔", "서울 강남구 테헤란로 606"],
  ["andaz", "안다즈 서울 강남", "서울", "강남구", "민간", "호텔", "서울 강남구 논현로 854"],
  ["chapel-cheongdam", "더채플앳청담", "서울", "강남구", "민간", "하우스·채플", "서울 강남구 선릉로 757"],
  ["noble-samsung", "노블발렌티 삼성", "서울", "강남구", "민간", "하우스·채플", "서울 강남구 봉은사로 637"],
  ["villa-de-gd", "빌라드지디 청담", "서울", "강남구", "민간", "하우스·채플", "서울 강남구 학동로 519"],
  ["apelmago-banpo", "아펠가모 반포", "서울", "서초구", "민간", "하우스·채플", "서울 서초구 반포대로 235"],
  ["apelmago-jamsil", "아펠가모 잠실", "서울", "송파구", "민간", "하우스·채플", "서울 송파구 올림픽로35길 137"],
  ["lotte-world", "롯데호텔 월드", "서울", "송파구", "민간", "호텔", "서울 송파구 올림픽로 240"],
  ["sofitel", "소피텔 앰배서더 서울", "서울", "송파구", "민간", "호텔", "서울 송파구 잠실로 209"],
  ["signiel", "시그니엘 서울", "서울", "송파구", "민간", "호텔", "서울 송파구 올림픽로 300"],
  ["sejong", "세종대학교 대양AI센터", "서울", "광진구", "민간", "컨벤션", "서울 광진구 능동로 209"],
  ["marriage-garden", "로프트가든344", "서울", "양천구", "민간", "하우스·채플", "서울 양천구 오목로 344"],
  ["wedding-city", "웨딩시티 신도림", "서울", "구로구", "민간", "컨벤션", "서울 구로구 새말로 97"],
  ["d-cube", "쉐라톤 서울 디큐브시티 호텔", "서울", "구로구", "민간", "호텔", "서울 구로구 경인로 662"],
  ["the-link", "더 링크 호텔 서울", "서울", "구로구", "민간", "호텔", "서울 구로구 경인로 610"],
  ["botanic-wedding", "보타닉파크웨딩", "서울", "강서구", "민간", "컨벤션", "서울 강서구 마곡중앙5로 6"],
  ["the-venue-g", "더베뉴지서울", "서울", "강서구", "민간", "컨벤션", "서울 강서구 강서로 388"],
  ["amoris", "아모리스 역삼", "서울", "강남구", "민간", "컨벤션", "서울 강남구 논현로 508"],
  ["suwon", "수원전통문화관", "경기", "수원시", "공공", "한옥", "경기 수원시 팔달구 정조로 893", 37.28714, 127.01443],
  ["hanok", "부천한옥체험마을", "경기", "부천시", "공공", "한옥", "경기 부천시 원미구 길주로 660", 37.51619, 126.76524],
  ["garden", "율동공원", "경기", "성남시", "공공", "공원·야외", "경기 성남시 분당구 문정로 145", 37.37743, 127.14916],
  ["gwanggyo-lake", "광교호수공원", "경기", "수원시", "공공", "공원·야외", "경기 수원시 영통구 광교호수로 165"],
  ["suwon-convention", "수원컨벤션센터", "경기", "수원시", "공공", "컨벤션", "경기 수원시 영통구 광교중앙로 140"],
  ["gyeonggi-art", "경기아트센터", "경기", "수원시", "공공", "공공공간", "경기 수원시 팔달구 효원로307번길 20"],
  ["hwadam", "화담숲", "경기", "광주시", "민간", "공원·야외", "경기 광주시 도척면 도척윗로 278-1"],
  ["yuldong", "성남 율동공원 책테마파크", "경기", "성남시", "공공", "공원·야외", "경기 성남시 분당구 문정로 145"],
  ["paju-wisdom", "파주 지혜의숲", "경기", "파주시", "공공", "공공공간", "경기 파주시 회동길 145"],
  ["byeokchoji", "벽초지수목원", "경기", "파주시", "민간", "공원·야외", "경기 파주시 광탄면 부흥로 242"],
  ["first-garden", "퍼스트가든", "경기", "파주시", "민간", "공원·야외", "경기 파주시 탑삭골길 260"],
  ["ilsan-lake", "일산호수공원", "경기", "고양시", "공공", "공원·야외", "경기 고양시 일산동구 호수로 731"],
  ["kintex", "킨텍스", "경기", "고양시", "공공", "컨벤션", "경기 고양시 일산서구 킨텍스로 217-60"],
  ["sono-goyang", "소노캄 고양", "경기", "고양시", "민간", "호텔", "경기 고양시 일산동구 태극로 20"],
  ["bellacitta", "벨라시타", "경기", "고양시", "민간", "하우스·채플", "경기 고양시 일산동구 강송로 33"],
  ["novotel-suwon", "노보텔 앰배서더 수원", "경기", "수원시", "민간", "호텔", "경기 수원시 팔달구 덕영대로 902"],
  ["ramada-suwon", "라마다프라자 수원", "경기", "수원시", "민간", "호텔", "경기 수원시 팔달구 중부대로 150"],
  ["ibis-suwon", "이비스 앰배서더 수원", "경기", "수원시", "민간", "호텔", "경기 수원시 팔달구 권광로 132"],
  ["wi-convention", "WI컨벤션", "경기", "수원시", "민간", "컨벤션", "경기 수원시 팔달구 월드컵로 310"],
  ["partyum", "파티움하우스 수원", "경기", "수원시", "민간", "하우스·채플", "경기 수원시 팔달구 효원로 289"],
  ["courtyard-suwon", "코트야드 메리어트 수원", "경기", "수원시", "민간", "호텔", "경기 수원시 영통구 광교호수공원로 320"],
  ["gravity", "그래비티 서울 판교", "경기", "성남시", "민간", "호텔", "경기 성남시 분당구 판교역로146번길 2"],
  ["doubletree", "더블트리 바이 힐튼 서울 판교", "경기", "성남시", "민간", "호텔", "경기 성남시 분당구 백현로 26"],
  ["militopia", "밀리토피아호텔", "경기", "성남시", "민간", "호텔", "경기 성남시 수정구 위례대로 83"],
  ["w-square", "W스퀘어", "경기", "성남시", "민간", "컨벤션", "경기 성남시 분당구 판교역로226번길 16"],
  ["white-veil", "더화이트베일", "경기", "성남시", "민간", "하우스·채플", "경기 성남시 분당구 성남대로 916"],
  ["mj", "MJ컨벤션", "경기", "부천시", "민간", "컨벤션", "경기 부천시 소사구 경인로 386"],
  ["sopoong", "소풍컨벤션웨딩", "경기", "부천시", "민간", "컨벤션", "경기 부천시 원미구 송내대로 239"],
  ["hotel-prumir", "호텔 푸르미르", "경기", "화성시", "민간", "호텔", "경기 화성시 효행로 480"],
  ["rolling-hills", "롤링힐스 호텔", "경기", "화성시", "민간", "호텔", "경기 화성시 남양읍 시청로 290"],
  ["shillastay-dongtan", "신라스테이 동탄", "경기", "화성시", "민간", "호텔", "경기 화성시 노작로 161"],
  ["laviedor", "라비돌리조트", "경기", "화성시", "민간", "호텔", "경기 화성시 정남면 세자로 286"],
  ["page-wedding", "페이지웨딩&파티", "경기", "용인시", "민간", "하우스·채플", "경기 용인시 처인구 백옥대로 1238"],
  ["leeum-yongin", "용인미르스타디움", "경기", "용인시", "공공", "공공공간", "경기 용인시 처인구 동백죽전대로 61"],
  ["hanwha-yongin", "한화리조트 용인 베잔송", "경기", "용인시", "민간", "호텔", "경기 용인시 처인구 남사읍 봉무로153번길 79"],
  ["eden-paradise", "에덴파라다이스호텔", "경기", "이천시", "민간", "호텔", "경기 이천시 마장면 서이천로 449-79"],
  ["miranda", "미란다호텔", "경기", "이천시", "민간", "호텔", "경기 이천시 중리천로115번길 45"],
  ["yangpyeong-museum", "양평군립미술관", "경기", "양평군", "공공", "공공공간", "경기 양평군 양평읍 문화복지길 2"],
  ["terarosa-seojeong", "서종문화체육공원", "경기", "양평군", "공공", "공원·야외", "경기 양평군 서종면 북한강로 781-2"],
  ["garden-of-morning", "아침고요수목원", "경기", "가평군", "민간", "공원·야외", "경기 가평군 상면 수목원로 432"],
  ["switzerland", "에델바이스 스위스 테마파크", "경기", "가평군", "민간", "공원·야외", "경기 가평군 설악면 다락재로 226-57"],
  ["museum-san", "남양주 정약용유적지", "경기", "남양주시", "공공", "공원·야외", "경기 남양주시 조안면 다산로747번길 11"],
  ["harmony", "남양주체육문화센터", "경기", "남양주시", "공공", "공공공간", "경기 남양주시 다산지금로 91"],
  ["hanam-convention", "하남문화예술회관", "경기", "하남시", "공공", "공공공간", "경기 하남시 신평로 125"],
  ["hanam-union", "유니온타워 시민행복센터", "경기", "하남시", "공공", "공공공간", "경기 하남시 미사대로 710"],
  ["uijeongbu-art", "의정부예술의전당", "경기", "의정부시", "공공", "공공공간", "경기 의정부시 의정로 1"],
];

const venues: Venue[] = venueSeeds.map(([id, name, area, district, type, setting, address, lat, lng]) => ({
  id,
  name,
  area,
  district,
  type,
  setting,
  address,
  lat,
  lng,
  capacity: "운영처 문의",
  note: notes[setting],
  search: `${name} 웨딩 예식`,
}));

type NaverMap = { panTo(position: unknown): void; setZoom(zoom: number): void };
type NaverMarker = { setMap(map: NaverMap | null): void };
type GeocodeResult = { v2?: { addresses?: Array<{ x: string; y: string }> } };
type NaverMapsApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => NaverMap;
  LatLng: new (lat: number, lng: number) => unknown;
  Marker: new (options: Record<string, unknown>) => NaverMarker;
  Point: new (x: number, y: number) => unknown;
  Position: { TOP_RIGHT: unknown };
  Event: { addListener(target: NaverMarker, event: string, handler: () => void): void };
  Service?: { geocode(options: { query: string }, callback: (status: string, response: GeocodeResult) => void): void; Status: { OK: string } };
};

declare global {
  interface Window { naver?: { maps: NaverMapsApi }; }
}

const settingOptions = ["전체", "공공공간", "한옥", "공원·야외", "호텔", "컨벤션", "하우스·채플"] as const;

export default function NaverVenueMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<NaverMarker[]>([]);
  const coordinateCache = useRef(new Map<string, { lat: number; lng: number }>());
  const [clientId, setClientId] = useState("");
  const [area, setArea] = useState<"전체" | "서울" | "경기">("전체");
  const [type, setType] = useState<"전체" | "공공" | "민간">("전체");
  const [setting, setSetting] = useState<(typeof settingOptions)[number]>("전체");
  const [pageSize, setPageSize] = useState<10 | 20 | 30>(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(venues[0].id);
  const [mapState, setMapState] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [coordinateVersion, setCoordinateVersion] = useState(0);

  const filtered = useMemo(() => venues.filter(venue =>
    (area === "전체" || venue.area === area) &&
    (type === "전체" || venue.type === type) &&
    (setting === "전체" || venue.setting === setting)
  ), [area, type, setting]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedVenues = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize]);
  const firstResult = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const lastResult = Math.min(page * pageSize, filtered.length);

  useEffect(() => { setPage(1); }, [area, type, setting, pageSize]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  useEffect(() => {
    let active = true;
    fetch("/api/naver-config", { cache: "no-store" })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("config unavailable")))
      .then((config: { clientId?: string }) => {
        if (!active) return;
        const id = config.clientId?.trim() || "";
        if (id) setClientId(id);
        else setMapState("missing");
      })
      .catch(() => { if (active) setMapState("error"); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!clientId || !mapEl.current) return;
    const renderMap = () => {
      if (!window.naver?.maps || !mapEl.current) return;
      const map = new window.naver.maps.Map(mapEl.current, {
        center: new window.naver.maps.LatLng(37.535, 126.985), zoom: 10, minZoom: 8,
        zoomControl: true, zoomControlOptions: { position: window.naver.maps.Position.TOP_RIGHT },
      });
      mapRef.current = map;
      setMapState("ready");
    };
    if (window.naver?.maps) { renderMap(); return; }
    const existing = document.querySelector<HTMLScriptElement>("script[data-naver-wedding-map]");
    if (existing) { existing.addEventListener("load", renderMap, { once: true }); return; }
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}&submodules=geocoder`;
    script.async = true;
    script.dataset.naverWeddingMap = "true";
    script.onload = renderMap;
    script.onerror = () => setMapState("error");
    document.head.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (mapState !== "ready" || !window.naver?.maps.Service) return;
    let active = true;
    pagedVenues.forEach(venue => {
      if (venue.lat && venue.lng) coordinateCache.current.set(venue.id, { lat: venue.lat, lng: venue.lng });
      if (coordinateCache.current.has(venue.id)) return;
      window.naver?.maps.Service?.geocode({ query: venue.address }, (status, response) => {
        if (!active || status !== window.naver?.maps.Service?.Status.OK) return;
        const result = response.v2?.addresses?.[0];
        if (!result) return;
        coordinateCache.current.set(venue.id, { lat: Number(result.y), lng: Number(result.x) });
        setCoordinateVersion(version => version + 1);
      });
    });
    return () => { active = false; };
  }, [mapState, pagedVenues]);

  useEffect(() => {
    if (mapState !== "ready" || !mapRef.current || !window.naver?.maps) return;
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = pagedVenues.flatMap(venue => {
      const coordinate = coordinateCache.current.get(venue.id) || (venue.lat && venue.lng ? { lat: venue.lat, lng: venue.lng } : null);
      if (!coordinate) return [];
      const marker = new window.naver!.maps.Marker({
        position: new window.naver!.maps.LatLng(coordinate.lat, coordinate.lng),
        map: mapRef.current,
        title: venue.name,
        icon: { content: `<button class="map-pin ${selected === venue.id ? "is-selected" : ""}" aria-label="${venue.name}"><span>${venue.area === "서울" ? "서" : "경"}</span></button>`, anchor: new window.naver!.maps.Point(19, 42) },
      });
      window.naver!.maps.Event.addListener(marker, "click", () => setSelected(venue.id));
      return [marker];
    });
  }, [pagedVenues, mapState, selected, coordinateVersion]);

  const choose = (venue: Venue) => {
    setSelected(venue.id);
    const coordinate = coordinateCache.current.get(venue.id) || (venue.lat && venue.lng ? { lat: venue.lat, lng: venue.lng } : null);
    if (coordinate && mapRef.current && window.naver?.maps) {
      mapRef.current.panTo(new window.naver.maps.LatLng(coordinate.lat, coordinate.lng));
      mapRef.current.setZoom(13);
    }
  };

  const movePage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
    setSelected("");
  };

  return <div className="venue-explorer">
    <div className="venue-toolbar">
      <div><small>지역</small>{(["전체", "서울", "경기"] as const).map(value => <button key={value} type="button" className={area === value ? "active" : ""} onClick={() => setArea(value)}>{value}</button>)}</div>
      <div><small>운영</small>{(["전체", "공공", "민간"] as const).map(value => <button key={value} type="button" className={type === value ? "active" : ""} onClick={() => setType(value)}>{value}</button>)}</div>
      <p><b>{filtered.length}</b>곳의 후보 공간</p>
    </div>
    <div className="venue-subtoolbar">
      <div className="venue-settings"><small>공간 유형</small>{settingOptions.map(value => <button key={value} type="button" className={setting === value ? "active" : ""} onClick={() => setSetting(value)}>{value}</button>)}</div>
      <div className="venue-page-size"><small>한 번에</small>{([10, 20, 30] as const).map(value => <button key={value} type="button" className={pageSize === value ? "active" : ""} onClick={() => setPageSize(value)}>{value}개</button>)}</div>
    </div>
    <div className="venue-layout">
      <div className={`naver-map ${mapState !== "ready" ? "map-fallback" : ""}`} ref={mapEl} aria-label="서울·경기 웨딩 공간 네이버 지도">
        {mapState === "missing" && <div className="map-message"><i>지도</i><strong>네이버 지도 연결 준비 완료</strong><p>Maps JavaScript API의 Client ID를 연결하면<br/>이곳에 장소별 마커가 표시됩니다.</p><a href="https://console.ncloud.com/naver-service/application" target="_blank" rel="noreferrer">네이버 클라우드 콘솔 열기 ↗</a></div>}
        {mapState === "loading" && <div className="map-message"><strong>지도를 불러오는 중이에요</strong></div>}
        {mapState === "error" && <div className="map-message"><strong>지도를 불러오지 못했어요</strong><p>등록한 Web 서비스 URL과 Client ID를 확인해 주세요.</p></div>}
      </div>
      <div className="venue-results">
        <div className="venue-result-head"><strong>{firstResult}–{lastResult}</strong><span>/ 총 {filtered.length}곳</span><small>현재 페이지 장소가 지도에 표시됩니다.</small></div>
        <div className="venue-list" aria-live="polite">
          {pagedVenues.map(venue => <button type="button" key={venue.id} className={selected === venue.id ? "selected" : ""} onClick={() => choose(venue)}>
            <span className="venue-badges"><em>{venue.area} · {venue.district}</em><i>{venue.type}</i><i>{venue.setting}</i></span>
            <strong>{venue.name}</strong><small>{venue.address}</small>
            <p>{venue.note}</p>
            <span className="venue-meta"><b>인원·비용</b>{venue.capacity} · 대관/식음료 별도 확인</span>
            <a href={`https://search.naver.com/search.naver?query=${encodeURIComponent(venue.search)}`} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}>최신 운영 정보 보기 ↗</a>
          </button>)}
          {!filtered.length && <p className="empty-venues">선택한 조건에 맞는 장소가 없어요.</p>}
        </div>
        <div className="venue-pagination" role="navigation" aria-label="웨딩 공간 페이지 이동">
          <button type="button" onClick={() => movePage(page - 1)} disabled={page === 1}>이전</button>
          <span><b>{page}</b> / {totalPages}</span>
          <button type="button" onClick={() => movePage(page + 1)} disabled={page === totalPages}>다음</button>
        </div>
      </div>
    </div>
    <p className="map-caption">후보 공간 100여 곳은 탐색을 돕기 위한 큐레이션입니다. 예식 운영 여부와 상호·주소는 달라질 수 있으니 방문 전 네이버 최신 정보와 운영 기관을 통해 수용 인원, 대관 가능일, 음식 반입, 우천 대안과 실제 비용을 반드시 확인하세요.</p>
  </div>;
}
