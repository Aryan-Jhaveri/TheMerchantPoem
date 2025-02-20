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
      // Start playing automatically
      backgroundMusic.setVolume(0.5);
      backgroundMusic.loop();
      isPlaying = true;
      if (playButton) {
        playButton.html('❚❚'); // Update button to show pause symbol
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

  // Add scenes
  mgr.wire();
  mgr.addScene(WelcomeScene);
  mgr.addScene(JourneyScene);
  mgr.addScene(LastScene);
  
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
  const titleSpan = createSpan('Life of Pi');
  titleSpan.style('color', 'white');
  titleSpan.style('font-family', 'Arial');
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
