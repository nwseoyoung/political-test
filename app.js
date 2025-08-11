const { useState, useEffect } = React;

// EmailJS 초기화 (실제 PUBLIC_KEY로 교체 필요)
if (typeof emailjs !== 'undefined') {
    emailjs.init("YOUR_PUBLIC_KEY"); // email-config.js의 PUBLIC_KEY 값으로 교체
}

function App() {
    const [currentScreen, setCurrentScreen] = useState('start');
    const [currentBaseQuestion, setCurrentBaseQuestion] = useState(0);
    const [selectedDetails, setSelectedDetails] = useState({});
    const [hasSelectedNone, setHasSelectedNone] = useState(false);
    const [allSelectedDetails, setAllSelectedDetails] = useState({});
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [targetArticle, setTargetArticle] = useState('');

    const handleStart = () => {
        // 유효성 검사
        if (!userInfo.name || !userInfo.phone || !userInfo.email) {
            alert('모든 정보를 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userInfo.email)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            return;
        }
        
        // 정보 저장
        localStorage.setItem('testUserInfo', JSON.stringify(userInfo));
        setCurrentScreen('quiz');
    };

    const handleDetailToggle = (questionId) => {
        if (hasSelectedNone) {
            setHasSelectedNone(false);
            setSelectedDetails({ [questionId]: true });
        } else {
            setSelectedDetails({
                ...selectedDetails,
                [questionId]: !selectedDetails[questionId]
            });
        }
    };

    const handleNoneSelected = () => {
        setSelectedDetails({});
        setHasSelectedNone(true);
    };

    const handleNext = () => {
        // 현재 선택사항을 전체 선택사항에 저장
        const updatedAll = { ...allSelectedDetails, ...selectedDetails };
        setAllSelectedDetails(updatedAll);
        
        if (currentBaseQuestion < baseQuestions.length - 1) {
            setCurrentBaseQuestion(currentBaseQuestion + 1);
            setSelectedDetails({});
            setHasSelectedNone(false);
        } else {
            calculateResults();
        }
    };

    const handlePrevious = () => {
        if (currentBaseQuestion > 0) {
            // 현재 선택사항을 전체 선택사항에 저장
            const updatedAll = { ...allSelectedDetails, ...selectedDetails };
            setAllSelectedDetails(updatedAll);
            
            // 이전 페이지로 이동
            const prevQuestion = currentBaseQuestion - 1;
            setCurrentBaseQuestion(prevQuestion);
            
            // 이전 페이지의 선택사항 복원
            const prevQuestionDetails = {};
            let hasNone = false;
            baseQuestions[prevQuestion].detailQuestions.forEach(detailQ => {
                if (updatedAll[detailQ.id]) {
                    prevQuestionDetails[detailQ.id] = true;
                }
            });
            
            // 선택된 항목이 없으면 "해당항목 없음"이 선택된 것
            if (Object.keys(prevQuestionDetails).length === 0) {
                hasNone = true;
            }
            
            setSelectedDetails(prevQuestionDetails);
            setHasSelectedNone(hasNone);
        }
    };

    const calculateResults = () => {
        setCurrentScreen('result');
        
        // 점수 계산
        const totalScore = getTotalAnsweredCount();
        const selfScore = getCategoryScore('자기 역량');
        const localScore = getCategoryScore('지역 활동');
        const partyScore = getCategoryScore('정당 활동');
        
        // 결과를 localStorage에 저장
        const resultData = {
            date: new Date().toISOString(),
            allSelectedDetails,
            totalScore,
            selfScore,
            localScore,
            partyScore
        };
        localStorage.setItem('politicalTestResult', JSON.stringify(resultData));
        
        // 이메일 전송 (EmailJS 설정이 있는 경우)
        sendResultEmail(totalScore, selfScore, localScore, partyScore);
    };
    
    const sendResultEmail = (totalScore, selfScore, localScore, partyScore) => {
        // EmailJS가 로드되었고 사용자 정보가 있는 경우에만 전송
        if (typeof emailjs === 'undefined') {
            console.log('EmailJS가 설정되지 않았습니다.');
            return;
        }
        
        const savedUserInfo = localStorage.getItem('testUserInfo');
        if (!savedUserInfo) return;
        
        const user = JSON.parse(savedUserInfo);
        const personalityType = getPersonalityTypeForEmail(selfScore, localScore, partyScore);
        
        // 선택한 문항들을 카테고리별로 정리
        const selectedItemsByCategory = getSelectedItemsByCategory();
        
        const templateParams = {
            user_name: user.name,
            user_email: user.email,
            user_phone: user.phone,
            test_date: new Date().toLocaleDateString('ko-KR'),
            total_score: totalScore,
            self_score: selfScore,
            local_score: localScore,
            party_score: partyScore,
            personality_type: personalityType.type,
            personality_message: personalityType.message,
            test_url: window.location.href,
            guide_url: 'https://newwayskr.notion.site/249441828a8280c58a57c9d75b8cd1d3',
            bootcamp_url: 'https://newways.kr/1daybootcamp?utm_source=homepage&utm_medium=email&utm_campaign=1daycamp_selfcheck&utm_content=250813',
            selected_self: selectedItemsByCategory.self.join('\n'),
            selected_local: selectedItemsByCategory.local.join('\n'),
            selected_party: selectedItemsByCategory.party.join('\n')
        };
        
        // EmailJS로 이메일 전송 (SERVICE_ID와 TEMPLATE_ID 교체 필요)
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then((response) => {
                console.log('이메일 전송 성공!', response.status, response.text);
            })
            .catch((error) => {
                console.log('이메일 전송 실패:', error);
            });
    };
    
    const getSelectedItemsByCategory = () => {
        const selectedItems = {
            self: [],
            local: [],
            party: []
        };
        
        baseQuestions.forEach(baseQ => {
            baseQ.detailQuestions.forEach(detailQ => {
                if (allSelectedDetails[detailQ.id]) {
                    const itemText = `• ${detailQ.text}`;
                    
                    if (baseQ.category === '자기 역량') {
                        selectedItems.self.push(itemText);
                    } else if (baseQ.category === '지역 활동') {
                        selectedItems.local.push(itemText);
                    } else if (baseQ.category === '정당 활동') {
                        selectedItems.party.push(itemText);
                    }
                }
            });
        });
        
        // 선택한 항목이 없는 경우 처리
        if (selectedItems.self.length === 0) selectedItems.self.push('• 선택한 항목 없음');
        if (selectedItems.local.length === 0) selectedItems.local.push('• 선택한 항목 없음');
        if (selectedItems.party.length === 0) selectedItems.party.push('• 선택한 항목 없음');
        
        return selectedItems;
    };
    
    const getPersonalityTypeForEmail = (selfScore, localScore, partyScore) => {
        const selfHigh = selfScore >= 9;
        const localHigh = localScore >= 10;
        const partyHigh = partyScore >= 8;
        
        if (selfHigh && localHigh && partyHigh) {
            return {
                type: '출마 준비를 마쳤습니다',
                message: '모든 역량이 준비되었습니다! 출마를 고려해보세요.'
            };
        } else if (selfHigh && !localHigh && partyHigh) {
            return {
                type: '비례 영입인재',
                message: '정당활동은 부족하지만 전문성이 뛰어납니다.'
            };
        } else if (selfHigh && localHigh && !partyHigh) {
            return {
                type: '지역 영입인재',
                message: '정당활동은 부족하지만 역량이 우수합니다.'
            };
        } else if (selfHigh && !localHigh && !partyHigh) {
            return {
                type: '당 리더십, 청년위원장형 인재',
                message: '정당 내 활동에 강점이 있습니다.'
            };
        } else if (!selfHigh && !localHigh && partyHigh) {
            return {
                type: '정당활동만 치우친 유형',
                message: '더 많은 준비가 필요합니다. 본인만의 전문 역량을 길러보세요.'
            };
        } else if (!selfHigh && localHigh && !partyHigh) {
            return {
                type: '선택과 집중, 리더십 만들기',
                message: '리더십, 전문성 등 특정 영역에 집중해 역량을 키워보세요.'
            };
        } else if (!selfHigh && !localHigh && !partyHigh) {
            return {
                type: '자기역량부터 만들기',
                message: '나만의 전문성부터 차근차근 쌓아가세요.'
            };
        } else {
            return {
                type: '선택과 집중, 전문성 만들기',
                message: '리더십, 전문성 등 특정 영역에 집중해 역량을 키워보세요.'
            };
        }
    };

    const handleInterpretationClick = (articleUrl) => {
        setTargetArticle(articleUrl);
        setShowInfoModal(true);
    };

    const handleInfoSubmit = (e) => {
        e.preventDefault();
        
        // 유효성 검사
        if (!userInfo.name || !userInfo.phone || !userInfo.email) {
            alert('모든 정보를 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userInfo.email)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            return;
        }
        
        // 정보 저장
        const userData = {
            ...userInfo,
            testDate: new Date().toISOString(),
            testResult: localStorage.getItem('politicalTestResult')
        };
        localStorage.setItem('userInfo', JSON.stringify(userData));
        
        // 해설 페이지로 이동
        window.open(targetArticle, '_blank');
        setShowInfoModal(false);
        setUserInfo({ name: '', phone: '', email: '' });
    };


    const getTotalAnsweredCount = () => {
        let count = 0;
        baseQuestions.forEach(baseQ => {
            baseQ.detailQuestions.forEach(detailQ => {
                if (allSelectedDetails[detailQ.id]) {
                    count++;
                }
            });
        });
        return count;
    };

    const getCategoryScore = (category) => {
        let count = 0;
        baseQuestions.forEach(baseQ => {
            if (baseQ.category === category) {
                baseQ.detailQuestions.forEach(detailQ => {
                    if (allSelectedDetails[detailQ.id]) {
                        count++;
                    }
                });
            }
        });
        return count;
    };

    const renderStartScreen = () => (
        <div className="start-screen">
            <div className="start-content">
                <img src="images/mate-character-2.png" alt="뉴웨이즈 메이트" className="mate-character-intro" />
                <p className="start-subtitle">나는 지금 얼마나 준비됐을까?</p>
                <h1 className="start-title">정치인 역량 테스트</h1>
                <p className="start-description">
                    전현직 젊치인의 자문을 받아 구성한 정치인 역량 테스트로 체크해 보세요.
                    어떤 역량을 키워야 할지 스스로 목표를 세울 수 있어요.
                </p>
                
                <div className="user-info-section">
                    <p className="info-title">진단 결과를 보내드릴게요</p>
                    <div className="info-form-inline">
                        <input
                            type="text"
                            placeholder="이름"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                            className="start-input"
                        />
                        <input
                            type="email"
                            placeholder="이메일"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                            className="start-input"
                        />
                        <input
                            type="tel"
                            placeholder="연락처"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                            className="start-input"
                        />
                    </div>
                </div>

                <button className="start-btn" onClick={handleStart}>
                    진단 시작하기
                </button>
                
                <div className="competency-intro-small">
                    <div className="competency-mini">
                        <strong>자기 역량</strong>
                        <span>리더십, 전문성, 영향력</span>
                    </div>
                    <div className="competency-mini">
                        <strong>지역 활동</strong>
                        <span>지역 이해도, 네트워크</span>
                    </div>
                    <div className="competency-mini">
                        <strong>정당 활동</strong>
                        <span>정당 이해, 활동 경험</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderQuiz = () => {
        const baseQuestion = baseQuestions[currentBaseQuestion];
        const progress = ((currentBaseQuestion + 1) / baseQuestions.length) * 100;
        
        const hasSelection = Object.keys(selectedDetails).length > 0 || hasSelectedNone;

        return (
            <div className="quiz-container">
                <div className="quiz-header-fixed">
                    <div className="progress-info">
                        <span className="category-info">{baseQuestion.category}</span>
                        <span>{currentBaseQuestion + 1}/12</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="question-header">
                        <h2 className="question-text">{baseQuestion.question}</h2>
                        <p className="question-hint">해당되는 항목을 모두 선택하세요</p>
                    </div>
                </div>

                <div className="quiz-content">
                    <div className="option-list">
                        {baseQuestion.detailQuestions.map((detail) => (
                            <div 
                                key={detail.id}
                                className={`option-item ${selectedDetails[detail.id] ? 'selected' : ''}`}
                                onClick={() => handleDetailToggle(detail.id)}
                            >
                                <span className="option-text">{detail.text}</span>
                                <div className="option-checkbox"></div>
                            </div>
                        ))}
                        <div 
                            className={`option-item ${hasSelectedNone ? 'selected' : ''}`}
                            onClick={handleNoneSelected}
                        >
                            <span className="option-text">해당항목 없음</span>
                            <div className="option-checkbox"></div>
                        </div>
                    </div>
                </div>

                <div className="navigation">
                    <button 
                        className="nav-btn" 
                        onClick={handlePrevious}
                        disabled={currentBaseQuestion === 0}
                    >
                        이전
                    </button>
                    <button 
                        className="nav-btn primary" 
                        onClick={handleNext}
                        disabled={!hasSelection}
                    >
                        {currentBaseQuestion === baseQuestions.length - 1 ? '결과 보기' : '다음 질문'}
                    </button>
                </div>
            </div>
        );
    };

    const getPersonalityType = () => {
        const selfScore = getCategoryScore('자기 역량');
        const localScore = getCategoryScore('지역 활동');
        const partyScore = getCategoryScore('정당 활동');
        
        const selfHigh = selfScore >= 9;
        const localHigh = localScore >= 10;
        const partyHigh = partyScore >= 8;
        
        // 유형 판정 로직
        if (selfHigh && localHigh && partyHigh) {
            return {
                type: '출마 준비를 마쳤습니다',
                icon: '🏆',
                message: '모든 역량이 준비되었습니다! 출마를 고려해보세요.',
                color: '#DAE000'
            };
        } else if (selfHigh && !localHigh && partyHigh) {
            return {
                type: '비례 영입인재',
                icon: '⚖️',
                message: '정당활동은 부족하지만 전문성이 뛰어납니다.',
                color: '#DAE000'
            };
        } else if (selfHigh && localHigh && !partyHigh) {
            return {
                type: '지역 영입인재',
                icon: '🏘️',
                message: '정당활동은 부족하지만 역량이 우수합니다.',
                color: '#DAE000'
            };
        } else if (selfHigh && !localHigh && !partyHigh) {
            return {
                type: '당 리더십, 청년위원장형 인재',
                icon: '🎯',
                message: '정당 내 활동에 강점이 있습니다.',
                color: '#DAE000'
            };
        } else if (!selfHigh && !localHigh && partyHigh) {
            return {
                type: '정당활동만 치우친 유형',
                icon: '⚠️',
                message: '더 많은 준비가 필요합니다. 본인만의 전문 역량을 길러보세요.',
                color: '#FFA500'
            };
        } else if (!selfHigh && localHigh && !partyHigh) {
            return {
                type: '선택과 집중, 리더십 만들기',
                icon: '🎪',
                message: '리더십, 전문성 등 특정 영역에 집중해 역량을 키워보세요.',
                color: '#87CEEB'
            };
        } else if (!selfHigh && !localHigh && !partyHigh) {
            return {
                type: '자기역량부터 만들기',
                icon: '🌱',
                message: '나만의 전문성부터 차근차근 쌓아가세요.',
                color: '#9370DB'
            };
        } else {
            return {
                type: '선택과 집중, 전문성 만들기',
                icon: '📚',
                message: '리더십, 전문성 등 특정 영역에 집중해 역량을 키워보세요.',
                color: '#87CEEB'
            };
        }
    };

    const renderResult = () => {
        const today = new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace('.', '');

        const totalScore = getTotalAnsweredCount();
        const personalityType = getPersonalityType();
        
        return (
            <div className="result-screen">
                <div className="result-header">
                    <img src="images/mate-character-1.png" alt="뉴웨이즈 메이트" className="mate-character-result" />
                    <div className="personality-type" style={{marginTop: '20px', marginBottom: '30px'}}>
                        <div className="type-icon" style={{fontSize: '3rem', marginBottom: '15px'}}>{personalityType.icon}</div>
                        <h2 className="type-title" style={{fontSize: '1.8rem', fontWeight: '700', color: personalityType.color, marginBottom: '10px'}}>
                            {personalityType.type}
                        </h2>
                        <p className="type-message" style={{fontSize: '1.1rem', opacity: '0.9', lineHeight: '1.6'}}>
                            {personalityType.message}
                        </p>
                    </div>
                    <div className="total-score">{totalScore}/52</div>
                </div>

                <div className="score-cards">
                    <div className={`score-card ${getCategoryScore('자기 역량') >= 9 ? 'high-score' : 'low-score'}`}>
                        <h3>자기 역량</h3>
                        <div className="score-value">{getCategoryScore('자기 역량')}/18</div>
                        <div className="score-indicator" style={{
                            backgroundColor: getCategoryScore('자기 역량') >= 9 ? '#DAE000' : '#666'
                        }}></div>
                    </div>
                    <div className={`score-card ${getCategoryScore('지역 활동') >= 10 ? 'high-score' : 'low-score'}`}>
                        <h3>지역 활동</h3>
                        <div className="score-value">{getCategoryScore('지역 활동')}/19</div>
                        <div className="score-indicator" style={{
                            backgroundColor: getCategoryScore('지역 활동') >= 10 ? '#DAE000' : '#666'
                        }}></div>
                    </div>
                    <div className={`score-card ${getCategoryScore('정당 활동') >= 8 ? 'high-score' : 'low-score'}`}>
                        <h3>정당 활동</h3>
                        <div className="score-value">{getCategoryScore('정당 활동')}/15</div>
                        <div className="score-indicator" style={{
                            backgroundColor: getCategoryScore('정당 활동') >= 8 ? '#DAE000' : '#666'
                        }}></div>
                    </div>
                </div>

                <div className="bootcamp-section">
                    <img src="images/bootcamp-logo.png" alt="뉴웨이즈 부트캠프" className="bootcamp-logo" />
                    <h3 className="bootcamp-title">정치 역량을 높이고 싶다면?</h3>
                    <p className="bootcamp-description">
                        뉴웨이즈 부트캠프에서 체계적인 교육과 멘토링을 통해 
                        정치 역량을 향상시킬 수 있습니다.
                    </p>
                    <button className="cta-btn" onClick={() => window.open('https://newways.kr/1daybootcamp?utm_source=homepage&utm_medium=landing&utm_campaign=1daycamp_selfcheck&utm_content=250813', '_blank')}>
                        부트캠프 자세히 보기
                    </button>
                </div>

                <div className="interpretation-section">
                    <h3 className="interpretation-title">결과 해석 보러가기</h3>
                    <p className="interpretation-description">
                        각 영역별 상세한 해설과 개선 방법을 확인해보세요.
                    </p>
                    <div className="interpretation-links">
                        <button 
                            className="interpretation-btn" 
                            onClick={() => handleInterpretationClick('https://newways.kr/article/self-competency')}
                        >
                            자기 역량 해설 보기
                        </button>
                        <button 
                            className="interpretation-btn" 
                            onClick={() => handleInterpretationClick('https://newways.kr/article/local-activity')}
                        >
                            지역 활동 역량 해설 보기
                        </button>
                        <button 
                            className="interpretation-btn" 
                            onClick={() => handleInterpretationClick('https://newways.kr/article/party-activity')}
                        >
                            정당 활동 역량 해설 보기
                        </button>
                    </div>
                </div>

                <div className="share-link-section">
                    <button className="share-link-btn" onClick={() => {
                        const text = `정치인 역량 테스트 결과: ${personalityType.type}\n${personalityType.message}\n\n테스트 하러가기: ${window.location.href}`;
                        navigator.clipboard.writeText(text);
                        alert('링크가 복사되었습니다!');
                    }}>
                        🔗 결과 링크 복사하기
                    </button>
                </div>
            </div>
        );
    };

    const renderInfoModal = () => (
        <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">결과 해설을 받아보세요</h2>
                <p className="modal-description">
                    상세한 해설 자료를 이메일로 보내드립니다.
                </p>
                <form onSubmit={handleInfoSubmit} className="info-form">
                    <input
                        type="text"
                        placeholder="이름"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="info-input"
                        required
                    />
                    <input
                        type="tel"
                        placeholder="연락처 (010-0000-0000)"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        className="info-input"
                        required
                    />
                    <input
                        type="email"
                        placeholder="이메일"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        className="info-input"
                        required
                    />
                    <div className="modal-buttons">
                        <button type="button" className="modal-cancel-btn" onClick={() => setShowInfoModal(false)}>
                            취소
                        </button>
                        <button type="submit" className="modal-submit-btn">
                            해설 보기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="container">
            {currentScreen === 'start' && renderStartScreen()}
            {currentScreen === 'quiz' && renderQuiz()}
            {currentScreen === 'result' && renderResult()}
            {showInfoModal && renderInfoModal()}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));