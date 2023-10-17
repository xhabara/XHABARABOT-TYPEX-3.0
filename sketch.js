// Typex 3.0 Created by Rully Shabara
// Official Website: rullyshabara.id


let sound1, sound2;
let loopPlaying1 = false;
let loopPlaying2 = false;
let lettersInput1, lettersInput2;
let loopButton1, loopButton2;
let syncButton;
let delaySlider;
let gainNode;
let filter;
let syncActive = false;
let initialInputValue1, initialInputValue2;
let currentRate1, currentRate2;
let volumeLevel = 0.3; 
let timeoutID1, timeoutID2;
let compressor;
let autoSlideActive = false;  
let autoSlideTimeoutSlider;
let autoSlideTimeout = 1000;  // Default value in milliseconds
let globalRateSlider;
let globalRate = 1.0;  // Default rate is 1.0 (normal speed)
let includeRateCheckbox;






let soundRecorder;
let recordedSound;
let saveButton;
let isRecording = false;

let rateMapping = {
  'a': 1.0,    // Root
  'b': 1.125,  // Major second
  'c': 1.2,    // Minor third
  'd': 1.25,   // Perfect fourth
  'e': 1.333,  // Perfect fifth
  'f': 1.4,    // Minor sixth
  'g': 1.5,    // Major seventh
  'h': 0.5,    // Root (lower octave)
  'i': 0.5625, // Major second (lower octave)
  'j': 0.6,    // Minor third (lower octave)
  'k': 0.625,  // Perfect fourth (lower octave)
  'l': 0.666,  // Perfect fifth (lower octave)
  'm': 0.7,    // Minor sixth (lower octave)
  'n': 0.75,   // Major seventh (lower octave)
  'o': 2.0,    // Root (2nd octave)
  'p': 2.25,   // Major second (2nd octave)
  'q': 2.4,    // Minor third (2nd octave)
  'r': 2.5,    // Perfect fourth (2nd octave)
  's': 2.666,  // Perfect fifth (2nd octave)
  't': 2.8,    // Minor sixth (2nd octave)
  'u': 3.0,    // Major seventh (2nd octave)
  'v': 4.0,    // Root (3rd octave)
  'w': 4.5,    // Major second (3rd octave)
  'x': 4.8,    // Minor third (3rd octave)
  'y': 5.0,    // Perfect fourth (3rd octave)
  'z': 5.333  // Perfect fifth (3rd octave)
};


function preload() {
  sound1 = loadSound('sound1.mp3');  
  sound2 = loadSound('sound2.mp3'); 
  
  
}

function setup() {
  createCanvas(800, 400);
  textSize(20);
  textAlign(CENTER, CENTER);
  setupInputFields();
  setupButtons();
  setupSlider();

  gainNode = new p5.Gain();
  gainNode.connect();

  filter = new p5.HighPass();
  gainNode.connect(filter);
  filter.connect();
  
  soundRecorder = new p5.SoundRecorder();
  recordedSound = new p5.SoundFile();
  soundRecorder.setInput();  // Record from all sound sources
  
  
   const audioContext = getAudioContext();
  compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
  compressor.knee.setValueAtTime(40, audioContext.currentTime);
  compressor.ratio.setValueAtTime(12, audioContext.currentTime);
  compressor.attack.setValueAtTime(0, audioContext.currentTime);
  compressor.release.setValueAtTime(0.25, audioContext.currentTime);

  // Connect the compressor
  compressor.connect(audioContext.destination);
  sound1.connect(compressor);
sound2.connect(compressor);


  
  soundRecorder.setInput(compressor);  // Record from the compressor

globalRateSlider = createSlider(0.5, 2.0, 1.0, 0.01)  // 0.5 to 2.0 with steps of 0.01
    .position(580, 480)
    .style("width", "250px")
    .style("cursor", "pointer");

  if (globalRateSlider.elt) {
    globalRateSlider.elt.style.background = "linear-gradient(90deg, #FF5722 0%, #4CAF50 100%)";
    
    includeRateCheckbox = createCheckbox(' Include Autonomous Rate in Xhabarabot Mode', false)
  .position(430, 400)
  .style("color", "#FFFFFF")
  .style("font-size", "10px");

  }


}

function updateCurrentRate(rate, whichSound) {
  if (whichSound === 1) {
    currentRate1 = rate;
  } else if (whichSound === 2) {
    currentRate2 = rate;
  }
}

function setupInputFields() {
  lettersInput1 = createInput().position(width / 1.7 - 50, height / 2 + 28).size(400, 30).style("font-size", "15px");
  lettersInput2 = createInput().position(width / 1.7 - 50, height / 2 + 138).size(400, 30).style("font-size", "15px");
}


