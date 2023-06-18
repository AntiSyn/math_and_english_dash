
// Declare all the variables in the JavaScript file and fetch their respective values. 
document.addEventListener('DOMContentLoaded', (event) => {
    let scoreDiv = document.getElementById('score');
    let timerDiv = document.getElementById('timer');
    let questionDiv = document.getElementById('question');
    let submitBtn = document.getElementById('submit');
    let answerInput = document.getElementById('answer');
    let startTime;
    let gameStarted = false;
    let gameType = sessionStorage.getItem('gameType');
    let difficultyLevel = sessionStorage.getItem('difficultyLevel');
    let player = document.getElementById('player');
    let opponent1 = document.getElementById('opponent1');
    let gameEnded = false;
    let replayBtn = document.getElementById('replay');
    let playerSpeed = 5;
    let opponent1Speed = 9;
    // Set the width of the track to the full width - 80px from the right edge to allow a buffer for the runners to stop. 
    let trackWidth = document.getElementById('track').offsetWidth - 80;
    let playerTime, opponent1Time;

    
// Sends users to the home page ('index.html') file. 
    replayBtn.addEventListener('click', function() {
    window.location.href = "index.html";
});

// This functions ends the game and sets the specified variables to specific conditions.
// It also sets the 'times' variable to the players' times and sorts them in order to generate the placings. 
    function endGame() {
    gameStarted = false;
    gameEnded = true; 
    submitBtn.disabled = true;
    

    let times = [
        {name: 'Player', time: playerTime},
        opponent1Time ? {name: 'Opponent 1', time: opponent1Time} : null,
        
    ].filter(runner => runner !== null);
// Sorts the times of the runners to determine who finished the race first
    times.sort((a, b) => a.time - b.time);

    let placement = times.findIndex(runner => runner.name === 'Player') + 1;
    timerDiv.textContent = "Your time: " + playerTime + " seconds. Your placement: " + placement;
}



// This function fetches the 'gameType' and 'difficultyLevel' for the learning object and then displays it on the 'main_game.html' page. 
    function newQuestion() {
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

// This function sets the time variable and other variables to their respective conditions to ensure the game runs as expected. 
    function startGame() {
        startTime = Date.now();
        gameStarted = true;
        submitBtn.disabled = false;
        newQuestion();
        // This will be used to mimic the movement of the runners 'running' across the screen despite their distance away from the 
        // left of the screen simply being increased. 
        player.style.left = '0px';
        opponent1.style.left = '0px';
    }

// This functions updates the runners' positions at a constant rate away from the screen to mimic the action of running. 
     function updateRunnerPositions() {
        if (player.offsetLeft < trackWidth && !playerTime) {
        player.style.left = (player.offsetLeft + playerSpeed) + 'px';
    } else if (!playerTime) {
// Finds the difference between the current time and the time that was declared previously in the 'startGame' function. 
        playerTime = Date.now() - startTime;
        gameEnded = true;
    }
        if (opponent1.offsetLeft < trackWidth && !opponent1Time) {
            opponent1.style.left = (opponent1.offsetLeft + opponent1Speed) + 'px';
        }
        
    }

// This function checks whether the game has start OR ended, if so, the 'updateRunnerPositions' function is returned. 
    setInterval(function() {
    if (!gameStarted || gameEnded) {
        return;
    }

    updateRunnerPositions();
// If the player or opponent's offset left to the screen is greater than that of the 'trackWidth', record their time. 
    if (player.offsetLeft >= trackWidth && !playerTime) {
        playerTime = (Date.now() - startTime)/1000; // Convert the time to seconds so that it makes more sense to the 10-13 year old users.
        
    
    }
    if (opponent1.offsetLeft >= trackWidth && !opponent1Time) {
        opponent1Time = (Date.now() - startTime)/1000;
    }
    // Finds if the times of the player and opponent or their offsets away from the left of the screen are greater than the 'track' thus ending the game. 
    if ((playerTime && opponent1Time) || 
        (player.offsetLeft >= trackWidth && opponent1.offsetLeft >= trackWidth )) {
        gameEnded = true;
        // If the player's time was less than the opponent's time, the confetti effect is played, if not, an alert is sent. 
        if (playerTime < opponent1Time) {
            // Iteration component to declare function several times. 
            for (var i=1; i<=5; i++) {
                // Confetti function with specific parameters. 
                confetti({
                    spread: 1000,
                    particleCount: 250,
                    startVelocity: 50
                  });
            }
        } else alert('Better luck next time!');
        

        endGame();
        return;
    }
        

// Relay this in the HTML file. 
    let elapsedTime = (Date.now() - startTime)/1000;
    timerDiv.textContent = "Elapsed Time: " + elapsedTime + " seconds";
}, 100);

// When the submit button is clicked, if the game has started or the player's offset
// to the left is great or equal to, then return the following. 
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (!gameStarted || player.offsetLeft >= trackWidth) {
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
            // If the user's response was correct, then relay 'Score: ' to the html file plus the stored data score. 
            // Also increase the player's 'offset speed' by 1, however, if the user got this wrong, send an alert saying 
            // 'Incorrect' and reduce their 'offset speed' by 2.5. 
            if (data.success) {
                scoreDiv.textContent = "Score: " + data.score;
                answerInput.value = '';
                playerSpeed += 1; 
                newQuestion();
            } else {
                alert('Incorrect!');
                playerSpeed -= 2.5; 
                if (playerSpeed < 0) playerSpeed = 0; 
            }
        });
    });

    startGame();
});

