<?php
session_start();

header('Content-Type: application/json');
# Check if the score variable exists and set it to 0. 
if (!isset($_SESSION['score'])) {
    $_SESSION['score'] = 0;
}
# Generate an empty array to contain session variables and other values throughout the program. 
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['answer'])) {
    $response = [];

    if ($_POST['answer'] == $_SESSION['correct_answer']) {
        $_SESSION['score']++;
        $response['success'] = true;
        $response['score'] = $_SESSION['score'];
    } else {
        $response['success'] = false;
    }
# Encode to JSON to be relayed to the JS file. 
    echo json_encode($response);
}
# If the 'newQuestion' variable exists, then let 'type' equal the chosen 'gameType' and 'difficulty' equal the chosen 'difficultyLevel'. 
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['newQuestion'])) {
        $type = $_POST['gameType'];
        $difficulty = $_POST['difficultyLevel'];

        if (empty($type)) {
        return; 
        }
        # If the 'gameType' is math, then get the difficulty that was chosen, generate two random numbers from arrays '0' and '1'. 
        if ($type == 'math') {
            $difficultyLevels = getDifficulty($difficulty);
            $num1 = rand(1, $difficultyLevels[0]);
            $num2 = rand(1, $difficultyLevels[1]);
            # If the relayed difficulty is 'medium', check if the first generated number is smaller than the second.
            # If this is true, flip these numbers.
            if ($difficulty == 'medium') {
                if($num1 < $num2) {
                $temp = $num1;
                $num1 = $num2;
                $num2 = $temp;
            }
                $_SESSION['correct_answer'] = $num1 - $num2;
                $question = "$num1 - $num2";
            } elseif ($difficulty == 'hard') {
                # If the difficulty is 'hard', change the operation to multiplication. 
                $_SESSION['correct_answer'] = $num1 * $num2;
                $question = "$num1 * $num2";
            } else {
                # If is neither 'medium' nor 'hard', then simply assume the difficulty is easy and 
                # change the operation to addition. 
                $_SESSION['correct_answer'] = $num1 + $num2;
                $question = "$num1 + $num2";
            }
        } else {
            $words = getWords($difficulty);
            $word = $words[array_rand($words)];
            $_SESSION['correct_answer'] = $word;
            $question = str_shuffle($word);
        }
        $response = ['question' => $question];
        echo json_encode($response);
    }
}

# Return a specific first amount of numbers from 1 depending on the difficulty. 
# For instance, if the chosen difficulty was 'medium', the program would return a random number from
# 1-20 for the first number while a random number from 1-10 would be chosen for the second number. 
function getDifficulty($difficulty) {
    switch ($difficulty) {
        case 'easy': return [10, 10];
        case 'medium': return [20, 10];
        case 'hard': return [12, 12];
        default: return [10, 10];
    }
}

# Simple brute force was used here to generate an array of words to be fetched for the English game. 
# The easy words are only 3 letters, medium are 4 and hard are 5. They are also capitalized to provide
# hints on the required word as some groups of letters can create more than one word. 
function getWords($difficulty) {
    $easyWords = ["And", "Fix", "Own", "Are", "Fly", "Odd", "Ape", "Fry", "Our", "Ace", "For", "Pet", "Act", "Got", "Pat", "Ask", "Get", "Peg", "Arm", "God", "Paw", "Age", "Gel", "Pup", "Ago", "Gas", "Pit", "Air", "Hat", "Put", "Ate", "Hit", "Pot", "All", "Has", "Pop", "But", "Had", "Pin", "Bye", "How", "Rat", "Bad", "Her", "Rag", "Big", "His", "Rub", "Bed", "Hen", "Row", "Bat", "Ink", "Rug", "Boy", "Ice", "Run", "Bus", "Ill", "Rap", "Bag", "Jab", "Ram", "Box", "Jug", "Sow", "Bit", "Jet", "See", "Bee", "Jam"];
    $mediumWords = ["Also", "Able", "Acid", "Aged", "Away", "Baby", "Back", "Bank", "Been", "Ball", "Base", "Busy", "Bend", "Bell", "Bird", "Come", "Came", "Calm", "Card", "Coat", "City", "Chat", "Cash", "Crow", "Cook", "Cool", "Dark", "Each", "Evil", "Even", "Ever", "Face", "Fact", "Four", "Five", "Fair", "Feel", "Fell", "Fire", "Fine", "Fish", "Game", "Gone", "Gold", "Girl", "Have", "Hair", "Here", "Hear", "Into", "Iron", "Jump", "Kick", "Kill", "Life", "Like", "Love", "Main", "Move", "Meet", "More", "Nose", "Near", "Open", "Only", "Push", "Pull", "Sell", "Sale"];
    $hardWords = ["Drove", "Fifty", "Glass", "House", "Dying", "Fight", "Globe", "Human", "Eager", "Final", "Going", "Ideal", "Early", "First", "Grace", "Image", "Earth", "Fixed", "Grade", "Index", "Eight", "Flash", "Grand", "Inner", "Elite", "Fleet", "Grant", "Input", "Empty", "Floor", "Grass", "Issue", "Enemy", "Fluid", "Great", "Irony", "Enjoy", "Focus", "Green", "Juice", "Enter", "Force", "Gross", "Joint", "Judge", "Metal", "Media", "Newly", "Known", "Local", "Might", "Noise", "Label", "Logic", "Minor", "North", "Large", "Loose", "Minus", "Noted", "Laser", "Lower", "Mixed", "Novel", "Later", "Lucky", "Model", "Nurse", "Laugh", "Lunch", "Money", "Occur", "Layer", "Lying", "Month", "Ocean", "Learn", "Magic", "Moral", "Offer", "Lease", "Major", "Motor", "Often", "Least", "Maker", "Mount", "Order", "Leave", "March", "Mouse", "Other", "Legal", "Music", "Mouth", "Ought", "Level", "Match", "Movie", "Paint", "Light", "Mayor", "Needs", "Paper", "Limit", "Meant", "Never", "Party", "Peace", "Power", "Radio"];

    switch ($difficulty) {
        case 'easy': return $easyWords;
        case 'medium': return $mediumWords;
        case 'hard': return $hardWords;
        default: return $easyWords;
    }
}

# Resets the score at the end of the session. 
if (isset($_POST['resetScore'])) {
    $_SESSION['score'] = 0;
    exit();
}

?>

