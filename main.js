"use strict";
let data = [];
let current = 0;
async function init() {
    const res = await fetch('questions.json');
    data = await res.json();
    shuffle(data);
    render();
    document.getElementById('card').addEventListener('click', flip);
    document.getElementById('next').addEventListener('click', next);
}
function shuffle(arr) {
    arr.sort(() => Math.random() - 0.5);
}
function flip() {
    document.getElementById('card').classList.toggle('flipped');
}
function next() {
    current = (current + 1) % data.length;
    document.getElementById('card').classList.remove('flipped');
    render();
}
function render() {
    const q = data[current];
    document.getElementById('question').innerText = q.question.zh + "\n" + q.question.en;
    document.getElementById('answer').innerText = q.answer.zh + "\n" + q.answer.en;
}
init();
