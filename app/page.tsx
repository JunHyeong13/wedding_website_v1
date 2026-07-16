"use client";

import { useEffect, useMemo, useState } from "react";
import NaverVenueMap from "./components/NaverVenueMap";

const regions = {
  gangnam: ["서울 강남", 1.35, 38464], seoul: ["서울(강남 외)", 1.15, 38464],
  metro: ["경기·광역시", 1, 31000], local: ["그 외 지역", .78, 26000],
} as const;
const styles = { simple: ["알뜰하게", .72], standard: ["보통으로", 1], premium: ["여유롭게", 1.45] } as const;
const tasks = [
  ["talk", "D-365", "두 사람의 결혼 원칙과 총예산 합의", "부모님 지원금은 확정된 금액만 반영해요."],
  ["family", "D-300", "양가에 결혼 의사 전달", "민감한 조건은 상견례 전에 먼저 조율해요."],
  ["venue", "D-240", "예식 지역·날짜·보증인원 결정", "취소 규정과 최소 인원을 확인해요."],
  ["meeting", "D-210", "상견례 장소 예약", "조용한 룸, 이동 거리, 식단을 고려해요."],
  ["studio", "D-180", "스드메 견적 비교 및 계약", "원본·헬퍼비·업그레이드를 따로 적어요."],
  ["travel", "D-150", "신혼여행 예약", "여권 만료일과 취소 가능 요금을 확인해요."],
  ["invite", "D-90", "청첩장과 하객 리스트 정리", "초대 범위는 같은 기준으로 맞춰요."],
  ["final", "D-30", "최종 인원·식순·잔금 확인", "당일 담당자 연락처를 공유해요."],
] as const;
const won = (n: number) => `${Math.round(n).toLocaleString("ko-KR")}만원`;

type SavingsPlanProps = {
  target: number;
  currentFunds: number;
  monthlySavings: number;
  onCurrentFundsChange: (value: number) => void;
  onMonthlySavingsChange: (value: number) => void;
  weddingType: string;
};

