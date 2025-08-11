// Vercel Serverless Function
// /api/send-email.js

export default async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
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
        test_date,
        total_score,
        self_score,
        local_score,
        party_score,
        personality_type,
        personality_message,
        selected_self,
        selected_local,
        selected_party
    } = req.body;
    
    // 스티비 API 설정
    const STIBEE_API_KEY = process.env.STIBEE_API_KEY; // Vercel 환경변수에 설정
    const STIBEE_LIST_ID = process.env.STIBEE_LIST_ID; // 스티비 리스트 ID
    
    try {
        // 1. 구독자 추가/업데이트
        const subscriberResponse = await fetch(
            `https://api.stibee.com/v1/lists/${STIBEE_LIST_ID}/subscribers`,
            {
                method: 'POST',
                headers: {
                    'AccessToken': STIBEE_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscribers: [{
                        email: user_email,
                        name: user_name,
                        phone: user_phone,
                        // 커스텀 필드 (스티비에서 미리 생성 필요)
                        customFields: {
                            test_date: test_date,
                            total_score: total_score.toString(),
                            self_score: self_score.toString(),
                            local_score: local_score.toString(),
                            party_score: party_score.toString(),
                            personality_type: personality_type,
                            selected_self: selected_self,
                            selected_local: selected_local,
                            selected_party: selected_party
                        }
                    }]
                })
            }
        );
        
        if (!subscriberResponse.ok) {
            throw new Error('Failed to add subscriber');
        }
        
        // 2. 이메일 발송 (자동 이메일 시퀀스 트리거)
        // 스티비에서 "정치 역량 테스트 완료" 태그를 트리거로 하는 자동 이메일 설정 필요
        const tagResponse = await fetch(
            `https://api.stibee.com/v1/lists/${STIBEE_LIST_ID}/subscribers/tags`,
            {
                method: 'POST',
                headers: {
                    'AccessToken': STIBEE_API_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscribers: [user_email],
                    tag: '정치역량테스트완료'
                })
            }
        );
        
        if (!tagResponse.ok) {
            throw new Error('Failed to add tag');
        }
        
        res.status(200).json({ success: true, message: 'Email sent successfully' });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
}