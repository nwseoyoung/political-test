const { useState, useEffect } = React;

function App() {
    const [currentScreen, setCurrentScreen] = useState('start');
    const [currentBaseQuestion, setCurrentBaseQuestion] = useState(0);
    const [selectedDetails, setSelectedDetails] = useState({});
    const [hasSelectedNone, setHasSelectedNone] = useState(false);
    const [allSelectedDetails, setAllSelectedDetails] = useState({});

    const handleStart = () => {
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
            setCurrentBaseQuestion(currentBaseQuestion - 1);
            setSelectedDetails({});
            setHasSelectedNone(false);
        }
    };

    const calculateResults = () => {
        setCurrentScreen('result');
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
                
                <div className="competency-intro">
                    <div className="competency-card">
                        <h3>자기 역량</h3>
                        <p>리더십, 전문성, 영향력 등 개인의 기본적인 정치 역량을 평가합니다.</p>
                    </div>
                    <div className="competency-card">
                        <h3>지역 활동</h3>
                        <p>지역 이해도, 네트워크, 활동 경험 등 지역 기반 역량을 측정합니다.</p>
                    </div>
                    <div className="competency-card">
                        <h3>정당 활동</h3>
                        <p>정당 이해, 활동 경험, 네트워크 등 정당 내 활동 역량을 확인합니다.</p>
                    </div>
                </div>

                <button className="start-btn" onClick={handleStart}>
                    진단하러 가기
                </button>
            </div>
        </div>
    );

    const renderQuiz = () => {
        const baseQuestion = baseQuestions[currentBaseQuestion];
        const progress = ((currentBaseQuestion + 1) / baseQuestions.length) * 100;
        
        const hasSelection = Object.keys(selectedDetails).length > 0 || hasSelectedNone;

        return (
            <>
                <div className="progress-info">
                    <span className="category-info">{baseQuestion.category}</span>
                    <span>{currentBaseQuestion + 1}/12</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="question-card">
                    <div className="question-header">
                        <h2 className="question-text">{baseQuestion.question}</h2>
                        <p className="question-hint">해당되는 항목을 모두 선택하세요</p>
                    </div>

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
            </>
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

                <div className="interpretation-section">
                    <h3 className="interpretation-title">결과 해석 보러가기</h3>
                    <p className="interpretation-description">
                        각 영역별 상세한 해설과 개선 방법을 확인해보세요.
                    </p>
                    <div className="interpretation-links">
                        <button 
                            className="interpretation-btn" 
                            onClick={() => window.open('https://newways.kr/article/self-competency', '_blank')}
                        >
                            자기 역량 해설 보기
                        </button>
                        <button 
                            className="interpretation-btn" 
                            onClick={() => window.open('https://newways.kr/article/local-activity', '_blank')}
                        >
                            지역 활동 역량 해설 보기
                        </button>
                        <button 
                            className="interpretation-btn" 
                            onClick={() => window.open('https://newways.kr/article/party-activity', '_blank')}
                        >
                            정당 활동 역량 해설 보기
                        </button>
                    </div>
                </div>

                <div className="share-section">
                    <h3 className="share-title">결과 공유하기</h3>
                    <div className="share-buttons">
                        <button className="share-btn" onClick={() => {
                            const text = `정치인 역량 테스트 결과: ${personalityType.type}\n${personalityType.message}\n\n테스트 하러가기: ${window.location.href}`;
                            navigator.clipboard.writeText(text);
                            alert('결과가 복사되었습니다!');
                        }}>
                            📋 결과 복사하기
                        </button>
                        <button className="share-btn" onClick={() => {
                            const url = window.location.href;
                            const text = `나의 정치인 역량 유형은 "${personalityType.type}"! 당신도 테스트해보세요!`;
                            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                        }}>
                            🐦 트위터 공유
                        </button>
                        <button className="share-btn" onClick={() => {
                            const url = window.location.href;
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                        }}>
                            📘 페이스북 공유
                        </button>
                    </div>
                </div>

                <div className="bootcamp-section">
                    <h3 className="bootcamp-title">정치 역량을 높이고 싶다면?</h3>
                    <p className="bootcamp-description">
                        뉴웨이즈 부트캠프에서 체계적인 교육과 멘토링을 통해 
                        정치 역량을 향상시킬 수 있습니다.
                    </p>
                    <button className="cta-btn" onClick={() => window.open('https://newways.kr/bootcamp', '_blank')}>
                        부트캠프 자세히 보기
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <header className="header">
                <button className="close-btn" onClick={() => window.close()}>✕</button>
            </header>
            
            {currentScreen === 'start' && renderStartScreen()}
            {currentScreen === 'quiz' && renderQuiz()}
            {currentScreen === 'result' && renderResult()}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));