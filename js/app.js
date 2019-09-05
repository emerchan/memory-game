/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

let card = document.getElementsByClassName("card");
let cards = [...card];

// start the moves with 0
let moves = 0;
let counter = document.querySelector(".moves");

const board = document.getElementById("card-board");

// starts top section
const stars = document.querySelectorAll(".fa-star");


let sameCard = document.getElementsByClassName("same");

let matchedCard = document.getElementsByClassName("match");

let modal = document.getElementById("popupCongratulations");

let close = document.querySelector(".close");

let banDoubleClick = 0;


document.body.onload = startPlay();


/**
* @shuffle change the cards position
* @param {array}  - Cards
*/
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


/**
* @startPlay Reset all the variables to start the game
*/
function startPlay(){
   
    // clean array cards
    openedCards = [];
    
    

    // clean array cards double click
    openedCardsDouble = [];

    // shuffle board
    cards = shuffle(cards);
    
    for (var i = 0; i < cards.length; i++){
    	// remove all exisiting classes from each section
        board.innerHTML = "";
        [].forEach.call(cards, function(item) {
            board.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    // reset moves
    moves = 0;
    counter.innerHTML = moves;
    // reset rating
    for (var i= 0; i < stars.length; i++){
        stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    //reset timer
    seconds = 0;
    minutes = 0; 
    hours = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}

/**
* @startTimer Reset the timer for the game
*/
var seconds = 0, minutes = 0; hours = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minutes+"mins "+seconds+"secs";
        seconds++;
        if(seconds == 60){
            minutes++;
            seconds=0;
        }
        if(minutes == 60){
            hours++;
            minutes = 0;
        }
    },1000);
}

/**
* @displayCard Basically is executed after the click event and reset the card
*/
var displayCard = function (){
    openedCardsDouble.push(this);
    let lenClick = openedCardsDouble.length;
    if(lenClick >= 2){
        if (openedCardsDouble[lenClick-2].id == openedCardsDouble[lenClick-1].id){
            banDoubleClick=1;

        }else{
            this.classList.toggle("open");
            this.classList.toggle("show");
            this.classList.toggle("disabled");
            banDoubleClick=0;
        }
    }else{
        this.classList.toggle("open");
        this.classList.toggle("show");
        this.classList.toggle("disabled");
        banDoubleClick=0;

    }
    
};


function cardOpen() {
    if (banDoubleClick==0){

        
        openedCards.push(this);
        var len = openedCards.length;
        if(len === 2){
            increaseCounter();
            if(openedCards[0].type === openedCards[1].type){
                matched();
            } else {
                unmatched();
            }
        }
    }
};

/**
* @congratulations Show modal and variables of move, time and rating
*/
function congratulations(){
    if (matchedCard.length == 16){
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // show modal
        modal.classList.add("show");

        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        //closeicon on modal
        closePopup();
    };
}


for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",congratulations);
};

/**
* @increaseCounter increase the number of moves
*/
function increaseCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        seconds = 0;
        minutes = 0; 
        hours = 0;
        startTimer();
    }
    // setting rates based on moves
    if (moves > 8 && moves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "collapse";
            }
        }
    }
}

/**
* @matched Execute function for matching cards
*/
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}


/**
* @unmatched If the cards dont match flip over thye cards and reset arrays
*/
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        openedCards = [];
        openedCardsDouble = [];
    },1000);
}


/**
* @disable disbale cards when unmatched

*/
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}



/**
* @enable Enable cards and disable matched cards
*/
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}

/**
* @closePopup Close icon on modal
*/
function closePopup(){
    close.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}

/**
* @startAgain Reset and start
*/

function startAgain(){
    modal.classList.remove("show");

    startPlay();
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
