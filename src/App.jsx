import { useMemo, useState } from "react";

const categories = {
  text: {
    label: "텍스트",
    emoji: "📝",
    description: "안내문, 알림장, 계획안, 문장 다듬기",
    tasks: [
      "학부모 안내문",
      "알림장 문구",
      "수업계획안",
      "놀이 활동 계획",
      "스토리 만들기",
      "게시판 문구",
      "관찰기록 문장",
      "생기부 문장 손보기",
      "말투 다듬기",
    ],
  },
  image: {
    label: "이미지",
    emoji: "🎨",
    description: "게시판, 삽화, 수업 도입 이미지",
    tasks: [
      "교실 게시판 이미지",
      "현수막 제작용 디자인",
      "수업 도입 이미지",
      "활동지 삽화",
      "이야기 나누기 이미지",
      "카드뉴스 이미지",
      "교실 약속 게시물",
    ],
  },
  summary: {
    label: "문서요약",
    emoji: "📄",
    description: "공문, 회의자료, 연수자료 정리",
    tasks: [
      "긴 글 요약",
      "공문 요약",
      "회의록 요약",
      "파일 읽고 정보 찾기",
      "해야 할 일 체크리스트",
      "학부모 안내문으로 다시쓰기",
    ],
  },
  research: {
    label: "자료조사",
    emoji: "🔎",
    description: "수업자료, 놀이자료, 배경자료 조사",
    tasks: [
      "수업 배경자료 조사",
      "놀이 아이디어 조사",
      "계기교육 자료 조사",
      "안전교육 자료 조사",
      "프로젝트 주제 조사",
      "학부모 안내자료 조사",
    ],
  },
  app: {
    label: "앱",
    emoji: "💻",
    description: "간단한 학급용 앱 아이디어",
    tasks: [
      "퀴즈 앱",
      "랜덤 뽑기 앱",
      "빙고 게임",
      "체크리스트 앱",
      "학급 투표 앱",
      "모둠 편성 도구",
    ],
  },
};

const toneOptions = [
  "따뜻하고 친절하게",
  "짧고 간결하게",
  "공식적이고 신뢰감 있게",
  "부드럽지만 핵심은 분명하게",
  "유아 눈높이에 맞게",
  "초등학생 눈높이에 맞게",
  "학부모가 이해하기 쉽게",
];

const audienceOptions = [
  "유치원 학부모",
  "초등 학부모",
  "유아",
  "초등학생",
  "동료 교사",
  "관리자",
  "신규 교사",
];

const defaultForm = {
  schoolLevel: "",
  audience: "",
  topic: "",
  situation: "",
  mustInclude: "",
  format: "",
  tone: "",
  length: "",
  avoid: "",
  reference: "",
};

