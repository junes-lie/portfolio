# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

이지선(Jisun Lee)의 개인 포트폴리오. 정적 HTML/CSS/JS 단일 페이지(6 섹션 스크롤). 프레임워크·번들러 없음. GSAP이 메인 애니메이션 엔진.

**원칙: 글보다 디자인 언어로 증명한다.** 자소서 줄글을 섹션 카피로 복붙하지 않는다. 서사는 히어로의 압축된 한 줄 + 사이트 자체의 디자인 언어(그리드·번호 체계·호버 인터랙션)로만 녹인다.

---

## Running the Project

- **VS Code Live Server** 포트 `5501` (`.vscode/settings.json`에 설정)
- 또는 정적 서버: `npx http-server .` / `python -m http.server`
- **`index.html`을 파일로 직접 열지 말 것** — 스크롤 애니메이션이 HTTP 서버 필요

## SCSS 동기화 (중요)

SCSS 소스는 `assets/scss/`, 컴파일 결과물은 `assets/css/style.css`. 빌드 스크립트 없음.

- **sass CLI가 PATH에 있으면**: `sass assets/scss/style.scss assets/css/style.css --watch`
- **없으면 (현재 환경)**: SCSS 수정 후 `assets/css/style.css`의 해당 규칙을 **손으로 동기화**. 과거에 SCSS만 고치고 "왜 반영 안 되지?"에 오래 매달린 기록 있음. 브라우저는 `style.css`만 읽는다.

새 파셜 추가 시 `style.scss`에 `@use` 추가 + 컴파일된 출력을 `style.css`에 append.

---

## Architecture

### Entry Point

`index.html`이 단일 HTML. 모든 JS 모듈은 하단에서 `defer`로 다음 순서 로드:

1. `assets/js/config.js` — GSAP 플러그인 등록, 전역 `CONFIG`, 반응형 헬퍼(`remap()`, `clampVal()`)
2. `assets/js/scroll.js` — ScrollSmoother init, 섹션 네비, `sectionMove()` 프로그래매틱 스크롤
3. `assets/js/logo.js` — Intro 로더 + SVG 로고 애니메이션 시퀀스 (§ 부트 시퀀스)
4. `assets/js/navigation.js` — 사이드바 점 네비, 스크롤 싱크, `.is-diff` 클래스 토글
5. `assets/js/skillCircle.js` — SVG stroke-dashoffset 스킬 원형 애니
6. `assets/js/publish.js` — Publishing 캐러셀
7. `assets/js/uxui.js` — UX/UI 갤러리 auto-play
8. `assets/js/graphic.js` — 3D flip 카드
9. `assets/js/planning.js` — 확장 프로세스 카드, 풀스크린 토글
10. `assets/js/quick.js` — 퀵 버튼(top, PDF, resume, GitHub)

### 부트 시퀀스 (`logo.js`)

```
Loading()                                   ← 파일 마지막에서 호출
 ├─ 초기 set: navigation/quick-btns/hero/mouse-wrap autoAlpha 0,
 │             possessive width/autoAlpha 0, hero height 0,
 │             loader-tagline .line autoAlpha 0 y 10
 ├─ content-wrap 에서 `is-loading` class 제거 (FOUC 끝)
 ├─ smoother.scrollTo(0, false); smoother.paused(true)
 ├─ LogoDraw()  ← GSAP TL 반환. onComplete에서 isLogoFinished=true
 │    ├─ #logo-white .stroke stroke-dasharray/offset 세팅
 │    ├─ wave2 scaleX:-1 (좌우 반전)
 │    ├─ half-circle / wave 드로잉 (2s / 1s)
 │    ├─ .up/.wave1/.wave2/.wave3 등장
 │    ├─ 태그라인 .line stagger 페이드인 (4줄, 0.4s stagger)
 │    └─ 끝에 1.2s hold (독해 시간)
 └─ imagesLoaded(img) → progress 카운터 갱신, always에서 isImageLoaded=true
       둘 다 true → init()
```

`logoFlip()`: `.logo`에 10초 간격으로 `.flipped` class 토글, hover 시 중단. **그 외 동작 없음** — 로고가 어디로 "이동"하거나 하지 않는다.

### SCSS 구조

