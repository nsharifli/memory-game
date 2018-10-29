/*
 * Create a list that holds all of your cards
 */

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
  'fa-anchor',
  'fa-bolt',
  'fa-cube',
  'fa-anchor',
  'fa-leaf',
  'fa-bicycle'
];

let cards = [],
    cardId = 0;
for (let icon of icons) {
  let card = { open: false, icon: icon, matched: false, id: cardId };
  cardId++;

  cards.push(card);
};

let moves = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

shuffle(cards);

const fragment = document.createDocumentFragment(),
      cardDeck = document.querySelector('.deck');

for (let card of cards) {
  const cardElement = document.createElement('li');
  cardElement.className = 'card';
  cardElement.innerHTML = `<i class="fa ${card.icon}"></i>`;
  cardElement.id = card.id;

  fragment.appendChild(cardElement);
}     


cardDeck.appendChild(fragment);


let currentOpenCard = null;
timer();

const cardElements = document.querySelectorAll('.card');
for (let cardElement of cardElements) {
  cardElement.addEventListener('click', function (event) {
    let cardObject = findCardBy(cardElement.id);
    if (cardObject.matched || cardObject.open) return;
    moves++
    cardObject.open = true;
    cardElement.classList.toggle('open');
    compareCards(cardObject);
    updateMovesCounter(moves);
    updateStars(moves);
    setTimeout(updateCards, 1000);
  });
}

function compareCards(card) {
  if (currentOpenCard == null) {
    currentOpenCard = card;
  } else {
    if (cardsMatch(currentOpenCard, card)) {
      currentOpenCard.matched = true;
      card.matched = true;
    } else {
      currentOpenCard.open = false;
      card.open = false;
    }
    currentOpenCard = null;
  }
}

function cardsMatch(firstCard, secondCard) {
  return firstCard.icon === secondCard.icon;
}

function findCardBy(id) {
  let cardId = parseInt(id);

  return cards.find( card =>  card.id == cardId);
}

function updateCards() {
  for (let cardElement of cardElements) {
    cardObject = findCardBy(cardElement.id);
    cardElement.classList.toggle('open', cardObject.open);
    cardElement.classList.toggle('match', cardObject.matched);
  }

  if (allCardsMatched()) { openWinningModal() };
}

function updateMovesCounter(moves) {
  let movesCounterElement = document.querySelector('.moves');

  movesCounterElement.innerText = moves;
}

function updateStars(moves) {
  let starsElement = document.querySelector('.stars')

  switch (moves) {
    case 24:
      starsElement.removeChild(starsElement.lastElementChild);
      break;
    case 32:
      starsElement.removeChild(starsElement.lastElementChild);
  }
}

function allCardsMatched() {
  return cards.every(isMatched);
}

function isMatched(card) {
  return card.matched;
}

function openWinningModal() {
  let modal = document.querySelector('#winning-modal');

  modal.style.display = "block";
}

function timer() {
  let n = 0;

  const intervalId = setInterval(() => { 
    document.querySelector('.fa-hourglass').innerText = n;
    n += 1;
    console.log(n);
    if (allCardsMatched()) {
      clearInterval(intervalId);
    }
  }, 1000);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
