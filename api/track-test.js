// Vercel Serverless Function
// 테스트 이용 통계 추적 API

export default async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        user_name,
        user_email,
        user_phone,
        marketing_agree,
        test_completed,
        candidate_intention,
        total_score,
        self_score,
        local_score,
        party_score
    } = req.body;

    // Google Apps Script URL (환경변수로 설정)
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    
    try {
        // Google Sheets에 데이터 전송
        if (GOOGLE_SCRIPT_URL) {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    user_name: user_name || '',
                    user_email: user_email || '',
                    user_phone: user_phone || '',
                    marketing_agree: marketing_agree ? 'Y' : 'N',
                    test_completed: test_completed || false,
                    candidate_intention: candidate_intention || '',
                    total_score: total_score || 0,
                    self_score: self_score || 0,
                    local_score: local_score || 0,
                    party_score: party_score || 0
                })
            });

            if (!response.ok) {
                console.error('Google Sheets response not OK:', response.status);
            } else {
                const result = await response.json();
                console.log('Google Sheets save result:', result);
            }
        }

        // 로깅 (Vercel 대시보드에서 확인 가능)
        console.log('Test Tracking:', {
            timestamp: new Date().toISOString(),
            user_name: user_name || 'Anonymous',
            marketing_agree: marketing_agree || false,
            test_completed: test_completed || false,
            candidate_intention: candidate_intention || 'Not specified'
        });
        
        res.status(200).json({ 
            success: true,
            message: 'Test tracked successfully'
        });
        
    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to track test'
        });
    }
}