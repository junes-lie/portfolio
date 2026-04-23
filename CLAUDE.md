# Portfolio — Jisun Lee

이지선(Jisun Lee)의 개인 포트폴리오 사이트. 정적 HTML/CSS/JS 단일 페이지(6 섹션 스크롤). 프레임워크·번들러 없음.

**원칙: 글보다 디자인 언어로 증명한다.** 자소서 줄글을 섹션 카피로 복붙하지 않는다. 서사는 히어로의 압축된 한 줄 + 사이트 자체의 디자인 언어(그리드·번호 체계·호버 인터랙션)로만 녹인다.

---

## 1. 구조

```
index.html              (단일 페이지, ~80KB, 6 섹션)
assets/
  css/style.css         ← 컴파일 결과물. 직접 편집/동기화 필수 (§3 참조)
  scss/
    style.scss          (진입점)
    _variable.scss      ($font-*, $space-*, $p-*, $z-*, $radius-*, $btn-*, $trans-du, $font-icon, $font-caption, $font-h4 …)
    _mixin.scss         (flex-center, flex, absolute-center, fill-parent, glass, point, difference,
                         hover-effect, portrait, landscape-mobile)
    _font.scss          (clamp-calc 기반 폰트 사이즈)
    _reset.scss, _common.scss, _header.scss, _animation.scss
    _component.scss     (.quick-btns, .navigation, .mouse-wrap, #logo-white, #logo-colored)
    _intro.scss 등 섹션별 파셜
  js/
    config.js           (GSAP 플러그인 등록, smoother 인스턴스 등 전역)
    logo.js             (로딩/인트로 타임라인 — 이 파일이 전체 부트 진입점)
    scroll.js, navigation.js, quick.js
    skillCircle.js, publish.js, uxui.js, graphic.js, planning.js
  images/, docs/이지선 입사지원서.docx
```

**섹션 (`.s1 ~ .s6`)**: Intro / Profile / Publishing / UXUI / Graphic / Planning.
Profile 섹션의 팩트(이름/생일/회사 이력/스킬 5개 원형)는 **100% 유지** — 이력서 미열람 면접관 대비 완결 정보 블록.

---

## 2. 기술 스택

| 영역 | 도구 |
|---|---|
| 애니메이션 | GSAP 3.13 + `ScrollSmoother`, `ScrollTrigger`, `SplitText` (CDN) |
| 이미지 로더 | `imagesLoaded` |
| 아이콘 | `iconify-icon` |
| 스타일 | SCSS → CSS (컴파일러 PATH 없음, §3) |
| 빌드 | 없음. 정적 서빙 |

`package.json`은 `@types/gsap`만 포함. npm 스크립트 없음.

---

## 3. SCSS 동기화 (중요)

**`sass` 바이너리가 PATH에 없다.** SCSS 파일을 수정하면 `assets/css/style.css`도 **같은 diff로 손으로 동기화**해야 함. 과거에 SCSS만 고치고 브라우저 확인 후 "왜 반영 안 되지?" 에 오래 매달린 기록 있음.

동기화 절차:
1. `assets/scss/*.scss` 수정
2. 동일한 변경을 `assets/css/style.css`의 해당 규칙에 반영 (mixin 전개 포함)
3. 브라우저는 `style.css`만 읽음 — SCSS는 소스 기록용

새 파셜 추가 시 `style.scss`에 `@use` 추가 + 컴파일된 출력을 `style.css`에 append.

---

## 4. 부트 시퀀스 (`logo.js`)

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

---

## 5. 함정 (실측으로 확인된 것)

### 5-1. CSS Grid `grid-template-rows` 보간 불안정
GSAP로 `auto 1fr 1fr` ↔ `auto 0fr 0fr` 를 tween하면 **중간 프레임이 끊겨 뚝뚝 움직임**. 브라우저 스펙상 intrinsic(`auto`)↔flexible(`fr`) 보간이 보장되지 않음.
→ **flexbox + wrapper의 `height: 0` tween**으로 해결. `overflow: hidden; min-height: 0` 필수.

### 5-2. flex-center는 overflow 시 중앙을 보장하지 않는다
자식 합계가 부모보다 크면 위로 튀어 오름. 로딩 상태에서 `.hero { height: 0 }`로 flex 공간을 명시적으로 차단해야 loader-wrap이 content-wrap 안에 들어감.

