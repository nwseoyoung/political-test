# 캠페이너스 페이지 통합 가이드

## 빠른 시작

캠페이너스 HTML 블록에 아래 코드를 복사하여 붙여넣으세요:

```html
<div id="political-test-widget" style="width: 100%; max-width: 700px; margin: 0 auto; position: relative; overflow: hidden;">
    <iframe 
        src="https://political-test-three.vercel.app/" 
        style="width: 100%; height: 100vh; min-height: 800px; border: none; border-radius: 12px; overflow: auto; -webkit-overflow-scrolling: touch;"
        title="정치 역량 진단 테스트"
        loading="lazy"
        scrolling="yes"
        allowfullscreen>
    </iframe>
</div>

<script>
// iframe 높이 자동 조절 및 스크롤 최적화
(function() {
    var iframe = document.querySelector('#political-test-widget iframe');
    if (iframe) {
        // 뷰포트 높이에 맞춤
        function adjustHeight() {
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            iframe.style.height = Math.max(viewportHeight, 800) + 'px';
        }
        
        adjustHeight();
        window.addEventListener('resize', adjustHeight);
        
        // iframe 로드 시 상단으로 스크롤
        iframe.onload = function() {
            window.scrollTo(0, 0);
        };
    }
})();
</script>
```

## 통합 옵션

### 옵션 1: iframe 임베드 (권장)
- 가장 간단한 방법
- 페이지 스타일에 영향 없음
- 자동 높이 조절 지원
- 스크롤 최적화 포함

### 옵션 2: 팝업 창 방식
- 페이지 이탈 방지
- 사용자가 현재 페이지에 머물면서 테스트 진행
- campaignus-embed.html 파일의 옵션 2 코드 사용

### 옵션 3: 동적 로딩
- 페이지 성능 최적화
- 사용자가 스크롤하여 위젯이 보일 때 로딩
- campaignus-embed.html 파일의 옵션 3 코드 사용

## 설치 단계

1. **캠페이너스 관리자 페이지 접속**
   - 캠페이너스 관리자 계정으로 로그인

2. **페이지 편집 모드 진입**
   - 원하는 페이지의 편집 버튼 클릭

3. **HTML 블록 추가**
   - 컨텐츠 추가 → HTML 블록 선택

4. **코드 붙여넣기**
   - 위의 코드를 복사하여 HTML 편집기에 붙여넣기

5. **저장 및 확인**
   - 저장 후 미리보기로 확인

## 커스터마이징

### 크기 조정
```html
<!-- 너비 조정 -->
<div style="max-width: 800px;">

<!-- 높이 조정 -->
<iframe style="height: 1000px;">
```

### 정렬
```html
<!-- 왼쪽 정렬 -->
<div style="margin: 0;">

<!-- 중앙 정렬 (기본) -->
<div style="margin: 0 auto;">

<!-- 오른쪽 정렬 -->
<div style="margin: 0 0 0 auto;">
```

### 여백 추가
```html
<!-- 상하 여백 추가 -->
<div style="margin: 40px auto;">

<!-- 패딩 추가 -->
<div style="padding: 20px;">
```

## 주요 기능

- **12개 기본 질문**: 정치 역량의 핵심 영역 평가
- **52개 세부 항목**: 구체적인 역량 측정
- **3개 카테고리**: 자기 역량, 지역 활동, 정당 활동
- **실시간 진행률**: 진행 상황 표시
- **상세 결과 분석**: 영역별 점수 및 해설
- **강점/약점 분석**: 70% 이상 달성한 강점과 개선이 필요한 영역 표시
- **모바일 최적화**: 반응형 디자인

## 문제 해결

### 위젯이 표시되지 않는 경우
1. 캠페이너스가 iframe을 허용하는지 확인
2. URL이 올바른지 확인 (https://political-test-three.vercel.app/)
3. 브라우저 콘솔에서 오류 확인

### 스크롤 문제가 있는 경우
1. 제공된 스크립트가 포함되었는지 확인
2. iframe의 scrolling="yes" 속성 확인
3. 캠페이너스 페이지 자체의 스크롤 설정 확인

### 스타일이 깨지는 경우
1. HTML 블록 내에 다른 스타일 코드가 없는지 확인
2. 컨테이너 div의 style 속성 확인

### 모바일에서 문제가 있는 경우
1. viewport 메타 태그 확인
2. 너비를 100%로 설정했는지 확인
3. -webkit-overflow-scrolling: touch 속성 확인

## 지원

- 기술 문의: [이메일 주소]
- 버그 리포트: GitHub Issues
- 업데이트 정보: https://newways.kr

## 라이선스

이 프로젝트는 뉴웨이즈의 소유입니다. 무단 복제 및 배포를 금지합니다.