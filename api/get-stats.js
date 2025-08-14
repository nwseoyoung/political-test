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

    // Google Apps Script URL (환경변수로 설정)
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    
    try {
        let stats = {
            total_tests: 0,
            completed_tests: 0,
            marketing_agreed: 0,
            candidate_intentions: {
                "언젠가 출마할 것이다": 0,
                "2026 지방선거에 출마할 것이다": 0,
                "출마를 고민하거나 계획하고 있다": 0,
                "출마를 고려하지 않는다": 0
            },
            last_updated: new Date().toISOString()
        };

        // Google Sheets에서 데이터 가져오기
        if (GOOGLE_SCRIPT_URL) {
            try {
                const response = await fetch(`${GOOGLE_SCRIPT_URL}?key=${ADMIN_KEY}`);
                if (response.ok) {
                    const sheetsData = await response.json();
                    // Google Sheets 데이터로 업데이트
                    stats = {
                        ...sheetsData,
                        last_updated: sheetsData.last_updated || new Date().toISOString()
                    };
                } else {
                    console.error('Google Sheets fetch failed:', response.status);
                    stats.message = "Google Sheets 연동 오류. 임시 데이터를 표시합니다.";
                }
            } catch (fetchError) {
                console.error('Google Sheets fetch error:', fetchError);
                stats.message = "Google Sheets 연결 실패. 환경변수를 확인해주세요.";
            }
        } else {
            stats.message = "Google Sheets URL이 설정되지 않았습니다. Vercel 환경변수를 확인해주세요.";
        }

        res.status(200).json(stats);
        
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch stats'
        });
    }
}