### 5-3. `visibility: hidden` FOUC 가드
초기 로드 시 GSAP `set()` 전에 한 프레임이라도 보이면 hero/navigation이 깜빡임. `.content-wrap.is-loading { visibility: hidden }` 을 `_component.scss`의 `.navigation/.quick-btns/.mouse-wrap`에도 동일 적용. `Loading()` 초기 `.call(() => …classList.remove('is-loading'))` 로 해제.

### 5-4. Chrome DevTools MCP `navigate_page` 가 `file://`에서 타임아웃
`new_page` 로 새 탭을 여는 쪽이 안정적. reload 대신 새 페이지 열기.

### 5-5. GSAP 타임라인 디버깅
`evaluate_script` 로 runtime TL을 재구성해서 progress 0→1을 샘플링하는 패턴이 가장 빨리 원인 찾음. `tl.progress(0.3)` 처럼 값 세팅 후 측정. 실제 페이지의 TL을 수정하는 것보다 복제 TL에서 실험하는 편이 깨끗함.

---

## 6. 디자인 언어 (컨셉)

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

## 7. 규칙

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
- Claude Code Co-Author footer 포함.

### 대화
- 한국어.
- 수정 전에 설명하고 허락을 받는다.
- 사용자가 방향을 제안하면, 무작정 수정하지 말고 **대안 비교부터**.
- 거절당하면 멈추고 묻는다. 대안을 더 쌓지 않는다.
- 창작/컨셉 작업은 한 스텝씩 다이얼로그. 완성품을 먼저 꺼내지 않는다.
- 플랫폼 동작을 추측하지 않는다. 모르면 모른다고 말하고 확인한다.
- Sycophantic 오프닝/클로징 금지.

---

## 8. 과거의 실패 기록 (반복 금지)

| 실패 | 교훈 |
|---|---|
| 자소서 줄글을 섹션 카피로 복붙 제안 | 포폴은 이력서 사본이 아니다. 디자인 언어로 증명한다. |
| loader collapse를 `gridTemplateRows: auto auto auto ↔ 0fr 0fr` tween으로 구현 | intrinsic↔flexible 보간 불안정. wrapper + `height: 0`로 다시 설계. |
| overflow 원인을 `1fr` grid row로 오진 | 실제 원인은 hero(386) + loader-wrap(709) > content-wrap(756). 측정부터. |
| `logoFlip()`이 "로고를 quick-btns 자리로 이동시킨다"고 상상 | 실제로는 `.flipped` class 토글만 함. 코드를 읽지 않고 동작을 지어내지 않는다. |
| 절대 배치 로고 + placeholder spacer 접근 | placeholder가 같은 flex 공간 차지 → overflow 그대로. 근본 해결 안 됨. |
| 여러 워크트리에서 "서사가 안 보임 + 방향 미정"으로 반복 실패 | 구조를 바꾸지 말고(6 섹션 유지) 디자인 언어 레이어만 더한다. |
| SCSS만 수정하고 브라우저 확인 | `style.css`에도 수동 동기화 필요. |

---

## 9. 작업 플랜 참조

진행 중인 상위 플랜: `C:\Users\LEE\.claude\plans\portfolio-luminous-spring.md`
- Step 1 (Intro 4줄 태그라인 + 로더 재설계) 완료 → PR #12
- Step 2 이후(번호 라벨 / 그리드 오버레이 / Profile 타임라인화 / 카드 호버 구조선) 사용자 확인 후 진행

---

## 10. 검증 체크리스트

변경 후 확인:
1. 로딩 중 loader-wrap이 content-wrap 안에 들어가고 중앙정렬 유지 (Chrome DevTools 실측)
2. 4줄 태그라인 stagger 0.4s, 끝에 1.2s hold
3. init 전환 시 hero h2/h1이 viewport 밖으로 튀지 않음
4. `welcome to` / `Portfolio` SplitText 등장이 끊김 없이 이어짐
5. 스크롤 시 6 섹션 배경 그라디언트(gold → coral → blue) 끊김 없음
6. 데스크톱/태블릿/모바일(portrait + landscape-mobile) 3개 브레이크포인트 확인
7. 호버 인터랙션은 데스크톱에서만, 모바일은 정적
8. Profile 섹션 팩트(이름/생일/전화/회사 3/JLPT/스킬 5개) 손실 없음
