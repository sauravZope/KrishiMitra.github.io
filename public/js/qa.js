// Initialize data structure
const STORAGE_KEY = 'farmerQA';
let questions = [];
let filteredQuestions = [];
let visibleAnswers = new Set();
let currentUser = null;

// Load initial data
function loadData() {
    console.log('Loading data...');
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        questions = JSON.parse(storedData);
        // Migrate old data format to new format
        questions = questions.map(question => ({
            ...question,
            author: question.author || "Anonymous",
            date: question.date || new Date().toISOString(),
            views: question.views || 0,
            answers: (question.answers || []).map(answer => ({
                ...answer,
                author: answer.author || "Anonymous",
                date: answer.date || new Date().toISOString(),
                isAccepted: answer.isAccepted || false
            }))
        }));
        console.log('Loaded questions from storage:', questions);
    } else {
        console.log('No stored data found, using initial data');
        // Seed initial data
        questions = [
            {
                id: 1,
                text: "How do I prevent pests in my wheat crop?",
                author: "John Farmer",
                date: "2024-03-15T10:30:00",
                answers: [
                    { 
                        id: 1, 
                        text: "Use neem-based pesticides and rotate crops regularly.", 
                        author: "Expert Farmer",
                        date: "2024-03-15T11:00:00",
                        upvotes: 3,
                        isAccepted: true
                    },
                    { 
                        id: 2, 
                        text: "Install pheromone traps around your field.", 
                        author: "Local Expert",
                        date: "2024-03-15T11:30:00",
                        upvotes: 1,
                        isAccepted: false
                    }
                ],
                views: 45,
                upvotes: 5
            },
            {
                id: 2,
                text: "What's the best fertilizer for rice?",
                author: "Rice Grower",
                date: "2024-03-14T15:20:00",
                answers: [
                    { 
                        id: 1, 
                        text: "Urea combined with potassium is effective for rice.", 
                        author: "Agri Expert",
                        date: "2024-03-14T16:00:00",
                        upvotes: 2,
                        isAccepted: false
                    }
                ],
                views: 30,
                upvotes: 3
            }
        ];
        saveData();
    }
    filteredQuestions = [...questions];
    renderQuestions();
}

// Save data to localStorage
function saveData() {
    console.log('Saving data...');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

// Generate unique ID
function generateId() {
    return Date.now();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Add new question
function addQuestion(text) {
    console.log('Adding new question:', { text });
    const newQuestion = {
        id: generateId(),
        text: text,
        author: currentUser || "Anonymous",
        date: new Date().toISOString(),
        answers: [],
        views: 0,
        upvotes: 0
    };
    questions.unshift(newQuestion);
    filteredQuestions = [...questions];
    saveData();
    renderQuestions();
    hideQuestionForm();
}

// Add new answer
function addAnswer(questionId, text) {
    console.log('Adding new answer:', { questionId, text });
    const question = questions.find(q => q.id === questionId);
    if (question) {
        const newAnswer = {
            id: generateId(),
            text: text,
            author: currentUser || "Anonymous",
            date: new Date().toISOString(),
            upvotes: 0,
            isAccepted: false
        };
        question.answers.push(newAnswer);
        saveData();
        renderQuestions();
    }
}

// Upvote question
function upvoteQuestion(questionId) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.upvotes++;
        saveData();
        renderQuestions();
    }
}

// Upvote answer
function upvoteAnswer(questionId, answerId) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        const answer = question.answers.find(a => a.id === answerId);
        if (answer) {
            answer.upvotes++;
            saveData();
            renderQuestions();
        }
    }
}

// Downvote answer
function downvoteAnswer(questionId, answerId) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        const answer = question.answers.find(a => a.id === answerId);
        if (answer) {
            answer.upvotes = Math.max(0, answer.upvotes - 1);
            saveData();
            renderQuestions();
        }
    }
}

// Accept answer
function acceptAnswer(questionId, answerId) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        // Unaccept any previously accepted answer
        question.answers.forEach(a => a.isAccepted = false);
        // Accept the new answer
        const answer = question.answers.find(a => a.id === answerId);
        if (answer) {
            answer.isAccepted = true;
            saveData();
            renderQuestions();
        }
    }
}

// Increment view count
function incrementViews(questionId) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.views++;
        saveData();
    }
}

// Filter questions based on search input
function filterQuestions(searchTerm) {
    if (!searchTerm.trim()) {
        filteredQuestions = [...questions];
    } else {
        const searchLower = searchTerm.toLowerCase();
        filteredQuestions = questions.filter(question => 
            question.text.toLowerCase().includes(searchLower)
        );
    }
    renderQuestions();
}

