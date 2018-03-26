/*
 * Create a list that holds all of your cards
 */



var listItems = document.getElementsByClassName("card");


// console.log(listItems);

var arrListItems = Array.prototype.slice.call(listItems);
// console.log(arrListItems);

var shuffledArray = shuffle(arrListItems);
// console.log(shuffledArray);


var newList = '';
for (i=0; i<shuffledArray.length; i++) {
	newList += shuffledArray[i].outerHTML;
}

function shuffleCards () {
	document.getElementById("deck").innerHTML = newList;
}

// shuffleCards(); - might be easier to work  with unshuffled cards for other parts



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
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one) --- revealCard()
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one) --- addOpenCard()
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one) --- matchCards()
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one) --- hideCards()
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one) --- updateMoveCounter()
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)  --- checkIfWon()
 */


// max two cards, will be removed straight away. Cards currently revealed but not matched
var openCards = [];
// this only remains useful for console logging.
var matchedCards = [];
//this informs when the game is won
var matchedCount = 0;
// number of moves player has made - counts when cards are matched and when they are hidden
var moveCount = 0;
// to get cards currently showing that are to be matched
var matchingCards;
// to get cards currently showing that do not match and are to be hidden
var displayedCards;

// to access all cards in restart function
var allCards = document.getElementsByClassName('card');

//modal that appears on completing the game
var successModal = document.getElementById('success-modal');

// button that allows modal to be closed
var closeModalButton = document.getElementsByClassName('close-button')[0];

// button on modal that restarts game
var playAgainButton = document.getElementById('button-restart');

// button above game board, always present, always listening, allowing restart
var restartButton = document.getElementsByClassName("restart")[0];


// have restart button active throughout session
restartButton.addEventListener('click', restartGame);





// Game logic and listeners
//start with shuffle

// shuffleCards();


//click event
	document.body.addEventListener('click', function(e) {
		
		// if it is a card that was clicked
		// and a card that isnt being shown
	if (e.target.classList.contains("not-shown") && (document.querySelectorAll('.show').length < 2)) {	
		if (document.querySelectorAll('.not-shown').length == 16 && moveCount === 0) {
			runTimer();
		}
		
		// console.log("card was clicked!");
		// this allows class name of clicked to be compared against array 
		let classMatch = e.target.querySelector('i').className;																	

		
			if (openCards.length < 1) {  // no open cards - first card opened
				// console.log("nothing in the array!");
				//shows the card
				revealCard(e);
				//adds to the open card array
				addOpenCard(e);
				
			} else {  // openCards has something in it, so this card is being compared against the first card that was opened.
				// console.log("there is something in the array");
					if (openCards.includes(classMatch)) {
						// only for console logging
						matchedCards.push(classMatch);
						//shows the card
						revealCard(e);
						// matches the cards, locks them open
						matchCards();
						// increments the move counter by one
						updateMoveCount();
						//resets open cards to zero, re-initialising event listeners
						openCards = [];
					} else {
						// shows the card
						revealCard(e);
						// hides the two open cards as they didn't match
						hideCards();

					}
			}

	}  else {
		console.log("clicked outside cards");
	}
});	



// Functions


function updateMoveCount () {
	moveCount += 1;
	if (moveCount === 1) {
		document.getElementById("moves-made").innerHTML =moveCount+" Move";
	} else {
		document.getElementById("moves-made").innerHTML =moveCount+" Moves";
	}

	adjustStars();
	
	// console.log(moveCount);
}


function matchCards() {
	
		matchedCount += 1;
		// don't want them to turn green instantly
		setTimeout(function() {
		matchingCards = document.querySelectorAll(".show");
		for (let i = 0; i< matchingCards.length; i++) {
			matchingCards[i].className = "card match";
			}
		console.log(matchingCards);
		checkIfWon();
		}, 1000);
}

