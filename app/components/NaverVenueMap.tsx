"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Venue = {
  id: string;
  name: string;
  area: "서울" | "경기";
  district: string;
  type: "공공" | "민간";
  setting: string;
  capacity: string;
  address: string;
  lat: number;
  lng: number;
  note: string;
  search: string;
};

const venues: Venue[] = [
  { id: "citizens", name: "시민청 태평홀", area: "서울", district: "중구", type: "공공", setting: "실내", capacity: "약 100명", address: "서울 중구 세종대로 110", lat: 37.56636, lng: 126.97794, note: "대중교통 접근성이 좋은 도심형 공공 예식 공간", search: "시민청 태평홀 결혼식" },
  { id: "namsan", name: "남산골한옥마을", area: "서울", district: "중구", type: "공공", setting: "한옥·야외", capacity: "공간별 상이", address: "서울 중구 퇴계로34길 28", lat: 37.55929, lng: 126.99442, note: "전통 혼례나 한옥 분위기의 소규모 예식에 어울리는 공간", search: "남산골한옥마을 전통혼례" },
  { id: "oil", name: "문화비축기지", area: "서울", district: "마포구", type: "공공", setting: "산업·야외", capacity: "공간별 상이", address: "서울 마포구 증산로 87", lat: 37.57105, lng: 126.89497, note: "독특한 산업 유산 공간과 넓은 야외 동선을 활용할 수 있어요", search: "문화비축기지 서울마이웨딩" },
  { id: "dream", name: "북서울꿈의숲", area: "서울", district: "강북구", type: "공공", setting: "공원·야외", capacity: "공간별 상이", address: "서울 강북구 월계로 173", lat: 37.62023, lng: 127.04151, note: "녹음이 있는 공원형 예식을 원할 때 살펴볼 만한 장소", search: "북서울꿈의숲 서울마이웨딩" },
  { id: "women", name: "서울여성플라자", area: "서울", district: "동작구", type: "공공", setting: "실내·정원", capacity: "공간별 상이", address: "서울 동작구 여의대방로54길 18", lat: 37.51119, lng: 126.92763, note: "실내 공간과 정원 동선을 함께 검토할 수 있는 공공시설", search: "서울여성플라자 결혼식" },
  { id: "suwon", name: "수원전통문화관", area: "경기", district: "수원시", type: "공공", setting: "한옥", capacity: "행사별 문의", address: "경기 수원시 팔달구 정조로 893", lat: 37.28714, lng: 127.01443, note: "화성행궁 인근의 한옥 분위기를 살린 소규모 행사 공간", search: "수원전통문화관 혼례" },
  { id: "hanok", name: "부천한옥체험마을", area: "경기", district: "부천시", type: "공공", setting: "한옥·야외", capacity: "행사별 문의", address: "경기 부천시 원미구 길주로 660", lat: 37.51619, lng: 126.76524, note: "한옥 마당과 전통적인 분위기를 활용할 수 있는 공간", search: "부천한옥체험마을 전통혼례" },
  { id: "garden", name: "율동공원", area: "경기", district: "성남시", type: "공공", setting: "공원·야외", capacity: "행사별 문의", address: "경기 성남시 분당구 문정로 145", lat: 37.37743, lng: 127.14916, note: "야외 예식 후보지로 검토할 때 우천·전기·음향 조건을 함께 확인하세요", search: "율동공원 야외 결혼식" },
];

type NaverMap = { panTo(position: unknown): void; setZoom(zoom: number): void };
type NaverMarker = { setMap(map: NaverMap | null): void };
type NaverMapsApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => NaverMap;
  LatLng: new (lat: number, lng: number) => unknown;
  Marker: new (options: Record<string, unknown>) => NaverMarker;
  Point: new (x: number, y: number) => unknown;
  Position: { TOP_RIGHT: unknown };
  Event: { addListener(target: NaverMarker, event: string, handler: () => void): void };
};

declare global {
  interface Window { naver?: { maps: NaverMapsApi }; }
}

const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID || "";

