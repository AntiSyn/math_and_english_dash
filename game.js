
// Set all the variables for the JS code that will be declared later throughout the game. 
document.addEventListener('DOMContentLoaded', (event) => { 
    let scoreDiv = document.getElementById('score');
    let questionDiv = document.getElementById('question');
    let submitBtn = document.getElementById('submit');
    let startBtn = document.getElementById('start');
    let replayBtn = document.getElementById('replay');
    let gameTypeSelect = document.getElementById('gameType');
    let difficultyLevelSelect = document.getElementById('difficultyLevel');
    let gameStarted = false;
    let answerInput = document.getElementById('answer');
    
// Disables the start button if a game mode has not been chosen yet and enables it once this is true. 
    gameTypeSelect.addEventListener('change', function() {
    if (gameTypeSelect.value !== '') {
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
});

// This function generates the questions onto the HTML file. It fetches the numbers from the 'game.php' file. 
    function newQuestion() {
        let gameType = gameTypeSelect.value;
        let difficultyLevel = difficultyLevelSelect.value;

        fetch('game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'newQuestion=true&gameType=' + encodeURIComponent(gameType) + '&difficultyLevel=' + encodeURIComponent(difficultyLevel),
        })
        .then(response => response.json())
        .then(data => {
            questionDiv.textContent = data.question;
        });
    }


// This function sets which variables will be enabled or disabled depending on their use 
// (e.g. the startBtn.disabled is set to true as the game has already begun meaning their is no need for it). 
    function startGame() {
        gameStarted = true;
        submitBtn.disabled = false;
        startBtn.disabled = true;
        replayBtn.disabled = true;
        gameTypeSelect.disabled = true;
        difficultyLevelSelect.disabled = true;
        newQuestion();
    }

// This event stores the 'gameType' and 'difficultyLevel' into the session to be fetched by the main_game.js' file 
// to then be used in the learning object and relay the respective difficulty and mode that will be tested.   
    startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem('gameType', gameTypeSelect.value);
    sessionStorage.setItem('difficultyLevel', difficultyLevelSelect.value);
    window.location.href = "main_game.html";
});

// This code creates an event where if the game has begun, the answer variables becomes what the user has inputted. 
// Takes care of whether or not the inputted answer is correct or not and replaces the input field to an empty string. 
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (!gameStarted) {
            return;
        }

        let answer = answerInput.value;

        fetch('game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'answer=' + encodeURIComponent(answer),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                scoreDiv.textContent = "Score: ";
                answerInput.value = '';
                newQuestion();
            }
        });
    });


// This patch of code simply resets the score to 0 when the start button is clicked. 
    startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        startGame();
   
    fetch('game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'resetScore=true',
    })
    .then(() => {
        scoreDiv.textContent = "Score: 0";
        startGame();
    });
});

// This patch of code simply resets the score to 0 when the replay button is clicked. 
    replayBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'resetScore=true',
    })
    .then(() => {
        scoreDiv.textContent = "Score: 0";
        scoreDiv = 0; 
        startGame();
    });
});

    
});
