# Google Sheets 연동 가이드

## 1. Google Sheets 준비

### 1.1 새 스프레드시트 생성
1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 생성
3. 시트 이름: "정치역량테스트_데이터"

### 1.2 컬럼 헤더 설정
첫 번째 행에 다음 헤더 추가:
```
A1: 타임스탬프
B1: 이름
C1: 이메일
D1: 연락처
E1: 출마의사
F1: 마케팅동의
G1: 총점수
H1: 자기역량
I1: 지역활동
J1: 정당활동
K1: 유형
L1: 접속도메인
```

## 2. Google Apps Script 설정

### 2.1 Apps Script 생성
1. 스프레드시트 메뉴 → 확장 프로그램 → Apps Script
2. 기본 코드 삭제
3. 아래 코드 붙여넣기:

```javascript
// Google Apps Script 코드
function doPost(e) {
  try {
    // 스프레드시트 ID (URL에서 확인)
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 새 행 추가
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.candidateIntention || '',
      data.marketingAgree || 'N',
      data.totalScore || '',
      data.selfScore || '',
      data.localScore || '',
      data.partyScore || '',
      data.personalityType || '',
      data.source || ''
    ]);
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'timestamp': new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 테스트용 GET 함수
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      'status': 'API is working',
      'method': 'GET'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 2.2 스프레드시트 ID 설정
1. 스프레드시트 URL 확인:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
2. `YOUR_SPREADSHEET_ID`를 실제 ID로 교체

### 2.3 웹 앱으로 배포
1. Apps Script 에디터에서 "배포" → "새 배포"
2. 설정:
   - 유형: 웹 앱
   - 설명: 정치역량테스트 데이터 수집
   - 실행: 나
   - 액세스: 모든 사용자
3. "배포" 클릭
4. **웹 앱 URL 복사** (중요!)

## 3. 웹사이트 연동

### 3.1 app.js 수정
```javascript
// app.js의 sendToGoogleSheets 함수에서
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```
위 부분을 복사한 웹 앱 URL로 교체

### 3.2 데이터 전송 추가
결과 계산 시 Google Sheets로도 데이터 전송:
```javascript
// calculateResults 함수 내에 추가
const googleData = {
    timestamp: new Date().toISOString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    candidateIntention: user.candidateIntention,
    marketingAgree: user.marketingAgree ? 'Y' : 'N',
    totalScore: totalScore,
    selfScore: selfScore,
    localScore: localScore,
    partyScore: partyScore,
    personalityType: personalityType.type,
    source: window.location.hostname
};

sendToGoogleSheets(googleData);
```

## 4. 대시보드 구성

### 4.1 요약 시트 추가
새 시트 탭 생성: "대시보드"

### 4.2 주요 지표 수식
```
총 참여자 수: =COUNTA(데이터!B:B)-1
오늘 참여자: =COUNTIF(데이터!A:A,">="&TODAY())
평균 점수: =AVERAGE(데이터!G:G)
```

### 4.3 출마 의사 분석
```
=COUNTIF(데이터!E:E,"2026 지방선거에 출마할 것이다")
=COUNTIF(데이터!E:E,"언젠가 출마할 것이다")
=COUNTIF(데이터!E:E,"출마를 고민하거나 계획하고 있다")
=COUNTIF(데이터!E:E,"출마를 고려하지 않는다")
```

### 4.4 차트 생성
1. 삽입 → 차트
2. 차트 유형 선택:
   - 출마 의사: 원형 차트
   - 일별 참여자: 선 그래프
   - 점수 분포: 히스토그램

## 5. 보안 및 권한

### 5.1 시트 보호
1. 데이터 → 보호된 시트 및 범위
2. 편집 권한 설정

### 5.2 공유 설정
1. 공유 버튼 클릭
2. 특정 사용자만 편집 가능
3. 링크 공유: 보기 전용

## 6. 테스트

### 6.1 API 테스트
브라우저에서 웹 앱 URL 접속:
```
{"status":"API is working","method":"GET"}
```

### 6.2 데이터 전송 테스트
1. 테스트 페이지에서 양식 작성
2. Google Sheets 확인
3. 새 행 추가 확인

## 7. 문제 해결

### CORS 에러
- Apps Script는 CORS를 자동 처리
- `mode: 'no-cors'` 사용

### 권한 오류
- 배포 설정에서 "모든 사용자" 선택 확인
- 새로 배포 시 URL 변경 주의

### 데이터 누락
- 컬럼 순서 확인
- 타임존 설정 확인

## 8. 추가 기능

### 8.1 이메일 알림
```javascript
// Apps Script에 추가
if (data.candidateIntention === "2026 지방선거에 출마할 것이다") {
  MailApp.sendEmail({
    to: "admin@newways.kr",
    subject: "2026 출마 의사자 등록",
    body: `이름: ${data.name}\n이메일: ${data.email}`
  });
}
```

### 8.2 자동 백업
- Google Drive에 자동 백업
- 주간/월간 리포트 생성

## 9. 유지보수

- 매주 데이터 검토
- 월별 백업
- 분기별 대시보드 업데이트