//Creating Game object
class Game {
    constructor(timeLeft, score, isOver) {
        this.timeLeft = timeLeft;
        this.score = score;
        this.isOver = isOver;
        this.word;
        this.correct;
    }
    //Init is used when the window is loaded
    init() {
        //Display the number of seconds in the game
        ui.displayTimeframe(time);
        //Display the score of 0 in the beginning
        ui.displayScore(0);
        //Create a word as the page loads
        game.getWord();
        // Timer for counting down the time left
        setInterval(game.timer, 1000);
        // Checking the status of game every 50 miliseconds
        setInterval(game.status, 50);
        //Listening for the input field
        ui.listenToInput();
    }
    //Returns a random word from the array words
    getWord() {
        let index = Math.floor(Math.random() * words.length);

        game.word = words[index];

        ui.displayWord(game.word);
    }
    //A timer is used to count down seconds
    timer() {
        ui.displayTime(game.timeLeft);

        if (game.timeLeft > 0) {
            game.timeLeft--;
            game.isOver = false;
        } else {
            game.isOver = true;
        }
    }

    // Check for a game status every 50 milliseconds
    status() {
        if (game.isOver === true) {
            ui.displayStatus('Game is Over!', 'red');
        } else {
            ui.displayStatus('Game is ON!', 'blue');
        }
    }

    // Compares an input word to the typing word
    compareWord() {
        if (ui.inputWord() === game.word) {
            if (game.isOver === true){
                game.isOver = false;
                game.timeLeft = time - 1;
                game.score = 0;
            } else {
                game.score++;
                game.timeLeft = time - 1;
            }
            
            //refresh score after every correct word
            ui.displayScore(game.score);

            //refresh the input field
            ui.clearInput();

            //get a new word to type
            game.getWord();
        }
    }

}

class UI {
    //Display the main typing word
    displayWord(word) {
        document.querySelector('#word').innerHTML = word;
    }

    displayScore(score) {
        document.querySelector('#score').innerHTML = score;
    }

    //Change the color of UI depending on different game statuses
    displayStatus(message, color) {
        document.querySelector('#message').innerHTML = message;
        document.querySelector('#message').style.color = color;

        if (color === 'red') {
            document.querySelector('#word').style.color = color;
        } else {
            document.querySelector('#word').style.color = 'initial';
        }
    }

    displayTime(time) {
        document.querySelector('#time-left').innerHTML = time;
    }

    listenToInput() {
        
        document.querySelector('#word-input').addEventListener('input', game.compareWord);
    }

    clearInput() {
        document.querySelector('#word-input').value = '';
    }

    inputWord() {
        return document.querySelector('#word-input').value;
    }

    displayTimeframe(time) {
        document.querySelector('#timeframe').innerHTML = time;
    }
}



const time = 5;
let allWords;
let words = [];

//Fetch the words from the local file - can be modified to an external API
fetch('words.txt')
.then((response) => response.text())
.then((response) => {
    console.log('reading...')
    allWords = response.split('\n');
    
    for(let i = 0; i < allWords.length; i++) {
        if (allWords[i].includes(' ') === false) {
            words.push(allWords[i]);
        }
    }
})
.catch((error) => {
    words.push(error);
    console.log(error);
});


//Initiate a game object
const game = new Game(time, 0, false);

//Initiate a UI object
const ui = new UI;

//Load a word when the window loads
window.addEventListener('load', game.init);
