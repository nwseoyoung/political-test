# 📋 스티비 설정 체크리스트

## 1. API 키 확인
- 위치: 스티비 대시보드 → 설정 → API 연동
- 형태: `stibee_` 로 시작하는 긴 문자열

## 2. 리스트 ID 확인  
- 위치: 리스트 페이지 URL
- 예시: `https://page.stibee.com/lists/123456` → **123456**이 리스트 ID

## 3. 커스텀 필드 확인 (이미 생성하셨다면 ✅)
리스트 → 구독자 관리 → 사용자 정의 필드에서 다음 필드들이 있는지 확인:

- [ ] `test_date` (텍스트)
- [ ] `total_score` (텍스트)
- [ ] `self_score` (텍스트)
- [ ] `local_score` (텍스트)
- [ ] `party_score` (텍스트)
- [ ] `personality_type` (텍스트)
- [ ] `selected_self` (긴 텍스트)
- [ ] `selected_local` (긴 텍스트)
- [ ] `selected_party` (긴 텍스트)

## 4. 자동 이메일 설정
1. 자동 이메일 → 새 캠페인 만들기
2. 트리거 설정:
   - 트리거: "태그가 추가될 때"
   - 태그명: `정치역량테스트완료`
3. 이메일 템플릿:
   - `STIBEE_EMAIL_TEMPLATE.html` 내용 복사 → HTML 에디터에 붙여넣기
4. 캠페인 활성화

## 5. 테스트 방법
1. 위 설정 완료 후
2. https://political-test.vercel.app 에서 테스트
3. 스티비 대시보드에서 확인:
   - 구독자 추가 여부
   - 태그 추가 여부  
   - 이메일 발송 여부

## ⚠️ 주의사항
- API 키는 절대 공개 저장소에 업로드하지 마세요
- Vercel 환경변수에만 안전하게 저장
- 로컬 테스트 시 `.env.local` 파일 사용