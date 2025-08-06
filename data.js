const questionsData = [
    // A. 자기 역량 (18개)
    // 리더십
    {
        id: 1,
        category: "자기 역량",
        subcategory: "리더십",
        question: "대표 혹은 그에 준하는 자격으로 기업 혹은 단체를 '설립'한 경험이 있고 연혁을 3개 이상 말할 수 있다.",
        weight: 3
    },
    {
        id: 2,
        category: "자기 역량",
        subcategory: "리더십",
        question: "대표 혹은 그에 준하는 자격으로 10명 이상의 조직이나 공동체를 '운영'한 경험이 있다.",
        weight: 3
    },
    {
        id: 3,
        category: "자기 역량",
        subcategory: "리더십",
        question: "최근 3년 내 100명 이상의 청중 앞에서 강연이나 연설을 한 경험이 있다.",
        weight: 2
    },
    {
        id: 4,
        category: "자기 역량",
        subcategory: "리더십",
        question: "최근 3년 내 100명 이상의 사람들을 설득해 특정한 성과를 만든 경험이 있다.",
        weight: 3
    },
    {
        id: 5,
        category: "자기 역량",
        subcategory: "리더십",
        question: "음주운전, 성범죄 등의 범죄 사실이 없고 조직이나 공동체에서 윤리적인 문제를 야기한 적이 없다.",
        weight: 5
    },
    // 분야 전문성
    {
        id: 6,
        category: "자기 역량",
        subcategory: "분야 전문성",
        question: "정치를 제외한 특정 분야에서 본업으로 한 1년 이상의 커리어 경력이나 프로젝트 경험을 가지고 있다.",
        weight: 2
    },
    {
        id: 7,
        category: "자기 역량",
        subcategory: "분야 전문성",
        question: "정치를 제외한 특정 전문 분야에서 대표 혹은 그에 준하는 자격으로 수행한 프로젝트의 성공 경험이 있다.",
        weight: 3
    },
    {
        id: 8,
        category: "자기 역량",
        subcategory: "분야 전문성",
        question: "정치를 제외한 특정 분야에 대한 석사 이상의 학위 졸업장을 가지고 있다.",
        weight: 2
    },
    {
        id: 9,
        category: "자기 역량",
        subcategory: "분야 전문성",
        question: "정치를 제외한 특정 분야에서 전문적 지식 혹은 경험을 바탕으로 기고나 인터뷰, 강연, 출판 중 경험이 2번 이상 있다.",
        weight: 2
    },
    // 이슈 전문성
    {
        id: 10,
        category: "자기 역량",
        subcategory: "이슈 전문성",
        question: "특정한 사회 이슈 혹은 의제와 관련된 조직이나 공동체에서 활동 중이다.",
        weight: 2
    },
    {
        id: 11,
        category: "자기 역량",
        subcategory: "이슈 전문성",
        question: "특정한 사회 이슈 혹은 의제와 관련된 조직이나 공동체의 대표 혹은 그에 준하는 자격으로 활동 중이다.",
        weight: 3
    },
    {
        id: 12,
        category: "자기 역량",
        subcategory: "이슈 전문성",
        question: "특정한 사회 이슈 혹은 의제의 당사자로서 활동 중이다.",
        weight: 3
    },
    {
        id: 13,
        category: "자기 역량",
        subcategory: "이슈 전문성",
        question: "특정한 사회 이슈 혹은 의제에 대한 구체적인 해결책과 이를 구현할 수 있는 방법에 대해 설명할 수 있다.",
        weight: 3
    },
    {
        id: 14,
        category: "자기 역량",
        subcategory: "이슈 전문성",
        question: "사회 이슈에 대해 작은 성과라도 구체적인 해결책을 만든 경험이 있고 나의 기여에 대해 증명할 수 있다.",
        weight: 3
    },
    {
        id: 15,
        category: "자기 역량",
        subcategory: "이슈 전문성",
        question: "시민단체, 언론 등 특정한 사회적 이슈 혹은 의제와 관련한 네트워크를 3개 이상 알고 있고 협업해본 경험이 있다.",
        weight: 2
    },
    {
        id: 16,
        category: "자기 역량",
        subcategory: "이슈 전문성",
        question: "특정한 사회 이슈에 대해 기고나 인터뷰, 강연, 출판 중 경험이 2번 이상 있다.",
        weight: 2
    },
    // 영향력
    {
        id: 17,
        category: "자기 역량",
        subcategory: "영향력",
        question: "5천 명 이상의 팔로워를 보유한 소셜미디어 계정을 1개 이상 가지고 있다.",
        weight: 2
    },
    {
        id: 18,
        category: "자기 역량",
        subcategory: "영향력",
        question: "라디오, TV 방송, 유튜브 채널 등에 꾸준히 패널로 출연하거나 신문 매체에서 꾸준히 칼럼을 기고하고 있다.",
        weight: 3
    },
    
    // B. 지역 활동 (19개)
    // 지역 이해
    {
        id: 19,
        category: "지역 활동",
        subcategory: "지역 이해",
        question: "출마 지역의 선거인 수와 성별/연령 비율, 가구 구성 등 특성에 대해 읍면동별로 설명할 수 있다.",
        weight: 3
    },
    {
        id: 20,
        category: "지역 활동",
        subcategory: "지역 이해",
        question: "출마 지역의 최근 3년 내 역대 선거 결과와 특징에 대해 읍면동별로 설명할 수 있다.",
        weight: 3
    },
    {
        id: 21,
        category: "지역 활동",
        subcategory: "지역 이해",
        question: "출마 지역의 주요 현안과 여론에 대해 3개 이상 구체적으로 설명할 수 있다.",
        weight: 3
    },
    // 지역 의제
    {
        id: 22,
        category: "지역 활동",
        subcategory: "지역 의제",
        question: "현재 출마 지역 내 특정한 이슈 해결과 관련된 조직이나 공동체에서 활동 중이다.",
        weight: 2
    },
    {
        id: 23,
        category: "지역 활동",
        subcategory: "지역 의제",
        question: "현재 출마 지역 내 특정한 이슈 해결과 관련된 조직이나 공동체의 대표 혹은 그에 준하는 자격으로 활동 중이다.",
        weight: 3
    },
    {
        id: 24,
        category: "지역 활동",
        subcategory: "지역 의제",
        question: "출마 지역 내 특정한 이슈의 당사자로서 활동 중이다.",
        weight: 3
    },
    {
        id: 25,
        category: "지역 활동",
        subcategory: "지역 의제",
        question: "출마 지역 내 특정한 이슈 해결에 대한 구체적인 해결책과 실현할 수 있는 방법을 설명할 수 있다.",
        weight: 3
    },
    {
        id: 26,
        category: "지역 활동",
        subcategory: "지역 의제",
        question: "지역에서 작은 성과라도 구체적인 해결책을 만든 경험이 있고 나의 기여에 대해 증명할 수 있다.",
        weight: 3
    },
    {
        id: 27,
        category: "지역 활동",
        subcategory: "지역 의제",
        question: "출마 지역 내 시민단체, 언론 등 특정한 사회적 이슈 혹은 의제와 관련한 네트워크를 3개 이상 알고 있고 협업해본 경험이 있다.",
        weight: 2
    },
    {
        id: 28,
        category: "지역 활동",
        subcategory: "지역 의제",
        question: "출마 지역 내 특정한 문제를 해결하는 과정에서 지역 언론에 기고나 인터뷰한 경험이 1번 이상 있다.",
        weight: 2
    },
    // 지역 활동
    {
        id: 29,
        category: "지역 활동",
        subcategory: "지역 활동",
        question: "출마 지역 내 주민자치회, 자율방법대 등 마을자치기구 또는 지역봉사단체에서 최소 월 1회, 3개월 이상 꾸준히 활동 중이다.",
        weight: 2
    },
    {
        id: 30,
        category: "지역 활동",
        subcategory: "지역 활동",
        question: "출마 지역 내 아파트주민자치회, 학부모위원회 등 주요 지역 커뮤니티에서 대표 혹은 그에 준하는 자격으로 활동 중이다.",
        weight: 3
    },
    {
        id: 31,
        category: "지역 활동",
        subcategory: "지역 활동",
        question: "출마 지역 내 소모임, 커뮤니티, 프로젝트에 최소 월 1회, 3개월 이상 꾸준히 활동 중이다.",
        weight: 2
    },
    {
        id: 32,
        category: "지역 활동",
        subcategory: "지역 활동",
        question: "출마 지역 내 종교단체에 월 1회, 3개월 이상 꾸준히 참여하고 있다.",
        weight: 1
    },
    {
        id: 33,
        category: "지역 활동",
        subcategory: "지역 활동",
        question: "출마 지역 내 교류하고 있는 직능단체, 관변단체, 시민사회단체 등이 5개 이상 있다.",
        weight: 2
    },
    {
        id: 34,
        category: "지역 활동",
        subcategory: "지역 활동",
        question: "출마 지역 내 공공기관 혹은 민간기관에서 1년 이상 생업으로 일한 경험이 있다.",
        weight: 2
    },
    // 지역 네트워크
    {
        id: 35,
        category: "지역 활동",
        subcategory: "지역 네트워크",
        question: "출마 지역에 살거나, 학업 및 생업 활동을 하고 있거나, 활동을 꾸준히 출마 지역에서 하고 있다.",
        weight: 3
    },
    {
        id: 36,
        category: "지역 활동",
        subcategory: "지역 네트워크",
        question: "출마 지역에 내가 졸업한 초등학교, 중학교, 고등학교, 대학교가 1개 이상 있다.",
        weight: 2
    },
    {
        id: 37,
        category: "지역 활동",
        subcategory: "지역 네트워크",
        question: "나의 부모나 배우자/파트너, 자녀가 출마 지역에 살거나 학업 및 생업 혹은 활동 기반을 출마 지역에 두고 있다.",
        weight: 2
    },
    
    // C. 정당 활동 (15개)
    // 정당 이해
    {
        id: 38,
        category: "정당 활동",
        subcategory: "정당 이해",
        question: "당의 강령과 당헌, 당규를 모두 읽었고 당의 가치와 이념에 대해 설명할 수 있다.",
        weight: 3
    },
    {
        id: 39,
        category: "정당 활동",
        subcategory: "정당 이해",
        question: "소속 정당의 주요 역사와 인물, 성과와 과오에 대해 설명할 수 있다.",
        weight: 2
    },
    {
        id: 40,
        category: "정당 활동",
        subcategory: "정당 이해",
        question: "소속 정당의 조직도와 의사결정 체계를 이해하고 설명할 수 있다.",
        weight: 2
    },
    {
        id: 41,
        category: "정당 활동",
        subcategory: "정당 이해",
        question: "소속 정당의 출마단위별 공천 조건과 공천권의 결정 구조에 대해 이해하고 설명할 수 있다.",
        weight: 3
    },
    // 정당 현안
    {
        id: 42,
        category: "정당 활동",
        subcategory: "정당 현안",
        question: "소속 정당이 최근 1년 이내 집중한 주요 정책을 설명할 수 있다.",
        weight: 2
    },
    {
        id: 43,
        category: "정당 활동",
        subcategory: "정당 현안",
        question: "주 1회 이상 언론 기사와 당의 논평을 통해 소속 정당의 현안을 파악하고 있다.",
        weight: 2
    },
    {
        id: 44,
        category: "정당 활동",
        subcategory: "정당 현안",
        question: "지역구 내 주요 현안이나 이슈에 대한 소속 정당의 입장 혹은 대안을 3개 이상 설명할 수 있다.",
        weight: 3
    },
    // 정당 활동
    {
        id: 45,
        category: "정당 활동",
        subcategory: "정당 활동",
        question: "나는 권리당원, 책임당원, 당권자 등 의결권이 있는 당원이다.",
        weight: 3
    },
    {
        id: 46,
        category: "정당 활동",
        subcategory: "정당 활동",
        question: "나는 최근 공직 선거에서 특정한 역할을 임명 받아 선거 운동에 참여한 경험이 있다.",
        weight: 2
    },
    {
        id: 47,
        category: "정당 활동",
        subcategory: "정당 활동",
        question: "최근 2년 이내 중앙당에서 특정 역할을 임명 받아 활동한 경험이 있고 이를 증명할 수 있다.",
        weight: 3
    },
    {
        id: 48,
        category: "정당 활동",
        subcategory: "정당 활동",
        question: "최근 2년 이내 시도당에서 특정 역할을 임명 받아 활동한 경험이 있고 이를 증명할 수 있다.",
        weight: 2
    },
    {
        id: 49,
        category: "정당 활동",
        subcategory: "정당 활동",
        question: "최근 2년 이내 지역위원회 특정 역할을 임명 받아 활동한 경험이 있고 이를 증명할 수 있다.",
        weight: 2
    },
    // 정당 네트워크
    {
        id: 50,
        category: "정당 활동",
        subcategory: "정당 네트워크",
        question: "중앙당, 시도당, 지역/당협위원회 내 당직자 중 의논하거나 조언을 받을 수 있는 신뢰 관계가 2명 이상 있다.",
        weight: 2
    },
    {
        id: 51,
        category: "정당 활동",
        subcategory: "정당 네트워크",
        question: "지역구의 전・현직 의원들과 알고 있으며 의논하거나 조언을 받을 수 있는 신뢰 관계가 2명 이상 있다.",
        weight: 3
    },
    {
        id: 52,
        category: "정당 활동",
        subcategory: "정당 네트워크",
        question: "당 내 경선 시 나를 지지할만한 당원이 50명 이상이다.",
        weight: 3
    }
];