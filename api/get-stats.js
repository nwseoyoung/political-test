// Vercel Serverless Function
// 관리자용 통계 확인 API

export default async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 간단한 인증 (쿼리 파라미터로 비밀번호 확인)
    const { key } = req.query;
    const ADMIN_KEY = process.env.ADMIN_KEY || 'newways2024'; // Vercel 환경변수에 설정
    
    if (key !== ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // 실제로는 데이터베이스나 Google Sheets에서 데이터를 가져와야 함
        // 임시로 하드코딩된 데이터 반환
        const stats = {
            total_tests: 0,
            completed_tests: 0,
            marketing_agreed: 0,
            candidate_intentions: {
                "언젠가 출마할 것이다": 0,
                "2026 지방선거에 출마할 것이다": 0,
                "출마를 고민하거나 계획하고 있다": 0,
                "출마를 고려하지 않는다": 0
            },
            last_updated: new Date().toISOString(),
            message: "실제 통계는 Google Sheets 또는 데이터베이스 연동 후 확인 가능합니다."
        };

        res.status(200).json(stats);
        
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch stats'
        });
    }
}