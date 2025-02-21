let mgr;
let backgroundMusic;
let playButton;
let volumeSlider;
let isPlaying = false;

function preload() {
  // Load the music file
  soundFormats('mp3');
  backgroundMusic = loadSound('public/Life of Pi.mp3', 
    () => {
      console.log("Music loaded successfully");
      // Add user interaction check
      if (getAudioContext().state !== 'running') {
        getAudioContext().resume().then(() => {
          backgroundMusic.setVolume(0.5); 
          backgroundMusic.loop();
          isPlaying = true;
          if (playButton) {
            playButton.html('❚❚');
          }
        });
      } else {
        backgroundMusic.setVolume(0.5);
        backgroundMusic.loop();
        isPlaying = true;
        if (playButton) {
          playButton.html('❚❚');
        }
      }
    },
    (error) => {
      console.error("Error loading music:", error);
    }
  );

  // Preload assets for the welcome scene
  window.welcomeScene = new WelcomeScene();
  window.welcomeScene.preload();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Disable device orientation and motion handling
  window._disableDeviceMotion = true;
  window._disableDeviceOrientation = true;
  
  // Create UI controls
  createMusicControls();
  
  mgr = new SceneManager();
  window.mgr = mgr;

  mgr.addScene(WelcomeScene);
  mgr.addScene(JourneyScene);
  mgr.addScene(LastScene);

  // Configure scene manager to call enter() on scene changes
  mgr.wire = function() {
    this.scenes[this.scene].enter();
  };
  
  mgr.showScene(WelcomeScene);
}

function createMusicControls() {
  // Create container div for music controls
  const controlsDiv = createDiv('');
  controlsDiv.style('position', 'fixed');
  controlsDiv.style('top', '20px');
  controlsDiv.style('right', '20px');
  controlsDiv.style('display', 'flex');
  controlsDiv.style('align-items', 'center');
  controlsDiv.style('gap', '10px');
  controlsDiv.style('background', 'rgba(0, 0, 0, 0.5)');
  controlsDiv.style('padding', '10px');
  controlsDiv.style('border-radius', '5px');
  controlsDiv.id('music-controls');

  // Create title text
  const titleSpan = createSpan('Life of Pi - A.Jhaveri');
  titleSpan.style('color', 'white');
  titleSpan.style('font-family', 'Jacquard12');
  titleSpan.style('margin-right', '10px');
  titleSpan.parent(controlsDiv);

  // Create play button
  playButton = createButton('▶');
  playButton.style('background', 'none');
  playButton.style('border', '1px solid white');
  playButton.style('color', 'white');
  playButton.style('cursor', 'pointer');
  playButton.style('padding', '5px 10px');
  playButton.style('border-radius', '3px');
  playButton.mousePressed(togglePlay);
  playButton.parent(controlsDiv);

  // Create volume slider
  // Create volume slider with range 0-1, starting value 0.5, and step size 0.01
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.style('width', '100px');
  volumeSlider.input(updateVolume);
  volumeSlider.parent(controlsDiv);
}

function togglePlay() {
  if (!isPlaying) {
    backgroundMusic.loop();
    playButton.html('❚❚'); // pause symbol
    isPlaying = true;
  } else {
    backgroundMusic.pause();
    playButton.html('▶'); // play symbol
    isPlaying = false;
  }
}

function updateVolume() {
  const volume = volumeSlider.value();
  backgroundMusic.setVolume(volume);
}

function draw() {
  mgr.draw();
}

function mousePressed() {
  mgr.mousePressed();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (mgr.scene.windowResized) {
    mgr.scene.windowResized();
  }
}

// Configure scene manager to call enter() on scene changes
mgr.wire = function() {
  this.scenes[this.scene].enter();
};
