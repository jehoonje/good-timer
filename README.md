# Good Timer

웨이트 세트/휴식 타이머. 부위(등·가슴·어깨·하체) → 운동 선택 → 화면 더블탭으로 세트 완료 / 브레이크 완료를 기록합니다.

## 구조
- 빌드 없는 정적 사이트 (Vercel에 그대로 배포)
- `index.html`, `styles.css`, `app.js` — 앱
- `sync.js` — Supabase 동기화 (로컬 먼저 저장 → 익명 로그인 사용자로 `gt_sessions`에 업서트)
- `config.js` — Supabase URL과 publishable 키 (공개 키, 접근 제어는 RLS)
- `supabase/migrations/` — 테이블/RLS 정의

## Supabase
Digger 프로젝트를 같이 씁니다. 이 앱의 객체는 모두 `gt_` 접두사입니다.
Authentication → Sign In / Providers에서 **Allow anonymous sign-ins**가 켜져 있어야 동기화됩니다.

## Access codes
- The app opens on an access-code screen. A code (8 characters, shown as `XXXX-XXXX`) is an account:
  every device that enters the same code shares one history.
- There is no sign-up. Codes are issued from the SQL editor: `select public.gt_new_code('label');`
  Deactivate one with `update public.gt_access_codes set active = false where code = '...';`
- Sign out is in History.
