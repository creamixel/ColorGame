// Reglages du jeu (palette de cinq couleurs distinctes).
const baseColors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
const INITIAL_LIVES = 3;
const START_INTERVAL_MS = 1000;
const ACCELERATION_MS = 100;
const MIN_INTERVAL_MS = 200;

// Elements HTML utilises par le jeu.
const body = document.body;
const btnPlay = document.querySelector('.btn-play');
const btnRestart = document.querySelector('.btn-restart');
const scoreHtml = document.querySelector('.score-display');
const lifesHtml = document.querySelector('.lifes-display');
const topScoreHtml = document.querySelector('.top-score-display');
// Fonctionnalite individuelle : paragraphe affiche sous le bouton.
const feedbackHtml = document.querySelector('.feedback-message');

// Etat du jeu entre les evenements.
let intervalChangementDeCouleurID = null;
let currentBgColor = baseColors[0];
let currentBtnColor = baseColors[1];
let score = 0;
let lifes = INITIAL_LIVES;
let topScore = 0;
let state = 'not_started';

// Retourne un element aleatoire du tableau recu.
function drawArrayElement(arrayToDrawIn) {
    const randomIndex = Math.floor(Math.random() * arrayToDrawIn.length);
    return arrayToDrawIn[randomIndex];
}

// Change l'arriere-plan sans reprendre sa couleur precedente.
function changeBgColor() {
    let colorDrawn = drawArrayElement(baseColors);

    while (colorDrawn === currentBgColor) {
        colorDrawn = drawArrayElement(baseColors);
    }

    body.classList.remove(currentBgColor);
    body.classList.add(colorDrawn);
    currentBgColor = colorDrawn;
}

// Change le bouton sans reprendre sa couleur ni celle de l'arriere-plan.
function changeBtnColor() {
    let colorDrawn = drawArrayElement(baseColors);

    while (colorDrawn === currentBtnColor || colorDrawn === currentBgColor) {
        colorDrawn = drawArrayElement(baseColors);
    }

    btnPlay.classList.remove(currentBtnColor);
    btnPlay.classList.add(colorDrawn);
    currentBtnColor = colorDrawn;
}

// Calcule le delai sans jamais depasser la vitesse maximale prevue.
function getIntervalMs() {
    let delay = START_INTERVAL_MS - (score * ACCELERATION_MS);

    if (delay < MIN_INTERVAL_MS) {
        delay = MIN_INTERVAL_MS;
    }

    return delay;
}

// Arrete l'ancienne minuterie avant d'en demarrer une nouvelle.
function restartColorInterval() {
    clearInterval(intervalChangementDeCouleurID);
    intervalChangementDeCouleurID = setInterval(changeBgColor, getIntervalMs());
}

// Replace les couleurs et les valeurs initiales pour une nouvelle partie.
function startGame() {
    clearInterval(intervalChangementDeCouleurID);
    intervalChangementDeCouleurID = null;

    score = 0;
    lifes = INITIAL_LIVES;
    scoreHtml.textContent = 'Score: ' + score;
    lifesHtml.textContent = 'Vies: ' + lifes;
    topScoreHtml.textContent = 'Meilleur score: ' + topScore;

    feedbackHtml.textContent = '';
    feedbackHtml.classList.remove('feedback-success', 'feedback-error');

    // Retire toute ancienne couleur avant d'appliquer les couleurs de depart.
    for (let i = 0; i < baseColors.length; i++) {
        body.classList.remove(baseColors[i]);
        btnPlay.classList.remove(baseColors[i]);
    }

    currentBgColor = baseColors[0];
    currentBtnColor = baseColors[1];
    body.classList.add(currentBgColor);
    btnPlay.classList.add(currentBtnColor);

    btnRestart.hidden = true;
    btnPlay.hidden = false;
    btnPlay.disabled = false;
    btnPlay.textContent = '';
    state = 'started';
    restartColorInterval();
}

// Termine la partie sans effacer le score final ni le meilleur score.
function finishGame() {
    clearInterval(intervalChangementDeCouleurID);
    intervalChangementDeCouleurID = null;
    state = 'finished';
    btnPlay.disabled = true;
    btnPlay.hidden = true;
    btnRestart.hidden = false;
}

// Traite une reussite ou une erreur en mettant a jour l'interface.
function compareColor() {
    if (currentBgColor === currentBtnColor) {
        score++;
        scoreHtml.textContent = 'Score: ' + score;
        feedbackHtml.textContent = 'Bravo! +1';
        feedbackHtml.classList.remove('feedback-error');
        feedbackHtml.classList.add('feedback-success');

        if (score > topScore) {
            topScore = score;
            topScoreHtml.textContent = 'Meilleur score: ' + topScore;
        }

        restartColorInterval();
    } else {
        lifes--;
        lifesHtml.textContent = 'Vies: ' + lifes;
        feedbackHtml.textContent = 'Oups!!! -1 vie';
        feedbackHtml.classList.remove('feedback-success');
        feedbackHtml.classList.add('feedback-error');
    }
}

// Reagit au clic sur le bouton principal selon l'etat de la partie.
function btnPlayClickHandler() {
    if (state === 'not_started') {
        startGame();
        return;
    }

    if (state !== 'started') {
        return;
    }

    compareColor();

    if (lifes <= 0) {
        finishGame();
        return;
    }

    changeBtnColor();
}

// Branche les actions de jeu et de nouvelle partie.
btnPlay.addEventListener('click', btnPlayClickHandler);
btnRestart.addEventListener('click', startGame);
