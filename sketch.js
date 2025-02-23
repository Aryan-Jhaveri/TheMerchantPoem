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
 * Breakpoints for responsive design
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

  // Calculate initial positions based on window dimensions
  let topOffset, leftOffset, direction;
  
  if (windowWidth <= BREAKPOINTS.MOBILE) {
    topOffset = windowHeight * 0.01;  // 5% from top
    leftOffset = windowWidth * 0.02;  // 2% from left
    direction = 'row';
  } else { //DESKTOP
    topOffset = windowHeight * 0.03;  // 3% from top
    leftOffset = windowWidth * 0.02;  // 2% from left
    direction = 'row';
  }

  // Apply calculated positions and layout
  menuDiv.style('top', topOffset + 'px');
  menuDiv.style('left', leftOffset + 'px');
  menuDiv.style('flex-direction', direction);

  // Base button style that won't change with screen size
  const buttonStyle = {
    'font-family': 'Jacquard12-Regular',
    'background': 'rgba(0, 0, 0, 0.5)',
    'color': 'white',
    'border': '1px solid white',
    'cursor': 'pointer',
    'border-radius': '5px',
    'text-align': 'center',
    'transition': 'all 0.3s ease'
  };

  // Initial positioning and responsive styles will be set by updateMenuPosition
  this.updateMenuPosition()

  // Function to handle scene switching with cleanup
  const switchScene = (SceneClass) => {
    // If there's a current scene with an exit method, call it
    if (mgr.scene && mgr.scene.oScene && typeof mgr.scene.oScene.exit === 'function') {
      mgr.scene.oScene.exit();
    }

    // Clear the canvas before switching scenes
    clear();
    
    // Show the new scene
    mgr.showScene(SceneClass);
  };

  // Function to create a button with both mouse and touch handlers
  function createSceneButton(label, targetScene) {
    const button = createButton(label);
    
    // Mouse click handler
    button.mousePressed(() => switchScene(targetScene));
    
    // Touch handlers
    button.touchStarted(() => {
      switchScene(targetScene);
      return false; // Prevent default touch behavior
    });
    
    // Add touch ended to prevent any lingering touch issues
    button.touchEnded(() => false);
    
    return button;
  }

  // Create buttons with both mouse and touch handlers
  homeButton = createSceneButton('Home', WelcomeScene);
  poemButton = createSceneButton('Poem', JourneyScene);
  resourcesButton = createSceneButton('Resources', LastScene);

  const buttons = [homeButton, poemButton, resourcesButton];
  buttons.forEach(button => {
    button.parent(menuDiv);
    Object.entries(buttonStyle).forEach(([property, value]) => {
      button.style(property, value);
    });

    // Add hover effect
    button.mouseOver(() => {
      button.style('background-color', 'rgba(255, 255, 255, 0.2)');
    });
    button.mouseOut(() => {
      button.style('background-color', 'rgba(0, 0, 0, 0.5)');
    });
  });
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
  // Base size calculations
  const baseButtonWidth = Math.min(windowWidth * 0.15, 200); // Max width of 200px
  const baseFontSize = Math.min(windowWidth * 0.015, 24); // Max font size of 24px
  
  const config = {
    mobile: {
      topOffset: windowHeight * 0.02,    // 2% from top
      leftOffset: windowWidth * 0.02,    // 2% from left
      buttonWidth: Math.min(windowWidth * 0.25, 120), // Smaller buttons for mobile
      fontSize: Math.min(windowWidth * 0.03, 18) + 'px', // Proportional but capped
      padding: '8px 12px',
      direction: 'row',
      gap: '8px'
    },
    tablet: {
      topOffset: windowHeight * 0.03,    // 3% from top
      leftOffset: windowWidth * 0.02,    // 2% from left
      buttonWidth: baseButtonWidth * 1.2, // Slightly larger than base
      fontSize: baseFontSize + 'px',
      padding: '10px 15px',
      direction: 'row',
      gap: '12px'
    },
    
    desktop: {
      topOffset: windowHeight * 0.03,    // 3% from top
      leftOffset: windowWidth * 0.02,    // 2% from left
      buttonWidth: baseButtonWidth,
      fontSize: baseFontSize + 'px',
      padding: '12px 20px',
      direction: 'row',
      gap: '15px'
    }
  };

  if (windowWidth <= BREAKPOINTS.MOBILE) return config.mobile;
  if (windowWidth <= BREAKPOINTS.TABLET) return config.tablet;
  return config.desktop;
}

/*
* Update the menu position based on the current window size
*/
function updateMenuPosition() {
  if (!menuDiv) return;

  const config = getMenuConfig();

  // Update menu container
  menuDiv.position(config.leftOffset, config.topOffset);
  menuDiv.style('flex-direction', config.direction);
  menuDiv.style('gap', config.gap);

  // Update button styles
  [homeButton, poemButton, resourcesButton].forEach(button => {
    if (button) {
      button.style('width', config.buttonWidth);
      button.style('font-size', config.fontSize);
      button.style('padding', config.padding);
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