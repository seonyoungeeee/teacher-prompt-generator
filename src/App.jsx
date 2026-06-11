import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  RotateCcw,
  ChevronLeft,
  Sparkles,
  FileText,
  Image,
  AppWindow,
  Search,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";


function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ variant = "default", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
  const styles =
    variant === "outline"
      ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";
  return <button className={cn(base, styles, className)} {...props} />;
}

function Card({ className = "", ...props }) {
  return <div className={cn("rounded-3xl border border-slate-200 bg-white", className)} {...props} />;
}

function CardContent({ className = "", ...props }) {
  return <div className={cn("p-6", className)} {...props} />;
}

const safetyNote = "학생 실명, 학부모 연락처, 건강 정보, 상담 내용 등 개인정보와 민감정보는 입력하지 마세요.";

const gradeOptions = [
  "유치원",
  "초등 1학년",
  "초등 2학년",
  "초등 3학년",
  "초등 4학년",
  "초등 5학년",
  "초등 6학년",
  "초등 전학년",
];

const categories = [
  {
    id: "text",
    label: "텍스트",
    description: "안내문, 알림장, 수업자료 등",
    icon: FileText,
    color: "from-blue-50 to-indigo-50",
    tasks: [
      { id: "notice", label: "가정통신문" },
      { id: "classNote", label: "알림장" },
      { id: "parentMessage", label: "학부모 안내 문구" },
      { id: "lessonPlan", label: "수업기획안" },
      { id: "worksheet", label: "활동지" },
      { id: "classRules", label: "학급 규칙" },
      { id: "quiz", label: "퀴즈/평가문항" },
    ],
  },
  {
    id: "image",
    label: "이미지",
    description: "수업 도입 이미지, 삽화, 게시물 등",
    icon: Image,
    color: "from-pink-50 to-rose-50",
    tasks: [
      { id: "introImage", label: "수업 도입 이미지" },
      { id: "worksheetImage", label: "활동지 삽화" },
      { id: "classPoster", label: "교실 게시물" },
      { id: "safetyImage", label: "안전교육 이미지" },
      { id: "storyScene", label: "스토리텔링 장면" },
      { id: "cardNews", label: "카드뉴스/포스터" },
    ],
  },
  {
    id: "app",
    label: "앱",
    description: "퀴즈, 뽑기, 빙고, 체크리스트 등",
    icon: AppWindow,
    color: "from-emerald-50 to-teal-50",
    tasks: [
      { id: "quizApp", label: "간단한 퀴즈 앱" },
      { id: "randomPicker", label: "랜덤 뽑기 앱" },
      { id: "bingo", label: "빙고 게임" },
      { id: "checklist", label: "체크리스트 앱" },
      { id: "vote", label: "학급 투표 앱" },
      { id: "groupMaker", label: "모둠 편성 도구" },
    ],
  },
  {
    id: "summary",
    label: "문서요약",
    description: "공문, 회의록, 연수자료 핵심 정리",
    icon: ClipboardList,
    color: "from-amber-50 to-orange-50",
    tasks: [
      { id: "officialDoc", label: "공문 요약" },
      { id: "meeting", label: "회의록 요약" },
      { id: "training", label: "연수자료 요약" },
      { id: "todo", label: "해야 할 일 추출" },
    ],
  },
  {
    id: "research",
    label: "자료조사",
    description: "수업 배경자료, 계기교육, 안전교육 조사",
    icon: Search,
    color: "from-violet-50 to-purple-50",
    tasks: [
      { id: "lessonResearch", label: "수업 배경자료 조사" },
      { id: "eventEducation", label: "계기교육 자료 조사" },
      { id: "safetyResearch", label: "안전교육 자료 조사" },
      { id: "projectResearch", label: "프로젝트 수업 주제 조사" },
    ],
  },
];

const f = {
  input: (key, label, placeholder, span = false) => ({ key, label, placeholder, span }),
  area: (key, label, placeholder) => ({ key, label, placeholder, multiline: true, span: true }),
  select: (key, label, options, span = false) => ({ key, label, type: "select", options, span }),
};