// Render questions and answers
function renderQuestions() {
    console.log('Rendering questions...');
    const questionsList = document.getElementById('questionsList');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    if (!questionsList) {
        console.error('Questions list element not found!');
        return;
    }
    
    questionsList.innerHTML = '';

    if (filteredQuestions.length === 0) {
        noResultsMessage.classList.remove('hidden');
        return;
    }

    noResultsMessage.classList.add('hidden');

    filteredQuestions.forEach(question => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        
        // Sort answers by accepted status and upvotes
        const sortedAnswers = [...question.answers].sort((a, b) => {
            if (a.isAccepted !== b.isAccepted) return b.isAccepted - a.isAccepted;
            return b.upvotes - a.upvotes;
        });
        
        const isVisible = visibleAnswers.has(question.id);

        questionCard.innerHTML = `
            <div class="question-header">
                <div class="question-meta">
                    <span>👤 ${question.author}</span>
                    <span>🕒 ${formatDate(question.date)}</span>
                    <span>👁️ ${question.views} views</span>
                </div>
                <div class="voting-container">
                    <button class="like-btn ${question.liked ? 'active' : ''}" onclick="toggleLike(${question.id})" data-tooltip="Like">
                        <span class="heart">❤</span>
                        <span class="like-count">${question.likes || 0}</span>
                    </button>
                </div>
            </div>
            <div class="question-text">${question.text}</div>
            <button class="show-answers-btn" onclick="toggleAnswers(${question.id})">
                ${isVisible ? 'Hide Answers' : `Show ${question.answers.length} Answer${question.answers.length !== 1 ? 's' : ''}`}
            </button>
            <div class="answers-list ${isVisible ? '' : 'hidden'}" id="answers-${question.id}">
                ${sortedAnswers.map(answer => `
                    <div class="answer-card ${answer.isAccepted ? 'accepted' : ''}">
                        <div class="voting-container">
                            <button class="upvote-btn ${answer.upvotes > 0 ? 'active' : ''}" 
                                    onclick="upvoteAnswer(${question.id}, ${answer.id})"
                                    data-tooltip="Upvote">
                                <span>▲</span>
                                <span class="vote-count">${answer.upvotes}</span>
                            </button>
                            <button class="downvote-btn ${answer.downvoted ? 'active' : ''}" 
                                    onclick="downvoteAnswer(${question.id}, ${answer.id})"
                                    data-tooltip="Downvote">
                                <span>▼</span>
                            </button>
                            ${!answer.isAccepted ? `
                                <button class="accept-btn" 
                                        onclick="acceptAnswer(${question.id}, ${answer.id})"
                                        data-tooltip="Accept Answer">
                                    <span>✓</span>
                                </button>
                            ` : `
                                <div class="accepted-badge" data-tooltip="Accepted Answer">
                                    <span>✓</span>
                                </div>
                            `}
                        </div>
                        <div class="answer-content">
                            <div class="answer-text">${answer.text}</div>
                            <div class="answer-meta">
                                <span>👤 ${answer.author}</span>
                                <span>🕒 ${formatDate(answer.date)}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <form class="answer-form" onsubmit="event.preventDefault(); addAnswer(${question.id}, this.querySelector('textarea').value); this.reset();">
                <textarea placeholder="Write your answer..." required></textarea>
                <button type="submit" class="btn-primary">Submit Answer</button>
            </form>
        `;

        questionsList.appendChild(questionCard);
    });
}

// Toggle like for a question
function toggleLike(questionId) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.liked = !question.liked;
        question.likes = (question.likes || 0) + (question.liked ? 1 : -1);
        saveData();
        renderQuestions();
    }
}

// Toggle answers visibility
function toggleAnswers(questionId) {
    const answersList = document.getElementById(`answers-${questionId}`);
    const showAnswersBtn = answersList.previousElementSibling;
    const question = questions.find(q => q.id === questionId);
    
    if (answersList.classList.contains('hidden')) {
        answersList.classList.remove('hidden');
        showAnswersBtn.textContent = 'Hide Answers';
        visibleAnswers.add(questionId);
        // Increment view count when answers are shown
        if (question) {
            question.views = (question.views || 0) + 1;
            saveData();
        }
    } else {
        answersList.classList.add('hidden');
        showAnswersBtn.textContent = `Show ${question.answers.length} Answer${question.answers.length !== 1 ? 's' : ''}`;
        visibleAnswers.delete(questionId);
    }
}

// Show question form
function showQuestionForm() {
    console.log('Showing question form');
    const formContainer = document.getElementById('questionFormContainer');
    if (formContainer) {
        formContainer.classList.remove('hidden');
        document.getElementById('questionText').focus();
    } else {
        console.error('Question form container not found');
    }
}

// Hide question form
function hideQuestionForm() {
    console.log('Hiding question form');
    const formContainer = document.getElementById('questionFormContainer');
    if (formContainer) {
        formContainer.classList.add('hidden');
        document.getElementById('questionForm').reset();
    } else {
        console.error('Question form container not found');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize data
    loadData();

    // Question form handlers
    const askQuestionBtn = document.getElementById('askQuestionBtn');
    const questionForm = document.getElementById('questionForm');
    const cancelQuestionBtn = document.getElementById('cancelQuestionBtn');
    const searchInput = document.getElementById('searchInput');

    // Check for required elements
    if (!askQuestionBtn || !questionForm || !cancelQuestionBtn || !searchInput) {
        console.error('Required elements not found:', {
            askQuestionBtn: !!askQuestionBtn,
            questionForm: !!questionForm,
            cancelQuestionBtn: !!cancelQuestionBtn,
            searchInput: !!searchInput
        });
        return;
    }

    console.log('Setting up event listeners');
    
    // Ask Question button click handler
    askQuestionBtn.addEventListener('click', () => {
        console.log('Ask question button clicked');
        showQuestionForm();
    });
    
    // Cancel button click handler
    cancelQuestionBtn.addEventListener('click', () => {
        console.log('Cancel button clicked');
        hideQuestionForm();
    });

    // Question form submit handler
    questionForm.addEventListener('submit', (e) => {
        console.log('Form submitted');
        e.preventDefault();
        const questionText = document.getElementById('questionText').value;
        addQuestion(questionText);
        hideQuestionForm();
    });

    // Search input handler
    searchInput.addEventListener('input', (e) => {
        console.log('Search input changed:', e.target.value);
        filterQuestions(e.target.value);
    });
}); 