function buildPrompt(category, task, form) {
  const level = form.schoolLevel || "유치원 또는 초등학교";
  const audience = form.audience || "대상";
  const topic = form.topic || "주제";
  const situation = form.situation || "상황";
  const mustInclude = form.mustInclude || "포함해야 할 내용";
  const format = form.format || "원하는 형식";
  const tone = form.tone || "원하는 말투";
  const length = form.length || "원하는 분량";
  const avoid = form.avoid || "피해야 할 표현이나 요소";
  const reference = form.reference || "";

  if (category === "image") {
    return `너는 유치원과 초등학교 교사의 교육용 이미지 제작을 돕는 프롬프트 작성 도우미야.
아래 조건에 맞는 ${task} 이미지를 만들기 위한 프롬프트를 작성해줘.

[사용 목적]
${task}

[학교급]
${level}

[대상]
${audience}

[주제]
${topic}

[장면 또는 상황]
${situation}

[반드시 포함할 요소]
${mustInclude}

[스타일]
${tone}

[비율 또는 형태]
${format || "수업자료에 활용하기 좋은 형태"}

[피해야 할 요소]
${avoid}

[중요 조건]
1. 실제 유아나 학생처럼 보이는 인물은 만들지 말아줘.
2. 개인정보가 드러나는 요소는 넣지 말아줘.
3. 교육용 자료로 활용하기 좋게 깔끔하게 구성해줘.
4. 이미지가 너무 복잡하지 않게 해줘.
5. 텍스트가 들어간다면 짧고 또렷하게 배치해줘.

${task.includes("현수막") ? `
[현수막 제작용 추가 조건]
- 벽에 걸린 목업 사진처럼 만들지 말고, 인쇄 제작용 평면 디자인 시안으로 만들어줘.
- 정면 2D 레이아웃으로 보여줘.
- 천 질감, 주름, 그림자, 집게, 끈, 배경 벽, 설치된 모습은 제외해줘.
- 현수막 디자인만 화면에 꽉 차게 보여줘.
` : ""}`;
  }

  if (category === "summary") {
    return `너는 유치원과 초등학교 신규 교사의 문서 이해를 돕는 요약 도우미야.
아래 자료 또는 첨부파일을 읽고 ${task} 작업을 해줘.

[학교급]
${level}

[대상]
${audience}

[문서 또는 자료의 주제]
${topic}

[내가 알고 싶은 점]
${situation}

[중점적으로 찾아야 할 내용]
${mustInclude}

[원하는 결과 형식]
${format || "표와 체크리스트"}

[작성 톤]
${tone || "신규 교사가 이해하기 쉽게"}

[분량]
${length || "핵심만 간결하게"}

[주의사항]
1. 문서의 핵심 내용을 먼저 요약해줘.
2. 내가 해야 할 일을 체크리스트로 정리해줘.
3. 날짜, 제출물, 준비물, 담당자처럼 확인이 필요한 정보는 따로 표시해줘.
4. 유아, 학생, 학부모에게 안내해야 할 내용이 있으면 따로 알려줘.
5. 개인정보나 민감정보가 포함되어 있다면 주의하라고 알려줘.
6. 확실하지 않은 내용은 단정하지 말고 [확인 필요]라고 표시해줘.

[피해야 할 점]
${avoid}`;
  }

  if (category === "research") {
    return `너는 유치원과 초등학교 교사의 수업 및 학급 운영 자료조사를 돕는 도우미야.
아래 조건에 맞게 ${task}를 해줘.

[학교급]
${level}

[대상]
${audience}

[조사 주제]
${topic}

[활용 상황]
${situation}

[반드시 포함할 내용]
${mustInclude}

[원하는 형식]
${format || "핵심 개념, 쉬운 설명, 활동 아이디어"}

[작성 톤]
${tone || "교사가 바로 이해하고 활용할 수 있게"}

[분량]
${length || "핵심 중심으로 정리"}

[조건]
1. 교사가 바로 수업이나 활동에 활용할 수 있게 정리해줘.
2. 유아 또는 초등학생 눈높이로 바꿔 설명할 수 있는 예시를 포함해줘.
3. 도입 질문 3개를 제안해줘.
4. 활동 아이디어 2개를 제안해줘.
5. 사실 확인이 필요한 내용은 [확인 필요]라고 표시해줘.

[피해야 할 점]
${avoid}`;
  }

  if (category === "app") {
    return `너는 유치원과 초등학교 교사의 학급용 간단한 웹앱 기획을 돕는 도우미야.
아래 조건에 맞는 ${task} 아이디어와 제작 프롬프트를 만들어줘.

[학교급]
${level}

[사용 대상]
${audience}

[앱 주제]
${topic}

[활용 상황]
${situation}

[꼭 필요한 기능]
${mustInclude}

[원하는 화면 구성]
${format || "교사가 쉽게 사용할 수 있는 단순한 화면"}

[분위기]
${tone || "깔끔하고 직관적으로"}

[조건]
1. 교사가 수업이나 학급 운영에서 바로 사용할 수 있게 구성해줘.
2. 기능은 너무 복잡하지 않게 해줘.
3. 학생 개인정보를 저장하지 않는 방식으로 제안해줘.
4. 버튼, 입력칸, 결과 화면을 구체적으로 설명해줘.
5. 개발 도구에 넣을 수 있는 앱 제작용 프롬프트도 함께 작성해줘.

[피해야 할 점]
${avoid}`;
  }

  return `너는 유치원과 초등학교 교사의 반복 업무를 돕는 문서 작성 도우미야.
아래 조건에 맞게 ${task} 초안을 작성해줘.

[학교급]
${level}

[대상]
${audience}

[주제]
${topic}

[상황]
${situation}

[반드시 포함할 내용]
${mustInclude}

[원하는 형식]
${format}

[말투]
${tone}

[분량]
${length}

[참고할 문체나 자료]
${reference}

[피해야 할 표현이나 주의사항]
${avoid}

[작성 조건]
1. 실제 업무에 바로 활용할 수 있는 초안으로 작성해줘.
2. 대상이 이해하기 쉬운 말로 써줘.
3. 핵심 내용이 잘 보이게 정리해줘.
4. 너무 과장된 표현은 피하고 자연스럽게 작성해줘.
5. 개인정보, 학생 실명, 학부모 연락처, 건강 정보, 상담 내용 등 민감정보는 포함하지 말아줘.
6. 교사가 최종 확인해야 할 부분은 [확인 필요]로 표시해줘.`;
}

