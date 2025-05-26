"use strict";
const categoryNames = {
    history: '历史文化',
    unesco_sites: '文化遗产',
    dishes: '传统美食',
    tea: '茶文化',
    festivals: '节庆文化',
    philosophy: '哲学思想',
    art: '艺术文化',
    literature: '文学经典',
    geography: '地理文化',
    architecture: '建筑文化'
};
const state = {
    data: [],
    current: 0,
    answered: new Set(),
    isFlipped: false
};
async function init() {
    try {
        const res = await fetch('questions.json');
        state.data = await res.json();
        shuffle(state.data);
        loadProgress();
        render();
        bindEvents();
        updateStats();
        updateProgress();
        document.addEventListener('keydown', handleKeyPress);
    }
    catch (error) {
        console.error('Failed to load questions:', error);
        showError('题目加载失败，请刷新页面重试');
    }
}
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
function bindEvents() {
    const card = document.getElementById('card');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    card.addEventListener('click', flip);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let touchHandled = false;
    card.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
        touchHandled = false;
    });
    card.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        const diffX = startX - endX;
        const diffY = Math.abs(startY - endY);
        const timeDiff = endTime - startTime;
        if (timeDiff > 1000)
            return;
        if (Math.abs(diffX) > 80 && diffY < 60) {
            if (diffX > 0) {
                next();
            }
            else {
                prev();
            }
            touchHandled = true;
        }
        else if (Math.abs(diffX) < 40 && diffY < 40) {
            flip();
            touchHandled = true;
        }
    });
    card.addEventListener('click', (e) => {
        if (!touchHandled) {
            flip();
        }
    });
}
function flip() {
    const card = document.getElementById('card');
    state.isFlipped = !state.isFlipped;
    card.classList.toggle('flipped', state.isFlipped);
    if (state.isFlipped && !state.answered.has(state.data[state.current].id)) {
        state.answered.add(state.data[state.current].id);
        saveProgress();
        updateStats();
    }
}
function next() {
    if (state.current < state.data.length - 1) {
        state.current++;
        state.isFlipped = false;
        document.getElementById('card').classList.remove('flipped');
        render();
        updateProgress();
    }
}
function prev() {
    if (state.current > 0) {
        state.current--;
        state.isFlipped = false;
        document.getElementById('card').classList.remove('flipped');
        render();
        updateProgress();
    }
}
function render() {
    const q = state.data[state.current];
    if (!q)
        return;
    const questionZh = document.querySelector('.question-zh');
    const questionEn = document.querySelector('.question-en');
    const answerZh = document.querySelector('.answer-zh');
    const answerEn = document.querySelector('.answer-en');
    questionZh.textContent = q.question.zh;
    questionEn.textContent = q.question.en;
    answerZh.textContent = q.answer.zh;
    answerEn.textContent = q.answer.en;
    const categoryText = document.getElementById('category-text');
    categoryText.textContent = categoryNames[q.category] || q.category;
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    prevBtn.disabled = state.current === 0;
    nextBtn.disabled = state.current === state.data.length - 1;
    if (state.current === state.data.length - 1) {
        nextBtn.querySelector('.btn-text').textContent = '完成学习';
    }
    else {
        nextBtn.querySelector('.btn-text').textContent = '下一题';
    }
}
function updateProgress() {
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    progressText.textContent = `题目 ${state.current + 1} / ${state.data.length}`;
    const percentage = ((state.current + 1) / state.data.length) * 100;
    progressFill.style.width = `${percentage}%`;
}
function updateStats() {
    const totalAnswered = document.getElementById('total-answered');
    const completionRate = document.getElementById('completion-rate');
    totalAnswered.textContent = state.answered.size.toString();
    const rate = state.data.length > 0 ? Math.round((state.answered.size / state.data.length) * 100) : 0;
    completionRate.textContent = `${rate}%`;
}
function handleKeyPress(e) {
    switch (e.key) {
        case ' ':
        case 'Enter':
            e.preventDefault();
            flip();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prev();
            break;
        case 'ArrowRight':
            e.preventDefault();
            next();
            break;
    }
}
function saveProgress() {
    try {
        localStorage.setItem('culture-flip-answered', JSON.stringify([...state.answered]));
    }
    catch (error) {
        console.warn('Failed to save progress:', error);
    }
}
function loadProgress() {
    try {
        const saved = localStorage.getItem('culture-flip-answered');
        if (saved) {
            state.answered = new Set(JSON.parse(saved));
        }
    }
    catch (error) {
        console.warn('Failed to load progress:', error);
        state.answered = new Set();
    }
}
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.95);
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 1000;
    text-align: center;
    color: #a0522d;
    font-weight: 500;
  `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 3000);
}
init();