function SavingsPlan({ target, currentFunds, monthlySavings, onCurrentFundsChange, onMonthlySavingsChange, weddingType }: SavingsPlanProps) {
  const remaining = Math.max(0, target - currentFunds);
  const months = remaining === 0 ? 0 : monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : null;
  const progress = target > 0 ? Math.min(100, currentFunds / target * 100) : 100;
  const period = months === null
    ? "월 저축액을 입력해 주세요"
    : months === 0
      ? "이미 목표 예산을 마련했어요"
      : `${Math.floor(months / 12) > 0 ? `${Math.floor(months / 12)}년 ` : ""}${months % 12 > 0 ? `${months % 12}개월` : ""}`.trim();
  const targetMonth = useMemo(() => {
    if (months === null || months === 0) return null;
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long" }).format(date);
  }, [months]);

  const updateNumber = (value: string, setter: (value: number) => void) => {
    const parsed = Number(value);
    setter(Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
  };

  return <div className="savings-plan">
    <div className="savings-head">
      <div><small>예산 달성 플래너</small><strong>{weddingType} 자금 준비 기간</strong></div>
      <span>입력값은 두 계산기에 함께 반영돼요</span>
    </div>
    <div className="savings-fields">
      <label><span>현재 마련한 금액</span><div><input type="number" min="0" step="10" inputMode="numeric" value={currentFunds} onChange={e => updateNumber(e.target.value, onCurrentFundsChange)} aria-label="현재 마련한 금액"/><b>만원</b></div></label>
      <label><span>앞으로 매달 모을 금액</span><div><input type="number" min="0" step="10" inputMode="numeric" value={monthlySavings} onChange={e => updateNumber(e.target.value, onMonthlySavingsChange)} aria-label="매달 모을 금액"/><b>만원</b></div></label>
    </div>
    <div className="funding-progress" aria-label={`예산 준비율 ${Math.round(progress)}%`}><i style={{ width: `${progress}%` }}/></div>
    <div className="savings-summary">
      <div><small>더 필요한 금액</small><b>{won(remaining)}</b></div>
      <div><small>예상 준비 기간</small><b>{period}</b>{months !== null && months > 0 && <em>총 {months.toLocaleString("ko-KR")}개월</em>}</div>
      <div><small>목표 달성 예상</small><b>{targetMonth ?? (months === 0 ? "지금 바로 가능" : "계산 대기 중")}</b></div>
    </div>
    <p>이자·투자수익과 물가 변동은 반영하지 않은 단순 저축 기준이며, 실제 계약 전에는 예비비를 별도로 남겨두는 것이 좋아요.</p>
  </div>;
}

const smallSpaces = {
  public: ["공공·커뮤니티 공간", 120],
  restaurant: ["레스토랑·한옥", 280],
  house: ["하우스·가든", 520],
} as const;
const smallPackages = {
  essential: ["핵심만", 0.72],
  standard: ["균형 있게", 1],
  signature: ["공간 연출 중심", 1.45],
} as const;
const smallSteps = [
  ["D-180", "형식·총예산·최대 인원 합의", "초대하고 싶은 사람부터 적은 뒤 1차 명단의 상한을 정해요."],
  ["D-150", "공간 3곳 답사", "최소 보증 인원, 독점 케이터링, 우천 대안을 같은 표로 비교해요."],
  ["D-120", "공간·식음료 계약", "대관 시간에는 설치와 철수 시간까지 포함되는지 확인해요."],
  ["D-90", "사진·의상·메이크업 결정", "패키지가 아니라 필요한 항목만 개별 계약해도 괜찮아요."],
  ["D-60", "초대장·좌석·식순 설계", "소규모일수록 모든 하객이 참여할 짧은 순서를 넣으면 좋아요."],
  ["D-30", "최종 인원·메뉴·동선 확정", "유아식, 채식, 알레르기와 교통·주차 안내를 함께 확인해요."],
  ["D-7", "당일 운영표와 잔금 점검", "현장 담당자 한 명에게 업체 연락처와 시간표를 공유해요."],
] as const;

type SharedSavingsProps = Pick<SavingsPlanProps, "currentFunds" | "monthlySavings" | "onCurrentFundsChange" | "onMonthlySavingsChange">;

function SmallWeddingSection({ currentFunds, monthlySavings, onCurrentFundsChange, onMonthlySavingsChange }: SharedSavingsProps) {
  const [guests, setGuests] = useState(40);
  const [space, setSpace] = useState<keyof typeof smallSpaces>("restaurant");
  const [pack, setPack] = useState<keyof typeof smallPackages>("standard");
  const [meal, setMeal] = useState(7);
  const estimate = useMemo(() => {
    const factor = smallPackages[pack][1];
    const base = {
      "공간 대관": smallSpaces[space][1],
      "식사·음료": guests * meal,
      "꽃·공간 연출": 260 * factor,
      "사진·의상·메이크업": 410 * factor,
      "진행·음향": 130 * factor,
      "초대장·답례": guests * 1.35 * factor,
    };
    const subtotal = Object.values(base).reduce((a, b) => a + b, 0);
    return { parts: { ...base, "예비비 8%": subtotal * .08 }, total: subtotal * 1.08 };
  }, [guests, space, pack, meal]);

  return <section className="small-wedding" id="small-wedding">
    <div className="small-intro">
      <div className="title"><p>02 · 스몰웨딩 현실 가이드</p><h2>작게 초대하고,<br/>더 오래 기억하는 결혼식</h2><span>하객 수가 적다고 무조건 저렴한 것은 아니에요. 최소 보증 인원과 공간 대관료를 먼저 보고, 식사와 연출에서 우리다운 우선순위를 고르세요.</span></div>
      <div className="small-ranges">
        <article><small>10–30명</small><strong>600–1,500만원</strong><p>가족 중심 식사·레스토랑형</p></article>
        <article><small>30–60명</small><strong>1,000–2,500만원</strong><p>한옥·하우스·공공 공간형</p></article>
        <article><small>60–100명</small><strong>1,800–3,500만원</strong><p>예식 구성과 공간 연출 포함</p></article>
        <p>※ 위 금액은 서울·경기권 탐색을 위한 계획 범위이며, 장소·계절·식음료 조건에 따라 달라집니다.</p>
      </div>
    </div>

    <div className="small-calculator">
      <div className="small-controls">
        <p className="calc-label">우리의 스몰웨딩 조건</p>
        <label className="range"><b>초대 인원 <em>{guests}명</em></b><input type="range" min="10" max="100" step="5" value={guests} onChange={e => setGuests(+e.target.value)}/><small><span>10명</span><span>100명</span></small></label>
        <fieldset><legend>공간 유형</legend><div className="segments">{Object.entries(smallSpaces).map(([k, v]) => <button type="button" key={k} className={space === k ? "active" : ""} onClick={() => setSpace(k as keyof typeof smallSpaces)}>{v[0]}</button>)}</div></fieldset>
        <fieldset><legend>준비 방식</legend><div className="segments">{Object.entries(smallPackages).map(([k, v]) => <button type="button" key={k} className={pack === k ? "active" : ""} onClick={() => setPack(k as keyof typeof smallPackages)}>{v[0]}</button>)}</div></fieldset>
        <label><b>1인 식사 예산</b><select value={meal} onChange={e => setMeal(+e.target.value)}><option value="5.5">5만 5천원</option><option value="7">7만원</option><option value="9.5">9만 5천원</option><option value="13">13만원</option></select></label>
      </div>
      <div className="small-result">
        <div><small>현재 조건의 예상 준비비</small><h3>{won(estimate.total)}</h3><p>{smallSpaces[space][0]} · {smallPackages[pack][0]} · {guests}명</p></div>
        <dl>{Object.entries(estimate.parts).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{won(value)}</dd></div>)}</dl>
        <p className="estimate-note">신혼집·혼수·신혼여행 비용은 제외한 예식 중심 추정치예요.</p>
        <SavingsPlan target={estimate.total} currentFunds={currentFunds} monthlySavings={monthlySavings} onCurrentFundsChange={onCurrentFundsChange} onMonthlySavingsChange={onMonthlySavingsChange} weddingType="스몰웨딩" />
      </div>
    </div>

    <div className="small-steps">
      <div><p>준비 순서</p><h3>180일이면 충분한<br/>7단계 로드맵</h3><span>인원이 적을수록 공간과 식사의 선택지가 달라져요. 날짜보다 먼저 초대 인원의 상한을 정하세요.</span></div>
      <ol>{smallSteps.map(([date, title, desc]) => <li key={date}><b>{date}</b><div><strong>{title}</strong><p>{desc}</p></div></li>)}</ol>
    </div>

    <div className="small-contract">
      <div><small>계약 전 6문장</small><h3>이것만은 꼭 물어보세요</h3></div>
      <ul>
        <li>최소 보증 인원과 인원 미달 시 비용은?</li><li>외부 케이터링·주류·업체 반입료는?</li>
        <li>설치와 철수를 포함한 실제 대관 시간은?</li><li>야외 예식의 우천·폭염 대체 공간은?</li>
        <li>주차 가능 대수와 셔틀·대중교통 동선은?</li><li>날짜 변경·취소 시점별 환불 기준은?</li>
      </ul>
    </div>
  </section>;
}