| 파일 | 역할 |
|------|------|
| `_variable.scss` | CSS 변수, 브레이크포인트(`$pc: 1400px`, `$tablet: 768px`, `$mobile: 360px`), `$font-*`, `$space-*`, `$p-*`, `$z-*`, `$radius-*`, `$btn-*` |
| `_mixin.scss` | `flex-center`, `flex($dir, $gap)`, `absolute-center`, `fill-parent`, `glass`, `point`, `difference`, `hover-effect`, `portrait`, `landscape-mobile`, `clamp-calc()` |
| `_animation.scss` | 키프레임 정의 |
| `_common.scss` | 전역 엘리먼트 스타일 |
| `_component.scss` | `.quick-btns`, `.navigation`, `.mouse-wrap`, `#logo-white`, `#logo-colored` 등 컴포넌트 |
| `_font.scss` | Font-face + clamp-calc 기반 폰트 사이즈 |

### 페이지 섹션

| ID | JS | 설명 |
|-----|-----|------|
| `#intro` (`.s1`) | `logo.js` | 로고 인트로 + 로더 |
| `#profile` (`.s2`) | `skillCircle.js` | About 정보 + 스킬 원형 |
| `#publishing` (`.s3`) | `publish.js` | Work 캐러셀 + 배경 이미지 전환 |
| `#uxui` (`.s4`) | `uxui.js` | 디자인 갤러리 auto-play |
| `#graphic` (`.s5`) | `graphic.js` | 3D flip 카드 |
| `#planning` (`.s6`) | `planning.js` | 확장 프로세스 카드 |

네비 점은 `.navigation` 사이드바. `data-full-move="true"`는 섹션 전체 스크롤 스냅.

**Profile 섹션의 팩트(이름/생일/전화/회사 이력 3/JLPT N1/스킬 원형 5개)는 100% 유지.** 이력서 미열람 면접관 대비 완결 정보 블록.

### 핵심 패턴

- **반응형 사이즈**: `clamp-calc($min, $max, $vp-min, $vp-max)` SCSS 함수 — 고정 px 대신
- **호버 vs 터치**: `@mixin hover-effect` — PC는 `:hover`, 터치는 `:active`
- **오리엔테이션**: `@mixin portrait` + GSAP `matchMedia()`
- **GSAP 반응형**: `gsap.matchMedia()` + `config.js`의 `CONFIG.media` 브레이크포인트
- **전역 상태**: `window.isIntroDone` (인트로 완료), `isManualMove` (수동 스크롤 오버라이드, `scroll.js`)

### 디자인 토큰

- Accent: `--point-color: rgb(242, 120, 75)` (orange)
- Korean heading: `YUniverse-B`
- Korean body: `SUIT` / `SUITE`
- English accent: `Raleway`
- 모든 GSAP 플러그인(ScrollTrigger, ScrollSmoother, SplitText, Observer) CDN + `config.js`에서 등록

---

## 디자인 언어 (컨셉)

**The Architect of Clear Interfaces** — "기준을 세우고 구조를 뜯어보는 사람"을 말 없이 증명.

### 히어로에만 노출되는 정체성 4줄

```
붓으로 그린 다채로운 디자인 감성과
돋보기로 찾아낸 구조의 인사이트로
사용자의 마음에 태양처럼 가닿는
UX 디자이너 이지선입니다
```

로딩 페이즈에만 노출. `init()` 전환 시 fade out, 이후 `welcome to Portfolio` SplitText 등장.

---

## 함정 (실측으로 확인된 것)

### CSS Grid `grid-template-rows` 보간 불안정
GSAP로 `auto 1fr 1fr` ↔ `auto 0fr 0fr` 를 tween하면 **중간 프레임이 끊겨 뚝뚝 움직임**. 브라우저 스펙상 intrinsic(`auto`)↔flexible(`fr`) 보간이 보장되지 않음.
→ **flexbox + wrapper의 `height: 0` tween**으로 해결. `overflow: hidden; min-height: 0` 필수.

### flex-center는 overflow 시 중앙을 보장하지 않는다
자식 합계가 부모보다 크면 위로 튀어 오름. 로딩 상태에서 `.hero { height: 0 }`로 flex 공간을 명시적으로 차단해야 loader-wrap이 content-wrap 안에 들어감.

