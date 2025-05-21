let mgr;
let backgroundMusic;
let playButton;
let volumeSlider;
let isPlaying = false;
let menuFont = null;

// Touch tracking variables
let touchStartY = null;
let lastTouchY = null;
let touchStartX = null;
let lastTouchX = null;

// Device orientation variables
let rotationX = 0;
let rotationY = 0;
let rotationZ = 0;
let accelerationX = 0;
let accelerationY = 0;
let accelerationZ = 0;
let tiltEnabled = true;

// Menu buttons
let homeButton;
let poemButton;
let resourcesButton;
let menuDiv;

// Shared wave properties
let globalYoff = VISUAL_SETTINGS.WAVE.Y_OFFSET_START;

// Shared wave colors - unified color scheme
const WAVE_COLORS = {
  UNIFIED: {
    // The BASE color is the RGB values for the wave's main color
    // Format: [Red (0-255), Green (0-255), Blue (0-255)]
    // Increasing values makes the color lighter, decreasing makes it darker
    BASE: [80, 153, 199],    // Medium blue for all waves 
    
    // ALPHA controls the transparency/opacity of wave layers
    // Format: [Min Alpha, Max Alpha]
    // Values range from 0 (completely transparent) to 255 (fully opaque)
    // Values above 255 are treated as 255 internally by p5.js
    ALPHA: [40, 215]
  }
};

// New Tailwind blue palette for wave textures - deeper blues only.
const WAVE_TINTS = [
  [17,26,45],
  [17,26,45], 
  [17,26,45],
  [13,18,29]      
];

/**
 * Star class handles the creation and animation of individual stars in the background
 */
class Star {
  constructor() {
    this.reset();
    this.initializePosition();
  }

  initializePosition() {
    // Store positions as percentages of window size for responsiveness
    this.xPercent = random(0, 1);
    this.yPercent = random(0, 1);
    this.updatePosition();
  }

  reset() {
    const windowDiagonal = sqrt(windowWidth * windowWidth + windowHeight * windowHeight);
    this.baseSize = random(VISUAL_SETTINGS.STAR_SIZE.MIN, VISUAL_SETTINGS.STAR_SIZE.MAX) * 
                    (windowDiagonal / 1500);
    
    this.opacity = map(
      this.baseSize,
      VISUAL_SETTINGS.STAR_SIZE.MIN * (windowDiagonal / 1500),
      VISUAL_SETTINGS.STAR_SIZE.MAX * (windowDiagonal / 1500),
      VISUAL_SETTINGS.STAR_OPACITY.MIN,
      VISUAL_SETTINGS.STAR_OPACITY.MAX
    );

    this.twinkleSpeed = random(0.02, 0.05);
    this.twinklePhase = random(TWO_PI);
  }

  updatePosition() {
    this.x = this.xPercent * windowWidth;
    this.y = this.yPercent * windowHeight;
  }

  handleResize() {
    this.reset();
    this.updatePosition();
  }

  update() {
    this.opacity = map(
      sin(frameCount * this.twinkleSpeed + this.twinklePhase),
      -1, 1,
      VISUAL_SETTINGS.STAR_OPACITY.MIN,
      VISUAL_SETTINGS.STAR_OPACITY.MAX
    );
  }

  display() {
    noStroke();
    fill(255, 255, 255, this.opacity);
    ellipse(this.x, this.y, this.baseSize, this.baseSize);
  }
}

/**
* Cloud class manages individual cloud elements, including their movement and opacity
*/
class Cloud {
constructor(img, speed) {
    this.img = img;
    this.speed = speed * 0.3;
    this.initializeCloud();
}

initializeCloud() {
    this.xPercent = random(0, 1);
    this.yPercent = random(0, 0.4);
    this.updateDimensions();
    
    // Animation properties
    this.opacity = 0;
    this.targetOpacity = random(300, 400);
    this.fadeSpeed = 0.005;
    this.ySpeed = random(0.001, 0.002);
    this.yAmplitude = random(5, 10);
    
    // Lifecycle management
    this.lifespan = random(300, 600);
    this.age = 0;
}

updateDimensions() {
    this.x = this.xPercent * windowWidth;
    this.y = this.yPercent * windowHeight;
    this.originalY = this.y;
    this.width = windowWidth * 0.2;
    this.height = this.width * 0.66;
}

update() {
    this.age++;
    this.x += this.speed;
    this.y = this.originalY + sin(frameCount * this.ySpeed) * this.yAmplitude;

    // Handle cloud lifecycle
    if (this.age < 60) {
    this.opacity = lerp(this.opacity, this.targetOpacity, 0.02);
    } else if (this.age > this.lifespan - 60) {
    this.opacity = lerp(this.opacity, 0, 0.02);
    }

    if (this.age > this.lifespan || this.x > windowWidth + this.width) {
    this.reset();
    }
}

reset() {
    this.initializeCloud();
}

handleResize() {
    this.updateDimensions();
}

display() {
    push();
    if (this.img && this.img.width > 0) {
    tint(255, this.opacity);
    image(this.img, this.x, this.y, this.width, this.height);
    }
    pop();
}
}

