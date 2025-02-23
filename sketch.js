let mgr;
let backgroundMusic;
let playButton;
let volumeSlider;
let isPlaying = false;
let menuFont = null;

let touchStartY = null;
let lastTouchY = null;

// Menu buttons
let homeButton;
let poemButton;
let resourcesButton;
let menuDiv;

/**
 * Preload
 */
function preload() {
  // Load the font
  menuFont = loadFont('assets/Jacquard12-Regular.ttf');
  
  // Load the music file
  soundFormats('mp3');
  backgroundMusic = loadSound('public/Life of Pi.mp3', 
    () => {
      console.log("Music loaded successfully");
      // Add user interaction check
      if (getAudioContext().state !== 'running') {
        getAudioContext().resume().then(() => {
          backgroundMusic.setVolume(volumeSlider.value()); 
          backgroundMusic.loop();
          isPlaying = true;
          if (playButton) {
            playButton.html('❚❚');
          }
        });
      } else {
        backgroundMusic.setVolume(volumeSlider.value());
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

// Helper function to determine current device type
function getDeviceType() {
  if (windowWidth <= BREAKPOINTS.MOBILE) return 'MOBILE';
  if (windowWidth <= BREAKPOINTS.TABLET) return 'TABLET';
  return 'DESKTOP';
}

/**
 * Create menu buttons with responsive layout
 */
function createMenuButtons() {
  // Create container div for menu buttons
  menuDiv = createDiv('');
  menuDiv.style('position', 'fixed');
  menuDiv.style('display', 'flex');
  menuDiv.style('z-index', '1000');
  menuDiv.id('menu-buttons');

  // Function to handle scene switching with cleanup
  const switchScene = (SceneClass) => {
    if (mgr.scene && mgr.scene.oScene && typeof mgr.scene.oScene.exit === 'function') {
      mgr.scene.oScene.exit();
    }
    clear();
    mgr.showScene(SceneClass);
  };

  // Function to create a scene button with both mouse and touch handlers
  function createSceneButton(label, targetScene) {
    const btn = createButton(label);
    Object.entries(BUTTON_STYLE).forEach(([key, value]) => {
      btn.style(key, value);
    });
    btn.mousePressed(() => switchScene(targetScene));
    btn.touchStarted(() => switchScene(targetScene));
    btn.parent(menuDiv);
    return btn;
  }

  // Create the buttons
  homeButton = createSceneButton('Home', WelcomeScene);
  poemButton = createSceneButton('Poem', JourneyScene);
  resourcesButton = createSceneButton('Resources', LastScene);

  // Initial position update
  updateMenuPosition();
}


/**
 * Setup the sketch
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  // Disable device orientation and motion handling
  window._disableDeviceMotion = true;
  window._disableDeviceOrientation = true;
  
  // Create UI controls
  createMusicControls();
  createMenuButtons();
  
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

/**
 * Create music controls with play/pause button and volume slider
 */

function createMusicControls() {
  // Create container div for music controls
  const controlsDiv = createDiv('');
  controlsDiv.style('position', 'fixed');
  controlsDiv.style('bottom', '20px');  // Position from bottom
  controlsDiv.style('left', '20px');    // Position from left
  controlsDiv.style('display', 'flex');
  controlsDiv.style('align-items', 'center');
  controlsDiv.style('gap', '10px');
  controlsDiv.style('background', 'rgba(0, 0, 0, 0.5)');
  controlsDiv.style('padding', '10px');
  controlsDiv.style('border-radius', '5px');
  controlsDiv.style('z-index', '1000');  // Ensure it's above other elements
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
  playButton.touchStarted(togglePlay);
  playButton.parent(controlsDiv);

  // Create volume slider
  // Create volume slider with range 0-1, starting value 0.5, and step size 0.01
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.style('width', '100px');
  volumeSlider.input(updateVolume);
  volumeSlider.touchStarted(handleSliderTouch);
  volumeSlider.touchMoved(handleSliderTouch);
  volumeSlider.parent(controlsDiv);
}

/**
 * 
 * @returns {AudioContext} The shared audio context
 */
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

/**
 * Update the volume based on the slider value
 */
function updateVolume() {
  const volume = volumeSlider.value();
  backgroundMusic.setVolume(volume);
}

/**
 * Draw the sketch
 */
function draw() {
  mgr.draw();
}

/**
 * Handle mouse press event
 */
function mousePressed() {
  // The buttons handle their own click events
  mgr.mousePressed();
}

/**
 * 
 * @param {*} event 
 * @returns 
 */
function mouseWheel(event) {
  if (mgr && mgr.scene) {
    const actualScene = mgr.scene.oScene;
    if (typeof actualScene.mouseWheel === 'function') {
      return actualScene.mouseWheel(event);
    }
  }
  return true;
}

/**
 * 
 * @returns {boolean} Whether the current viewport is tablet
 */
function getMenuConfig() {
  const baseButtonWidth = Math.min(windowWidth * 0.25, 5000); // Max width
  const baseFontSize = Math.min(windowWidth * 0.15, 24); // Max font size
  
  return {
    topOffset: windowHeight * 0.03,       // 3% from top
    leftOffset: windowWidth * 0.02,       // 2% from left
    buttonWidth: baseButtonWidth,         // Base button width for desktop
    fontSize: baseFontSize + 'px',         // Base font size for desktop
    padding: '12px 20px',                 // Button padding
    direction: 'row',                     // Layout direction
    gap: '15px'                           // Gap between buttons
  };
}

/*
* Update the menu position based on the current window size
*/
function updateMenuPosition() {
  if (!menuDiv) return;

  const deviceType = getDeviceType();
  
  // Calculate dimensions based on device type and window size
  const buttonWidth = Math.min(
    windowWidth * MENU_CONFIG.BUTTON.WIDTH_PERCENTAGE[deviceType],
    MENU_CONFIG.BUTTON.MAX_WIDTH[deviceType]
  );

  // Update menu container
  menuDiv.position(
    windowWidth * MENU_CONFIG.POSITION.LEFT_OFFSET_PERCENTAGE,
    windowHeight * MENU_CONFIG.POSITION.TOP_OFFSET_PERCENTAGE
  );
  menuDiv.style('gap', MENU_CONFIG.BUTTON.GAP[deviceType]);

  // Update all buttons
  [homeButton, poemButton, resourcesButton].forEach(button => {
    if (button) {
      button.style('width', `${buttonWidth}px`);
      button.style('font-size', `${MENU_CONFIG.BUTTON.FONT_SIZE[deviceType]}px`);
      button.style('padding', MENU_CONFIG.BUTTON.PADDING[deviceType]);
    }
  });
}
/**
 * Handle window resizing
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Update menu positioning
  updateMenuPosition();

  // Check if mgr and mgr.scene exist before accessing
  if (mgr && mgr.scene && mgr.scene.windowResized) {
    mgr.scene.windowResized();
  }
}

/**
 * 
 * @param {*} event 
 * @returns 
 */
function handleSliderTouch(event) {
  event.preventDefault();
  updateVolume();
  return false;
}

/**
 * 
 * @param {*} event 
 * @returns 
 */
function touchStarted(event) {
  // Check if touch is on music controls or menu buttons
  const musicControls = select('#music-controls').elt;
  const menuButtons = select('#menu-buttons').elt;
  if ((musicControls && musicControls.contains(event.target)) ||
      (menuButtons && menuButtons.contains(event.target))) {
    // Allow touch events for music controls and menu buttons
    return true;
  }
  
  if (touches.length > 0) {
    touchStartY = touches[0].y;
    lastTouchY = touches[0].y;
    
    if (mgr && mgr.scene) {
      const actualScene = mgr.scene.oScene;
      if (typeof actualScene.mousePressed === 'function') {
        actualScene.mousePressed();
      }
    }
  }
  return false;
}

/**
 * 
 * @param {*} event 
 * @returns 
 */
function touchMoved(event) {
  // Check if touch is on music controls
  const musicControls = select('#music-controls').elt;
  if (musicControls && musicControls.contains(event.target)) {
    event.preventDefault();
    return true;
  }

  event.preventDefault();
  
  if (!touchStartY) return false;
  
  if (mgr && mgr.scene && touches.length > 0) {
    const actualScene = mgr.scene.oScene;
    const currentTouchY = touches[0].y;
    const touchDelta = lastTouchY - currentTouchY;
    
    if (Math.abs(touchDelta) <= 5) {
      return false;
    }
    
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

/**
 * 
 * @returns 
 */
function touchEnded() {
  // Only clear if we actually had a touch start
  if (touchStartY !== null) {
    touchStartY = null;
    lastTouchY = null;
  }
  return false;
}