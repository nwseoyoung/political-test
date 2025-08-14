# Google Sheets 연동 설정 가이드

## 1. Google Sheets 생성
1. Google Drive에서 새 스프레드시트 생성
2. 시트 이름을 "정치역량테스트_통계"로 변경
3. 첫 번째 행에 다음 헤더 추가:
   - A1: 타임스탬프
   - B1: 이름
   - C1: 이메일
   - D1: 전화번호
   - E1: 출마의향
   - F1: 마케팅동의
   - G1: 테스트완료
   - H1: 총점
   - I1: 자기역량
   - J1: 지역활동
   - K1: 정당활동

## 2. Google Apps Script 설정

### 2-1. Apps Script 열기
1. 스프레드시트에서 확장 프로그램 > Apps Script 클릭
2. 기존 코드 모두 삭제

### 2-2. 아래 코드 붙여넣기:

```javascript
function doPost(e) {
  try {
    // 스프레드시트 열기
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 현재 시간
    const timestamp = new Date();
    
    // 새 행 추가
    sheet.appendRow([
      timestamp,
      data.user_name || '',
      data.user_email || '',
      data.user_phone || '',
      data.candidate_intention || '',
      data.marketing_agree || 'N',
      data.test_completed || false,
      data.total_score || 0,
      data.self_score || 0,
      data.local_score || 0,
      data.party_score || 0
    ]);
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'row': sheet.getLastRow()
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

function doGet(e) {
  try {
    // 관리자 키 확인
    const adminKey = e.parameter.key;
    if (adminKey !== 'newways2024') {
      return ContentService
        .createTextOutput(JSON.stringify({
          'error': 'Unauthorized'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // 스프레드시트 데이터 읽기
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // 헤더 제외하고 데이터 처리
    const rows = data.slice(1);
    
    // 통계 계산
    let totalTests = 0;
    let completedTests = 0;
    let marketingAgreed = 0;
    const intentions = {};
    
    rows.forEach(row => {
      if (row[0]) { // 타임스탬프가 있는 행만
        totalTests++;
        
        if (row[6] === true || row[6] === 'true') {
          completedTests++;
        }
        
        if (row[5] === 'Y') {
          marketingAgreed++;
        }
        
        const intention = row[4] || '미선택';
        intentions[intention] = (intentions[intention] || 0) + 1;
      }
    });
    
    // 통계 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'total_tests': totalTests,
        'completed_tests': completedTests,
        'marketing_agreed': marketingAgreed,
        'candidate_intentions': intentions,
        'last_updated': new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2-3. 배포 설정
1. 저장 (Ctrl+S 또는 Cmd+S)
2. 배포 > 새 배포 클릭
3. 톱니바퀴 아이콘 > 웹앱 선택
4. 다음과 같이 설정:
   - 설명: 정치역량테스트 API
   - 실행: 나
   - 액세스 권한: 모든 사용자
5. 배포 클릭
6. 권한 승인 (처음만)
7. **웹앱 URL 복사** (매우 중요!)

## 3. 웹앱 URL 적용

복사한 웹앱 URL을 다음 파일들에 적용:

### app.js 수정
```javascript
// 기존 코드
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

// 수정 후 (실제 URL로 교체)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/[your-script-id]/exec';
```

### api/track-test.js 수정
Google Sheets API 호출 추가

### api/get-stats.js 수정
Google Sheets에서 통계 가져오기

## 4. 테스트
1. 테스트 페이지에서 테스트 진행
2. Google Sheets에 데이터가 추가되는지 확인
3. 관리자 통계 페이지에서 실시간 데이터 확인

## 주의사항
- Google Apps Script URL은 절대 공개하지 마세요
- 스프레드시트 ID도 비공개로 유지하세요
- 필요시 관리자 키를 변경하세요