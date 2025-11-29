// Translations
const translations = {
    en: {
        'app.title': 'DypaQuiz',
        'app.subtitle': 'Interactive Quiz System',
        loading: 'Loading quiz...',
        'error.title': 'Error Loading Quiz',
        'error.detail': 'There was an error loading the quiz data. Please make sure quiz.json is in the project directory.',
        'nav.previous': 'Previous',
        'nav.next': 'Next',
        'nav.finish': 'Finish Quiz',
        'nav.retake': 'Retake Quiz',
        'nav.home': 'Return to start',
        start: 'Start',
        'sections.label': 'Chapter:',
        'sections.all': 'All chapters',
        'feedback.label': 'Feedback:',
        'feedback.end': 'At the end',
        'feedback.immediate': 'After each question',
        'randomize.label': 'Randomize questions',
        'sections.summary': 'Chapter: {name} ({count}/{total})',
        'progress': 'Question {current} of {total}',
        'results.details': '{correct} out of {total} correct',
        'results.perfect': '🎉 Perfect! All answers are correct!',
        'results.incorrectHeader': 'Incorrect Answers ({count})',
        'results.yourAnswer': 'Your answer: {answer}',
        'results.correctAnswer': 'Correct answer: {answer}',
        'results.notAnswered': 'Not answered',
        'explanation.title': 'Explanation'
    },
    el: {
        'app.title': 'DypaQuiz',
        'app.subtitle': 'Διαδραστικό Σύστημα Κουίζ',
        loading: 'Φόρτωση κουίζ...',
        'error.title': 'Σφάλμα φόρτωσης κουίζ',
        'error.detail': 'Παρουσιάστηκε σφάλμα κατά τη φόρτωση των δεδομένων. Βεβαιωθείτε ότι το quiz.json βρίσκεται στον φάκελο του έργου.',
        'nav.previous': 'Προηγούμενο',
        'nav.next': 'Επόμενο',
        'nav.finish': 'Ολοκλήρωση',
        'nav.retake': 'Επανάληψη Κουίζ',
        'nav.home': 'Επιστροφή στην αρχική',
        start: 'Έναρξη',
        'sections.label': 'Κεφάλαιο:',
        'sections.all': 'Όλα τα κεφάλαια',
        'feedback.label': 'Έλεγχος απάντησης',
        'feedback.end': 'Στο τέλος',
        'feedback.immediate': 'Μετά από κάθε ερώτηση',
        'randomize.label': 'Τυχαιοποίηση ερωτήσεων',
        'sections.summary': 'Κεφάλαιο: {name} ({count}/{total})',
        'progress': 'Ερώτηση {current} από {total}',
        'results.details': '{correct} από {total} σωστές',
        'results.perfect': '🎉 Τέλεια! Όλες οι απαντήσεις είναι σωστές!',
        'results.incorrectHeader': 'Λανθασμένες Απαντήσεις ({count})',
        'results.yourAnswer': 'Η απάντησή σας: {answer}',
        'results.correctAnswer': 'Σωστή απάντηση: {answer}',
        'results.notAnswered': 'Δεν απαντήθηκε',
        'explanation.title': 'Εξήγηση'
    }
};

class QuizApp {
    constructor() {
        this.quizData = null;
        this.questions = [];
        this.allQuestions = [];
        this.chapterData = {};
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.isQuizComplete = false;
        this.isMobile = this.detectMobile();
        this.lang = this.getInitialLanguage();
        this.sections = [];
        this.sectionCounts = new Map();
        this.totalCount = 0;
        this.currentSection = 'all';
        this.feedbackMode = this.getInitialFeedbackMode();
        this.randomizeQuestions = this.getInitialRandomizeMode();
        this.shuffledIndexMap = [];
        
        this.initializeApp();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768 || 
               'ontouchstart' in window;
    }

    getInitialLanguage() {
        const saved = localStorage.getItem('lang');
        const supported = ['en', 'el'];
        if (saved && supported.includes(saved)) return saved;
        const browser = (navigator.language || 'en').slice(0, 2);
        return supported.includes(browser) ? browser : 'en';
    }

    getInitialFeedbackMode() {
        return localStorage.getItem('feedbackMode') === 'immediate' ? 'immediate' : 'end';
    }

    getInitialRandomizeMode() {
        return localStorage.getItem('randomizeQuestions') === 'true';
    }

