// EmailJS 설정
// 1. https://www.emailjs.com/ 에서 무료 계정 생성
// 2. Email Service 추가 (Gmail 추천)
// 3. Email Template 생성
// 4. 아래 값들을 실제 값으로 교체

const EMAIL_CONFIG = {
    // EmailJS Dashboard에서 확인 가능한 값들
    SERVICE_ID: 'YOUR_SERVICE_ID', // 예: 'service_abc123'
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // 예: 'template_xyz789'
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // 예: 'abcdefghijk123456'
};

// 이메일 템플릿 예시 (EmailJS Dashboard에서 설정)
/*
템플릿 변수:
- {{user_name}} : 사용자 이름
- {{user_email}} : 사용자 이메일
- {{user_phone}} : 사용자 연락처
- {{test_date}} : 테스트 날짜
- {{total_score}} : 총 점수
- {{self_score}} : 자기 역량 점수
- {{local_score}} : 지역 활동 점수
- {{party_score}} : 정당 활동 점수
- {{personality_type}} : 진단 유형
- {{personality_message}} : 진단 메시지
- {{test_url}} : 테스트 URL
*/