export default function NaverVenueMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<NaverMarker[]>([]);
  const [area, setArea] = useState<"전체" | "서울" | "경기">("전체");
  const [type, setType] = useState<"전체" | "공공" | "민간">("전체");
  const [selected, setSelected] = useState(venues[0].id);
  const [mapState, setMapState] = useState<"loading" | "ready" | "missing" | "error">(clientId ? "loading" : "missing");

  const filtered = useMemo(() => venues.filter(v => (area === "전체" || v.area === area) && (type === "전체" || v.type === type)), [area, type]);

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
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`;
    script.async = true;
    script.dataset.naverWeddingMap = "true";
    script.onload = renderMap;
    script.onerror = () => setMapState("error");
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (mapState !== "ready" || !mapRef.current || !window.naver?.maps) return;
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = filtered.map(venue => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(venue.lat, venue.lng),
        map: mapRef.current,
        title: venue.name,
        icon: { content: `<button class="map-pin ${selected === venue.id ? "is-selected" : ""}" aria-label="${venue.name}"><span>${venue.area === "서울" ? "서" : "경"}</span></button>`, anchor: new window.naver.maps.Point(19, 42) },
      });
      window.naver.maps.Event.addListener(marker, "click", () => setSelected(venue.id));
      return marker;
    });
  }, [filtered, mapState, selected]);

  const choose = (venue: Venue) => {
    setSelected(venue.id);
    if (mapRef.current && window.naver?.maps) {
      mapRef.current.panTo(new window.naver.maps.LatLng(venue.lat, venue.lng));
      mapRef.current.setZoom(13);
    }
  };

  return <div className="venue-explorer">
    <div className="venue-toolbar">
      <div><small>지역</small>{(["전체", "서울", "경기"] as const).map(v => <button key={v} type="button" className={area === v ? "active" : ""} onClick={() => setArea(v)}>{v}</button>)}</div>
      <div><small>운영</small>{(["전체", "공공", "민간"] as const).map(v => <button key={v} type="button" className={type === v ? "active" : ""} onClick={() => setType(v)} disabled={v === "민간"}>{v}</button>)}</div>
      <p><b>{filtered.length}</b>곳의 후보 공간</p>
    </div>
    <div className="venue-layout">
      <div className={`naver-map ${mapState !== "ready" ? "map-fallback" : ""}`} ref={mapEl} aria-label="서울·경기 스몰웨딩 후보지 네이버 지도">
        {mapState === "missing" && <div className="map-message"><i>지도</i><strong>네이버 지도 연결 준비 완료</strong><p>Maps JavaScript API의 Client ID를 연결하면<br/>이곳에 장소별 마커가 표시됩니다.</p><a href="https://console.ncloud.com/naver-service/application" target="_blank" rel="noreferrer">네이버 클라우드 콘솔 열기 ↗</a></div>}
        {mapState === "loading" && <div className="map-message"><strong>지도를 불러오는 중이에요</strong></div>}
        {mapState === "error" && <div className="map-message"><strong>지도를 불러오지 못했어요</strong><p>등록한 Web 서비스 URL과 Client ID를 확인해 주세요.</p></div>}
      </div>
      <div className="venue-list" aria-live="polite">
        {filtered.map(venue => <button type="button" key={venue.id} className={selected === venue.id ? "selected" : ""} onClick={() => choose(venue)}>
          <span className="venue-badges"><em>{venue.area} · {venue.district}</em><i>{venue.type}</i><i>{venue.setting}</i></span>
          <strong>{venue.name}</strong><small>{venue.address}</small>
          <p>{venue.note}</p>
          <span className="venue-meta"><b>권장 확인</b>{venue.capacity} · 대관/식음료 별도 문의</span>
          <a href={`https://search.naver.com/search.naver?query=${encodeURIComponent(venue.search)}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>최신 운영 정보 보기 ↗</a>
        </button>)}
        {!filtered.length && <p className="empty-venues">선택한 조건에 맞는 장소가 없어요.</p>}
      </div>
    </div>
    <p className="map-caption">장소 정보는 탐색을 돕는 출발점입니다. 수용 인원, 대관 가능일, 음식 반입, 우천 대안과 실제 비용은 운영 기관에 반드시 다시 확인하세요.</p>
  </div>;
}