/**
* Moon class handles the moon's display and gentle floating animation
*/
class Moon {
constructor(img) {
    this.img = img;
    this.calculateDimensions();
    this.floatSpeed = 0.002;
    this.floatAmplitude = 15;
    this.floatOffset = 0;
}

calculateDimensions() {
    this.leftBoundary = (windowWidth * 5) / 7;
    this.size = windowWidth * 0.2;
    this.x = this.leftBoundary + (windowWidth - this.leftBoundary) / 2;
    this.y = windowHeight * 0.15;
}

update() {
    this.floatOffset = sin(frameCount * this.floatSpeed) * this.floatAmplitude;
}

display() {
    if (this.img) {
      push();
      tint(255, 220);
      image(
        this.img,
        this.x - this.size / 2,
        this.y + this.floatOffset - this.size / 2,
        this.size,
        this.size
      );
      pop();
    }
}

handleResize() {
    this.calculateDimensions();
}
}

/**
* FloatingImage class manages the merchant character's movement and interaction with waves
*/
class FloatingImage {
  constructor(img) {
      this.img = img;
      this.initializeProperties();
  }

  initializeProperties() {
      // Position constraints
      this.xMin = 200;
      this.xMax = 330;
      this.yMin = 450;
      this.yMax = 600;

      // Current position and dimensions
      this.x = (this.xMin + this.xMax) / 2;
      this.y = (this.yMin + this.yMax) / 2;
      this.width = 230;
      this.height = 200;

      // Physics properties
      this.velocity = createVector(0, 4);
      this.dampening = 0.9;
      this.waveInfluenceStrength = 0.5;
      this.prevWaveHeight = 5;
  }

  getWaveHeightAtPosition(xoff, yoff) {
      return map(
      noise(this.x * VISUAL_SETTINGS.WAVE.NOISE_SCALE + xoff, yoff),
      0, 1,
      this.yRange.min,
      this.yRange.max
      );
  }

  update() {
      let currentWaveHeight = this.getWaveHeightAtPosition(0, this.yoff);
      let waveVelocity = (currentWaveHeight - this.prevWaveHeight) * this.waveInfluenceStrength;

      this.velocity.y += waveVelocity;
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.x = constrain(this.x, this.xMin, this.xMax);
      this.y = constrain(this.y, this.yMin, this.yMax);

      this.velocity.mult(this.dampening);
      this.prevWaveHeight = currentWaveHeight;
  }

  display() {
      push();
      image(
      this.img,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
      );
      pop();
  }
}

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
          if (volumeSlider) {
            backgroundMusic.setVolume(volumeSlider.value());
          }
          backgroundMusic.loop();
          isPlaying = true;
          if (playButton) {
            playButton.html('❚❚');
          }
        });
      } else {
        if (volumeSlider) {
          backgroundMusic.setVolume(volumeSlider.value());
        }
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
  //poemButton = createSceneButton('Poem', JourneyScene);
  resourcesButton = createSceneButton('Resources', LastScene);

  // Initial position update
  updateMenuPosition();
}


