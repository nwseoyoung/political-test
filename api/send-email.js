// Vercel Serverless Function
// /api/send-email.js

export default async function handler(req, res) {
    // CORS 설정 - 특정 도메인만 허용
    const allowedOrigins = [
        'https://nwseoyoung.github.io',
        'https://political-test.vercel.app',
        'https://political-test-three.vercel.app',
        'https://newways.kr',
        'http://localhost:3000'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const {
        user_name,
        user_email,
        user_phone,
        candidate_intention,
        marketing_agree,
        test_date,
        total_score,
        self_score,
        local_score,
        party_score,
        weakness_message,
        strength_message,
        selected_items
    } = req.body;
    
    // 스티비 API 설정
    const STIBEE_API_KEY = process.env.STIBEE_API_KEY; // Vercel 환경변수에 설정
    const STIBEE_LIST_ID = process.env.STIBEE_LIST_ID; // 스티비 리스트 ID
    
    console.log('Received email request for:', user_email);
    console.log('API Key exists:', !!STIBEE_API_KEY);
    console.log('List ID:', STIBEE_LIST_ID);
    console.log('Custom fields being sent:', {
        test_date,
        total_score,
        self_score,
        local_score,
        party_score,
        weakness_message: weakness_message ? weakness_message.substring(0, 50) + '...' : '',
        strength_message: strength_message ? strength_message.substring(0, 50) + '...' : '',
        candidate_intention,
        marketing_agree,
        selected_items: selected_items ? selected_items.substring(0, 100) + '...' : ''
    });
    
    try {
        // 1. 구독자 추가/업데이트
        const requestBody = {
            subscribers: [{
                email: user_email,
                name: user_name || '',
                phone: user_phone || ''
            }]
        };

        // 커스텀 필드를 구독자 객체의 최상위 레벨에 추가
        requestBody.subscribers[0].test_date = test_date || '';
        requestBody.subscribers[0].total_score = total_score ? total_score.toString() : '0';
        requestBody.subscribers[0].self_score = self_score ? self_score.toString() : '0';
        requestBody.subscribers[0].local_score = local_score ? local_score.toString() : '0';
        requestBody.subscribers[0].party_score = party_score ? party_score.toString() : '0';
        requestBody.subscribers[0].weakness_message = weakness_message || '역량을 더 강화할 수 있는 부분이 있습니다.';
        requestBody.subscribers[0].strength_message = strength_message || '강점 역량을 계속 발전시켜 나가세요.';
        requestBody.subscribers[0].candidate_intention = candidate_intention || '';
        requestBody.subscribers[0].marketing_agree = marketing_agree || 'N';
        requestBody.subscribers[0].selected_items = selected_items || '';

        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        const subscriberResponse = await fetch(
            `https://api.stibee.com/v1/lists/${STIBEE_LIST_ID}/subscribers`,
            {
                method: 'POST',
                headers: {
                    'AccessToken': STIBEE_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            }
        );
        
        if (!subscriberResponse.ok) {
            const errorText = await subscriberResponse.text();
            console.error('Stibee subscriber error:', errorText);
            throw new Error(`Failed to add subscriber: ${errorText}`);
        }
        
        const subscriberData = await subscriberResponse.json();
        console.log('Subscriber added successfully:', subscriberData);
        
        // 2. 태그 추가 - 스티비 v1 API 사용
        try {
            const tagResponse = await fetch(
                `https://api.stibee.com/v1/lists/${STIBEE_LIST_ID}/subscribers/tags`,
                {
                    method: 'POST',
                    headers: {
                        'AccessToken': STIBEE_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        emails: [user_email],
                        tags: ['정치역량테스트완료']
                    })
                }
            );
            
            if (!tagResponse.ok) {
                const errorText = await tagResponse.text();
                console.error('Stibee tag error:', errorText);
                console.log('Tag API failed, but subscriber was added successfully');
                // 태그 추가 실패해도 이메일은 전송 성공으로 처리
            } else {
                console.log('Tag added successfully');
            }
        } catch (tagError) {
            console.error('Tag addition failed:', tagError);
            // 태그 추가 실패해도 계속 진행
        }
        
        res.status(200).json({ success: true, message: 'Email sent successfully' });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}