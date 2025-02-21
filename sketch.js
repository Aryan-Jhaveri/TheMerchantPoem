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

  // Preload assets for all scenes
  window.welcomeScene = new WelcomeScene();
  window.journeyScene = new JourneyScene();
  window.welcomeScene.preload();

  window.journeyScene.preload();
  
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
  mgr.addScene(WelcomeScene);
  mgr.addScene(JourneyScene);
  mgr.addScene(LastScene);

  // Wire up the scene manager
  mgr.wire = function() {
      if (this.scene) {
          console.log('Wiring scene:', this.scene.constructor.name);
          // Bind all p5 methods to the scene
          Reflect.ownKeys(this.scene).forEach(method => {
              if (typeof this.scene[method] === 'function') {
                  this.scene[method] = this.scene[method].bind(this.scene);
              }
          });
      }
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

async function togglePlay() {
  try {
    // Ensure audio context is properly resumed
    if (getAudioContext().state !== 'running') {
      await getAudioContext().resume();
    }

    // Verify music is loaded
    if (!backgroundMusic) {
      console.error('Music not loaded');
      return;
    }

    // Handle play/pause based on actual playback state
    if (backgroundMusic.isPlaying()) {
      backgroundMusic.pause();
      isPlaying = false;
      playButton.html('▶');
    } else {
      backgroundMusic.loop();
      isPlaying = true;
      playButton.html('❚❚');
    }

    // Force sync with actual audio context state
    if (getAudioContext().state !== 'running') {
      await getAudioContext().suspend();
    }

  } catch (error) {
    console.error('Playback error:', error);
  }

  // Debug log with actual states
  console.log('Toggle state:', {
    isPlaying: backgroundMusic.isPlaying(),
    audioContextState: getAudioContext().state,
    musicIsPlaying: backgroundMusic.isPlaying()
  });
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

function mouseWheel(event) {
  if (mgr && mgr.scene) {
    const actualScene = mgr.scene.oScene;
    if (typeof actualScene.mouseWheel === 'function') {
      return actualScene.mouseWheel(event);
    }
  }
  return true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Check if mgr and mgr.scene exist before accessing
  if (mgr && mgr.scene && mgr.scene.windowResized) {
    mgr.scene.windowResized();
  }
}

function touchStarted(event) {
  if (touches.length > 0) {
    touchStartY = touches[0].y;
    lastTouchY = touches[0].y;
    
    // Route touch as mouse press for buttons/interactions
    if (mgr && mgr.scene) {
      const actualScene = mgr.scene.oScene;
      if (typeof actualScene.mousePressed === 'function') {
        actualScene.mousePressed();
      }
    }
  }
  return false;
}

function touchMoved(event) {
  event.preventDefault();
  
  if (!touchStartY) return false;
  
  if (mgr && mgr.scene && touches.length > 0) {
    const actualScene = mgr.scene.oScene;
    const currentTouchY = touches[0].y;
    const touchDelta = lastTouchY - currentTouchY;
    
    // If movement is small, don't trigger scroll
    if (Math.abs(touchDelta) <= 5) {
      return false;
    }
    
    // Handle scroll
    if (typeof actualScene.mouseWheel === 'function') {
      const touchEvent = {
        delta: touchDelta
      };
      lastTouchY = currentTouchY;
      return actualScene.mouseWheel(touchEvent);
    }
  }
  return false;
}

function touchEnded() {
  // Only clear if we actually had a touch start
  if (touchStartY !== null) {
    touchStartY = null;
    lastTouchY = null;
  }
  return false;
}