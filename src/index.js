let states;
let alreadyGuessed = new Map();
let score = 0;
let submit = document.getElementById('submit');
let playerInput = document.getElementById('playerInput');
let notQuite = document.getElementById('notQuite');
let stateNumber = 0;
let reset = document.getElementById('reset');
let attempts = 3;

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

const handleResize = () => {
  document.getElementById('header').style.top = window.visualViewport.offsetTop.toString() + 'px'
}

if (window && window.visualViewport) visualViewport.addEventListener('resize', handleResize)



reset.addEventListener('click', function() {
  resetMap();
})



// Get states from server
const res = await fetch('https://api.cohagancreates.com:8080/getStates');
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
  notQuite.style.display="none";
  let guess = playerInput.value;
  if(guess.toUpperCase().trim() == states[stateNumber][2].toUpperCase().trim()) {
    playerInput.value = '';
    document.getElementById('score').innerHTML = ('Score: ' + score);
    isInMap();
  }
  else if (guess !== '' && guess.toUpperCase().trim() !== states[stateNumber][2].toUpperCase().trim() && attempts > 1) {
    playerInput.value = '';
    notQuite.style.display="block";
    attempts--;
    document.getElementById('attempts').innerHTML = ('Attempts: ' + attempts);
  }
  else if (guess === '') {
    playerInput.value = '';
    notQuite.style.display="block";
    notQuite.innerHTML = ('Input cannot be blank.');
  }
  else{
    attempts--;
    document.getElementById('attempts').innerHTML = ('Attempts: ' + attempts);
    playerInput.value = '';
    submit.style.display = 'none';
    playerInput.style.display = 'none';
    document.getElementById('guess').innerHTML  = ('You lose, better luck next time!');
    notQuite.style.display="block";
    notQuite.innerHTML = ('The capital of ' + states[stateNumber][0] + ' is ' + states[stateNumber][2]);
  }
}

function resetMap() {
  for(let i = 0; i < states.length; i ++) {
    document.getElementById(states[i][1]).style.fill='#D0D0D0';
  }
  alreadyGuessed = new Map();
  score = 0;
  attempts = 3;
  document.getElementById('attempts').innerHTML = ('Attempts: ' + attempts);
  submit.style.display = 'block';
  playerInput.style.display = 'block';
  notQuite.style.display="none";
  notQuite.innerHTML = ('Not quite, try again.');

  isInMap();
}

// Run the program
isInMap();

