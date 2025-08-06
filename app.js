const { useState, useEffect } = React;

function App() {
    const [currentScreen, setCurrentScreen] = useState('start');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);

    const handleStart = () => {
        setCurrentScreen('quiz');
    };

    const handleAnswer = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        });
        setSelectedOption(answer ? 'yes' : 'no');
    };

    const handleNext = () => {
        if (selectedOption !== null) {
            if (currentQuestion < questionsData.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(answers[questionsData[currentQuestion + 1].id] !== undefined 
                    ? (answers[questionsData[currentQuestion + 1].id] ? 'yes' : 'no') 
                    : null);
            } else {
                calculateResults();
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedOption(answers[questionsData[currentQuestion - 1].id] !== undefined 
                ? (answers[questionsData[currentQuestion - 1].id] ? 'yes' : 'no') 
                : null);
        }
    };

    const calculateResults = () => {
        const categoryScores = {
            '자기 역량': { total: 0, max: 0, count: 0 },
            '지역 활동': { total: 0, max: 0, count: 0 },
            '정당 활동': { total: 0, max: 0, count: 0 }
        };

        questionsData.forEach(question => {
            const category = question.category;
            categoryScores[category].max += question.weight;
            if (answers[question.id] === true) {
                categoryScores[category].total += question.weight;
                categoryScores[category].count += 1;
            }
        });

        setCurrentScreen('result');
    };

    const getScore = (category) => {
        let score = 0;
        let count = 0;
        questionsData.forEach(question => {
            if (question.category === category && answers[question.id] === true) {
                score += question.weight;
                count += 1;
            }
        });
        return count;
    };

    const getTotalScore = () => {
        let count = 0;
        questionsData.forEach(question => {
            if (answers[question.id] === true) {
                count += 1;
            }
        });
        return count;
    };

    const renderStartScreen = () => (
        <div className="start-screen">
            <div className="start-content">
                <p className="start-subtitle">나는 지금 얼마나 준비됐을까?</p>
                <h1 className="start-title">정치인 역량 진단하기</h1>
                <p className="start-description">
                    전현직 젊치인의 자문을 받아 구성한 셀프 진단으로 체크해 보세요.
                    어떤 역량을 키워야 할지 스스로 목표를 세울 수 있어요.
                </p>
                <button className="start-btn" onClick={handleStart}>
                    진단 시작하기
                </button>
            </div>
        </div>
    );

    const renderQuiz = () => {
        const question = questionsData[currentQuestion];
        const progress = ((currentQuestion + 1) / questionsData.length) * 100;
        
        const categoryCount = questionsData.filter(q => q.category === question.category).length;
        const categoryIndex = questionsData.filter((q, i) => i <= currentQuestion && q.category === question.category).length;

        return (
            <>
                <div className="progress-info">
                    <span className="category-info">{question.category}</span>
                    <span>{currentQuestion + 1}/{questionsData.length}</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="question-card">
                    <div className="question-header">
                        <h2 className="question-text">{question.question}</h2>
                        <p className="question-hint">해당되는 항목을 모두 선택하세요</p>
                    </div>

                    <div className="option-list">
                        <div 
                            className={`option-item ${selectedOption === 'yes' ? 'selected' : ''}`}
                            onClick={() => handleAnswer(question.id, true)}
                        >
                            <span className="option-text">{question.question}</span>
                            <div className="option-checkbox"></div>
                        </div>
                        <div 
                            className={`option-item ${selectedOption === 'no' ? 'selected' : ''}`}
                            onClick={() => handleAnswer(question.id, false)}
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
                        disabled={currentQuestion === 0}
                    >
                        이전
                    </button>
                    <button 
                        className="nav-btn primary" 
                        onClick={handleNext}
                        disabled={selectedOption === null}
                    >
                        {currentQuestion === questionsData.length - 1 ? '결과 보기' : '다음 질문'}
                    </button>
                </div>
            </>
        );
    };

    const getPersonalityType = () => {
        const selfScore = getScore('자기 역량');
        const localScore = getScore('지역 활동');
        const partyScore = getScore('정당 활동');
        
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

        const totalScore = getTotalScore();
        const personalityType = getPersonalityType();
        
        return (
            <div className="result-screen">
                <div className="result-header">
                    <p className="result-date">{today} 진단 결과</p>
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
                    <div className={`score-card ${getScore('자기 역량') >= 9 ? 'high-score' : 'low-score'}`}>
                        <h3>자기 역량</h3>
                        <div className="score-value">{getScore('자기 역량')}/18</div>
                        <div className="score-indicator" style={{
                            backgroundColor: getScore('자기 역량') >= 9 ? '#DAE000' : '#666'
                        }}></div>
                    </div>
                    <div className={`score-card ${getScore('지역 활동') >= 10 ? 'high-score' : 'low-score'}`}>
                        <h3>지역 활동</h3>
                        <div className="score-value">{getScore('지역 활동')}/19</div>
                        <div className="score-indicator" style={{
                            backgroundColor: getScore('지역 활동') >= 10 ? '#DAE000' : '#666'
                        }}></div>
                    </div>
                    <div className={`score-card ${getScore('정당 활동') >= 8 ? 'high-score' : 'low-score'}`}>
                        <h3>정당 활동</h3>
                        <div className="score-value">{getScore('정당 활동')}/15</div>
                        <div className="score-indicator" style={{
                            backgroundColor: getScore('정당 활동') >= 8 ? '#DAE000' : '#666'
                        }}></div>
                    </div>
                </div>

                <div className="result-details">
                    {getScore('자기 역량') < 6 && (
                        <div className="detail-section">
                            <h3>조직이나 공동체의 리더로서 활동한 경험이 있다.</h3>
                            <p>음주운전, 성범죄 등의 범죄 사실이 없고 조직이나 공동체에서 윤리적인 문제를 야기한 적이 없다.</p>
                        </div>
                    )}

                    {getScore('지역 활동') < 7 && (
                        <div className="detail-section">
                            <h3>정치를 제외한 특정 분야에서 전문 지식 혹은 경험이 있다.</h3>
                            <p>정치를 제외한 특정 분야에서 본업으로 한 1년 이상의 커리어 경력이나 프로젝트 경험을 가지고 있다.</p>
                        </div>
                    )}

                    {getScore('정당 활동') < 5 && (
                        <div className="detail-section">
                            <h3>특정한 사회 이슈 혹은 의제에 관심을 가지고 해결하기 위해 활동 중이다.</h3>
                            <p>사회 이슈에 대해 작은 성과라도 구체적인 해결책을 만든 경험이 있고 나의 기여에 대해 증명할 수 있다.</p>
                        </div>
                    )}

                    <div className="detail-section">
                        <h3>나의 활동과 생각에 대해 알릴 수 있는 채널을 가지고 있다.</h3>
                        <p>해당사항 없음</p>
                    </div>

                    <div className="detail-section">
                        <h3>출마 지역의 특성에 대해 읍면동별로 설명할 수 있다.</h3>
                        <p>해당사항 없음</p>
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