const taskConfigs = {
  // TEXT
  notice: {
    title: "가정통신문 프롬프트 만들기",
    helper: "행사·체험활동·준비물 안내처럼 학부모에게 공식적으로 전달할 문서를 만들 때 사용해요.",
    fields: [
      f.input("target", "대상", "예: 초등학교 2학년 학부모"),
      f.input("eventName", "행사명/안내명", "예: 봄 현장체험학습 안내"),
      f.input("dateTime", "일시", "예: 6월 20일 금요일 1~3교시"),
      f.input("place", "장소", "예: 학교 근처 생태공원"),
      f.input("supplies", "준비물", "예: 물, 모자, 편한 신발", true),
      f.area("noticeItems", "주의사항/협조사항", "예: 비가 오면 교실 활동으로 변경, 개인 장난감 지참 금지"),
      f.select("tone", "문체", ["공식적이지만 친절하게", "모바일에서 읽기 쉽게", "따뜻하고 부드럽게", "짧고 명확하게"]),
    ],
    build: (v) => `너는 유·초등 교사의 가정통신문 작성을 돕는 문서 작성 도우미야.
아래 내용을 바탕으로 학부모에게 보낼 가정통신문 초안을 작성해줘.

[안내 정보]
- 대상: ${v.target || "[대상]"}
- 행사명/안내명: ${v.eventName || "[행사명/안내명]"}
- 일시: ${v.dateTime || "[일시]"}
- 장소: ${v.place || "[장소]"}
- 준비물: ${v.supplies || "[준비물]"}
- 주의사항/협조사항: ${v.noticeItems || "[주의사항/협조사항]"}
- 문체: ${v.tone || "[문체]"}

[작성 조건]
1. 학부모가 핵심 정보를 빠르게 확인할 수 있도록 작성해줘.
2. 일시, 장소, 준비물은 잘 보이게 정리해줘.
3. 너무 과장된 표현은 피하고 학교 안내문에 어울리는 문체로 작성해줘.
4. 마지막에는 가정의 협조를 요청하는 문장을 넣어줘.
5. 사용 전 교사가 확인해야 할 항목도 3가지 알려줘.`,
  },
  classNote: {
    title: "알림장 프롬프트 만들기",
    helper: "모바일 알림장처럼 짧고 빠르게 읽히는 문구를 만들 때 사용해요.",
    fields: [
      f.input("target", "대상", "예: 초등학교 1학년 학부모"),
      f.input("date", "해당 날짜", "예: 6월 12일 목요일"),
      f.area("mainMessage", "오늘 꼭 전달할 내용", "예: 내일 미술 활동에 색연필과 풀을 준비해주세요"),
      f.input("supplies", "준비물/확인사항", "예: 색연필, 풀, 가위", true),
      f.select("length", "길이", ["3문장 이내", "5문장 이내", "핵심만 한 문단", "체크리스트 포함"]),
      f.select("tone", "말투", ["친절하고 짧게", "따뜻하게", "명확하게", "부담스럽지 않게"]),
    ],
    build: (v) => `너는 초등학교 담임교사의 알림장 작성을 돕는 문서 작성 도우미야.
아래 내용을 학부모가 모바일에서 빠르게 읽을 수 있는 알림장 문구로 작성해줘.

[알림 정보]
- 대상: ${v.target || "[대상]"}
- 해당 날짜: ${v.date || "[날짜]"}
- 꼭 전달할 내용: ${v.mainMessage || "[전달 내용]"}
- 준비물/확인사항: ${v.supplies || "[준비물/확인사항]"}
- 길이: ${v.length || "[길이]"}
- 말투: ${v.tone || "[말투]"}

[작성 조건]
1. 첫 문장에서 핵심 내용이 바로 보이게 작성해줘.
2. 학부모가 부담스럽지 않게, 그러나 필요한 행동은 분명히 알 수 있게 써줘.
3. 준비물이나 날짜가 있다면 눈에 띄게 정리해줘.
4. 너무 긴 설명은 피하고 모바일 알림장에 어울리게 작성해줘.`,
  },
  parentMessage: {
    title: "학부모 안내 문구 프롬프트 만들기",
    helper: "준비물, 숙제, 생활습관, 친구관계처럼 조심스럽게 전달해야 하는 문구를 만들 때 사용해요.",
    fields: [
      f.input("target", "대상", "예: 초등학교 3학년 학부모"),
      f.area("situation", "안내 상황", "예: 준비물을 자주 가져오지 않는 상황"),
      f.input("mustSay", "꼭 전달할 핵심", "예: 다음 활동을 위해 준비물이 필요함", true),
      f.input("avoid", "피하고 싶은 표현", "예: 잘못, 문제, 계속 안 함, 지도 부탁", true),
      f.select("tone", "톤", ["부드럽지만 핵심은 분명하게", "매우 조심스럽게", "협조를 요청하는 톤", "공식적이고 담백하게", "단호하지만 비난 없이"]),
      f.select("length", "길이", ["3문장 이내", "5문장 이내", "짧은 알림장 문구", "상담 전 사전 안내 문구"]),
    ],
    build: (v) => `너는 유·초등 담임교사의 학부모 소통 문구를 다듬는 코치야.
아래 상황을 학부모에게 안내하는 문구로 작성해줘.

[상황 정보]
- 대상: ${v.target || "[대상]"}
- 안내 상황: ${v.situation || "[안내 상황]"}
- 꼭 전달할 핵심: ${v.mustSay || "[핵심 내용]"}
- 피하고 싶은 표현: ${v.avoid || "[피하고 싶은 표현]"}
- 원하는 톤: ${v.tone || "[톤]"}
- 길이: ${v.length || "[길이]"}

[작성 조건]
1. 특정 학생이나 가정을 비난하는 느낌이 들지 않게 작성해줘.
2. 학부모가 방어적으로 느끼지 않도록 표현을 부드럽게 조정해줘.
3. 다만 핵심 요청 사항은 흐려지지 않게 분명히 전달해줘.
4. 가정과 함께 지도하자는 방향으로 마무리해줘.
5. 같은 상황에서 쓸 수 있는 대안 문구도 1개 더 제안해줘.`,
  },
  lessonPlan: {
    title: "수업기획안 프롬프트 만들기",
    helper: "도입-전개-마무리, 발문, 활동, 정리까지 수업 흐름을 잡을 때 사용해요.",
    fields: [
      f.select("grade", "대상 학년", gradeOptions),
      f.input("subject", "교과/영역", "예: 통합교과, 국어, 안전교육, 창의적 체험활동"),
      f.input("topic", "수업 주제", "예: 봄에 볼 수 있는 것, 친구와 사이좋게 지내기", true),
      f.input("time", "수업 시간", "예: 40분, 2차시, 80분"),
      f.select("activityStyle", "원하는 활동 방식", ["놀이 중심", "토의 중심", "그림 활동 중심", "신체활동 포함", "모둠활동 중심", "준비물 최소화"]),
      f.area("goal", "수업 목표", "예: 봄의 특징을 관찰하고 말로 표현할 수 있다"),
      f.area("constraints", "수업 여건/제약", "예: 교실 안에서 진행, 준비물 적게, 집중 시간이 짧음"),
    ],
    build: (v) => `너는 유·초등 수업 설계를 돕는 수업기획 코치야.
아래 조건에 맞는 수업기획안을 작성해줘.

[수업 정보]
- 대상 학년: ${v.grade || "[대상 학년]"}
- 교과/영역: ${v.subject || "[교과/영역]"}
- 수업 주제: ${v.topic || "[수업 주제]"}
- 수업 시간: ${v.time || "[수업 시간]"}
- 원하는 활동 방식: ${v.activityStyle || "[활동 방식]"}
- 수업 목표: ${v.goal || "[수업 목표]"}
- 수업 여건/제약: ${v.constraints || "[수업 여건/제약]"}

[작성 조건]
1. 도입-전개-마무리 흐름으로 구성해줘.
2. 각 단계별 시간 배분을 포함해줘.
3. 교사가 사용할 수 있는 발문을 단계별로 제안해줘.
4. 학생 활동이 구체적으로 보이게 작성해줘.
5. 준비물과 유의사항을 따로 정리해줘.
6. 수업 후 바로 확인할 수 있는 마무리 질문 3개를 포함해줘.`,
  },
  worksheet: {
    title: "활동지 프롬프트 만들기",
    helper: "학생용 활동지 구조, 문항, 그림칸, 체크리스트를 만들 때 사용해요.",
    fields: [
      f.select("grade", "대상 학년", gradeOptions),
      f.input("topic", "활동지 주제", "예: 봄 관찰 기록하기, 안전 약속 정하기", true),
      f.area("activity", "학생이 할 활동", "예: 관찰한 것을 그리고, 한 문장으로 표현하기"),
      f.select("writingLevel", "쓰기 부담", ["글을 거의 쓰지 않게", "짧은 단어 중심", "한 문장 쓰기", "생각을 3문장으로 쓰기", "체크와 그림 중심"]),
      f.select("format", "활동지 구성", ["A4 한 장", "그림칸 크게", "체크리스트 포함", "표 포함", "짝 활동 포함", "자기평가 포함"]),
      f.area("extra", "추가 조건", "예: 초1도 이해할 수 있는 쉬운 문장, 교사용 안내 따로 표시"),
    ],
    build: (v) => `너는 유·초등 학생용 활동지를 만드는 교사야.
아래 조건에 맞는 활동지 초안을 작성해줘.

[활동지 정보]
- 대상 학년: ${v.grade || "[대상 학년]"}
- 활동지 주제: ${v.topic || "[활동지 주제]"}
- 학생이 할 활동: ${v.activity || "[학생 활동]"}
- 쓰기 부담: ${v.writingLevel || "[쓰기 수준]"}
- 활동지 구성: ${v.format || "[활동지 구성]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[작성 조건]
1. 학생용 안내 문장은 짧고 쉬운 말로 작성해줘.
2. 활동지의 영역을 순서대로 구성해줘.
3. 그림, 체크, 짧은 쓰기 등 학생이 부담 없이 참여할 수 있는 요소를 넣어줘.
4. 교사가 설명할 안내 문장은 따로 구분해줘.
5. 마지막에는 간단한 자기점검 문항을 넣어줘.`,
  },
  classRules: {
    title: "학급 규칙/루틴 프롬프트 만들기",
    helper: "1학기 중반에 흐트러진 규칙과 루틴을 다시 정리할 때 사용해요.",
    fields: [
      f.select("grade", "대상 학년", gradeOptions),
      f.area("problem", "현재 고민", "예: 수업 시작 전 자리에 앉는 시간이 오래 걸림"),
      f.input("routine", "정비하고 싶은 루틴", "예: 줄서기, 발표 듣기, 준비물 정리, 쉬는 시간 약속", true),
      f.select("style", "규칙 표현 방식", ["긍정적인 약속 문장", "학생과 함께 정하는 질문형", "짧고 외우기 쉽게", "교실 게시용 문구", "생활지도 멘트 포함"]),
      f.area("extra", "추가 조건", "예: 비난하지 않기, 잔소리처럼 들리지 않기, 짧은 활동 포함"),
    ],
    build: (v) => `너는 유·초등 담임교사를 돕는 학급경영 코치야.
1학기 중반에 학급 규칙과 루틴을 다시 점검하려고 해.

[학급 상황]
- 대상 학년: ${v.grade || "[대상 학년]"}
- 현재 고민: ${v.problem || "[현재 고민]"}
- 정비하고 싶은 루틴: ${v.routine || "[루틴]"}
- 규칙 표현 방식: ${v.style || "[표현 방식]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[작성 조건]
1. 학생을 비난하지 않는 긍정적인 표현으로 제안해줘.
2. 다시 세울 수 있는 학급 약속 3~5가지를 만들어줘.
3. 각 약속마다 교사 멘트와 짧은 실천 활동을 함께 제안해줘.
4. 학생들이 이해하기 쉬운 말로 작성해줘.
5. 교실 게시용으로 짧게 바꾼 문구도 함께 제안해줘.`,
  },
  quiz: {
    title: "퀴즈/평가문항 프롬프트 만들기",
    helper: "수업 마무리 확인, 카훗, OX, 4지선다 문항을 만들 때 사용해요.",
    fields: [
      f.select("grade", "대상 학년", gradeOptions),
      f.input("topic", "퀴즈 주제", "예: 오늘 배운 안전 약속, 봄의 특징", true),
      f.area("content", "수업에서 다룬 내용", "예: 복도에서 뛰지 않기, 오른쪽으로 걷기, 친구와 부딪히지 않기"),
      f.select("questionType", "문항 유형", ["OX 퀴즈", "4지선다", "단답형", "카훗용 4지선다", "섞어서"]),
      f.select("count", "문항 수", ["3문항", "5문항", "10문항", "15문항"]),
      f.select("difficulty", "난이도", ["아주 쉽게", "보통", "살짝 생각하게", "복습용", "마무리 놀이용"]),
    ],
    build: (v) => `너는 유·초등 수업 마무리 퀴즈를 만드는 교사야.
아래 수업 내용을 바탕으로 퀴즈를 만들어줘.

[퀴즈 정보]
- 대상 학년: ${v.grade || "[대상 학년]"}
- 퀴즈 주제: ${v.topic || "[퀴즈 주제]"}
- 수업에서 다룬 내용: ${v.content || "[수업 내용]"}
- 문항 유형: ${v.questionType || "[문항 유형]"}
- 문항 수: ${v.count || "[문항 수]"}
- 난이도: ${v.difficulty || "[난이도]"}

[작성 조건]
1. 대상 학년이 이해할 수 있는 쉬운 말로 작성해줘.
2. 정답과 해설을 함께 제시해줘.
3. 헷갈리는 보기는 너무 어렵지 않게 만들어줘.
4. 카훗에 옮기기 쉽도록 표 형태로 정리해줘.
5. 학생들이 수업 내용을 자연스럽게 복습할 수 있게 구성해줘.`,
  },

  // IMAGE: no duplicate "사용 목적" field. The selected task is automatically reflected.
  introImage: {
    title: "수업 도입 이미지 프롬프트 만들기",
    helper: "이미 선택한 사용 목적은 ‘수업 도입 이미지’로 자동 반영됩니다. 여기서는 도입 장면을 구체화해요.",
    fields: [
      f.select("grade", "대상 학년", gradeOptions),
      f.input("lessonTopic", "수업 주제", "예: 복도 안전, 봄 관찰, 친구와 협력하기", true),
      f.area("scene", "도입에서 보여주고 싶은 장면", "예: 아이들이 복도 오른쪽에서 천천히 걷는 모습"),
      f.input("question", "이미지를 보고 떠올렸으면 하는 질문", "예: 복도에서는 어떻게 걸어야 할까?", true),
      f.select("style", "이미지 스타일", ["밝고 따뜻한 교육용 일러스트", "귀엽고 단순한 그림", "동화책 같은 분위기", "깔끔한 카드뉴스 스타일"]),
      f.select("ratio", "화면 비율", ["16:9 가로형", "4:3 가로형", "1:1 정사각형", "A4 세로형", "세로 포스터형"]),
      f.area("avoid", "피하고 싶은 요소", "예: 실제 인물처럼 보이는 얼굴, 복잡한 배경, 무서운 분위기, 개인정보"),
    ],
    build: (v) => `수업 도입에 사용할 교육용 이미지를 만들어줘.

[이미지 정보]
- 사용 목적: 수업 도입 이미지
- 대상 학년: ${v.grade || "[대상 학년]"}
- 수업 주제: ${v.lessonTopic || "[수업 주제]"}
- 도입에서 보여주고 싶은 장면: ${v.scene || "[장면]"}
- 학생들이 떠올렸으면 하는 질문: ${v.question || "[질문]"}
- 이미지 스타일: ${v.style || "[스타일]"}
- 화면 비율: ${v.ratio || "[화면 비율]"}
- 피하고 싶은 요소: ${v.avoid || "[피하고 싶은 요소]"}

[생성 조건]
1. 실제 학생이나 특정 인물처럼 보이지 않게 만들어줘.
2. 개인정보가 드러나는 요소는 넣지 말아줘.
3. 수업 도입에서 학생들의 생각을 열 수 있도록 장면이 명확해야 해.
4. 너무 복잡하지 않고, 교실 화면에 띄웠을 때 핵심이 잘 보이게 구성해줘.`,
  },
  worksheetImage: {
    title: "활동지 삽화 프롬프트 만들기",
    helper: "활동지 안에 들어갈 그림은 예쁜 것보다 학생 활동을 돕는 것이 중요해요.",
    fields: [
      f.select("grade", "대상 학년", gradeOptions),
      f.input("topic", "활동지 주제", "예: 봄 관찰 기록, 안전 약속, 감정 표현", true),
      f.area("role", "삽화의 역할", "예: 학생이 그림을 보고 빈칸에 안전 약속을 쓰도록 돕기"),
      f.input("position", "활동지에서 들어갈 위치", "예: 상단 도입 그림, 중앙 활동 그림, 하단 예시 그림", true),
      f.select("simplicity", "그림 단순도", ["아주 단순하게", "색칠하기 좋게", "선명한 일러스트", "배경 거의 없이", "아이콘처럼"]),
      f.area("avoid", "피하고 싶은 요소", "예: 글자가 많은 이미지, 복잡한 배경, 실제 인물 느낌"),
    ],
    build: (v) => `학생용 활동지에 넣을 교육용 삽화를 만들어줘.

[이미지 정보]
- 사용 목적: 활동지 삽화
- 대상 학년: ${v.grade || "[대상 학년]"}
- 활동지 주제: ${v.topic || "[활동지 주제]"}
- 삽화의 역할: ${v.role || "[삽화 역할]"}
- 활동지에서 들어갈 위치: ${v.position || "[위치]"}
- 그림 단순도: ${v.simplicity || "[단순도]"}
- 피하고 싶은 요소: ${v.avoid || "[피하고 싶은 요소]"}

[생성 조건]
1. 학생이 활동 내용을 이해하는 데 도움이 되는 그림으로 만들어줘.
2. 실제 인물처럼 보이지 않게 하고 개인정보 요소는 넣지 말아줘.
3. 활동지에 들어가도 복잡하지 않도록 여백과 형태를 단순하게 구성해줘.
4. 필요하면 학생이 색칠하거나 표시할 수 있는 느낌으로 만들어줘.`,
  },
  classPoster: {
    title: "교실 게시물 이미지 프롬프트 만들기",
    helper: "교실 게시물은 메시지가 한눈에 보이는 것이 중요해요.",
    fields: [
      f.input("topic", "게시물 주제", "예: 손 씻기, 복도 안전, 발표 약속"),
      f.input("location", "게시 장소", "예: 교실 앞문, 칠판 옆, 세면대 근처"),
      f.input("message", "넣고 싶은 핵심 문구", "예: 천천히 걸어요, 손을 깨끗이 씻어요", true),
      f.select("textIncluded", "글자 포함 여부", ["큰 글자 포함", "짧은 문구만 포함", "글자 없이 그림 중심", "문구 영역만 비워두기"]),
      f.select("style", "분위기", ["밝고 친근하게", "깔끔하고 명확하게", "귀엽고 단순하게", "차분한 학교 게시물 느낌"]),
      f.area("avoid", "피하고 싶은 요소", "예: 너무 많은 글자, 복잡한 배경, 실제 학생 얼굴"),
    ],
    build: (v) => `교실에 붙일 교육용 게시물 이미지를 만들어줘.

[이미지 정보]
- 사용 목적: 교실 게시물
- 게시물 주제: ${v.topic || "[게시물 주제]"}
- 게시 장소: ${v.location || "[게시 장소]"}
- 핵심 문구: ${v.message || "[핵심 문구]"}
- 글자 포함 여부: ${v.textIncluded || "[글자 포함 여부]"}
- 분위기: ${v.style || "[분위기]"}
- 피하고 싶은 요소: ${v.avoid || "[피하고 싶은 요소]"}

[생성 조건]
1. 멀리서도 핵심 행동이 잘 보이게 구성해줘.
2. 교실 게시물로 적합한 밝고 안전한 분위기로 만들어줘.
3. 실제 학생 얼굴이나 개인정보는 포함하지 말아줘.
4. 문구를 포함하는 경우 글자는 짧고 크게 보여줘.`,
  },
  safetyImage: {
    title: "안전교육 이미지 프롬프트 만들기",
    helper: "무섭게 겁주는 이미지보다 안전 행동을 자연스럽게 보여주는 장면이 좋아요.",
    fields: [
      f.select("grade", "대상 학년", gradeOptions),
      f.input("safetyTopic", "안전 주제", "예: 복도 안전, 교통안전, 물놀이 안전, 급식실 안전", true),
      f.area("safeBehavior", "보여주고 싶은 안전 행동", "예: 복도 오른쪽으로 천천히 걷기"),
      f.select("mood", "표현 분위기", ["밝고 긍정적으로", "위험을 과장하지 않게", "행동 예시 중심", "차분하고 명확하게"]),
      f.select("ratio", "화면 비율", ["16:9 가로형", "1:1 정사각형", "A4 세로형", "포스터형"]),
      f.area("avoid", "피하고 싶은 요소", "예: 사고 장면, 공포감, 다친 모습, 실제 인물 느낌"),
    ],
    build: (v) => `안전교육에 사용할 교육용 이미지를 만들어줘.

[이미지 정보]
- 사용 목적: 안전교육 이미지
- 대상 학년: ${v.grade || "[대상 학년]"}
- 안전 주제: ${v.safetyTopic || "[안전 주제]"}
- 보여주고 싶은 안전 행동: ${v.safeBehavior || "[안전 행동]"}
- 표현 분위기: ${v.mood || "[분위기]"}
- 화면 비율: ${v.ratio || "[화면 비율]"}
- 피하고 싶은 요소: ${v.avoid || "[피하고 싶은 요소]"}

[생성 조건]
1. 사고나 공포를 강조하기보다 바람직한 안전 행동을 보여줘.
2. 유·초등 학생이 이해하기 쉬운 장면으로 구성해줘.
3. 실제 인물처럼 보이지 않게 하고 개인정보 요소는 넣지 말아줘.
4. 수업자료나 게시물에 바로 활용할 수 있게 명확한 장면으로 만들어줘.`,
  },
  storyScene: {
    title: "스토리텔링 장면 프롬프트 만들기",
    helper: "이야기 도입, 문제 상황, 해결 장면처럼 수업 서사를 만드는 이미지에 적합해요.",
    fields: [
      f.input("storyTopic", "이야기 주제", "예: 친구와 화해하기, 숲속 탐험, 학교에서 약속 지키기", true),
      f.input("characters", "등장인물", "예: 토끼 캐릭터와 다람쥐 친구들"),
      f.input("background", "배경", "예: 교실, 숲속, 운동장, 마을"),
      f.area("scene", "장면 설명", "예: 친구들이 함께 문제를 해결하려고 모여 이야기하는 장면"),
      f.select("emotion", "감정 분위기", ["따뜻하게", "궁금증이 생기게", "갈등이 살짝 느껴지게", "해결과 희망이 느껴지게", "즐겁고 밝게"]),
      f.area("avoid", "피하고 싶은 요소", "예: 무서운 분위기, 과도한 판타지, 복잡한 배경"),
    ],
    build: (v) => `수업 스토리텔링에 사용할 장면 이미지를 만들어줘.

[이미지 정보]
- 사용 목적: 스토리텔링 장면
- 이야기 주제: ${v.storyTopic || "[이야기 주제]"}
- 등장인물: ${v.characters || "[등장인물]"}
- 배경: ${v.background || "[배경]"}
- 장면 설명: ${v.scene || "[장면 설명]"}
- 감정 분위기: ${v.emotion || "[감정 분위기]"}
- 피하고 싶은 요소: ${v.avoid || "[피하고 싶은 요소]"}

[생성 조건]
1. 유·초등 수업에서 이야기 도입 자료로 활용할 수 있게 만들어줘.
2. 장면만 봐도 학생들이 무슨 일이 일어났는지 상상할 수 있어야 해.
3. 실제 인물이나 개인정보 요소는 포함하지 말아줘.
4. 따뜻하고 교육적인 분위기로 구성해줘.`,
  },
  cardNews: {
    title: "카드뉴스/포스터 프롬프트 만들기",
    helper: "학급 행사, 캠페인, 안전 약속 등을 한 장 이미지로 알릴 때 사용해요.",
    fields: [
      f.input("topic", "주제", "예: 손 씻기 캠페인, 학급 독서 행사, 안전 약속"),
      f.input("mainCopy", "메인 문구", "예: 손 씻기, 나와 친구를 지키는 작은 습관", true),
      f.area("subInfo", "넣을 정보", "예: 일시, 장소, 준비물, 참여 방법, 주의사항"),
      f.select("style", "디자인 스타일", ["깔끔한 카드뉴스", "밝은 포스터", "귀여운 교실 게시물", "정보가 잘 보이는 안내형", "행사 홍보 느낌"]),
      f.select("ratio", "화면 비율", ["1:1 정사각형", "4:5 세로형", "A4 세로형", "16:9 가로형"]),
      f.area("avoid", "피하고 싶은 요소", "예: 글자가 너무 많음, 복잡한 배경, 실제 학생 사진 느낌"),
    ],
    build: (v) => `교육용 카드뉴스 또는 포스터 이미지를 만들어줘.

[이미지 정보]
- 사용 목적: 카드뉴스/포스터
- 주제: ${v.topic || "[주제]"}
- 메인 문구: ${v.mainCopy || "[메인 문구]"}
- 넣을 정보: ${v.subInfo || "[넣을 정보]"}
- 디자인 스타일: ${v.style || "[디자인 스타일]"}
- 화면 비율: ${v.ratio || "[화면 비율]"}
- 피하고 싶은 요소: ${v.avoid || "[피하고 싶은 요소]"}

[생성 조건]
1. 핵심 문구가 가장 먼저 보이게 구성해줘.
2. 정보가 많다면 위계가 분명하게 보이도록 배치해줘.
3. 유·초등 학교 현장에 어울리는 밝고 신뢰감 있는 분위기로 만들어줘.
4. 실제 학생 사진처럼 보이는 이미지는 사용하지 말아줘.`,
  },

  // APP: no duplicate "앱 목적" field. The selected task is automatically reflected.
  quizApp: {
    title: "간단한 퀴즈 앱 프롬프트 만들기",
    helper: "이미 선택한 앱 종류는 ‘간단한 퀴즈 앱’으로 자동 반영됩니다. 여기서는 기능을 구체화해요.",
    fields: [
      f.select("grade", "사용 대상", gradeOptions),
      f.input("topic", "퀴즈 주제", "예: 안전교육 마무리 퀴즈, 수업 복습 퀴즈", true),
      f.select("questionType", "문항 유형", ["OX", "4지선다", "단답형", "섞어서"]),
      f.select("count", "문항 수", ["3문항", "5문항", "10문항", "직접 입력 가능하게"]),
      f.select("score", "점수 표시", ["점수 표시", "정답 개수만 표시", "피드백 문구 표시", "점수 표시 없음"]),
      f.area("features", "필요한 기능", "예: 다시 풀기 버튼, 정답 해설, 결과 화면, 교사용 문제 수정 기능"),
      f.select("format", "개발 형태", ["React 단일 파일", "HTML/CSS/JS 한 파일", "Google Apps Script 웹앱", "앱 기획서"]),
    ],
    build: (v) => `교실에서 사용할 간단한 퀴즈 앱을 만들어줘.

[앱 정보]
- 앱 종류: 간단한 퀴즈 앱
- 사용 대상: ${v.grade || "[사용 대상]"}
- 퀴즈 주제: ${v.topic || "[퀴즈 주제]"}
- 문항 유형: ${v.questionType || "[문항 유형]"}
- 문항 수: ${v.count || "[문항 수]"}
- 점수 표시 방식: ${v.score || "[점수 표시 방식]"}
- 필요한 기능: ${v.features || "[필요한 기능]"}
- 개발 형태: ${v.format || "[개발 형태]"}

[제작 조건]
1. 학생이 설명 없이도 사용할 수 있게 화면을 단순하게 만들어줘.
2. 개인정보를 저장하지 않는 구조로 설계해줘.
3. 모바일과 노트북 화면에서 모두 보기 좋게 만들어줘.
4. 교사가 문제를 수정하기 쉬운 구조로 작성해줘.`,
  },
  randomPicker: {
    title: "랜덤 뽑기 앱 프롬프트 만들기",
    helper: "발표자, 번호, 모둠, 키워드를 공정하게 뽑는 도구를 만들 때 사용해요.",
    fields: [
      f.input("pickTarget", "뽑을 대상", "예: 학생 번호, 모둠 이름, 발표 순서, 키워드", true),
      f.select("inputMethod", "입력 방식", ["줄바꿈으로 입력", "쉼표로 입력", "버튼으로 하나씩 추가", "번호 범위 입력"]),
      f.select("duplicate", "중복 뽑기", ["중복 없이 뽑기", "중복 허용", "뽑힌 항목은 따로 표시", "초기화 버튼 포함"]),
      f.select("effect", "결과 효과", ["간단하게 표시", "룰렛 느낌", "카드 뒤집기 느낌", "두근두근 애니메이션", "효과 없이 빠르게"]),
      f.area("features", "필요한 기능", "예: 뽑힌 목록 저장, 다시 뽑기, 전체 초기화, 교사용 화면"),
      f.select("format", "개발 형태", ["React 단일 파일", "HTML/CSS/JS 한 파일", "앱 기획서"]),
    ],
    build: (v) => `교실에서 사용할 랜덤 뽑기 앱을 만들어줘.

[앱 정보]
- 앱 종류: 랜덤 뽑기 앱
- 뽑을 대상: ${v.pickTarget || "[뽑을 대상]"}
- 입력 방식: ${v.inputMethod || "[입력 방식]"}
- 중복 뽑기 설정: ${v.duplicate || "[중복 설정]"}
- 결과 효과: ${v.effect || "[결과 효과]"}
- 필요한 기능: ${v.features || "[필요한 기능]"}
- 개발 형태: ${v.format || "[개발 형태]"}

[제작 조건]
1. 수업 중 빠르게 사용할 수 있도록 조작이 단순해야 해.
2. 학생 개인정보 저장 없이 브라우저 안에서만 작동하게 해줘.
3. 뽑기 결과가 한눈에 크게 보이게 해줘.
4. 교사가 초기화와 다시 뽑기를 쉽게 할 수 있게 만들어줘.`,
  },
  bingo: {
    title: "빙고 게임 프롬프트 만들기",
    helper: "키워드 복습, 아이스브레이킹, 수업 마무리 활동용 빙고를 만들 때 사용해요.",
    fields: [
      f.select("board", "빙고판 크기", ["3x3", "4x4", "5x5"]),
      f.input("topic", "빙고 주제", "예: 안전 약속, 수업 키워드, 친구 이름, 독서 단어", true),
      f.select("keywordInput", "키워드 입력 방식", ["교사가 직접 입력", "학생들이 함께 제안", "기본 예시 제공", "복사 붙여넣기"]),
      f.select("callMethod", "호출 방식", ["랜덤 호출", "교사가 직접 클릭", "호출 기록 표시", "이미 나온 키워드 제외"]),
      f.area("features", "필요한 기능", "예: 개인 빙고판 만들기, 교사용 호출 화면, 빙고 체크, 다시 시작"),
      f.select("format", "개발 형태", ["React 단일 파일", "HTML/CSS/JS 한 파일", "Google Apps Script 웹앱", "앱 기획서"]),
    ],
    build: (v) => `교실에서 사용할 빙고 게임 앱을 만들어줘.

[앱 정보]
- 앱 종류: 빙고 게임
- 빙고판 크기: ${v.board || "[빙고판 크기]"}
- 빙고 주제: ${v.topic || "[빙고 주제]"}
- 키워드 입력 방식: ${v.keywordInput || "[키워드 입력 방식]"}
- 호출 방식: ${v.callMethod || "[호출 방식]"}
- 필요한 기능: ${v.features || "[필요한 기능]"}
- 개발 형태: ${v.format || "[개발 형태]"}

[제작 조건]
1. 교사가 수업 중 쉽게 진행할 수 있는 화면 흐름으로 만들어줘.
2. 학생 개인정보를 저장하지 않게 해줘.
3. 키워드 호출 기록이 남아 공정하게 진행되도록 해줘.
4. 수업 복습이나 아이스브레이킹에 적합한 밝은 분위기로 구성해줘.`,
  },
  checklist: {
    title: "체크리스트 앱 프롬프트 만들기",
    helper: "수업 준비, 행사 준비, 학생 자기점검 등 반복 확인 업무에 사용해요.",
    fields: [
      f.input("checkTarget", "체크 대상", "예: 체험학습 준비물, 수업 준비, 학생 자기점검", true),
      f.select("user", "사용자", ["교사용", "학생용", "학부모 안내용", "교사+학생 공용"]),
      f.area("items", "체크 항목", "예: 물, 모자, 이름표, 활동지, 안전 약속 확인"),
      f.select("progress", "진행률 표시", ["진행률 표시", "완료 개수 표시", "완료 메시지 표시", "표시 없음"]),
      f.area("features", "필요한 기능", "예: 전체 선택, 초기화, 항목 추가/삭제, 인쇄용 화면"),
      f.select("format", "개발 형태", ["React 단일 파일", "HTML/CSS/JS 한 파일", "앱 기획서"]),
    ],
    build: (v) => `교실 또는 학교 업무에 사용할 체크리스트 앱을 만들어줘.

[앱 정보]
- 앱 종류: 체크리스트 앱
- 체크 대상: ${v.checkTarget || "[체크 대상]"}
- 사용자: ${v.user || "[사용자]"}
- 체크 항목: ${v.items || "[체크 항목]"}
- 진행률 표시: ${v.progress || "[진행률 표시]"}
- 필요한 기능: ${v.features || "[필요한 기능]"}
- 개발 형태: ${v.format || "[개발 형태]"}

[제작 조건]
1. 한눈에 확인하고 빠르게 체크할 수 있게 만들어줘.
2. 개인정보를 저장하지 않는 구조로 설계해줘.
3. 모바일에서도 체크하기 쉽게 버튼과 글자를 충분히 크게 해줘.
4. 교사가 항목을 쉽게 수정할 수 있는 구조로 만들어줘.`,
  },
  vote: {
    title: "학급 투표 앱 프롬프트 만들기",
    helper: "학급 의사결정, 선호도 조사, 활동 선택 투표에 사용해요.",
    fields: [
      f.input("voteTopic", "투표 주제", "예: 현장체험학습 활동 선택, 학급 구호 정하기", true),
      f.area("options", "선택지", "예: 공원 산책, 자연 관찰, 미션 활동, 그림 기록"),
      f.select("voting", "투표 방식", ["1인 1표", "복수 선택", "익명 투표", "이름 입력 선택", "교사용 결과만 표시"]),
      f.select("result", "결과 표시", ["막대그래프", "득표수만 표시", "퍼센트 표시", "1위만 표시", "전체 순위 표시"]),
      f.area("features", "필요한 기능", "예: 투표 초기화, 선택지 추가, 중복 방지 안내, 결과 숨기기"),
      f.select("format", "개발 형태", ["React 단일 파일", "HTML/CSS/JS 한 파일", "Google Apps Script 웹앱", "앱 기획서"]),
    ],
    build: (v) => `교실에서 사용할 학급 투표 앱을 만들어줘.

[앱 정보]
- 앱 종류: 학급 투표 앱
- 투표 주제: ${v.voteTopic || "[투표 주제]"}
- 선택지: ${v.options || "[선택지]"}
- 투표 방식: ${v.voting || "[투표 방식]"}
- 결과 표시: ${v.result || "[결과 표시]"}
- 필요한 기능: ${v.features || "[필요한 기능]"}
- 개발 형태: ${v.format || "[개발 형태]"}

[제작 조건]
1. 학생들이 쉽게 참여할 수 있게 화면을 단순하게 만들어줘.
2. 개인정보 저장을 최소화하고, 이름 입력이 필요 없다면 익명으로 설계해줘.
3. 결과가 한눈에 보이게 시각화해줘.
4. 교사가 수업 중 바로 초기화하고 다시 사용할 수 있게 해줘.`,
  },
  groupMaker: {
    title: "모둠 편성 도구 프롬프트 만들기",
    helper: "번호나 이름 목록을 바탕으로 모둠을 빠르게 나누는 도구를 만들 때 사용해요.",
    fields: [
      f.input("members", "편성 대상", "예: 학생 번호 1~24, 이름 목록, 모둠장 목록", true),
      f.select("groupMethod", "편성 방식", ["인원수 기준", "모둠 수 기준", "랜덤 편성", "모둠장 먼저 배치", "남녀/조건 고려"]),
      f.input("groupSize", "모둠 크기/모둠 수", "예: 4명씩, 6모둠, 모둠당 3~4명"),
      f.select("display", "결과 표시", ["모둠별 카드", "표로 표시", "복사하기 좋게", "발표 순서 포함"]),
      f.area("features", "필요한 기능", "예: 다시 섞기, 특정 학생 분리, 결과 복사, 초기화"),
      f.select("format", "개발 형태", ["React 단일 파일", "HTML/CSS/JS 한 파일", "앱 기획서"]),
    ],
    build: (v) => `교실에서 사용할 모둠 편성 도구를 만들어줘.

[앱 정보]
- 앱 종류: 모둠 편성 도구
- 편성 대상: ${v.members || "[편성 대상]"}
- 편성 방식: ${v.groupMethod || "[편성 방식]"}
- 모둠 크기/모둠 수: ${v.groupSize || "[모둠 크기/모둠 수]"}
- 결과 표시: ${v.display || "[결과 표시]"}
- 필요한 기능: ${v.features || "[필요한 기능]"}
- 개발 형태: ${v.format || "[개발 형태]"}

[제작 조건]
1. 학생 개인정보 저장 없이 브라우저 안에서만 작동하게 해줘.
2. 교사가 명단을 붙여넣고 바로 모둠을 만들 수 있게 해줘.
3. 결과를 보기 좋고 복사하기 쉽게 표시해줘.
4. 다시 섞기와 초기화 기능을 포함해줘.`,
  },

  // SUMMARY: no duplicate "문서 종류" field. The selected task is automatically reflected.
  officialDoc: {
    title: "공문 요약 프롬프트 만들기",
    helper: "공문 종류는 자동 반영됩니다. 여기서는 내 역할과 확인할 일을 구체화해요.",
    fields: [
      f.input("role", "나의 역할", "예: 담임교사, 학년 업무 담당자, 신규 교사"),
      f.area("focus", "특히 확인할 내용", "예: 제출 기한, 대상 학생, 준비물, 예산, 학부모 안내 여부"),
      f.select("output", "정리 방식", ["해야 할 일 중심", "체크리스트", "기한 순서", "표로 정리", "초보자도 이해하기 쉽게"]),
      f.input("deadline", "알고 싶은 기한/날짜", "예: 제출일, 행사일, 신청 마감일"),
      f.area("extra", "추가 조건", "예: 누락되면 안 되는 행정 처리, 담당자에게 확인할 질문 포함"),
    ],
    build: (v) => `첨부한 공문을 ${v.role || "[나의 역할]"} 입장에서 이해하기 쉽게 정리해줘.

[요약 요청]
- 문서 종류: 공문
- 나의 역할: ${v.role || "[나의 역할]"}
- 특히 확인할 내용: ${v.focus || "[확인할 내용]"}
- 정리 방식: ${v.output || "[정리 방식]"}
- 알고 싶은 기한/날짜: ${v.deadline || "[기한/날짜]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[요약 조건]
1. 단순 요약이 아니라 내가 해야 할 일을 중심으로 정리해줘.
2. 날짜, 제출물, 대상, 준비물, 예산이 있으면 따로 표시해줘.
3. 놓치면 안 되는 행정 처리와 확인 질문을 구분해줘.
4. 개인정보나 민감정보가 있다면 취급 주의 문구를 알려줘.`,
  },
  meeting: {
    title: "회의록 요약 프롬프트 만들기",
    helper: "회의록은 결정사항과 후속 조치가 핵심이에요.",
    fields: [
      f.input("meetingTopic", "회의 주제", "예: 학년 협의회, 생활지도 회의, 행사 준비 회의", true),
      f.input("myRole", "내가 맡은 역할", "예: 담임, 행사 담당, 기록 담당"),
      f.select("output", "정리 방식", ["결정사항 중심", "내가 할 일 중심", "기한별 정리", "담당자별 표", "공유용 요약"]),
      f.area("focus", "특히 뽑아야 할 내용", "예: 내가 해야 할 일, 학부모 안내, 준비물, 다음 회의 전까지 할 일"),
      f.area("extra", "추가 조건", "예: 모호한 결정사항은 확인 필요로 표시, 공유 문구까지 작성"),
    ],
    build: (v) => `첨부한 회의록을 ${v.myRole || "[내 역할]"} 입장에서 정리해줘.

[요약 요청]
- 문서 종류: 회의록
- 회의 주제: ${v.meetingTopic || "[회의 주제]"}
- 내가 맡은 역할: ${v.myRole || "[내 역할]"}
- 정리 방식: ${v.output || "[정리 방식]"}
- 특히 뽑아야 할 내용: ${v.focus || "[중점 내용]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[요약 조건]
1. 결정사항, 담당자, 기한, 후속 조치를 구분해줘.
2. 내가 해야 할 일은 체크리스트로 따로 정리해줘.
3. 모호하거나 추가 확인이 필요한 내용은 '확인 필요'로 표시해줘.
4. 다른 선생님에게 공유할 수 있는 짧은 요약 문구도 작성해줘.`,
  },
  training: {
    title: "연수자료 요약 프롬프트 만들기",
    helper: "연수자료는 핵심 개념과 현장 적용 아이디어를 분리하면 좋아요.",
    fields: [
      f.input("role", "요약 관점", "예: 신규 교사, 초등 담임, 유치원 교사"),
      f.select("output", "정리 방식", ["핵심 개념 5가지", "현장 적용 중심", "질문거리 포함", "체크리스트", "표로 정리"]),
      f.area("focus", "특히 알고 싶은 내용", "예: 바로 적용할 수 있는 방법, 주의점, 동료교사에게 공유할 내용"),
      f.area("extra", "추가 조건", "예: 어려운 용어는 쉽게 설명, 내 업무에 적용할 아이디어 포함"),
    ],
    build: (v) => `첨부한 연수자료를 ${v.role || "[요약 관점]"} 관점에서 정리해줘.

[요약 요청]
- 문서 종류: 연수자료
- 요약 관점: ${v.role || "[요약 관점]"}
- 정리 방식: ${v.output || "[정리 방식]"}
- 특히 알고 싶은 내용: ${v.focus || "[중점 내용]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[요약 조건]
1. 핵심 개념과 현장 적용 아이디어를 구분해줘.
2. 신규 교사도 이해할 수 있게 쉬운 말로 설명해줘.
3. 바로 실천할 수 있는 작은 행동을 3가지 제안해줘.
4. 더 확인하면 좋은 질문이나 키워드도 알려줘.`,
  },
  todo: {
    title: "해야 할 일 추출 프롬프트 만들기",
    helper: "긴 문서에서 ‘그래서 내가 뭘 해야 하지?’만 빠르게 뽑을 때 사용해요.",
    fields: [
      f.input("role", "나의 역할", "예: 담임교사, 학년 담당, 신규 교사"),
      f.select("priority", "우선순위 표시", ["긴급/중요로 나누기", "기한순 정리", "오늘/이번 주/나중으로 나누기", "체크리스트만"]),
      f.area("focus", "특히 찾을 일", "예: 제출, 신청, 준비물, 학부모 안내, 학생 안내, 회신 필요"),
      f.area("extra", "추가 조건", "예: 누락되면 문제가 되는 일 강조, 담당자 확인 질문 포함"),
    ],
    build: (v) => `첨부한 문서에서 내가 해야 할 일을 추출해줘.

[추출 요청]
- 나의 역할: ${v.role || "[나의 역할]"}
- 우선순위 표시 방식: ${v.priority || "[우선순위 방식]"}
- 특히 찾을 일: ${v.focus || "[특히 찾을 일]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[정리 조건]
1. 문서 전체 요약보다 '내가 해야 할 일'을 중심으로 정리해줘.
2. 기한, 제출물, 준비물, 안내 대상이 있으면 반드시 표시해줘.
3. 지금 바로 할 일과 나중에 할 일을 구분해줘.
4. 모호한 내용은 확인이 필요하다고 표시해줘.`,
  },

  // RESEARCH: use "활용 장면" instead of vague/redundant purpose.
  lessonResearch: {
    title: "수업 배경자료 조사 프롬프트 만들기",
    helper: "수업 주제의 배경지식, 도입 이야기, 활동 아이디어를 조사할 때 사용해요.",
    fields: [
      f.select("grade", "수업 대상", gradeOptions),
      f.input("topic", "조사 주제", "예: 디지털 시민성, 환경 보호, 봄의 변화", true),
      f.select("useScene", "활용 장면", ["수업 도입", "교사용 배경지식", "학생 활동", "토의 질문 만들기", "활동지 자료"]),
      f.select("depth", "조사 깊이", ["초등학생 눈높이", "교사용 핵심 정리", "사례 중심", "활동 아이디어 중심", "오개념 주의 포함"]),
      f.area("extra", "추가 조건", "예: 어려운 용어 쉽게 설명, 수업 발문 포함, 최신 자료 중심"),
    ],
    build: (v) => `유·초등 수업 준비를 위해 자료조사를 해줘.

[조사 요청]
- 조사 유형: 수업 배경자료 조사
- 수업 대상: ${v.grade || "[수업 대상]"}
- 조사 주제: ${v.topic || "[조사 주제]"}
- 활용 장면: ${v.useScene || "[활용 장면]"}
- 조사 깊이: ${v.depth || "[조사 깊이]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[정리 조건]
1. 수업에 바로 활용할 수 있도록 핵심 개념을 쉽게 정리해줘.
2. 학생에게 던질 수 있는 도입 질문을 포함해줘.
3. 활동 아이디어와 주의할 점을 구분해줘.
4. 확인이 필요한 정보는 출처 확인이 필요하다고 표시해줘.`,
  },
  eventEducation: {
    title: "계기교육 자료 조사 프롬프트 만들기",
    helper: "기념일, 행사, 사회적 이슈를 학생 눈높이에 맞게 다룰 때 사용해요.",
    fields: [
      f.select("grade", "수업 대상", gradeOptions),
      f.input("event", "계기교육 주제", "예: 환경의 날, 한글날, 장애이해교육, 독도교육", true),
      f.select("useScene", "활용 장면", ["아침활동", "창체 수업", "조회/종례", "학급 게시물", "가정 연계 안내"]),
      f.select("tone", "접근 방식", ["쉽고 따뜻하게", "토의 질문 중심", "활동 중심", "오해 없이 균형 있게", "짧은 이야기로"]),
      f.area("extra", "추가 조건", "예: 민감한 표현 주의, 학생용 쉬운 설명, 활동 3가지 포함"),
    ],
    build: (v) => `유·초등 계기교육 자료를 조사하고 정리해줘.

[조사 요청]
- 조사 유형: 계기교육 자료 조사
- 수업 대상: ${v.grade || "[수업 대상]"}
- 계기교육 주제: ${v.event || "[계기교육 주제]"}
- 활용 장면: ${v.useScene || "[활용 장면]"}
- 접근 방식: ${v.tone || "[접근 방식]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[정리 조건]
1. 학생 눈높이에 맞는 쉬운 설명을 먼저 제시해줘.
2. 수업이나 학급활동으로 연결할 수 있는 활동 아이디어를 제안해줘.
3. 교사가 표현할 때 주의해야 할 점을 알려줘.
4. 확인이 필요한 사실은 출처 확인이 필요하다고 표시해줘.`,
  },
  safetyResearch: {
    title: "안전교육 자료 조사 프롬프트 만들기",
    helper: "안전 행동, 위험 예방, 가정 연계 안내를 준비할 때 사용해요.",
    fields: [
      f.select("grade", "교육 대상", gradeOptions),
      f.input("topic", "안전교육 주제", "예: 교통안전, 물놀이 안전, 복도 안전, 재난 안전", true),
      f.select("useScene", "활용 장면", ["수업 도입", "안전 약속 만들기", "가정통신문", "게시물", "퀴즈 만들기"]),
      f.select("focus", "중점", ["예방 행동 중심", "학생 실천 중심", "가정 연계 중심", "퀴즈 포함", "사례 중심"]),
      f.area("extra", "추가 조건", "예: 겁주지 않기, 저학년 눈높이, 안전 행동 문장 포함"),
    ],
    build: (v) => `유·초등 안전교육 자료를 조사하고 정리해줘.

[조사 요청]
- 조사 유형: 안전교육 자료 조사
- 교육 대상: ${v.grade || "[교육 대상]"}
- 안전교육 주제: ${v.topic || "[안전교육 주제]"}
- 활용 장면: ${v.useScene || "[활용 장면]"}
- 중점: ${v.focus || "[중점]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[정리 조건]
1. 위험을 과장하기보다 학생이 실천할 수 있는 안전 행동 중심으로 정리해줘.
2. 학생용 쉬운 설명과 교사용 설명을 구분해줘.
3. 수업 활동, 발문, 마무리 퀴즈 아이디어를 포함해줘.
4. 가정 연계 안내 문구가 필요하면 짧게 제안해줘.`,
  },
  projectResearch: {
    title: "프로젝트 수업 주제 조사 프롬프트 만들기",
    helper: "프로젝트 주제, 탐구 질문, 산출물 아이디어를 잡을 때 사용해요.",
    fields: [
      f.select("grade", "수업 대상", gradeOptions),
      f.input("bigTheme", "큰 주제", "예: 환경, 우리 학교, 지역사회, 안전, 디지털 시민성", true),
      f.select("duration", "수업 기간", ["1차시", "2차시", "4차시", "6차시 이상", "프로젝트 주간"]),
      f.select("output", "원하는 산출물", ["포스터", "발표자료", "영상", "전시물", "앱/디지털 결과물", "캠페인"]),
      f.area("constraints", "수업 여건/제약", "예: 준비물 적게, 태블릿 사용 가능, 모둠활동, 교실 안에서 진행"),
      f.area("extra", "추가 조건", "예: 학생 선택권 포함, 평가 기준 포함, 쉬운 탐구 질문 포함"),
    ],
    build: (v) => `유·초등 프로젝트 수업 주제를 조사하고 제안해줘.

[조사 요청]
- 조사 유형: 프로젝트 수업 주제 조사
- 수업 대상: ${v.grade || "[수업 대상]"}
- 큰 주제: ${v.bigTheme || "[큰 주제]"}
- 수업 기간: ${v.duration || "[수업 기간]"}
- 원하는 산출물: ${v.output || "[산출물]"}
- 수업 여건/제약: ${v.constraints || "[수업 여건/제약]"}
- 추가 조건: ${v.extra || "[추가 조건]"}

[정리 조건]
1. 학생들이 흥미를 느낄 만한 프로젝트 주제 5가지를 제안해줘.
2. 각 주제마다 탐구 질문, 활동 흐름, 산출물을 함께 제시해줘.
3. 준비물과 난이도를 표시해줘.
4. 교사가 평가할 수 있는 간단한 기준도 제안해줘.`,
  },
};

