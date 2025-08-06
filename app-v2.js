const { useState, useEffect } = React;

function App() {
    const [currentScreen, setCurrentScreen] = useState('start');
    const [currentBaseQuestion, setCurrentBaseQuestion] = useState(0);
    const [selectedDetails, setSelectedDetails] = useState({});
    const [hasSelectedNone, setHasSelectedNone] = useState(false);

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
        // 저장: 현재 기본 질문의 선택된 세부 항목들
        const currentBase = baseQuestions[currentBaseQuestion];
        
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
                if (selectedDetails[detailQ.id]) {
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
                    if (selectedDetails[detailQ.id]) {
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
                <h1 className="start-title">정치 역량 진단 테스트</h1>
                <p className="start-description">
                    정치 입문을 준비하는 당신을 위한 역량 진단 테스트입니다.
                    12개의 기본 질문과 52개의 세부 질문을 통해 종합적인 평가를 제공합니다.
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

    const renderResult = () => {
        const today = new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\. /g, '.').replace('.', '');

        const totalScore = getTotalAnsweredCount();
        
        return (
            <div className="result-screen">
                <div className="result-header">
                    <p className="result-date">{today} 진단 결과</p>
                    <h2 className="result-title">총 점수</h2>
                    <div className="total-score">{totalScore}/52</div>
                </div>

                <div className="score-cards">
                    <div className="score-card">
                        <h3>자기 역량</h3>
                        <div className="score-value">{getCategoryScore('자기 역량')}/18</div>
                    </div>
                    <div className="score-card">
                        <h3>지역 활동</h3>
                        <div className="score-value">{getCategoryScore('지역 활동')}/19</div>
                    </div>
                    <div className="score-card">
                        <h3>정당 활동</h3>
                        <div className="score-value">{getCategoryScore('정당 활동')}/15</div>
                    </div>
                </div>

                <div className="result-details">
                    {baseQuestions.map((baseQ, idx) => {
                        const answeredCount = baseQ.detailQuestions.filter(d => selectedDetails[d.id]).length;
                        if (answeredCount === 0) {
                            return (
                                <div key={idx} className="detail-section">
                                    <h3>{baseQ.question}</h3>
                                    <p>해당사항 없음</p>
                                </div>
                            );
                        } else {
                            const answeredTexts = baseQ.detailQuestions
                                .filter(d => selectedDetails[d.id])
                                .map(d => d.text)
                                .join(', ');
                            return (
                                <div key={idx} className="detail-section">
                                    <h3>{baseQ.question}</h3>
                                    <p>{answeredTexts}</p>
                                </div>
                            );
                        }
                    })}
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
                <h1>셀프 진단</h1>
                <button className="close-btn" onClick={() => window.close()}>✕</button>
            </header>
            
            {currentScreen === 'start' && renderStartScreen()}
            {currentScreen === 'quiz' && renderQuiz()}
            {currentScreen === 'result' && renderResult()}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));