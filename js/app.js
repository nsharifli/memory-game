
const icons = [
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-anchor',
  'fa-leaf',
  'fa-bicycle',
  'fa-diamond',
  'fa-paper-plane-o',
  'fa-bolt',
  'fa-cube',
  'fa-leaf',
  'fa-bicycle',
  'fa-bomb',
  'fa-bomb'
];

let gameState = { moves: 0, currentOpenCard: null, timerId: null }

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

function createCardElements(cards) {
  const fragment = document.createDocumentFragment(),
      cardDeck = document.querySelector('.deck');

  cardDeck.innerHTML = null;

  for (let card of cards) {
    const cardElement = document.createElement('li');
    cardElement.className = 'card';
    cardElement.innerHTML = `<i class="fa ${card.icon}"></i>`;
    cardElement.id = card.id;

    fragment.appendChild(cardElement);
  }     

  cardDeck.appendChild(fragment);
}

function addClickHandlertoCardElements(cards) {
  const cardElements = document.querySelectorAll('.card');
  for (let cardElement of cardElements) {
    cardElement.addEventListener('click', function (event) {
      let cardObject = findCardBy(cards, cardElement.id);
      if (cardObject.matched || cardObject.open) return;

      gameState.moves += 1;
      cardObject.open = true;
      cardElement.classList.toggle('open');
      compareCards(cardObject);
      updateMovesCounter();
      updateStars();
      setTimeout(updateCards, 1000, cardElements, cards);
    });
  }
}

function createCards(icons) {
  let cards = [],
      cardId = 0;
  for (let icon of icons) {
    let card = { open: false, icon: icon, matched: false, id: cardId };
    cardId += 1;

    cards.push(card);
  }

  return cards;
};

function startGame() {
  let cards = createCards(icons);

  shuffle(cards);

  createCardElements(cards);

  gameState.moves = 0;
  clearInterval(gameState.timerId);
  gameState.timerId = timer(cards);

  updateMovesCounter(gameState.moves);
  updateStars(gameState.moves);

  addClickHandlertoCardElements(cards);
  addEventListenerToRestartButton();
  addEventListenerToPlayAgainButton();
}

startGame();

function compareCards(card) {
  if (gameState.currentOpenCard == null) {
    gameState.currentOpenCard = card;
  } else {
    if (cardsMatch(gameState.currentOpenCard, card)) {
      gameState.currentOpenCard.matched = true;
      card.matched = true;
    } else {
      gameState.currentOpenCard.open = false;
      card.open = false;
    }
    gameState.currentOpenCard = null;
  }
}

function cardsMatch(firstCard, secondCard) {
  return firstCard.icon === secondCard.icon;
}

function findCardBy(cards, id) {
  let cardId = parseInt(id);

  return cards.find( card =>  card.id == cardId);
}

function updateCards(cardElements, cards) {
  for (let cardElement of cardElements) {
    cardObject = findCardBy(cards, cardElement.id);
    cardElement.classList.toggle('open', cardObject.open);
    cardElement.classList.toggle('match', cardObject.matched);
  }

  if (allCardsMatched(cards)) { openWinningModal() };
}

function updateMovesCounter() {
  let movesCounterElement = document.querySelector('.moves');

  movesCounterElement.innerText = gameState.moves;
}

function updateStars() {
  let starsElement = document.querySelector('.stars')

  switch (gameState.moves) {
    case 24:
      starsElement.removeChild(starsElement.lastElementChild);
      break;
    case 32:
      starsElement.removeChild(starsElement.lastElementChild);
  }
}

function allCardsMatched(cards) {
  return cards.every(isMatched);
}

function isMatched(card) {
  return card.matched;
}

function openWinningModal() {
  let modal = document.querySelector('#winning-modal');

  modal.style.display = "block";
}

function closeWinningModal() {
  let modal = document.querySelector('#winning-modal');

  modal.style.display = "none";
}

function timer(cards) {
  let n = 0;

  const intervalId = setInterval(() => { 
    document.querySelector('.fa-hourglass').innerText = formatTime(n);
    n += 1;
    if (allCardsMatched(cards)) {
      clearInterval(intervalId);
    }
  }, 1000);

  return intervalId;
}

function formatTime(seconds) {
  let   min = Math.floor(seconds / 60),
        sec = seconds % 60;

  if (min < 10) {
    min = `0${min}`
  }
  if (sec < 10) {
    sec = `0${sec}`
  }

  return `${min}:${sec}`;
}

function addEventListenerToRestartButton() {
  const restartButton = document.querySelector('.fa-repeat');
  restartButton.addEventListener("click", startGame);
}

function addEventListenerToPlayAgainButton() {
  const playAgainButton = document.querySelector('.play-again-button');
  playAgainButton.addEventListener("click", playAgain);
}

function playAgain() {
  closeWinningModal();

  startGame();
}