function StepHeader({ step, title, subtitle }) {
  return (
    <div className="mb-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
        <Sparkles className="h-4 w-4" /> STEP {step}
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
      {subtitle && <p className="mt-3 text-base text-slate-600 md:text-lg">{subtitle}</p>}
    </div>
  );
}

function SafetyBanner() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
      <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
      <p>
        <span className="font-semibold text-slate-800">안전 안내:</span> {safetyNote}
      </p>
    </div>
  );
}

function getCategoryByTask(taskId) {
  return categories.find((category) => category.tasks.some((task) => task.id === taskId));
}

export default function TeacherPromptGenerator() {
  const [step, setStep] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [values, setValues] = useState({});
  const [copied, setCopied] = useState(false);

  const category = useMemo(() => categories.find((c) => c.id === categoryId), [categoryId]);
  const task = useMemo(() => category?.tasks.find((t) => t.id === taskId), [category, taskId]);
  const config = useMemo(() => taskConfigs[taskId], [taskId]);
  const prompt = useMemo(() => (config ? config.build(values) : ""), [config, values]);

  const reset = () => {
    setStep(1);
    setCategoryId(null);
    setTaskId(null);
    setValues({});
    setCopied(false);
  };

  const goBack = () => {
    setCopied(false);
    if (step === 4) setStep(3);
    else if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const selectCategory = (id) => {
    setCategoryId(id);
    setTaskId(null);
    setValues({});
    setStep(2);
  };

  const selectTask = (id) => {
    const taskCategory = getCategoryByTask(id);
    setCategoryId(taskCategory?.id || categoryId);
    setTaskId(id);
    setValues({});
    setCopied(false);
    setStep(3);
  };

  const updateValue = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={step === 1}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              step === 1 ? "cursor-not-allowed text-slate-300" : "bg-white text-slate-700 shadow-sm hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className="h-4 w-4" /> 이전
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" /> 처음으로
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <StepHeader
                step="1"
                title="무엇을 생성하시겠어요?"
                subtitle="제미나이에게 맡길 업무의 출력 형태를 먼저 선택하세요."
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => selectCategory(item.id)} className="text-left">
                      <Card
                        className={`h-full overflow-hidden rounded-3xl border-0 bg-gradient-to-br ${item.color} shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
                      >
                        <CardContent className="p-6">
                          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <Icon className="h-6 w-6 text-slate-700" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-900">{item.label}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                        </CardContent>
                      </Card>
                    </button>
                  );
                })}
              </div>
              <SafetyBanner />
            </motion.div>
          )}

          {step === 2 && category && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <StepHeader
                step="2"
                title={`어떤 ${category.label} 업무를 도와드릴까요?`}
                subtitle="여기서 선택한 업무는 다음 단계 프롬프트에 자동으로 반영됩니다."
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.tasks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectTask(item.id)}
                    className="rounded-2xl bg-white p-5 text-left font-semibold text-slate-800 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <SafetyBanner />
            </motion.div>
          )}

          {step === 3 && category && task && config && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <StepHeader step="3" title={config.title} subtitle={config.helper} />
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
                선택한 업무: <span className="font-semibold text-slate-900">{category.label} · {task.label}</span>
                <span className="ml-2 text-slate-500">이 정보는 최종 프롬프트에 자동 반영돼요.</span>
              </div>
              <Card className="rounded-3xl border-0 bg-white shadow-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="grid gap-5 md:grid-cols-2">
                    {config.fields.map((field) => (
                      <div key={field.key} className={field.span || field.multiline ? "md:col-span-2" : ""}>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">{field.label}</label>
                        {field.type === "select" ? (
                          <select
                            value={values[field.key] || ""}
                            onChange={(e) => updateValue(field.key, e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          >
                            <option value="">선택하세요</option>
                            {field.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.multiline ? (
                          <textarea
                            value={values[field.key] || ""}
                            onChange={(e) => updateValue(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          />
                        ) : (
                          <input
                            value={values[field.key] || ""}
                            onChange={(e) => updateValue(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button onClick={() => setStep(4)} className="rounded-2xl px-6 py-6 text-base">
                      프롬프트 생성하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <SafetyBanner />
            </motion.div>
          )}

          {step === 4 && category && task && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <StepHeader
                step="4"
                title="완성된 프롬프트"
                subtitle="복사해서 제미나이에 붙여넣은 뒤, 결과물을 교사 판단으로 한 번 더 다듬어 주세요."
              />
              <Card className="rounded-3xl border-0 bg-white shadow-sm">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-500">선택한 업무</p>
                      <p className="font-bold text-slate-900">
                        {category.label} · {task.label}
                      </p>
                    </div>
                    <Button onClick={copyPrompt} className="rounded-2xl">
                      <Copy className="mr-2 h-4 w-4" /> {copied ? "복사 완료!" : "복사하기"}
                    </Button>
                  </div>
                  <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-50">
                    {prompt}
                  </pre>
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    <p className="font-semibold text-slate-800">사용 전 확인</p>
                    <p className="mt-1">
                      생성된 프롬프트에 개인정보나 민감정보가 들어가지 않았는지 확인한 뒤 사용하세요. AI 결과물은 완성본이 아니라 초안입니다.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={() => setStep(3)} className="rounded-2xl">
                      같은 업무 다시 만들기
                    </Button>
                    <Button variant="outline" onClick={reset} className="rounded-2xl">
                      처음으로
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