function App() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [task, setTask] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [copied, setCopied] = useState(false);

  const selectedCategory = categories[category];

  const prompt = useMemo(() => {
    if (!category || !task) return "";
    return buildPrompt(category, task, form);
  }, [category, task, form]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setStep(1);
    setCategory("");
    setTask("");
    setForm(defaultForm);
    setCopied(false);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("복사가 되지 않았어요. 프롬프트를 직접 드래그해서 복사해 주세요.");
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-badge">Gemini Prompt Helper</div>
        <h1>AI 업무 주문서 생성기</h1>
        <p>
          유치원·초등 교사의 반복 업무를 줄이기 위한 Gemini 프롬프트 생성 도구입니다.
        </p>
        <div className="warning">
          학생 실명, 학부모 연락처, 건강 정보, 상담 내용 등 개인정보와 민감정보는 입력하지 마세요.
        </div>
      </header>

      <main className="container">
        <section className="progress">
          <div className={step >= 1 ? "active" : ""}>1. 유형 선택</div>
          <div className={step >= 2 ? "active" : ""}>2. 업무 선택</div>
          <div className={step >= 3 ? "active" : ""}>3. 정보 입력</div>
          <div className={step >= 4 ? "active" : ""}>4. 프롬프트 복사</div>
        </section>

        {step === 1 && (
          <section className="panel">
            <h2>무엇을 만들고 싶나요?</h2>
            <p className="sub">업무 유형을 먼저 선택해 주세요.</p>

            <div className="category-grid">
              {Object.entries(categories).map(([key, item]) => (
                <button
                  key={key}
                  className="category-card"
                  onClick={() => {
                    setCategory(key);
                    setTask("");
                    setStep(2);
                  }}
                >
                  <span className="emoji">{item.emoji}</span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && selectedCategory && (
          <section className="panel">
            <div className="top-row">
              <button className="ghost" onClick={() => setStep(1)}>
                ← 이전
              </button>
              <span className="pill">
                {selectedCategory.emoji} {selectedCategory.label}
              </span>
            </div>

            <h2>어떤 업무에 사용할까요?</h2>
            <p className="sub">선택한 업무는 최종 프롬프트에 자동으로 반영됩니다.</p>

            <div className="task-grid">
              {selectedCategory.tasks.map((item) => (
                <button
                  key={item}
                  className={task === item ? "task active" : "task"}
                  onClick={() => {
                    setTask(item);
                    setStep(3);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="panel">
            <div className="top-row">
              <button className="ghost" onClick={() => setStep(2)}>
                ← 이전
              </button>
              <span className="pill">{task}</span>
            </div>

            <h2>업무 주문서 작성하기</h2>
            <p className="sub">모든 칸을 다 채우지 않아도 됩니다. 필요한 정보만 입력해도 프롬프트가 생성됩니다.</p>

            <div className="form-grid">
              <label>
                학교급
                <input
                  value={form.schoolLevel}
                  onChange={(e) => updateForm("schoolLevel", e.target.value)}
                  placeholder="예: 유치원 만 5세 / 초등학교 2학년"
                />
              </label>

              <label>
                대상
                <select
                  value={form.audience}
                  onChange={(e) => updateForm("audience", e.target.value)}
                >
                  <option value="">선택 또는 직접 입력</option>
                  {audienceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                주제
                <input
                  value={form.topic}
                  onChange={(e) => updateForm("topic", e.target.value)}
                  placeholder="예: 봄 숲놀이 / 복도 안전 / 동물의 한살이"
                />
              </label>

              <label>
                원하는 형식
                <input
                  value={form.format}
                  onChange={(e) => updateForm("format", e.target.value)}
                  placeholder="예: 표, 체크리스트, 알림장 문구, PPT 목차"
                />
              </label>

              <label>
                말투
                <select
                  value={form.tone}
                  onChange={(e) => updateForm("tone", e.target.value)}
                >
                  <option value="">선택 또는 직접 입력</option>
                  {toneOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                분량
                <input
                  value={form.length}
                  onChange={(e) => updateForm("length", e.target.value)}
                  placeholder="예: 3문장 이내 / A4 한 장 / 8장 이내"
                />
              </label>
            </div>

            <label className="full">
              상황 설명
              <textarea
                value={form.situation}
                onChange={(e) => updateForm("situation", e.target.value)}
                placeholder="예: 내일 바깥놀이가 있어 편한 신발과 물병을 안내해야 함"
              />
            </label>

            <label className="full">
              반드시 포함할 내용
              <textarea
                value={form.mustInclude}
                onChange={(e) => updateForm("mustInclude", e.target.value)}
                placeholder="예: 일시, 장소, 준비물, 우천 시 대체 활동"
              />
            </label>

            <label className="full">
              참고할 문체나 자료
              <textarea
                value={form.reference}
                onChange={(e) => updateForm("reference", e.target.value)}
                placeholder="예: 작년 안내문처럼 따뜻하고 짧게 / 학교 공식 문체처럼"
              />
            </label>

            <label className="full">
              피해야 할 표현이나 주의사항
              <textarea
                value={form.avoid}
                onChange={(e) => updateForm("avoid", e.target.value)}
                placeholder="예: 비난처럼 들리는 표현 금지 / 개인정보 포함 금지"
              />
            </label>

            <button className="primary" onClick={() => setStep(4)}>
              프롬프트 생성하기
            </button>
          </section>
        )}

        {step === 4 && (
          <section className="panel result-panel">
            <div className="top-row">
              <button className="ghost" onClick={() => setStep(3)}>
                ← 수정하기
              </button>
              <span className="pill">{selectedCategory?.label} · {task}</span>
            </div>

            <h2>생성된 프롬프트</h2>
            <p className="sub">아래 프롬프트를 복사해서 Gemini에 붙여넣어 사용하세요.</p>

            <pre className="result">{prompt}</pre>

            <div className="button-row">
              <button className="primary" onClick={copyPrompt}>
                {copied ? "복사 완료!" : "프롬프트 복사하기"}
              </button>
              <button className="secondary" onClick={resetAll}>
                처음부터 다시 만들기
              </button>
            </div>

            <div className="tip">
              <strong>사용 전 확인!</strong>
              <ul>
                <li>학생 실명, 보호자 연락처, 건강 정보, 상담 내용은 입력하지 않습니다.</li>
                <li>AI 결과물은 초안입니다. 날짜, 장소, 준비물, 사실관계는 직접 확인합니다.</li>
                <li>우리 반 상황과 학교 지침에 맞게 반드시 수정합니다.</li>
              </ul>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