function setupButtons() {
  loopButton1 = createButton("PLAY LOOP A")
    .position(width / 2 - 160, height / 2 + 26)
    .size(120, 45)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("border-radius", "15px")
    .style("background", "linear-gradient(135deg, #4CAF50, #087f23)")
    .style("border", "none")
    .style("cursor", "pointer")
    .style("color", "white")
    .mousePressed(toggleLoop1);

  loopButton2 = createButton("PLAY LOOP B")
    .position(width / 2 - 160, height / 2 + 132)
    .size(120, 45)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("border-radius", "15px")
    .style("background", "linear-gradient(135deg, #4CAF50, #087f23)")
    .style("border", "none")
    .style("cursor", "pointer")
    .style("color", "white")
    .mousePressed(toggleLoop2);

  syncButton = createButton("SYNC")
    .position(width / 2 - 160, height / 2 + 86)
    .size(120, 25)
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .style("border-radius", "12px")
    .style("background", "linear-gradient(135deg, #FF5722, #bf360c)")
    .style("border", "none")
    .style("cursor", "pointer")
    .style("color", "white")
    .mousePressed(toggleSync);  
  
  autoSlideButton = createButton("XHABARABOT MODE")
  .position(420, 450)
  .size(120, 45)
  .style("font-size", "10px")
  .style("font-weight", "bold")
  .style("border-radius", "15px")
  .style("background", "linear-gradient(135deg, #9E9E9E, #616161)")
  .style("border", "none")
  .style("cursor", "pointer")
  .style("color", "white")
  .mousePressed(toggleAutoSlide);

  
  resetButton1 = createButton("Reset Loop A")
  .position(width / 1.6 + 360, height / 2 + 26)
  .size(100, 45)
  .style("font-size", "10px")
  .style("font-weight", "bold")
  .style("border-radius", "15px")
  .style("background", "linear-gradient(135deg, #FF5722, #bf360c)")
  .style("border", "none")
  .style("cursor", "pointer")
  .style("color", "white")
  .mousePressed(() => {
    clearTimeout(timeoutID1);  // Stop the loop timer
    lettersInput1.value("");  // Clear the input field
    loopPlaying1 = false;  // Stop the loop
    loopButton1.html("Start Loop 1");
    loopButton1.style("background-color", "#121212");
  });

resetButton2 = createButton("Reset Loop B")
  .position(width / 1.6 + 360, height / 2 + 132)
  .size(100, 45)
  .style("font-size", "10px")
  .style("font-weight", "bold")
  .style("border-radius", "15px")
  .style("background", "linear-gradient(135deg, #FF5722, #bf360c)")
  .style("border", "none")
  .style("cursor", "pointer")
  .style("color", "white")
  .mousePressed(() => {
    clearTimeout(timeoutID2);  // Stop the loop timer
    lettersInput2.value("");  // Clear the input field
    loopPlaying2 = false;  // Stop the loop
    loopButton2.html("Start Loop 2");
    loopButton2.style("background-color", "#121212");
  });

  saveButton = createButton("START RECORDING")
    .position(235, 450)
    .size(150, 50)
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .style("border-radius", "15px")
    .style("background", "linear-gradient(135deg, #2196F3, #0d47a1)")
    .style("border", "none")
    .style("cursor", "pointer")
    .style("color", "white")
    .mousePressed(toggleRecording);

}

function toggleAutoSlide() {
  autoSlideActive = !autoSlideActive;
  if (autoSlideActive) {
    autoSlideButton.html("STOP XHABARABOT");
    autoSlideButton.style("background-color", "#4CAF50");
    
    autoSlideTimeoutSlider = createSlider(200, 2000, 1500)  // 200ms to 2000ms
      .position(580, 450)
      .style("width", "250px")
      .style("cursor", "pointer");
    
    if (autoSlideTimeoutSlider.elt) {
      autoSlideTimeoutSlider.elt.style.background = "linear-gradient(90deg, #FF5722 0%, #4CAF50 100%)";
    }

    startAutoSlide();
  } else {
    autoSlideButton.html("START XHABARABOT");
    autoSlideButton.style("background-color", "#9E9E9E");
    autoSlideTimeoutSlider.remove();  // This removes the slider
  }
}


function startAutoSlide() {
  if (!autoSlideActive) return;
  
  // Random delay for the individual sounds
  let minDelay = 30;
  let maxDelay = 1000;
  let newDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  delaySlider.value(newDelay);
  
  if (includeRateCheckbox.checked()) {
    // Random global rate between 0.5 and 2.0
    let minRate = 0.5;
    let maxRate = 2.0;
    let newRate = Math.random() * (maxRate - minRate) + minRate;
    globalRateSlider.value(newRate);
  }
  
  autoSlideTimeout = autoSlideTimeoutSlider.value();  // Get the current value of the timeout slider
  
  setTimeout(startAutoSlide, autoSlideTimeout);
}




