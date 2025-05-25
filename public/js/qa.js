// Initialize data structure
const STORAGE_KEY = 'farmerQA';
let questions = [];
let filteredQuestions = [];

// Load initial data
function loadData() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        questions = JSON.parse(storedData);
    } else {
        // Seed initial data
        questions = [
            {
                id: 1,
                text: "How do I prevent pests in my wheat crop?",
                answers: [
                    { id: 1, text: "Use neem-based pesticides and rotate crops regularly.", upvotes: 3 },
                    { id: 2, text: "Install pheromone traps around your field.", upvotes: 1 }
                ]
            },
            {
                id: 2,
                text: "What's the best fertilizer for rice?",
                answers: [
                    { id: 1, text: "Urea combined with potassium is effective for rice.", upvotes: 2 }
                ]
            }
        ];
        saveData();
    }
    filteredQuestions = [...questions];
    renderQuestions();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

// Generate unique ID
function generateId() {
    return Date.now();
}

// Add new question
function addQuestion(text) {
    const newQuestion = {
        id: generateId(),
        text: text,
        answers: []
    };
    questions.unshift(newQuestion);
    filteredQuestions = [...questions];
    saveData();
    renderQuestions();
    hideQuestionForm();
}

// Add new answer
function addAnswer(questionId, text) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        const newAnswer = {
            id: generateId(),
            text: text,
            upvotes: 0
        };
        question.answers.push(newAnswer);
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

// Show question form
function showQuestionForm() {
    const formContainer = document.getElementById('questionFormContainer');
    formContainer.classList.remove('hidden');
    document.getElementById('questionText').focus();
}

// Hide question form
function hideQuestionForm() {
    const formContainer = document.getElementById('questionFormContainer');
    formContainer.classList.add('hidden');
    document.getElementById('questionForm').reset();
}

// Filter questions based on search input
function filterQuestions(searchTerm) {
    console.log('Filtering with term:', searchTerm); // Debug log
    if (!searchTerm.trim()) {
        filteredQuestions = [...questions];
    } else {
        const searchLower = searchTerm.toLowerCase();
        filteredQuestions = questions.filter(question => 
            question.text.toLowerCase().includes(searchLower)
        );
    }
    console.log('Filtered questions:', filteredQuestions); // Debug log
    renderQuestions();
}

// Render questions and answers
function renderQuestions() {
    const questionsList = document.getElementById('questionsList');
    const noResultsMessage = document.getElementById('noResultsMessage');
    questionsList.innerHTML = '';

    if (filteredQuestions.length === 0) {
        noResultsMessage.classList.remove('hidden');
        return;
    }

    noResultsMessage.classList.add('hidden');

    filteredQuestions.forEach(question => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        
        // Sort answers by upvotes
        const sortedAnswers = [...question.answers].sort((a, b) => b.upvotes - a.upvotes);

        questionCard.innerHTML = `
            <div class="question-text">${question.text}</div>
            <div class="answers-list">
                ${sortedAnswers.map(answer => `
                    <div class="answer-card">
                        <button class="upvote-btn" onclick="upvoteAnswer(${question.id}, ${answer.id})">
                            <span>▲</span>
                            <span class="upvote-count">${answer.upvotes}</span>
                        </button>
                        <div class="answer-content">${answer.text}</div>
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadData();

    // Question form handlers
    const askQuestionBtn = document.getElementById('askQuestionBtn');
    const questionForm = document.getElementById('questionForm');
    const cancelQuestionBtn = document.getElementById('cancelQuestionBtn');
    const searchInput = document.getElementById('searchInput');

    askQuestionBtn.addEventListener('click', showQuestionForm);
    cancelQuestionBtn.addEventListener('click', hideQuestionForm);

    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const questionText = document.getElementById('questionText').value;
        addQuestion(questionText);
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log('Search input changed:', e.target.value); // Debug log
            filterQuestions(e.target.value);
        });
    } else {
        console.error('Search input element not found!'); // Debug log
    }
}); 