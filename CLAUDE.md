# Good Timer

Static PWA (no build): `index.html`, `ui.css`, `app.js`, `sync.js`, `config.js`. Supabase for history sync (access-code accounts, RLS keyed by `account_code`).
Never commit access-code values.

## UI 디자인 원칙

이 프로젝트의 UI를 만들거나 수정할 때 아래 원칙을 반드시 지켜줘. "AI가 만든 티"가 나지 않는, 절제되고 정돈된 디자인이 목표야.

### 색과 효과
- 프라이머리 컬러 1개 + 포인트 컬러 최대 1개만 쓰고, 나머지는 무채색(회색 계열)으로 처리해.
- 그라데이션은 쓰지 마. 특히 보라색 그라데이션 금지.
- 글라스(blur) 효과, 아웃글로우, 그라데이션 그림자, 과한 box-shadow 금지. 구분이 필요하면 얇은 선이나 배경색 차이로 해결해.
- 모든 시각 효과는 이유를 설명할 수 있어야 해. 이유가 없으면 넣지 마.

### 글씨와 위계
- 폰트 크기·굵기 조합은 3단계 이하로 제한해 (예: 제목 / 본문 / 보조).
- 글씨를 과하게 키우지 마. 볼드는 정말 중요한 곳에만 써.
- 중요도는 크기·굵기·색·여백의 차이로 표현해. 강조 요소는 화면당 하나가 원칙.
- 한글 줄바꿈(word-break: keep-all)과 정렬이 어긋나지 않게 챙겨.

### 아이콘과 장식
- 아이콘은 기능을 전달할 때만 써. 타이틀 옆이나 목록 앞에 장식용으로 넣지 마.
- 이모지를 아이콘 대용으로 쓰지 마.
- 아이콘 스타일은 한 가지(예: 라인 아이콘 한 세트)로 통일해.
- 장식 요소는 최소화하고, 시선이 핵심 콘텐츠에 가도록 해.

### 일관성
- 같은 역할의 컴포넌트는 같은 모양(선, 라운드, 여백)을 가져야 해.
- 토글/라디오/탭처럼 비슷한 컴포넌트를 섞어 쓰지 말고 용도별로 하나만 정해.
- 선택/비선택, 활성/비활성 상태는 한눈에 구분되게 해.
- 내비게이션 같은 공통 구조는 화면이 바뀌어도 유지해.

### 정보 구조와 사용성
- 모든 요소는 "왜 이 위치에 있는지" 의도가 있어야 해.
- 핵심 행동(추가, 기록, 저장 등)은 어디를 눌러야 하는지 바로 보이게 해.
- 사용법 안내 화면이나 설명 팝업은 꼭 필요할 때만 만들어.
- 버튼은 버튼처럼 보여야 해. 기능이 겹치는 버튼(예: "알겠어요"와 닫기)은 하나로 합쳐.
- 한 화면에 모든 정보를 펼치지 말고, 하위 정보는 필요할 때 보이게 해.

### 문구(카피)
- 짧고 자연스러운 한국어로 써. 번역투, 과한 존댓말, 어색한 문장 금지.
- 기능을 부연 설명하는 문장(예: "~할 때 바로 답할 수 있어요")은 쓰지 마.
- 주어와 대상이 빠진 모호한 문장을 쓰지 마.
- 시스템 내부 처리 절차("A하면 B해요")를 사용자에게 설명하지 마. 사용자가 이미 아는 내용도 반복하지 마.

### 작업 방식
- 새 화면을 만들거나 수정한 뒤, 위 원칙을 기준으로 스스로 점검하고 위반 사항이 있으면 고친 다음 결과를 보여줘.

## Owner decisions that override the principles above
- Base look: the flat restyle in `ui.css` (1px lines, one button shape, Rajdhani + Share Tech Mono, blue primary, red = a running set).
- Kept from the earlier PS2 look, by the owner's choice: the blue-void background gradient with the red (set) / grey (break) floor; the red glow on the clock during a set; the flying SET/BREAK callout (Anton, gradient fill, skewed fly-by); the START wire ring (turning, press pulls in, launch flings out) with PRESS START. No new gradients or glows beyond these.
- No icons inside exercise cards; no glow or blur behind the body figures.
- Panels over other content (sheet, modal, toast) are opaque.
- UI copy is English (owner's choice); keep it short, no explanatory sentences.