export default function Home() {
  const [region, setRegion] = useState<keyof typeof regions>("seoul");
  const [style, setStyle] = useState<keyof typeof styles>("standard");
  const [guests, setGuests] = useState(180);
  const [house, setHouse] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [currentFunds, setCurrentFunds] = useState(1500);
  const [monthlySavings, setMonthlySavings] = useState(150);

  useEffect(() => {
    const timer = window.setTimeout(() => { try { setDone(JSON.parse(localStorage.getItem("wedding-tasks") || "[]")); } catch {} }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const budget = useMemo(() => {
    const f = styles[style][1]; const rf = regions[region][1];
    const parts = {
      "예식장·식대": (430 + guests * 6.5) * rf * f,
      "스드메": 390 * (.8 + f * .2), "신혼여행": 850 * f,
      [house ? "신혼집" : "혼수·가전"]: house ? regions[region][2] : 1150 * (.85 + f * .15),
      "예물·예단": 520 * f, "기타·예비비": 280 * (.8 + f * .2),
    };
    return { parts, total: Object.values(parts).reduce((a, b) => a + b, 0) };
  }, [region, style, guests, house]);
  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter(x => x !== id) : [...done, id];
    setDone(next); try { localStorage.setItem("wedding-tasks", JSON.stringify(next)); } catch {}
  };

  return <main>
    <header>
      <a className="brand" href="#top" aria-label="온결 홈으로 이동"><img src="/ongyeol-symbol.png" alt=""/><span className="brand-copy"><strong>온결</strong><small>우리의 결혼, 현실적인 가이드</small></span></a>
      <nav><a href="#budget">예산 계산기</a><a href="#small-wedding">스몰웨딩</a><a href="#venues">웨딩홀 지도</a><a href="#meeting">상견례 예절</a><a href="#checklist">체크리스트</a></nav>
      <a className="small-cta" href="#checklist">내 준비도 보기 ↗</a>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="hero-brandline"><span>ONGYEOL · OUR WAY</span><strong>온전히 우리다운 결혼</strong></div>
        <h1>결혼 준비,<br/>막막함 대신<br/><em>숫자와 순서로</em></h1>
        <p className="lead">20대 후반부터 30대 중반 사회 초년생을 위해<br/>예산, 상견례 예절, 준비 순서를 한곳에 담았어요.</p>
        <div className="actions"><a className="primary" href="#budget">내 결혼 예산 계산하기 <b>→</b></a><a href="#meeting">상견례 예절 먼저 보기 ↓</a></div>
      </div>
      <div className="hero-art"><img src="/hero-planning.png" alt="함께 결혼 예산을 계획하는 예비부부"/><span className="note n1">01 · 예산부터 합의하기</span><span className="note n2">02 · 관행은 선택하기</span></div>
      <div className="snapshot">
        <div><small>우리의 예상 총예산</small><strong>{won(budget.total)}</strong></div>
        <div><small>준비 완료</small><b>{Math.round(done.length / tasks.length * 100)}%</b><span><i style={{width:`${Math.max(4, done.length / tasks.length * 100)}%`}}/></span></div>
        <p>평균은 답이 아니에요.<br/><b>우리 형편과 우선순위</b>를 기준으로 시작하세요.</p>
      </div>
    </section>

    <section className="facts">
      <div><small>2026 결혼서비스 전국 평균</small><strong>2,139만원</strong><span>예식장 + 스드메</span></div>
      <div><small>주택 제외 결혼 준비 평균</small><strong>5,912만원</strong><span>평균은 목표가 아닌 참고선</span></div>
      <div><small>신혼집 마련 전국 평균</small><strong>3억 2,201만원</strong><span>지역·점유 형태에 따라 큰 차이</span></div>
    </section>

    <section className="section" id="budget">
      <div className="title"><p>01 · 현실 예산 계산기</p><h2>남들이 쓴 금액 말고,<br/>우리에게 필요한 금액</h2><span>지역과 하객 수만 바꿔도 비용은 크게 달라져요. 신혼집은 분리해서 보는 것이 현실적인 출발입니다.</span></div>
      <div className="calculator">
        <div className="inputs">
          <label><b>예식 지역</b><select value={region} onChange={e=>setRegion(e.target.value as keyof typeof regions)}>{Object.entries(regions).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></label>
          <fieldset><legend>준비 스타일</legend><div className="segments">{Object.entries(styles).map(([k,v])=><button type="button" className={style===k?"active":""} onClick={()=>setStyle(k as keyof typeof styles)} key={k}>{v[0]}</button>)}</div></fieldset>
          <label className="range"><b>예상 하객 수 <em>{guests}명</em></b><input type="range" min="50" max="400" step="10" value={guests} onChange={e=>setGuests(+e.target.value)}/><small><span>50명</span><span>400명</span></small></label>
          <label className="toggle"><input type="checkbox" checked={house} onChange={e=>setHouse(e.target.checked)}/><span><b>신혼집 마련 비용까지 포함</b><small>끄면 혼수·가전 비용만 계산해요.</small></span><i/></label>
          <aside><b>먼저 합의할 한 가지</b><p>축의금은 예상 수입으로 잡지 말고, 이미 가진 현금과 확정된 지원금 안에서 상한선을 정하세요.</p></aside>
        </div>
        <div className="result">
          <small>지금 조건의 예상 총예산</small><h3>{won(budget.total)}</h3><p>{regions[region][0]} · {styles[style][0]} · 하객 {guests}명</p>
          <div className="bars">{Object.entries(budget.parts).map(([k,v])=><div key={k}><span>{k}<b>{won(v)}</b></span><i><em style={{width:`${Math.max(4,v/budget.total*100)}%`}}/></i></div>)}</div>
          <aside><b>예비비 포함</b><p>부가세, 봉사료, 헬퍼비, 원본비, 추가 장식비는 계약 전에 따로 확인하세요.</p></aside>
          <SavingsPlan target={budget.total} currentFunds={currentFunds} monthlySavings={monthlySavings} onCurrentFundsChange={setCurrentFunds} onMonthlySavingsChange={setMonthlySavings} weddingType="일반웨딩" />
        </div>
      </div>
    </section>

    <SmallWeddingSection currentFunds={currentFunds} monthlySavings={monthlySavings} onCurrentFundsChange={setCurrentFunds} onMonthlySavingsChange={setMonthlySavings} />

    <section className="section venues" id="venues">
      <div className="venue-heading">
        <div className="title"><p>03 · 서울·경기 웨딩 공간</p><h2>지도에서 먼저 보고,<br/>우리 동선으로 좁혀요</h2></div>
        <p>공공 공간부터 한옥·공원·호텔·컨벤션·하우스웨딩까지 100여 곳을 모았어요. 지역과 공간 유형으로 좁혀 우리에게 맞는 후보를 비교해 보세요.</p>
      </div>
      <NaverVenueMap />
    </section>

    <section className="guide" id="guide">
      <div className="title"><p>04 · 돈 얘기하는 순서</p><h2>사랑과 돈을<br/>같은 테이블에 놓는 법</h2></div>
      <div className="cards">
        <article><i>1</i><h3>가진 돈을 먼저 공개해요</h3><p>현금, 대출, 학자금, 월 저축액을 같은 기준일로 적습니다. 부모님 지원은 확정 전까지 0원으로 둬요.</p><blockquote>“우리 둘이 감당 가능한 금액부터 정해보자.”</blockquote></article>
        <article><i>2</i><h3>필수와 선택을 나눠요</h3><p>예식, 집, 여행에서 각자 포기 못 하는 한 가지씩만 고릅니다. 예단·예물은 의무가 아니라 선택이에요.</p><blockquote>“나는 하객 식사는 지키고, 촬영은 줄여도 괜찮아.”</blockquote></article>
        <article><i>3</i><h3>부모님께는 합의안을 전해요</h3><p>두 사람의 기준을 먼저 만들고 양가에 동일하게 설명합니다. 누가 더 냈는지보다 경계를 분명히 해요.</p><blockquote>“저희가 정한 범위 안에서 준비하려고 해요.”</blockquote></article>
      </div>
    </section>

    <section className="section meeting" id="meeting">
      <div className="title"><p>05 · 상견례 예절</p><h2>좋은 상견례는<br/>결정이 아니라<br/><em>확인하는 자리</em></h2><span>예산과 집, 예단 같은 민감한 내용은 예비부부가 먼저 조율하세요. 당일에는 서로를 소개하고 큰 방향을 부드럽게 확인하면 충분합니다.</span></div>
      <ol>
        <li><b>15분 전</b><div><strong>예비부부가 먼저 도착</strong><p>룸과 메뉴를 확인하고 부모님을 입구에서 맞이해요.</p></div></li>
        <li><b>첫 인사</b><div><strong>예비부부가 가족을 소개</strong><p>관계와 성함을 차분히 알려드려요.</p></div></li>
        <li><b>식사 중</b><div><strong>가벼운 공통점부터</strong><p>오는 길, 음식, 취미를 이야기하고 정치·재산 비교는 피해요.</p></div></li>
        <li><b>마무리</b><div><strong>감사 인사와 다음 일정</strong><p>결제 담당은 미리 정하고 식당 밖에서 다시 인사해요.</p></div></li>
      </ol>
      <div className="etiquette"><article><b>자리</b><h3>상석은 양가 부모님께</h3><p>출입문에서 먼 안쪽을 양보하되, 정답보다 이동 편의가 우선입니다.</p></article><article><b>호칭</b><h3>정중하고 단순하게</h3><p>상대 부모님께 “아버님·어머님”, 부모님끼리는 “사돈어른”이 무난해요.</p></article><article><b>비용</b><h3>결제자는 미리 결정</h3><p>한쪽이 내야 한다는 규칙은 없어요. 미리 합의해 현장의 실랑이를 막으세요.</p></article><article><b>선물</b><h3>작고 부담 없게</h3><p>양가 모두 같은 수준으로 준비하거나 생략해도 예의에 어긋나지 않아요.</p></article></div>
    </section>

    <section className="section checklist" id="checklist">
      <div className="check-head"><div className="title"><p>06 · D-365 체크리스트</p><h2>오늘 할 일만 보이면<br/>준비는 가벼워져요</h2></div><div className="score"><small>나의 준비도</small><b>{done.length}<em> / {tasks.length}</em></b><span><i style={{width:`${done.length/tasks.length*100}%`}}/></span></div></div>
      <div className="task-list">{tasks.map(([id,d,text,desc])=><button type="button" className={done.includes(id)?"done":""} onClick={()=>toggle(id)} key={id}><i>{done.includes(id)?"✓":""}</i><b>{d}</b><span><strong>{text}</strong><small>{desc}</small></span><em>{done.includes(id)?"완료":"체크"}</em></button>)}</div>
      <small className="saved">체크한 내용은 이 기기에 자동 저장됩니다.</small>
    </section>

    <section className="closing"><p>결혼은 평균에 맞추는 일이 아니라</p><h2>두 사람의 생활을<br/>함께 설계하는 일이니까.</h2><a href="#budget">우리 예산 다시 계산하기 ↑</a></section>
    <footer><div><a className="brand" href="#top" aria-label="온결 홈으로 이동"><img src="/ongyeol-symbol.png" alt=""/><span className="brand-copy"><strong>온결</strong><small>온전히 우리다운 결혼</small></span></a><p>처음 결혼을 준비하는 사회 초년생을 위한 현실적인 출발점</p></div><div><b>자료·서비스 기준</b><a href="https://www.price.go.kr/tprice/portal/wedding/areaStatistic.do" target="_blank">한국소비자원 참가격 결혼서비스 통계 ↗</a><a href="https://familyseoul.or.kr/node/25845" target="_blank">서울시 서울마이웨딩 안내 ↗</a><a href="https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html" target="_blank">네이버 Maps JavaScript API ↗</a></div><small>예산 결과는 계획을 돕기 위한 참고용 추정치입니다. 장소 운영, 비용, 수용 인원은 수시로 달라질 수 있으므로 최종 계약 전 운영 기관의 최신 안내와 취소 규정을 확인하세요. · 데이터 확인 2026.07.16</small></footer>
  </main>;
}