/**
 * Setup the sketch
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  // Enable device orientation and motion handling for tilt controls
  window._disableDeviceMotion = false;
  window._disableDeviceOrientation = false;
  tiltEnabled = true;
  
  // Create UI controls
  createMusicControls();
  createMenuButtons();
  
  // Init device orientation event listener for iOS
  if (typeof window.DeviceOrientationEvent !== 'undefined' && 
      typeof window.DeviceOrientationEvent.requestPermission === 'function') {
    console.log("iOS device orientation detected - will request permission when user interacts");
    
    // Create permission request button for iOS (only shown if needed)
    const permissionButton = createButton('Enable Tilt Controls');
    permissionButton.position(windowWidth/2 - 100, windowHeight/2 - 25);
    permissionButton.size(200, 50);
    permissionButton.style('background-color', 'rgba(0,0,0,0.5)');
    permissionButton.style('color', 'white');
    permissionButton.style('border', 'none');
    permissionButton.style('border-radius', '5px');
    permissionButton.style('font-size', '16px');
    permissionButton.style('display', 'none');
    permissionButton.mousePressed(() => {
      // Request permission for device motion/orientation
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            tiltEnabled = true;
            permissionButton.style('display', 'none');
            console.log("Device orientation permission granted");
          } else {
            console.log("Device orientation permission denied");
          }
        })
        .catch(console.error);
    });
    
    // Show the button on first interaction
    window.addEventListener('touchstart', function showPermissionButtonOnce() {
      permissionButton.style('display', 'block');
      window.removeEventListener('touchstart', showPermissionButtonOnce);
    }, { once: true });
  }
  
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
 * Create music controls with play/pause button and canvas volume slider
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
  const titleSpan = createSpan('Life of Pi.mp3 - A.Jhaveri');
  titleSpan.style('color', 'white');
  titleSpan.style('font-family', menuFont ? 'Jacquard12' : 'sans-serif');
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

  // Create volume slider with DOM
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.style('width', '100px');
  volumeSlider.style('height', '10px');
  volumeSlider.style('margin-left', '10px');
  volumeSlider.style('appearance', 'none');
  volumeSlider.style('-webkit-appearance', 'none');
  volumeSlider.style('background', 'rgba(26, 33, 71, 0.5)');
  volumeSlider.style('outline', 'none');
  volumeSlider.style('opacity', '0.8');
  volumeSlider.style('border-radius', '5px');
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
  // Get value from the DOM slider
  const volume = volumeSlider.value();
  
  // Set the volume if the music is loaded
  if (backgroundMusic) {
    backgroundMusic.setVolume(volume);
  }
}

/**
 * Draw the sketch
 */
