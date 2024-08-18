let states;
const alreadyGuessed = new Map();
let score = 0;
let submit = document.getElementById('submit');
let playerInput = document.getElementById('playerInput');
let stateNumber = 0;
let reset = document.getElementById('reset');

submit.addEventListener('click', function() {
  if(score != 51) {
    checkCorrect();
  }
})

playerInput.addEventListener('keypress', function(event) {
  if(event.key === "Enter" && score != 51){
    event.preventDefault();
    checkCorrect();
  }
})

reset.addEventListener('click', function() {
  location.reload();
})



// Get states from server
const res = await fetch('http://localhost:8080/getStates');
states = await res.json();

// Random state number
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Random color for state fill
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Check if state that's been randomly selected
// is already in the hash map
function isInMap() {
  score++;
  let inMap = true;
  if(score == 51) {
    document.getElementById('guess').innerHTML = ('Congrats, you win!');
  }
  while(inMap && score != 51) {
    const rndInt = randomIntFromInterval(0, 49);
    stateNumber = rndInt;
    const randomState = states[rndInt][1];
    if(!alreadyGuessed.get(rndInt)) {
      alreadyGuessed.set(rndInt, states[rndInt]);
      document.getElementById(randomState).style.fill=getRandomColor();
      document.getElementById('guess').innerHTML  = ('Guess the capital of ' + states[rndInt][0]);
      inMap = false;
    }
  }
}

// See if player is correct or not
function checkCorrect() {
  document.getElementById('notQuite').style="visibility: hidden";
  let guess = playerInput.value;
  if(guess == states[stateNumber][2]) {
    playerInput.value = '';
    document.getElementById('score').innerHTML = ('Score: ' + score);
    isInMap();
  }
  else{
    playerInput.value = '';
    document.getElementById('notQuite').style="visibility: visible";
  }
}

// Run the program
isInMap();

