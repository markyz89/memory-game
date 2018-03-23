/*
 * Create a list that holds all of your cards
 */



var listItems = document.getElementsByClassName("card");


// console.log(listItems);

var arrListItems = Array.prototype.slice.call(listItems);
// console.log(arrListItems);

var shuffledArray = shuffle(arrListItems);
console.log(shuffledArray);


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


// Game logic and listeners
//start with shuffle

shuffleCards();

//click event
	document.body.addEventListener('click', function(e) {
		// if it is a card that was clicked
		// and a card that isnt being shown
	if (e.target.classList.contains("not-shown")) {	
																			
		console.log("card was clicked!");
		// this allows class name of clicked to be compared against array 
		let classMatch = e.target.querySelector('i').className;
																			
			// turns off event listeners while two unmatched cards are showing (so no more can be clicked)
			// actually an error that accomplises desired outcome anyway...not ideal
			if (document.querySelectorAll('.show').length == 2) {	
				console.log("not listening!");		
				document.getElementsByClassName('.card').removeEventListener('click', function(){
					
				})
				
			} else {
				console.log("still listening");
			}
	
			

		
			if (openCards.length < 1) {  // no open cards - first card opened
				console.log("nothing in the array!");
				//shows the card
				revealCard(e);
				//adds to the open card array
				addOpenCard(e);
				
			} else {  // openCards has something in it, so this card is being compared against the first card that was opened.
				console.log("there is something in the array");
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
	document.getElementById("moves-made").innerHTML = moveCount;
	console.log(moveCount);
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
		alert("You win! You completed the game in "+moveCount+" moves!");
	}
}