function draw() {
  // Draw the current scene
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
 * Handle keyboard input for merchant movement
 */
function keyPressed() {
  // Check if we're in a scene that has a floating merchant
  if (mgr && mgr.scene && mgr.scene.oScene) {
    const actualScene = mgr.scene.oScene;
    
    // Look for the merchant in common places in the scene
    const merchant = actualScene.merchant || actualScene.floatingMerchant;
    
    // If the scene has a merchant property
    if (merchant) {
      const pushForce = 4; // Lower force to work with the existing dampening
      
      // Apply force to the merchant's existing velocity (don't override it)
      if (keyCode === UP_ARROW || key === 'w' || key === 'W') {
        merchant.velocity.y -= pushForce;
      } else if (keyCode === DOWN_ARROW || key === 's' || key === 'S') {
        merchant.velocity.y += pushForce;
      } else if (keyCode === LEFT_ARROW || key === 'a' || key === 'A') {
        merchant.velocity.x -= pushForce;
      } else if (keyCode === RIGHT_ARROW || key === 'd' || key === 'D') {
        merchant.velocity.x += pushForce;
      }
      
      // The merchant's update() method will apply these velocity changes
      // and handle dampening, so we don't need to modify position directly
    }
  }
  
  // Pass the keyPressed event to the scene if it has the method
  if (mgr && mgr.scene) {
    const actualScene = mgr.scene.oScene;
    if (typeof actualScene.keyPressed === 'function') {
      return actualScene.keyPressed();
    }
  }
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
 * Handle touch events for the volume slider
 * @param {TouchEvent} event - The touch event
 * @returns {boolean} - False to prevent default behavior
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
    touchStartX = touches[0].x;
    lastTouchX = touches[0].x;
    
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
 * Handle touch movement events for both merchant movement and scene scrolling
 * @param {*} event Touch event object
 * @returns {boolean} Whether to prevent default behavior
 */
function touchMoved(event) {
  // Check if touch is on music controls
  const musicControls = select('#music-controls').elt;
  if (musicControls && musicControls.contains(event.target)) {
    event.preventDefault();
    return true;
  }

  event.preventDefault();
  
  // Process merchant movement if we have touches
  if (mgr && mgr.scene && mgr.scene.oScene && touches.length > 0 && 
      touchStartX !== null && touchStartY !== null) {
    
    const actualScene = mgr.scene.oScene;
    const merchant = actualScene.merchant || actualScene.floatingMerchant;
    const isJourneyScene = actualScene.constructor.name === 'JourneyScene';
    
    // Get current touch positions
    const currentTouchY = touches[0].y;
    const currentTouchX = touches[0].x;
    const touchDeltaY = lastTouchY - currentTouchY;
    const touchDeltaX = lastTouchX - currentTouchX;
    
    // Merchant movement - if merchant exists and touch movement is significant
    if (merchant && !isJourneyScene) {
      const pushForce = 3; // Force for touch movement
      
      // Only apply force if the touch movement is significant
      if (Math.abs(touchDeltaY) > 5) {
        // Apply vertical force (up/down)
        merchant.velocity.y -= (touchDeltaY / 10) * pushForce;
      }
      
      if (Math.abs(touchDeltaX) > 5) {
        // Apply horizontal force (left/right)
        merchant.velocity.x -= (touchDeltaX / 10) * pushForce;
      }
    }
    
    // Scene scrolling functionality - applies to all scenes with mouseWheel
    // Use a larger threshold for JourneyScene to make scrolling more intentional
    const touchThreshold = isJourneyScene ? 20 : 5;
    
    if (Math.abs(touchDeltaY) > touchThreshold) {
      console.log("Touch scroll delta:", touchDeltaY, "in scene:", actualScene.constructor.name);
      
      // For JourneyScene, handle touch scrolling with exaggerated delta
      if (isJourneyScene) {
        // Make touch scrolling more responsive for JourneyScene
        const amplifiedDelta = touchDeltaY * 3; // Amplify the effect
        
        if (typeof actualScene.mouseWheel === 'function') {
          const touchEvent = {
            delta: amplifiedDelta
          };
          actualScene.mouseWheel(touchEvent);
        }
      } 
      // For other scenes, use normal mouseWheel handling
      else if (typeof actualScene.mouseWheel === 'function') {
        const touchEvent = {
          delta: touchDeltaY
        };
        actualScene.mouseWheel(touchEvent);
      }
    }
    
    // Update last touch positions
    lastTouchY = currentTouchY;
    lastTouchX = currentTouchX;
  }
  
  return false;
}

/**
 * Handle device orientation and movement for merchant control
 */
function deviceMoved() {
  // Update acceleration values
  accelerationX = accelerationX * 0.8 + rotationY * 0.2;
  accelerationY = accelerationY * 0.8 + rotationX * 0.2;
  
  // Only proceed if tilt is enabled
  if (!tiltEnabled) return;
  
  // Check if we're in a scene that has a floating merchant
  if (mgr && mgr.scene && mgr.scene.oScene) {
    const actualScene = mgr.scene.oScene;
    
    // Look for the merchant in common places in the scene
    const merchant = actualScene.merchant || actualScene.floatingMerchant;
    
    // If the scene has a merchant property
    if (merchant) {
      // Set thresholds for device tilt - lower threshold for higher sensitivity
      const tiltThreshold = 0.5;  // Reduced from 2 to detect smaller tilts
      const maxTiltForce = 5;     // Increased from 3 for stronger response
      
      // Only apply forces if the tilt is significant enough
      if (abs(rotationY) > tiltThreshold || abs(rotationX) > tiltThreshold) {
        // Calculate force based on tilt angle with higher sensitivity
        // rotationY affects horizontal movement (left/right)
        // Divided by smaller value (10 instead of 20) for higher sensitivity
        const xForce = constrain(rotationY / 10, -maxTiltForce, maxTiltForce);
        
        // rotationX affects vertical movement (up/down)
        // Divided by smaller value (10 instead of 20) for higher sensitivity
        const yForce = constrain(rotationX / 10, -maxTiltForce, maxTiltForce);
        
        // Apply the forces to the merchant's velocity
        merchant.velocity.x += xForce;
        merchant.velocity.y += yForce;
        
        // Log forces for debugging
        console.log(`Tilt forces: X=${xForce.toFixed(2)}, Y=${yForce.toFixed(2)}, rotX=${rotationX.toFixed(2)}, rotY=${rotationY.toFixed(2)}`);
      }
    }
  }
}

/**
 * Handle device orientation changes (for iOS that uses deviceorientation instead of devicemotion)
 */
function deviceTurned() {
  // Update rotation values with less smoothing for more responsive control
  // Original was 0.9/0.1 ratio, updated to 0.7/0.3 for quicker response
  rotationX = rotationX * 0.7 + constrain(rotationX, -90, 90) * 0.3;
  rotationY = rotationY * 0.7 + constrain(rotationY, -90, 90) * 0.3;
  rotationZ = rotationZ * 0.7 + constrain(rotationZ, -90, 90) * 0.3;
  
  // Prevent extremely small rotations from causing noise
  if (abs(rotationX) < 0.3) rotationX = 0;
  if (abs(rotationY) < 0.3) rotationY = 0;
  
  // Debug output to help with calibration
  if (frameCount % 60 === 0) { // Log once per second
    console.log(`Device orientation: X=${rotationX.toFixed(1)}, Y=${rotationY.toFixed(1)}, Z=${rotationZ.toFixed(1)}`);
  }
}

/**
 * Draw the ocean waves - unified wave drawing function that can be used by any scene
 * @param {Object} options - Configuration options for the waves
 * @param {Object} options.yRange - The min and max y values for the waves
 * @param {number} options.layerCount - Number of wave layers to draw (default: 2)
 * @param {string} options.colorScheme - Color scheme name from WAVE_COLORS (default: 'WELCOME')
 * @param {p5.Color} options.customColor - Optional custom color to override the color scheme
 * @param {number} options.timeScale - Scale factor for animation speed (default: 0.0001)
 * @param {boolean} options.updateYoff - Whether to update the global yoff value (default: true)
 */
function drawWaves(options) {
  // Default options
  const defaults = {
    yRange: { min: height * 0.6, max: height * 0.8 },
    layerCount: 2,
    colorScheme: 'UNIFIED',  // Use the unified color scheme for all scenes
    timeScale: 0.0001,
    updateYoff: true
  };
  
  // Merge defaults with provided options
  const config = { ...defaults, ...options };
  
  // Get color settings from the specified scheme
  const colorSettings = WAVE_COLORS[config.colorScheme] || WAVE_COLORS.WELCOME;
  
  const t = frameCount * config.timeScale; // Time variable for texture animation
  
  // Draw wave layers with different properties
  for (let waveIndex = 0; waveIndex < config.layerCount; waveIndex++) {
    push();
    
    // Configure wave layer properties - interpolate alpha based on wave index
    const alphaRange = colorSettings.ALPHA;
    const alpha = map(
      waveIndex, 
      0, 
      config.layerCount - 1, 
      alphaRange[0], 
      alphaRange[1]
    );
    
    // Use custom color if provided, otherwise use color scheme
    let baseColor;
    if (config.customColor) {
      baseColor = config.customColor;
    } else {
      const [r, g, b] = colorSettings.BASE;
      baseColor = color(r, g, b);
    }
    
    // Apply alpha to create the wave color
    const waveColor = color(
      red(baseColor), 
      green(baseColor), 
      blue(baseColor), 
      alpha
    );
    
    // Calculate wave boundaries
    const yMin = config.yRange.min;
    const yMax = config.yRange.max;
    
    // Create the main wave shape
    beginShape();
    noStroke();
    fill(waveColor);
    
    // Generate wave points using Perlin noise
    const wavePoints = [];
    let xoff = 0;
    
    // Create wave vertices
    vertex(-30, height);
    for (let x = -30; x <= width + 30; x += VISUAL_SETTINGS.WAVE.STEP) {
      const y = map(
        noise(xoff, globalYoff + waveIndex * 0.5),
        0, 1,
        yMin, yMax
      );
      vertex(x, y);
      wavePoints.push({ x, y });
      xoff += VISUAL_SETTINGS.WAVE.NOISE_SCALE;
    }
    vertex(width + 20, height);
    endShape(CLOSE);
    
    // Add pixelated texture within the wave shape
    addWaveTexture(wavePoints, waveColor, alpha, t, waveIndex);
    
    pop();
  }
  
  // Update noise offset for continuous wave movement
  if (config.updateYoff) {
    globalYoff += VISUAL_SETTINGS.WAVE.Y_INCREMENT;
  }
  
  return globalYoff; // Return the current yoff value for scenes that need it
}

/**
 * Adds pixelated texture effect to the wave - shared utility function
 * @param {Array} wavePoints - Array of wave vertex positions
 * @param {p5.Color} waveColor - Base color of the wave
 * @param {number} alpha - Opacity value
 * @param {number} t - Time variable for animation
 * @param {number} waveIndex - Current wave layer index
 */
function addWaveTexture(wavePoints, waveColor, alpha, t, waveIndex) {
  const pixelSize = 60;
  
  for (let x = 0; x < width; x += pixelSize) {
    // Find wave height at current x position
    const waveX = x + 10;
    const index = constrain(
      floor(waveX / VISUAL_SETTINGS.WAVE.STEP),
      0,
      wavePoints.length - 2
    );
    
    // Interpolate wave height
    const waveHeight = lerp(
      wavePoints[index].y,
      wavePoints[index + 1].y,
      (waveX % VISUAL_SETTINGS.WAVE.STEP) / VISUAL_SETTINGS.WAVE.STEP
    );
    
    // Draw textured pixels from wave height to bottom
    for (let y = floor(waveHeight); y < height; y += pixelSize) {
      // Use noise to create a wavy pattern but consistent within each cube
      // Generate noise value once per cube for more coherent color blocks
      const noiseVal = noise(0.03 * floor(x/pixelSize), 0.03 * floor(y/pixelSize) + waveIndex * 0.2 + t * 0.05);
      
      // Calculate distance from wave surface - for applying color gradient
      const distanceFromSurface = y - waveHeight;
      
      // Make the light part MUCH thinner - only top 8% of the water
      const thinTopLayer = (height - waveHeight) * 0.05; // Top 8% of water
      const remainingWater = (height - waveHeight) - thinTopLayer;
      
      // Determine color selection strategy based on depth and wave pattern
      let tintIndex;
      
      // Thin light layer at the top
      if (distanceFromSurface < thinTopLayer) {
        // Very near the surface - create a thin light layer
        const surfaceRatio = 1 - (distanceFromSurface / thinTopLayer); // 1 at surface, 0 at layer boundary
        
        // Create light effect only at the very top and based on noise consistency
        if (surfaceRatio > 0.5 && noiseVal > 0.65) {
          // Light colors only at the very top of waves
          tintIndex = WAVE_TINTS.length - 1; // Lightest color
        } 
        else if (noiseVal > 0.9) {
          // Occasional light spots in the top layer
          tintIndex = WAVE_TINTS.length - 1; // Lightest color
        }
        else {
          // Use the second-to-lightest color for most of the thin top layer
          tintIndex = WAVE_TINTS.length - 2; 
        }
      } 
      // Everything below the thin top layer - predominantly dark
      else {
        // Calculate how deep we are in the remaining water
        const depthRatio = constrain(map(
          distanceFromSurface - thinTopLayer, 
          0, 
          remainingWater, 
          0, 
          1
        ), 0, 1);
        
        // Very rare light spots in the deeper water
        if (noiseVal > 0.9 && random() > 0.98) {
          // Extremely rare light spots deep in the water
          tintIndex = WAVE_TINTS.length - 2; 
        } else {
          // Use mostly the two darkest colors with coherent patterns
          // Higher noise values get slightly lighter colors
          const darkBias = depthRatio * 0.7 + (1 - noiseVal) * 0.3;
          tintIndex = floor(map(darkBias, 0, 1, 0, 1.8)); // Mostly darkest colors
        }
      }
      
      // Ensure index is within bounds
      const safeIndex = constrain(tintIndex, 0, WAVE_TINTS.length - 1);
      
      // Get the tint color
      const [r, g, b] = WAVE_TINTS[safeIndex];
      
      // Apply slight brightness variation for additional texture
      const brightness = map(noise(x * 0.05, y * 0.05, t), 0, 1, 0.9, 1.1);
      
      // Create fully opaque color with the tint
      const pixelColor = color(
        r * brightness,
        g * brightness, 
        b * brightness,
        255  // Fully opaque
      );
      
      fill(pixelColor);
      noStroke();
      rect(x, y, pixelSize, pixelSize);
    }
  }
}

/**
 * Handle touch end event - cleanup touch tracking variables
 * @param {*} event Touch end event
 * @returns {boolean} Whether to prevent default behavior
 */
function touchEnded(event) {
  // Log for debugging
  if (mgr && mgr.scene && mgr.scene.oScene) {
    const actualScene = mgr.scene.oScene;
    console.log("Touch ended in scene:", actualScene.constructor.name);
  }
  
  // Only clear if we actually had a touch start
  if (touchStartY !== null) {
    touchStartY = null;
    lastTouchY = null;
    touchStartX = null;
    lastTouchX = null;
  }
  
  // Prevent default to avoid accidental clicks after touch
  event.preventDefault();
  return false;
}