### `visibility: hidden` FOUC 가드
초기 로드 시 GSAP `set()` 전에 한 프레임이라도 보이면 hero/navigation이 깜빡임. `.content-wrap.is-loading { visibility: hidden }` 을 `_component.scss`의 `.navigation/.quick-btns/.mouse-wrap`에도 동일 적용. `Loading()` 초기 `.call(() => …classList.remove('is-loading'))` 로 해제.

### Chrome DevTools MCP `navigate_page` 가 `file://`에서 타임아웃
`new_page` 로 새 탭을 여는 쪽이 안정적. reload 대신 새 페이지 열기.

### GSAP 타임라인 디버깅
`evaluate_script` 로 runtime TL을 재구성해서 progress 0→1을 샘플링하는 패턴이 가장 빨리 원인 찾음. `tl.progress(0.3)` 처럼 값 세팅 후 측정. 실제 페이지의 TL을 수정하는 것보다 복제 TL에서 실험하는 편이 깨끗함.

---

## 규칙

### 스타일
- **폰트 사이즈는 반드시 `$font-*` 변수.** 컴포넌트에 인라인 `clamp-calc()` 금지.
- **기존 mixin 재사용.** `@include flex-center`, `@include flex($dir, $gap)`, `@include absolute-center`, `@include fill-parent`, `@include glass`, `@include point`, `@include difference`, `@include hover-effect`, `@include portrait`, `@include landscape-mobile`. 동일 규칙을 다시 쓰지 않는다.
- `$space-*`, `$p-*`, `$radius-*`, `$btn-*` 재사용.

### 카피
- **서사 카피 추가 금지.** Profile/Publishing/UXUI/Graphic/Planning 본문에 자소서 문구 삽입 금지.
- 히어로 4줄 외에 자소서 줄글이 섹션 카피로 들어가지 않는다.

### JS
- `config.js`에서 이미 만든 smoother/타임라인 전역 사용.
- 인라인 스타일(zIndex 등)은 JS에서 유지 — CSS로 옮기지 않는다.

### 커밋
- 메시지 접두사: `MMDD` (예: `0424 intro 로더 재설계 - …`).
- 원자성: 폴더 구조 변경 + 기능 추가 + 리디자인을 한 커밋에 섞지 않는다. cherry-pick 가능해야 함.
- Pre-commit hook 실패 시 **새 커밋**을 만든다. `--amend` 금지.

### 대화
- 한국어.
- 수정 전에 설명하고 허락을 받는다.
- 사용자가 방향을 제안하면, 무작정 수정하지 말고 **대안 비교부터**.
- 거절당하면 멈추고 묻는다. 대안을 더 쌓지 않는다.
- 창작/컨셉 작업은 한 스텝씩 다이얼로그. 완성품을 먼저 꺼내지 않는다.
- 플랫폼 동작을 추측하지 않는다. 모르면 모른다고 말하고 확인한다.

---

## 과거의 실패 기록 (반복 금지)

| 실패 | 교훈 |
|------|------|
| 자소서 줄글을 섹션 카피로 복붙 제안 | 포폴은 이력서 사본이 아니다. 디자인 언어로 증명한다. |
| loader collapse를 `gridTemplateRows: auto auto auto ↔ 0fr 0fr` tween으로 구현 | intrinsic↔flexible 보간 불안정. wrapper + `height: 0`로 다시 설계. |
| overflow 원인을 `1fr` grid row로 오진 | 실제 원인은 hero(386) + loader-wrap(709) > content-wrap(756). 측정부터. |
| `logoFlip()`이 "로고를 quick-btns 자리로 이동시킨다"고 상상 | 실제로는 `.flipped` class 토글만 함. 코드를 읽지 않고 동작을 지어내지 않는다. |
| 절대 배치 로고 + placeholder spacer 접근 | placeholder가 같은 flex 공간 차지 → overflow 그대로. 근본 해결 안 됨. |
| 여러 워크트리에서 "서사가 안 보임 + 방향 미정"으로 반복 실패 | 구조를 바꾸지 말고(6 섹션 유지) 디자인 언어 레이어만 더한다. |
| SCSS만 수정하고 브라우저 확인 | `style.css`에도 수동 동기화 필요. |

---

## 검증 체크리스트

변경 후 확인:
1. 데스크톱/태블릿/모바일(portrait + landscape-mobile) 3개 브레이크포인트 확인
2. 호버 인터랙션은 데스크톱에서만, 모바일은 정적
