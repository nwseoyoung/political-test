const { useState, useEffect } = React;

// EmailJS 초기화 - 설정되어 있을 때만
// EmailJS를 사용하려면 YOUR_PUBLIC_KEY를 실제 키로 교체하세요
// if (typeof emailjs !== 'undefined') {
//     emailjs.init("YOUR_PUBLIC_KEY");
// }

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
        email: '',
        candidateIntention: ''
    });
    const [privacyAgree, setPrivacyAgree] = useState(false);
    const [thirdPartyAgree, setThirdPartyAgree] = useState(false);
    const [marketingAgree, setMarketingAgree] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [targetArticle, setTargetArticle] = useState('');

    const handleStart = () => {
        // 유효성 검사
        if (!userInfo.name || !userInfo.phone || !userInfo.email || !userInfo.candidateIntention) {
            alert('모든 정보를 입력해주세요.');
            return;
        }
        
        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userInfo.email)) {
            alert('올바른 이메일 형식을 입력해주세요.');
            return;
        }
        
        // 개인정보 동의 확인
        if (!privacyAgree || !thirdPartyAgree) {
            alert('필수 동의 항목을 확인해주세요.');
            return;
        }
        
        // 정보 저장
        const userDataWithConsent = {
            ...userInfo,
            privacyAgree,
            thirdPartyAgree,
            marketingAgree,
            consentDate: new Date().toISOString()
        };
        localStorage.setItem('testUserInfo', JSON.stringify(userDataWithConsent));
        
        // 구글 스프레드시트로 데이터 전송
        sendToGoogleSheets(userDataWithConsent);
        
        setCurrentScreen('quiz');
    };
    
    const sendToGoogleSheets = (userData) => {
        // Google Apps Script Web App URL (나중에 실제 URL로 교체 필요)
        const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
        
        if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    candidateIntention: userData.candidateIntention,
                    marketingAgree: userData.marketingAgree ? 'Y' : 'N',
                    source: window.location.hostname
                })
            }).catch(error => {
                console.log('Google Sheets 전송 실패:', error);
            });
        }
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
        const savedUserInfo = localStorage.getItem('testUserInfo');
        if (!savedUserInfo) return;
        
        const user = JSON.parse(savedUserInfo);
        const personalityType = getPersonalityTypeForEmail(selfScore, localScore, partyScore);
        
        // 선택한 문항들을 카테고리별로 정리
        const selectedItemsByCategory = getSelectedItemsByCategory();
        
        const emailData = {
            user_name: user.name,
            user_email: user.email,
            user_phone: user.phone,
            candidate_intention: user.candidateIntention,
            marketing_agree: user.marketingAgree ? 'Y' : 'N',
            test_date: new Date().toLocaleDateString('ko-KR'),
            total_score: totalScore,
            self_score: selfScore,
            local_score: localScore,
            party_score: partyScore,
            personality_type: personalityType.type,
            personality_message: personalityType.message,
            selected_self: selectedItemsByCategory.self.join('\n'),
            selected_local: selectedItemsByCategory.local.join('\n'),
            selected_party: selectedItemsByCategory.party.join('\n')
        };
        
        // 스티비 API를 통한 이메일 전송 (Vercel Functions 사용)
        // Vercel에 배포된 경우에만 작동
        const isProduction = window.location.hostname.includes('vercel.app') || 
                           window.location.hostname.includes('newways.kr') ||
                           window.location.hostname === 'political-test-three.vercel.app';
        
        if (isProduction) {
            console.log('이메일 전송 시도:', emailData.user_email);
            
            fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            })
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('스티비 이메일 전송 성공:', data);
                // 사용자에게 알림 (선택사항)
                // alert('진단 결과가 이메일로 전송되었습니다!');
            })
            .catch(error => {
                console.error('스티비 이메일 전송 실패:', error);
                // 실패해도 테스트는 계속 진행
            });
        } else if (window.location.hostname.includes('github.io')) {
            // GitHub Pages에서 테스트하는 경우
            console.log('GitHub Pages에서는 Vercel API를 직접 호출합니다.');
            console.log('Vercel에 배포된 버전에서 이메일이 발송됩니다.');
            
            // 선택사항: Vercel API 직접 호출
            // fetch('https://political-test.vercel.app/api/send-email', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(emailData)
            // }).then(response => {
            //     console.log('Cross-origin 이메일 전송 시도:', response.status);
            // }).catch(error => {
            //     console.log('Cross-origin 요청 실패 (예상된 동작):', error);
            // });
        }
        
        // EmailJS 백업 (설정되어 있는 경우)
        if (typeof emailjs !== 'undefined' && emailjs.init) {
            const templateParams = {
                ...emailData,
                test_url: window.location.href,
                guide_url: 'https://newwayskr.notion.site/249441828a8280c58a57c9d75b8cd1d3',
                bootcamp_url: 'https://newways.kr/1daybootcamp?utm_source=homepage&utm_medium=email&utm_campaign=1daycamp_selfcheck&utm_content=250813'
            };
            
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then((response) => {
                    console.log('EmailJS 전송 성공!', response.status);
                })
                .catch((error) => {
                    console.log('EmailJS 전송 실패:', error);
                });
        }
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
                
                <div className="competency-highlight">
                    <h2 className="competency-title">🎯 총 52개 항목을 체크해보세요</h2>
                    <div className="competency-cards">
                        <div className="competency-card-start">
                            <div className="competency-icon">💪</div>
                            <h3>자기 역량</h3>
                            <p className="competency-count">18개 항목</p>
                            <span className="competency-desc">리더십, 전문성, 영향력</span>
                        </div>
                        <div className="competency-card-start">
                            <div className="competency-icon">🏛️</div>
                            <h3>지역 활동</h3>
                            <p className="competency-count">19개 항목</p>
                            <span className="competency-desc">지역 이해도, 네트워크</span>
                        </div>
                        <div className="competency-card-start">
                            <div className="competency-icon">🤝</div>
                            <h3>정당 활동</h3>
                            <p className="competency-count">15개 항목</p>
                            <span className="competency-desc">정당 이해, 활동 경험</span>
                        </div>
                    </div>
                    <p className="competency-subdesc">
                        각 영역별로 현재 보유한 역량을 체크하고,<br/>
                        부족한 부분을 파악해 체계적으로 준비할 수 있습니다.
                    </p>
                </div>
                
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
                    
                    <div className="candidate-dropdown-section">
                        <select
                            value={userInfo.candidateIntention}
                            onChange={(e) => setUserInfo({...userInfo, candidateIntention: e.target.value})}
                            className="start-dropdown"
                            required
                        >
                            <option value="">출마 계획을 선택해주세요</option>
                            <option value="언젠가 출마할 것이다">언젠가 출마할 것이다</option>
                            <option value="2026 지방선거에 출마할 것이다">2026 지방선거에 출마할 것이다</option>
                            <option value="출마를 고민하거나 계획하고 있다">출마를 고민하거나 계획하고 있다</option>
                            <option value="출마를 고려하지 않는다">출마를 고려하지 않는다</option>
                        </select>
                    </div>
                    
                    <div className="privacy-section">
                        <div className="privacy-item required">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={privacyAgree}
                                    onChange={(e) => setPrivacyAgree(e.target.checked)}
                                />
                                <span>(필수) 개인정보 수집·이용에 동의합니다</span>
                            </label>
                            <button className="privacy-detail-btn" onClick={() => setShowPrivacyModal('privacy')}>
                                자세히
                            </button>
                        </div>
                        
                        <div className="privacy-item required">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={thirdPartyAgree}
                                    onChange={(e) => setThirdPartyAgree(e.target.checked)}
                                />
                                <span>(필수) 개인정보 제3자 제공에 동의합니다</span>
                            </label>
                            <button className="privacy-detail-btn" onClick={() => setShowPrivacyModal('thirdParty')}>
                                자세히
                            </button>
                        </div>
                        
                        <div className="privacy-item">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={marketingAgree}
                                    onChange={(e) => setMarketingAgree(e.target.checked)}
                                />
                                <span>(선택) 마케팅 정보 수신에 동의합니다</span>
                            </label>
                            <button className="privacy-detail-btn" onClick={() => setShowPrivacyModal('marketing')}>
                                자세히
                            </button>
                        </div>
                        
                        <div className="privacy-all">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={privacyAgree && thirdPartyAgree && marketingAgree}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setPrivacyAgree(checked);
                                        setThirdPartyAgree(checked);
                                        setMarketingAgree(checked);
                                    }}
                                />
                                <span>전체 동의</span>
                            </label>
                        </div>
                    </div>
                </div>

                <button className="start-btn" onClick={handleStart}>
                    진단 시작하기
                </button>
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

    const renderPrivacyModal = () => {
        if (!showPrivacyModal) return null;
        
        const getPrivacyContent = () => {
            switch(showPrivacyModal) {
                case 'privacy':
                    return {
                        title: '개인정보 수집·이용 동의',
                        content: `
1. 수집하는 개인정보 항목
   - 필수항목: 이름, 이메일, 연락처, 출마 의사
   - 선택항목: 테스트 결과, 선택한 역량 항목

2. 개인정보 수집·이용 목적
   - 정치 역량 테스트 결과 제공
   - 맞춤형 교육 프로그램 안내
   - 정치 관련 정보 및 소식 전달 (동의 시)

3. 개인정보 보유 및 이용 기간
   - 수집일로부터 3년
   - 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보존

4. 동의를 거부할 권리
   - 위 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.
   - 필수항목 동의 거부 시 서비스 이용이 제한됩니다.`
                    };
                case 'thirdParty':
                    return {
                        title: '개인정보 제3자 제공 동의',
                        content: `
1. 제공받는 자
   - 스티비(Stibee): 이메일 발송 서비스
   - Google: 데이터 분석 및 저장

2. 제공하는 개인정보 항목
   - 스티비: 이름, 이메일, 연락처, 테스트 결과
   - Google: 이름, 이메일, 출마 의사, 테스트 일시

3. 제공받는 자의 이용 목적
   - 스티비: 테스트 결과 이메일 발송 및 마케팅 정보 전달
   - Google: 통계 분석 및 서비스 개선

4. 보유 및 이용 기간
   - 제공 목적 달성 시까지
   - 회원 탈퇴 또는 동의 철회 시 즉시 파기

5. 동의를 거부할 권리
   - 위 개인정보 제3자 제공에 대한 동의를 거부할 권리가 있습니다.
   - 동의 거부 시 이메일 발송 서비스를 이용할 수 없습니다.`
                    };
                case 'marketing':
                    return {
                        title: '마케팅 정보 수신 동의',
                        content: `
1. 수신 정보
   - 뉴웨이즈 교육 프로그램 안내
   - 정치 관련 뉴스레터 및 콘텐츠
   - 이벤트 및 세미나 초대
   - 정치인 네트워킹 행사 안내

2. 발송 방법
   - 이메일, SMS, 카카오톡 알림톡

3. 수신 동의 철회
   - 언제든지 수신 동의를 철회할 수 있습니다.
   - 이메일 하단의 '수신거부' 링크 클릭
   - 고객센터 문의

4. 동의를 거부할 권리
   - 마케팅 정보 수신은 선택사항입니다.
   - 동의하지 않아도 서비스 이용에 제한이 없습니다.`
                    };
                default:
                    return { title: '', content: '' };
            }
        };
        
        const { title, content } = getPrivacyContent();
        
        return (
            <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
                <div className="modal-content privacy-modal" onClick={(e) => e.stopPropagation()}>
                    <h2 className="modal-title">{title}</h2>
                    <div className="privacy-content">
                        <pre>{content}</pre>
                    </div>
                    <button className="modal-close-btn" onClick={() => setShowPrivacyModal(false)}>
                        확인
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            {currentScreen === 'start' && renderStartScreen()}
            {currentScreen === 'quiz' && renderQuiz()}
            {currentScreen === 'result' && renderResult()}
            {showInfoModal && renderInfoModal()}
            {renderPrivacyModal()}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));