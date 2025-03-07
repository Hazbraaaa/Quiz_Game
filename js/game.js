import { quizzes } from "./questions.js";
import { stockScore } from "./score.js";


// init variables

const message = document.querySelector('#message');
const infoContainer = document.querySelector('#info-container');
const choicesContainer = document.querySelector('#choices-container');
const nextButton = document.querySelector('#next-button');
const replayButton = document.querySelector('#replay-button');
const whichQuestion = document.querySelector('#current-question');
const progressContainer = document.querySelector('#progress-container');
const progress = document.querySelector('#progress');
const timer = document.querySelector('#timer');
const navQuizName = document.querySelector('#quiz-name');
let currentQuiz;
let currentQuestionIndex = 0;
export let score = 0;
export let quizName;




// init functions


function loadQuiz() {
    switch (localStorage.getItem("currentQuiz")) {
        case "quiz_RRRrrrr":
            navQuizName.innerText = "RRRrrrr";
            quizName = "RRRrrrr";
            break;
        case "quiz_Oss117":
            navQuizName.innerText = "OSS 117";
            quizName = "Oss117";
            break;
        case "quiz_CitéDeLaPeur":
            navQuizName.innerText = "La Cité de la Peur";
            quizName = "CitéDeLaPeur";
            break;
    }
    currentQuiz = quizzes[localStorage.getItem("currentQuiz")];
}

function loadQuestion() {
    if (currentQuestionIndex === currentQuiz.questions.length) {
        currentQuestionIndex = 0;
        score = 0;
    } // checking pbs of refreshing nav

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];

    message.style.display = "none";
    choicesContainer.textContent = "";
    whichQuestion.innerText = `Question ${currentQuestionIndex + 1}`;
    progress.value = (currentQuestionIndex / currentQuiz.questions.length) * 100;
    nextButton.disabled = true;
    infoContainer.innerText = currentQuestion.text;

    createTimer();
    createButton(currentQuestion);
    answering();
}

function createTimer() {
    let time = 15;

    timer.innerText = `Temps restant = ${time} secondes`;
    let intervalID = setInterval(() => {
        timer.innerText = `Temps restant = ${time} secondes`;
        if (time === 0) {
            timeUpMessage();
            localStorage.setItem(`currentQuestionIndex_${quizName}`, currentQuestionIndex + 1);
            clearInterval(intervalID);
        }
        if (!nextButton.disabled) {
            localStorage.setItem(`currentQuestionIndex_${quizName}`, currentQuestionIndex + 1);
            clearInterval(intervalID);
        }
        time--;
    }, 1000);
}

function createButton(currentQuestion) {
    currentQuestion.choices.forEach((element) => {
        const choice = document.createElement('button');
        choice.innerText = element;
        choice.classList.add('choice');
        choicesContainer.appendChild(choice);
    });
}

function answering() {
    const choicesArray = document.querySelectorAll('.choice');

    choicesArray.forEach((element) => {
        element.addEventListener("click", () => {
            checkAnswer(element);
            nextButton.disabled = false;
            choicesArray.forEach((element) => {
                element.disabled = true;
            })
        })
    });
}

function checkAnswer(selectedChoice) {
    if (selectedChoice.innerText === currentQuiz.questions[currentQuestionIndex].answer) {
        selectedChoice.classList.add('correct');
        score++;
    }
    else {
        selectedChoice.classList.add('wrong');
    }
}

function showMessage(score) {
    if (score < (currentQuiz.questions.length / 3)) {
        message.innerText = "Pas terrible comme score !";
    }
    else if (score > (currentQuiz.questions.length / 3) && score < (currentQuiz.questions.length * 2 / 3)) {
        message.innerText = "Pas mal, t'y es presque !";
    }
    else {
        message.innerText = "Quelle encyclopédie !";
    }
}

function timeUpMessage() {
    const choicesArray = document.querySelectorAll('.choice');

    timer.innerText = "Trop lent !";
    nextButton.disabled = false;
    choicesArray.forEach((element) => {
        element.disabled = true;
    })
}

function updateLocalStorage() {
    if (localStorage.getItem(`currentQuestionIndex_${quizName}`)) {
        currentQuestionIndex = Number(localStorage.getItem(`currentQuestionIndex_${quizName}`));
        score = Number(localStorage.getItem(`score_${quizName}`));
    }
}


// execute code

loadQuiz();
updateLocalStorage();
loadQuestion();
nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    localStorage.setItem(`currentQuestionIndex_${quizName}`, currentQuestionIndex);
    localStorage.setItem(`score_${quizName}`, score);
    if (currentQuestionIndex < currentQuiz.questions.length) {
        loadQuestion();
    }
    else {
        infoContainer.innerText = `Fin du game ! Ton Score = ${score}/${currentQuiz.questions.length}`;
        showMessage(score);
        choicesContainer.textContent = "";
        message.style.display = "block"
        progressContainer.style.display = "none";
        nextButton.style.display = "none";
        replayButton.style.display = "inline-block";
        stockScore();
        localStorage.removeItem(`currentQuestionIndex_${quizName}`);
        localStorage.removeItem(`score_${quizName}`);
    }
})
replayButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    progressContainer.style.display = "inline-block";
    replayButton.style.display = "none";
    nextButton.style.display = "inline-block";
    loadQuestion();
})