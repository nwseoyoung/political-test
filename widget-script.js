// 정치 역량 진단 테스트 위젯 삽입 스크립트
// 사용법: 웹사이트의 원하는 위치에 다음 코드를 삽입하세요

(function() {
    // 위젯 설정
    const config = {
        containerId: 'political-test-widget', // 위젯이 들어갈 div의 ID
        iframeUrl: 'https://your-domain.com/political-test-iframe.html', // iframe URL
        height: '800px', // 기본 높이
        maxWidth: '600px', // 최대 너비
        responsive: true // 반응형 높이 조정
    };

    // 위젯 생성 함수
    function createPoliticalTestWidget() {
        const container = document.getElementById(config.containerId);
        if (!container) {
            console.error('정치 역량 진단 테스트: 컨테이너를 찾을 수 없습니다. ID:', config.containerId);
            return;
        }

        // iframe 생성
        const iframe = document.createElement('iframe');
        iframe.src = config.iframeUrl;
        iframe.style.width = '100%';
        iframe.style.height = config.height;
        iframe.style.border = 'none';
        iframe.style.maxWidth = config.maxWidth;
        iframe.style.margin = '0 auto';
        iframe.style.display = 'block';
        iframe.setAttribute('scrolling', 'no');

        // 반응형 높이 조정
        if (config.responsive) {
            window.addEventListener('message', function(e) {
                if (e.data.type === 'resize' && e.data.height) {
                    iframe.style.height = e.data.height + 'px';
                }
            });
        }

        // 컨테이너에 추가
        container.appendChild(iframe);
    }

    // DOM 로드 완료 시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createPoliticalTestWidget);
    } else {
        createPoliticalTestWidget();
    }
})();