function setupSlider() {
  delaySlider = createSlider(10, 1000, 130)  // 10ms to 1000ms
    .position(width / 1.7 - 50, height / 2 + 88)
    .style("width", "400px")
    .style("cursor", "pointer");

  if (delaySlider.elt) {
    // Styling the slider track
    delaySlider.elt.style.background = "linear-gradient(90deg, #FF5722 0%, #4CAF50 100%)";
    // Styling the slider thumb
    delaySlider.elt.style.appearance = "none";
    delaySlider.elt.style.height = "12px";
    delaySlider.elt.style.borderRadius = "6px";

    // For Chrome
    if (delaySlider.elt.childNodes[1]) {
      let thumbStyles = `
        width: 20px;
        height: 20px;
        background: #FFF;
        cursor: pointer;
        appearance: none;
        border: 2px solid #4CAF50;
        border-radius: 50%;
      `;
      delaySlider.elt.childNodes[1].style = thumbStyles;
    }
  }
}


function draw() {
  background(27); // Clear background
  fill(255); // Set text color
  // Display the current rates
  text("Current Rate 1: " + currentRate1, 365, 180);
  text("Current Rate 2: " + currentRate2, 610, 180);
  text("TYPEX 3.0", 300, 150);
  
  globalRate = globalRateSlider.value(); 

}


function keyPressed() {
  let keyChar = key.toLowerCase();
  let rate = rateMapping[keyChar];
  if (rate && sound1 && sound2 && filter && gainNode) {
    sound1.rate(rate);
    sound1.play();
    sound2.rate(rate);
    sound2.play();

    filter.freq(10);
    gainNode.amp(0.2);
  }
}

function toggleSync() {
  syncActive = !syncActive;
  if (syncActive) {
    syncButton.html("STOP SYNC");
    syncButton.style("background-color", "#4CAF50");  // Green when active
    sharedDelayTime = delaySlider.value();  
    syncInputs();
  } else {
    syncButton.html("SYNC");
    syncButton.style("background-color", "#FF5722");  // Orange when inactive
  }
}

function toggleLoop1() {
  loopPlaying1 = !loopPlaying1;
  if (loopPlaying1) {
    loopButton1.html("Stop Loop A");
    loopButton1.style("background-color", "#4CAF50");
    initialInputValue1 = lettersInput1.value();
    playLoop1();
  } else {
    loopButton1.html("Start Loop A");
    loopButton1.style("background-color", "#121212");
  }
}

function toggleLoop2() {
  loopPlaying2 = !loopPlaying2;
  if (loopPlaying2) {
    loopButton2.html("Stop Loop B");
    loopButton2.style("background-color", "#4CAF50");
    initialInputValue2 = lettersInput2.value();
    playLoop2();
  } else {
    loopButton2.html("Start Loop B");
    loopButton2.style("background-color", "#121212");
  }
}

function toggleRecording() {
  isRecording = !isRecording;
  
  if (isRecording) {
    saveButton.html("Stop and Download");
    soundRecorder.setInput(compressor);  // Set input to compressor
    soundRecorder.record(recordedSound);  // Start recording into our SoundFile object
  } else {
    saveButton.html("Downloaded");
    soundRecorder.stop();  // Stop the recorder
    setTimeout(() => {  // Give it a moment before saving
      recordedSound.save('XhabarabotTypex3_Sequence.wav');  // Save file
    }, 1000);  // Wait a second to make sure recording has fully stopped
  }
}




function syncInputs() {
  if (syncActive) {  // Only sync when syncActive is true
    lettersInput2.value(lettersInput1.value());
    
  }
}
function playLoop(playLoopFunc, lettersInput, initialInputValue, loopPlaying, sound, whichSound) {
  // Stop the loop if loopPlaying is false
  if (!loopPlaying) {
    return;
  }

  // Split the input string into an array of letters
  let letters = lettersInput.value().split("");
  
  // If the input is empty and an initial value exists, reset to the initial value
  if (letters.length === 0 && initialInputValue) {
    letters = initialInputValue.split("");
  }

  // Shift the first letter off the array
  let key = letters.shift();
  
  let rate = rateMapping[key];
  
  if (rate) {
    updateCurrentRate(rate, whichSound);  // Update the current rate
    sound.rate(rate * globalRate); 

    sound.setVolume(volumeLevel);
    if (isRecording) {  // Only connect to the recorder if recording is active
    
    }
    sound.play();
    if (!isRecording) {  // Disconnect from the recorder if recording is not active
     
    }
  }

  // Push the shifted letter back onto the end of the array
  letters.push(key);
  
  // Update the input box with the modified string
  lettersInput.value(letters.join(""));
  
  // Calculate the delay time based on whether syncing is active
  let delayTime = syncActive ? sharedDelayTime : delaySlider.value();

  let timeoutID = setTimeout(() => {
    if (loopPlaying) { // Only proceed if loopPlaying is still true
      playLoopFunc();
    }
  }, delayTime);

  // Store the timeout ID depending on which loop this is for
  if (whichSound === 1) {
    timeoutID1 = timeoutID;
  } else if (whichSound === 2) {
    timeoutID2 = timeoutID;
  }
}






function playLoop1() {
  playLoop(playLoop1, lettersInput1, initialInputValue1, loopPlaying1, sound1, 1);
}

function playLoop2() {
  playLoop(playLoop2, lettersInput2, initialInputValue2, loopPlaying2, sound2, 2);
}
