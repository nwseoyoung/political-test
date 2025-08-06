# 정치 역량 진단 테스트 위젯 사용 방법

## 방법 1: 간단한 iframe 삽입

가장 간단한 방법은 HTML에 직접 iframe을 삽입하는 것입니다:

```html
<!-- 원하는 위치에 이 코드를 붙여넣으세요 -->
<iframe 
    src="https://your-domain.com/political-test-iframe.html" 
    width="100%" 
    height="800" 
    style="border: none; max-width: 600px; margin: 0 auto; display: block;"
    scrolling="no">
</iframe>
```

## 방법 2: 스크립트 태그 사용

더 유연한 방법은 스크립트를 사용하는 것입니다:

```html
<!-- 1. 위젯이 들어갈 위치에 div 추가 -->
<div id="political-test-widget"></div>

<!-- 2. 스크립트 추가 -->
<script>
(function() {
    var widget = document.createElement('iframe');
    widget.src = 'https://your-domain.com/political-test-iframe.html';
    widget.style.width = '100%';
    widget.style.height = '800px';
    widget.style.border = 'none';
    widget.style.maxWidth = '600px';
    widget.style.margin = '0 auto';
    widget.style.display = 'block';
    document.getElementById('political-test-widget').appendChild(widget);
})();
</script>
```

## 방법 3: WordPress 사용자

WordPress에서는 Custom HTML 블록을 사용하세요:

1. 페이지/포스트 편집기에서 블록 추가
2. "Custom HTML" 블록 선택
3. 위의 iframe 코드 붙여넣기

## 방법 4: 반응형 높이 자동 조정

콘텐츠에 따라 높이가 자동 조정되는 버전:

```html
<div id="political-test-widget"></div>
<script>
(function() {
    var widget = document.createElement('iframe');
    widget.src = 'https://your-domain.com/political-test-iframe.html';
    widget.style.width = '100%';
    widget.style.height = '800px';
    widget.style.border = 'none';
    widget.style.maxWidth = '600px';
    widget.style.margin = '0 auto';
    widget.style.display = 'block';
    
    // 높이 자동 조정
    window.addEventListener('message', function(e) {
        if (e.data.type === 'resize' && e.data.height) {
            widget.style.height = e.data.height + 'px';
        }
    });
    
    document.getElementById('political-test-widget').appendChild(widget);
})();
</script>
```

## 방법 5: 팝업 창으로 열기

버튼 클릭 시 팝업으로 열기:

```html
<button onclick="openPoliticalTest()">정치 역량 진단 테스트 시작</button>

<script>
function openPoliticalTest() {
    window.open(
        'https://your-domain.com/political-test-iframe.html',
        'politicalTest',
        'width=650,height=800,scrollbars=yes'
    );
}
</script>
```

## 중요 사항

1. **도메인 변경**: `https://your-domain.com`을 실제 호스팅 도메인으로 변경하세요.
2. **HTTPS 필수**: 보안을 위해 HTTPS 사용을 권장합니다.
3. **반응형 디자인**: 위젯은 모바일에서도 잘 작동하도록 설계되었습니다.

## 스타일 커스터마이징

위젯 주변에 여백이나 테두리를 추가하려면:

```html
<div style="padding: 20px; background: #f5f5f5; border-radius: 10px;">
    <h2 style="text-align: center; margin-bottom: 20px;">정치 역량을 진단해보세요</h2>
    <iframe 
        src="https://your-domain.com/political-test-iframe.html" 
        width="100%" 
        height="800" 
        style="border: none; max-width: 600px; margin: 0 auto; display: block;">
    </iframe>
</div>
```