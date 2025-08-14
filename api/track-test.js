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
        marketing_agree,
        test_completed,
        candidate_intention
    } = req.body;

    // Google Sheets API를 사용한 통계 저장
    // 또는 Vercel KV, Supabase 등을 사용할 수 있음
    
    try {
        // 간단한 로깅 (Vercel 대시보드에서 확인 가능)
        console.log('Test Tracking:', {
            timestamp: new Date().toISOString(),
            user_name: user_name || 'Anonymous',
            marketing_agree: marketing_agree || false,
            test_completed: test_completed || false,
            candidate_intention: candidate_intention || 'Not specified'
        });

        // Google Sheets 또는 데이터베이스에 저장하는 로직을 추가할 수 있습니다
        // 예: Google Sheets API 호출
        
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