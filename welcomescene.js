

/**
* Welcome Scene
*/
class WelcomeScene {
constructor() {
  // Move global variables here
  this.stars = [];
  this.clouds = [];
  this.cloudImages = [];
  this.moon;
  this.floatingMerchant;
  this.yoff = VISUAL_SETTINGS.WAVE.Y_OFFSET_START;
  this.yRange = {
    min: 450,
    max: 460
  };

  this.assets = {
    merchantImage: null,
    moonImage: null,
    cloudImages: []  
  };

  this.canvasw;
  this.canvash;
  this.buttonWidth;
  this.buttonHeight;
  this.startButtonX; 
  this.isLoading = true;

  this.loadedAssets = {
    merchant: false,
    moon: false,
    clouds: false
  };

  this.font = null;
}
enter() {
  console.log("WelcomeScene entered - resetting stars");
  
  // Reset stars array to ensure fresh layout every time
  this.stars = [];
  
  // Call preload when scene enters
  this.preload();
}

/**
* Preload all required assets
* This function runs before setup() and ensures all assets are loaded
*/  
preload() {
  const handleImageError = (err) => {
    //console.error('Failed to load image:', err);
  };

  // Load merchant image
  this.assets.merchantImage = loadImage("assets/merch.png", 
    () => {
      //console.log("Merchant image loaded successfully");
      this.loadedAssets.merchant = true;
      this.checkAllAssetsLoaded();
    },
    handleImageError
  );
  
  // Load moon image
  this.assets.moonImage = loadImage("assets/moon.png",
    () => {
      //console.log("Moon image loaded successfully");
      this.loadedAssets.moon = true;
      this.checkAllAssetsLoaded();
    },
    handleImageError
  );
  
  // Load cloud images
  this.assets.cloudImages = [];
  let loadedCloudCount = 0;
  
  for (let i = 1; i <= 4; i++) {
    this.assets.cloudImages[i-1] = loadImage(`assets/cloud${i}.png`, 
      () => {
        //console.log(`Cloud image ${i} loaded successfully`);
        loadedCloudCount++;
        if (loadedCloudCount === 4) {
          this.loadedAssets.clouds = true;
          this.checkAllAssetsLoaded();
        }
      },
      handleImageError
    );
  }

  // Load custom font
  this.font = loadFont("assets/Jacquard12-Regular.ttf");
}
checkAllAssetsLoaded() {
  if (Object.values(this.loadedAssets).every(loaded => loaded)) {
    //console.log("All assets loaded, running setup");
    this.isLoading = false;
    this.setup();
  }
}

/**
 * Initialize the stars
 * This function creates the star objects and adds them to the stars array
 */
initializeStars() {
  // Clear existing stars first to ensure a fresh layout
  this.stars = [];
  
  // Create new stars
  for (let i = 0; i < VISUAL_SETTINGS.STAR_COUNT; i++) {
    this.stars.push(new Star());
  }
  
  console.log(`Created ${this.stars.length} new stars`);
}

/**
* Initialize the interface elements
* This function calculates the button dimensions and updates the button position
*/
initializeInterface() {
  this.buttonWidth = min(this.canvasw * VISUAL_SETTINGS.CANVAS.BUTTON_WIDTH_PERCENT, 
                  VISUAL_SETTINGS.CANVAS.MAX_BUTTON_WIDTH);
  this.buttonHeight = min(this.canvash * VISUAL_SETTINGS.CANVAS.BUTTON_HEIGHT_PERCENT,
                    VISUAL_SETTINGS.CANVAS.MAX_BUTTON_HEIGHT);
  this.updateButtonPosition();
}

/**
* Initialize the clouds
* This function creates the cloud objects and adds them to the clouds array
*/
setupClouds() {
  this.clouds = [];  // Reset clouds array
  for (let i = 0; i < this.assets.cloudImages.length * 3; i++) {
    this.clouds.push(new Cloud(
      this.assets.cloudImages[i % this.assets.cloudImages.length],
      random(0.1, 0.3)
    ));
  }
}

/**
* Update the position of the start button
* This function updates the position of the start button
*/
updateButtonPosition() {
  this.startButtonX = this.canvasw / 2 - this.buttonWidth / 2;
  this.startButtonY = this.canvash / 2 - this.buttonHeight / 2;
}

/**
 * Initialize the canvas and all visual elements
 * This function runs after preload() when all assets are ready
 */
setup() {
  this.canvasw = windowWidth;
  this.canvash = windowHeight;
  createCanvas(this.canvasw, this.canvash);

  // Initialize basic elements that don't depend on images
  this.initializeStars();
  this.initializeInterface();
  
  // Create objects now that we know images are loaded
  this.moon = new Moon(this.assets.moonImage);
  this.setupClouds();
  this.floatingMerchant = new FloatingImage(this.assets.merchantImage);
  this.floatingMerchant.yoff = this.yoff;
  this.floatingMerchant.yRange = this.yRange;
}

/**
* Draw the starry background
* This function updates and displays all stars
*/
drawStarryBackground() {
  this.stars.forEach(star => {
    star.update();
    star.display();
  });
}

/**
* Draw the clouds
* This function updates and displays all clouds
*/
drawClouds() {
  if (this.clouds && this.clouds.length > 0) {
    this.clouds.forEach(cloud => {
      cloud.update();
      cloud.display();
    });
  }
}

/**
* Draw the ocean waves
* This function updates and displays the ocean waves
*/
drawWave() {
  // Use the shared wave drawing utility with our scene's settings
  globalYoff = drawWaves({
    yRange: this.yRange,
    layerCount: 2,
    colorScheme: 'UNIFIED',  // Use the unified color scheme
    timeScale: 0.0001,
    updateYoff: true
  });
  
  // Update our local reference to the global yoff for use with the merchant
  this.yoff = globalYoff;
}


/**
 * Draw the welcome scene
 * This function is called on every frame and handles the drawing of all elements
 */
draw() {
  background(0, 45);
  
  if (this.isLoading) {
    // Draw loading screen
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Loading...', width/2, height/2);
    pop();
    return;
  }
  
  // Layer 2: Deepest background elements - stars
  this.drawStarryBackground();
  
  // Layer 3: Moon in the background
  if (this.moon) {
    this.moon.update();
    this.moon.display();
  }
  
  // Layer 4: Clouds floating in front of the moon
  this.drawClouds();
  
  // Layer 5: Ocean waves
  this.drawWave();
  
  // Layer 6: Merchant character in the foreground
  if (this.floatingMerchant) {
    this.floatingMerchant.yoff = this.yoff;
    this.floatingMerchant.update();
    this.floatingMerchant.display();
  }
  
  // Layer 7: UI elements always on top
  this.drawTitle();
  this.drawStartButton();
}


// The addWaveTexture method has been moved to sketch.js as a global function

/**
* Draw the title
* This function draws the title text with gentle floating motion
*/
drawTitle() {
  push();
  // Set text properties
  fill(TYPOGRAPHY.TITLE.COLOR);
  textAlign(CENTER, CENTER);
  textFont(this.font);
  
  // Get responsive font size based on window width
  let titleSize;
  if (windowWidth <= BREAKPOINTS.MOBILE) {
    titleSize = TYPOGRAPHY.TITLE.SIZE.MOBILE;
  } else if (windowWidth <= BREAKPOINTS.TABLET) {
    titleSize = TYPOGRAPHY.TITLE.SIZE.TABLET;
  } else {
    titleSize = TYPOGRAPHY.TITLE.SIZE.DESKTOP;
  }
  
  textSize(titleSize);
  textLeading(titleSize * TYPOGRAPHY.TITLE.LEADING);
  
  const titleY = this.canvash / 3 + sin(frameCount * 0.02) * 5;
  
  this.drawTextWithShadow(
    "The Merchant Poem",
    this.canvasw / 2,
    titleY,
    color(0, 0, 0, 100),
    2
  );
  pop();
}

/**
* Draw the start button
* This function draws the start button with hover effect
*/
drawStartButton() {
  push();
  const buttonHover = this.isMouseOverButton();
  
  // Draw button with hover effect
  fill(buttonHover ? color(120, 120, 120, 200) : color(100, 100, 100, 180));
  
  
  // Draw button text
  fill(TYPOGRAPHY.BUTTON.COLOR);
  textAlign(CENTER, CENTER);
  textFont(this.font);
  textSize(TYPOGRAPHY.BUTTON.SIZE);
  textLeading(TYPOGRAPHY.BUTTON.SIZE * TYPOGRAPHY.BUTTON.LEADING);
  
  // Draw text with subtle shadow
  this.drawTextWithShadow(
    "Start Journey",
    this.startButtonX + this.buttonWidth / 2,
    this.startButtonY + this.buttonHeight / 2,
    color(0, 0, 0, 80),
    1
  );
  pop();
}

/**
* Draw text with shadow effect
* This function draws text with a subtle shadow effect
*/
drawTextWithShadow(txt, x, y, shadowColor, offset) {
  // Draw shadow
  fill(shadowColor);
  text(txt, x + offset, y + offset);
  
  // Draw main text
  fill(TYPOGRAPHY.TITLE.COLOR);
  text(txt, x, y);
}

/**
* Check if the mouse is over the start button
* This function returns true if the mouse is over the start button
*/
isMouseOverButton() {
  return mouseX > this.startButtonX &&
         mouseX < this.startButtonX + this.buttonWidth &&
         mouseY > this.startButtonY &&
         mouseY < this.startButtonY + this.buttonHeight;
}

/**
* Handle mouse pressed events
* This function checks if the mouse is over the start button and changes scene when clicked
*/
mousePressed() {
  // Check if mouse is over the button when clicked
  if (this.isMouseOverButton()) {
    // Change scene when button is clicked
    window.mgr.showScene(JourneyScene);
  }
}

/**
* Update the canvas dimensions when the window is resized
* This function updates the canvas dimensions and all responsive elements
*/
windowResized() {
  // Update canvas dimensions
  this.canvasw = windowWidth;
  this.canvash = windowHeight;
  resizeCanvas(this.canvasw, this.canvash);
  
  // Update all responsive elements
  this.stars.forEach(star => star.handleResize());
  this.clouds.forEach(cloud => cloud.handleResize());
  this.moon.handleResize();
  
  // Update interface elements
  this.buttonWidth = min(this.canvasw * VISUAL_SETTINGS.CANVAS.BUTTON_WIDTH_PERCENT,
                  VISUAL_SETTINGS.CANVAS.MAX_BUTTON_WIDTH);
  this.buttonHeight = min(this.canvash * VISUAL_SETTINGS.CANVAS.BUTTON_HEIGHT_PERCENT,
                    VISUAL_SETTINGS.CANVAS.MAX_BUTTON_HEIGHT);
  this.updateButtonPosition();
  
  // Update wave boundaries
  this.yRange = {
    min: this.canvash * 0.6,
    max: this.canvash * 0.8
  };
}

exit() {
  console.log('Cleaning up WelcomeScene...');
  
  // Clear the stars array
  this.stars = [];
  
  // Clear the clouds array
  this.clouds = [];
  
  // Reset floating merchant if it exists
  if (this.floatingMerchant) {
    this.floatingMerchant.velocity = createVector(0, 0);
    this.floatingMerchant.initializeProperties();
  }
  
  // Reset wave properties
  this.yoff = VISUAL_SETTINGS.WAVE.Y_OFFSET_START;
  this.yRange = {
    min: 450,
    max: 460
  };
  
  // Set flag to reinitialize on next entry
  this.isLoading = true;
  
  // Clear the canvas
  clear();
}
} 