    t(key, vars = {}) {
        const dict = translations[this.lang] || translations.en;
        let text = dict[key] || key;
        for (const [k, v] of Object.entries(vars)) {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
        return text;
    }

    setLanguage(lang) {
        if (!['en', 'el'].includes(lang)) return;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'language_changed', {
                'old_language': this.lang,
                'new_language': lang,
                'section': this.currentSection
            });
        }
        this.lang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.setAttribute('lang', lang);
        this.updateLangSelect();
        this.applyTranslations();
    }

    updateLangSelect() {
        const select = document.getElementById('lang-select');
        if (select) select.value = this.lang;
    }

    async initializeApp() {
        try {
            this.updateLangSelect();
            this.applyTranslations();
            await this.loadQuizData();
            this.computeSections();
            this.setupSectionSelector();
            this.setupEventListeners();
            this.optimizeForMobile();
            this.showStartScreenOrQuiz();
        } catch (error) {
            console.error('Error initializing quiz:', error);
            this.showError();
        }
    }

    optimizeForMobile() {
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
            
            // Prevent double-tap zoom
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (event) => {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, { passive: false });
            
            // Smooth scroll behavior
            if ('scrollBehavior' in document.documentElement.style) {
                document.documentElement.style.scrollBehavior = 'smooth';
            }
            
            // Optimize touch interactions
            document.addEventListener('touchstart', () => {}, { passive: true });
        }
    }

    async loadQuizData() {
        try {
            const response = await fetch('quiz.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.quizData = await response.json();
            this.validateQuizData();
            
            if (this.quizData.chapters?.length) {
                await this.loadChapters();
            } else {
                this.allQuestions = Array.isArray(this.quizData.questions) ? [...this.quizData.questions] : [];
            }
            
            this.applySectionFilter();
        } catch (error) {
            console.error('Error loading quiz data:', error);
            throw error;
        }
    }

    async loadChapters() {
        this.allQuestions = [];
        this.chapterData = {};
        
        for (const chapter of this.quizData.chapters) {
            if (chapter.enabled && chapter.chapterFile) {
                try {
                    const response = await fetch(chapter.chapterFile);
                    if (response.ok) {
                        const chapterData = await response.json();
                        this.chapterData[chapter.chapterNumber] = chapterData;
                        if (chapterData.questions?.length) {
                            this.allQuestions = this.allQuestions.concat(chapterData.questions);
                        }
                    }
                } catch (error) {
                    console.warn(`Error loading chapter ${chapter.chapterFile}:`, error);
                }
            }
        }
    }

    validateQuizData() {
        if (!this.quizData) throw new Error('Invalid quiz data format');
        
        if (this.quizData.chapters?.length) {
            this.quizData.chapters.forEach((chapter, index) => {
                if (!chapter.chapterNumber || !chapter.chapterFile) {
                    throw new Error(`Invalid chapter format at index ${index}`);
                }
            });
        } else if (this.quizData.questions?.length) {
            this.quizData.questions.forEach((question, index) => {
                if (!question.question || !question.options?.length) {
                    throw new Error(`Invalid question format at index ${index}`);
                }
                if (typeof question.correctAnswer !== 'number' || 
                    question.correctAnswer < 0 || 
                    question.correctAnswer >= question.options.length) {
                    throw new Error(`Invalid correctAnswer for question ${index + 1}`);
                }
            });
        } else {
            throw new Error('Invalid quiz data format - no chapters or questions found');
        }
    }

    computeSections() {
        if (this.quizData.chapters?.length) {
            this.sections = [];
            this.sectionCounts = new Map();
            this.totalCount = 0;
            
            this.quizData.chapters.forEach(chapter => {
                if (chapter.enabled && this.chapterData[chapter.chapterNumber]) {
                    const chapterQuestions = this.chapterData[chapter.chapterNumber].questions || [];
                    const sectionId = chapter.chapterNumber.toString();
                    this.sections.push(sectionId);
                    this.sectionCounts.set(sectionId, chapterQuestions.length);
                    this.totalCount += chapterQuestions.length;
                }
            });
        } else {
            const counts = new Map();
            (this.allQuestions || []).forEach(q => {
                const s = (q.section || '').trim();
                if (s) counts.set(s, (counts.get(s) || 0) + 1);
            });
            this.sections = Array.from(counts.keys());
            this.sectionCounts = counts;
            this.totalCount = (this.allQuestions || []).length;
        }
    }

    setupSectionSelector() {
        const container = document.getElementById('section-container');
        const select = document.getElementById('section-select');
        if (!container || !select) return;

        if (this.sections.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';
        select.innerHTML = '';
        
        const allOpt = document.createElement('option');
        allOpt.value = 'all';
        allOpt.textContent = `${this.t('sections.all')} (${this.totalCount})`;
        select.appendChild(allOpt);
        
        this.sections.forEach(sec => {
            const opt = document.createElement('option');
            opt.value = sec;
            const count = this.sectionCounts?.get(sec) || 0;
            let chapterTitle = sec;
            if (this.quizData.chapters?.length) {
                const chapter = this.quizData.chapters.find(c => c.chapterNumber.toString() === sec);
                if (chapter?.chapterTitle) chapterTitle = chapter.chapterTitle;
            }
            let displayText = `${chapterTitle} (${count})`;
            if (this.isMobile && displayText.length > 25) {
                displayText = `${chapterTitle.substring(0, 15)}... (${count})`;
            }
            opt.textContent = displayText;
            select.appendChild(opt);
        });
        select.value = this.currentSection;
    }

    applySectionFilter() {
        if (this.currentSection === 'all') {
            this.questions = [...(this.allQuestions || [])];
        } else {
            if (this.quizData.chapters?.length) {
                const chapterNumber = parseInt(this.currentSection);
                this.questions = [...(this.chapterData[chapterNumber]?.questions || [])];
            } else {
                this.questions = (this.allQuestions || []).filter(q => (q.section || '').trim() === this.currentSection);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finish-btn').addEventListener('click', () => this.finishQuiz());
        document.getElementById('retake-btn').addEventListener('click', () => this.retakeQuiz());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
        
        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            langSelect.value = this.lang;
            langSelect.addEventListener('change', (e) => this.setLanguage(e.target.value));
        }
        
        const sectionSelect = document.getElementById('section-select');
        if (sectionSelect) {
            sectionSelect.addEventListener('change', (e) => {
                const newSection = e.target.value || 'all';
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'section_changed', {
                        'old_section': this.currentSection,
                        'new_section': newSection,
                        'language': this.lang
                    });
                }
                this.currentSection = newSection;
                this.currentQuestionIndex = 0;
                this.userAnswers = {};
                this.isQuizComplete = false;
                this.applySectionFilter();
                if (document.getElementById('quiz-container').style.display !== 'none') {
                    this.renderQuestions();
                    this.updateProgress();
                    this.updateNavigation();
                }
            });
        }
        
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.addEventListener('click', () => this.startQuiz());
        
        const feedbackSelect = document.getElementById('feedback-select');
        if (feedbackSelect) {
            feedbackSelect.value = this.feedbackMode;
            feedbackSelect.addEventListener('change', (e) => {
                const val = e.target.value === 'immediate' ? 'immediate' : 'end';
                this.feedbackMode = val;
                localStorage.setItem('feedbackMode', val);
            });
        }
        
        const randomizeCheckbox = document.getElementById('randomize-checkbox');
        if (randomizeCheckbox) {
            randomizeCheckbox.checked = this.randomizeQuestions;
            randomizeCheckbox.addEventListener('change', (e) => {
                this.randomizeQuestions = e.target.checked;
                localStorage.setItem('randomizeQuestions', e.target.checked.toString());
            });
        }
    }

    startQuiz() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('start-screen').classList.remove('active');
        document.getElementById('quiz-container').style.display = 'block';
        document.body.classList.remove('start-screen-active');
        this.renderQuestions();
        this.updateProgress();
        this.updateNavigation();
        this.updateSectionSummary();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quiz_started', {
                'section': this.currentSection,
                'question_count': this.questions.length,
                'randomize_questions': this.randomizeQuestions,
                'feedback_mode': this.feedbackMode,
                'language': this.lang
            });
        }
    }

    showStartScreenOrQuiz() {
        const hasSections = this.sections?.length > 0;
        document.getElementById('loading').style.display = 'none';
        if (hasSections) {
            document.getElementById('start-screen').classList.add('active');
            document.getElementById('quiz-container').style.display = 'none';
            document.body.classList.add('start-screen-active');
        } else {
            this.startQuiz();
        }
    }

    renderQuestions() {
        const container = document.getElementById('questions-container');
        container.innerHTML = '';

        const working = [...this.questions];
        if (this.randomizeQuestions) {
            for (let i = working.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [working[i], working[j]] = [working[j], working[i]];
            }
        }

        this.shuffledIndexMap = working.map((_, idx) => idx);

        working.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-container';
            questionDiv.id = `question-${index}`;
            questionDiv.setAttribute('data-original-index', this.questions.indexOf(question));
            
            questionDiv.innerHTML = `
                <div class="question-number">${this.t('progress', { current: index + 1, total: working.length })}</div>
                <div class="question-text">${question.question}</div>
                <div class="options-container">
                    ${question.options.map((option, optionIndex) => `
                        <div class="option" data-option="${optionIndex}" data-question="${index}">
                            <span class="option-label">${['Α', 'Β', 'Γ', 'Δ'][optionIndex]}.</span>
                            ${option}
                        </div>
                    `).join('')}
                </div>
                <div class="explanation-area" id="explanation-${index}">
                    <div class="explanation-title">${this.t('explanation.title')}</div>
                    <div class="explanation-text"></div>
                </div>
            `;

            container.appendChild(questionDiv);

            questionDiv.querySelectorAll('.option').forEach(option => {
                const handleSelect = () => this.selectOption(index, parseInt(option.dataset.option));
                
                // Use click for both desktop and mobile (better compatibility)
                option.addEventListener('click', handleSelect);
                
                // Add touch feedback for mobile
                if (this.isMobile) {
                    option.addEventListener('touchstart', () => {
                        option.classList.add('touching');
                    }, { passive: true });
                    
                    option.addEventListener('touchend', () => {
                        option.classList.remove('touching');
                    }, { passive: true });
                }
            });
        });

        this.showQuestion(0);
    }

    showQuestion(index) {
        document.querySelectorAll('.question-container').forEach(q => q.classList.remove('active'));
        const questionEl = document.getElementById(`question-${index}`);
        if (questionEl) {
            questionEl.classList.add('active');
            
            // Smooth scroll to top on mobile when changing questions
            if (this.isMobile) {
                setTimeout(() => {
                    questionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
        
        const questionElement = document.getElementById(`question-${index}`);
        const originalIndex = parseInt(questionElement?.getAttribute('data-original-index') || '0');
        
        const userAnswer = this.userAnswers[originalIndex];
        if (userAnswer !== undefined) {
            const options = document.querySelectorAll(`#question-${index} .option`);
            options.forEach(option => option.classList.remove('selected'));
            if (options[userAnswer]) options[userAnswer].classList.add('selected');
        }
    }

    selectOption(questionIndex, optionIndex) {
        const options = document.querySelectorAll(`#question-${questionIndex} .option`);
        options.forEach(option => option.classList.remove('selected'));
        options[optionIndex].classList.add('selected');
        
        const questionElement = document.getElementById(`question-${questionIndex}`);
        const originalIndex = parseInt(questionElement?.getAttribute('data-original-index') || '0');
        this.userAnswers[originalIndex] = optionIndex;
        
        if (this.feedbackMode === 'immediate') {
            const question = this.questions[originalIndex];
            const correctIdx = question.correctAnswer;
            options.forEach((optEl, idx) => {
                optEl.classList.remove('correct', 'incorrect');
                if (idx === correctIdx) optEl.classList.add('correct');
            });
            if (optionIndex !== correctIdx) {
                options[optionIndex].classList.add('incorrect');
                const explanationArea = document.getElementById(`explanation-${questionIndex}`);
                if (explanationArea) {
                    const explanationText = explanationArea.querySelector('.explanation-text');
                    if (explanationText) {
                        explanationText.textContent = question.explanation || '';
                        explanationArea.classList.add('show');
                    }
                }
            } else {
                const explanationArea = document.getElementById(`explanation-${questionIndex}`);
                if (explanationArea) explanationArea.classList.remove('show');
            }
        }

        this.updateNavigation();
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion(this.currentQuestionIndex);
            this.updateProgress();
            this.updateNavigation();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion(this.currentQuestionIndex);
            this.updateProgress();
            this.updateNavigation();
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = 
            this.t('progress', { current: this.currentQuestionIndex + 1, total: this.questions.length });
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const finishBtn = document.getElementById('finish-btn');
        
        const questionElement = document.getElementById(`question-${this.currentQuestionIndex}`);
        const originalIndex = parseInt(questionElement?.getAttribute('data-original-index') || '0');
        const answered = this.userAnswers[originalIndex] !== undefined;

        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = 'inline-block';
            finishBtn.disabled = !answered;
        } else {
            nextBtn.style.display = 'inline-block';
            finishBtn.style.display = 'none';
            nextBtn.disabled = !answered;
        }
    }

    finishQuiz() {
        this.isQuizComplete = true;
        this.calculateResults();
        this.showResults();
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quiz_completed', {
                'section': this.currentSection,
                'score_percentage': this.results.percentage,
                'correct_answers': this.results.correct,
                'total_questions': this.results.total,
                'wrong_answers': this.results.wrong.length,
                'language': this.lang
            });
        }
    }

    calculateResults() {
        let correctCount = 0;
        const wrongAnswers = [];

        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.correctAnswer;
            
            if (userAnswer === correctAnswer) {
                correctCount++;
            } else {
                wrongAnswers.push({
                    question: question.question,
                    userAnswer: userAnswer !== undefined ? question.options[userAnswer] : this.t('results.notAnswered'),
                    correctAnswer: question.options[correctAnswer],
                    explanation: question.explanation || ''
                });
            }
        });

        this.results = {
            total: this.questions.length,
            correct: correctCount,
            wrong: wrongAnswers,
            percentage: Math.round((correctCount / this.questions.length) * 100)
        };
    }

    showResults() {
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('results-container').classList.add('active');

        document.getElementById('score-percentage').textContent = `${this.results.percentage}%`;
        document.getElementById('score-details').textContent = 
            this.t('results.details', { correct: this.results.correct, total: this.results.total });

        const wrongAnswersContainer = document.getElementById('wrong-answers');
        if (this.results.wrong.length === 0) {
            wrongAnswersContainer.innerHTML = `<h3 style="text-align: center; color: var(--success-color);">${this.t('results.perfect')}</h3>`;
        } else {
            wrongAnswersContainer.innerHTML = `
                <h3 style="margin-bottom: 20px; color: var(--error-color);">${this.t('results.incorrectHeader', { count: this.results.wrong.length })}</h3>
                ${this.results.wrong.map((item, index) => `
                    <div class="wrong-answer-item">
                        <div class="wrong-question">${index + 1}. ${item.question}</div>
                        <div class="wrong-user-answer">${this.t('results.yourAnswer', { answer: item.userAnswer })}</div>
                        <div class="correct-answer">${this.t('results.correctAnswer', { answer: item.correctAnswer })}</div>
                        ${item.explanation ? `<div class="explanation">${item.explanation}</div>` : ''}
                    </div>
                `).join('')}
            `;
        }
    }

    retakeQuiz() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quiz_retaken', {
                'section': this.currentSection,
                'previous_score': this.results?.percentage || 0,
                'language': this.lang
            });
        }

        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.isQuizComplete = false;
        this.results = null;

        document.getElementById('results-container').classList.remove('active');
        document.getElementById('quiz-container').style.display = 'block';

        if (this.randomizeQuestions) {
            this.renderQuestions();
        } else {
            this.showQuestion(0);
        }
        this.updateProgress();
        this.updateNavigation();
    }

    goHome() {
        document.getElementById('results-container').classList.remove('active');
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('start-screen').classList.add('active');
        document.body.classList.add('start-screen-active');
    }

    showError() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
    }

    applyTranslations() {
        const mappings = [
            ['app.title', '.quiz-title'],
            ['app.subtitle', '.quiz-subtitle'],
            ['loading', '#loading p'],
            ['error.title', '#error h3'],
            ['error.detail', '#error p'],
            ['nav.previous', '#prev-btn'],
            ['nav.next', '#next-btn'],
            ['nav.finish', '#finish-btn'],
            ['nav.retake', '#retake-btn'],
            ['nav.home', '#home-btn'],
            ['start', '#start-btn'],
            ['feedback.label', '#feedback-label'],
            ['feedback.end', "#feedback-select option[value='end']"],
            ['feedback.immediate', "#feedback-select option[value='immediate']"],
            ['randomize.label', '.randomize-text'],
        ];
        
        mappings.forEach(([key, selector]) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = this.t(key);
        });

        const sectionLabel = document.getElementById('section-label');
        if (sectionLabel) sectionLabel.textContent = this.t('sections.label');
        
        const sectionSelect = document.getElementById('section-select');
        if (sectionSelect?.options[0]?.value === 'all') {
            sectionSelect.options[0].textContent = `${this.t('sections.all')} (${this.totalCount || 0})`;
        }

        const progressEl = document.getElementById('progress-text');
        if (progressEl && this.questions.length > 0) {
            progressEl.textContent = this.t('progress', { current: this.currentQuestionIndex + 1, total: this.questions.length });
        }
    }

    updateSectionSummary() {
        const el = document.getElementById('section-summary');
        if (!el) return;
        const total = this.totalCount || 0;
        const name = this.currentSection === 'all' ? this.t('sections.all') : this.currentSection;
        const count = this.currentSection === 'all' ? (this.allQuestions?.length || 0) : (this.sectionCounts?.get(this.currentSection) || 0);
        if (count > 0) {
            el.style.display = 'block';
            el.textContent = this.t('sections.summary', { name, count, total });
        } else {
            el.style.display = 'none';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});