function hideCards () {
	openCards = [];
	displayedCards = document.querySelectorAll(".show");

	// temporary red colour applied to indicate the cards don't match
	setTimeout(function() {
		for (let i = 0; i< displayedCards.length; i++) {
			displayedCards[i].className += " red-wrong";
			}
	}, 1000);


	setTimeout(function() { 
		// cards hidden
		console.log(displayedCards);
		for (let i = 0; i< displayedCards.length; i++) {
			displayedCards[i].className = "card not-shown";
			}
			}, 3000);
		updateMoveCount();

	}


function revealCard(e) {
	e.target.classList.add('show', 'open');
	e.target.classList.remove('not-shown');
	}

// 
function addOpenCard (e) {
	let classMatch = e.target.querySelector('i').className;
	openCards.push(classMatch);
	}

function checkIfWon () {
	if (matchedCount === 8) {
		// alert("You win! You completed the game in "+moveCount+" moves!");
		stopTimer();
		successModal.style.display='block';
		document.getElementById('success-message').textContent = "You win! You completed the game in "+moveCount+" moves in a time of "+completedTime+"!";
		closeModal();
		

	}
}


function playAgain () {
	playAgainButton.addEventListener('click', restartGame);
	displayTimer.textContent = "0:00";
}

//closing modal functions
function closeModal () {
	closeModalButton.addEventListener('click', function () {
		successModal.style.display = 'none';
	});	
	window.addEventListener('click', windowCloseModal);
	playAgain();
}

function windowCloseModal (e) {
	if (e.target == successModal) {
		successModal.style.display = 'none';
	}
}

function restartGame () {
	// loop all cards and set class to not-shown
	for (let i = 0; i< allCards.length; i++) {
			allCards[i].className = "card not-shown";
			}

	// make sure everything is reset
	shuffleCards();
	moveCount = 0;
	document.getElementById("moves-made").innerHTML = moveCount;
	openCards = [];
	matchedCards = [];
	matchingCards = '';
	displayedCards = '';

	// make sure modal is not displaying
	successModal.style.display = 'none';
	stopTimer();
	displayTimer.textContent = "0:00";
	// Reset move count
	document.getElementById("moves-made").innerHTML =moveCount+" Moves";

}


//timer
const displayTimer = document.querySelector('#timer');
let clock;

var timerStart;
var timeNow;
var timerEnd;

var secondsElapsed;
var minutesElapsed;
var secondsRounded;
var secondsFormatted;
var timeElapsed;

var completedTime;

var clickToRun;
// runTimerOnFirstClick();


function runTimer() {
	timerStart = Date.now();
	clock = setInterval(function() {
	displayTime(clock);
	}, 1000)

	//remove it
	document.removeEventListener('click', runTimer);
}


function stopTimer() {

	clearInterval(clock);
	completedTime = document.querySelector('#timer').textContent;

	// console.log(completedTime);
}

function displayTime(clock) {
	timeNow = Date.now();
	secondsElapsed = (timeNow - timerStart) / 1000;
	minutesElapsed = Math.floor(secondsElapsed / 60);
	// seconds that take number of minutes into account
	secondsRounded = Math.floor(secondsElapsed % 60);
	secondsFormatted = secondsRounded < 10 ? '0'+secondsRounded: secondsRounded;
	timeElapsed = minutesElapsed+":"+secondsFormatted;
	displayTimer.textContent = timeElapsed;
	// console.log(timeElapsed);
}

var starRating = document.getElementsByClassName('stars')[0];

function adjustStars () {
	if (moveCount > 12) {
		starRating.innerHTML = "<li><i class='fa fa-star'></i></li><li><i class='fa fa-star'></i></li>";
	}
	if (moveCount > 18) {
		starRating.innerHTML = "<li><i class='fa fa-star'></i></li>";
	}
	if (moveCount > 25) {
		starRating.innerHTML = "<li><i class='fa fa-star-half'></i></li>";
	}

	if(moveCount > 27) {
		starRating.innerHTML = "<li><i>...</i></li>";
	}
}


// star rating system

// thresholds for moves 12 18 and 25 
// simple if statement after move adjustment function