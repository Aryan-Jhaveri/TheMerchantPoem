// Rename the existing sketch.js content to a class structure

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
        this.xMin = 100;
        this.xMax = 200;
        this.yMin = 330;
        this.yMax = 500;

        // Current position and dimensions
        this.x = (this.xMin + this.xMax) / 2;
        this.y = (this.yMin + this.yMax) / 2;
        this.width = 230;
        this.height = 200;

        // Physics properties
        this.velocity = createVector(0, 0);
        this.dampening = 0.96;
        this.waveInfluenceStrength = 0.04;
        this.prevWaveHeight = 0;
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
    // Call preload when scene enters
    this.preload();
  }


/**
 * Preload all required assets
 * This function runs before setup() and ensures all assets are loaded
 */  
  preload() {
    const handleImageError = (err) => {
      console.error('Failed to load image:', err);
    };

    // Load merchant image
    this.assets.merchantImage = loadImage("assets/merch.png", 
      () => {
        console.log("Merchant image loaded successfully");
        this.loadedAssets.merchant = true;
        this.checkAllAssetsLoaded();
      },
      handleImageError
    );
    
    // Load moon image
    this.assets.moonImage = loadImage("assets/moon.png",
      () => {
        console.log("Moon image loaded successfully");
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
          console.log(`Cloud image ${i} loaded successfully`);
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
      console.log("All assets loaded, running setup");
      this.isLoading = false;
      this.setup();
    }
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

  /**
 * Initialize the stars
 * This function creates the star objects and adds them to the stars array
 */
  initializeStars() {
    for (let i = 0; i < VISUAL_SETTINGS.STAR_COUNT; i++) {
      this.stars.push(new Star());
    }
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
    const t = frameCount * 0.0003; // Time variable for texture animation
    
    // Draw three wave layers with different properties
    for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
      push();
      
      // Configure wave layer properties
      const alpha = map(waveIndex, 0, 2, 300, 50);
      const waveColor = color(55, 78, 135, alpha);
      
      // Calculate wave boundaries
      const yMin = this.yRange.min;
      const yMax = this.yRange.max;
      
      // Create the main wave shape
      beginShape();
      noStroke();
      fill(waveColor);
      
      // Generate wave points using Perlin noise
      const wavePoints = [];
      let xoff = 0;
      
      // Create wave vertices
      vertex(-20, height);
      for (let x = -20; x <= width + 20; x += VISUAL_SETTINGS.WAVE.STEP) {
        const y = map(
          noise(xoff, this.yoff + waveIndex * 0.5),
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
      this.addWaveTexture(wavePoints, waveColor, alpha, t, waveIndex);
      
      pop();
    }
    
    // Update noise offset for continuous wave movement
    this.yoff += VISUAL_SETTINGS.WAVE.Y_INCREMENT;
  }

  /**
 * Add wave texture to the wave shape
 * This function adds a pixelated texture to the wave shape
 */
  addWaveTexture(wavePoints, waveColor, alpha, t, waveIndex) {
    const pixelSize = 20;
    
    if (this.isMouseOverButton()) {
      // Change scene when button is clicked
      window.mgr.showScene(JourneyScene);
    }
  }

/**
 * Adds pixelated texture effect to the wave
 * @param {Array} wavePoints - Array of wave vertex positions
 * @param {p5.Color} waveColor - Base color of the wave
 * @param {number} alpha - Opacity value
 * @param {number} t - Time variable for animation
 * @param {number} waveIndex - Current wave layer index
 */
  addWaveTexture(wavePoints, waveColor, alpha, t, waveIndex) {
    const pixelSize = 20;
    
    for (let x = 0; x < width; x += pixelSize) {
      // Find wave height at current x position
      const waveX = x + 20;
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
        const noiseVal = noise(0.06 * x * t, 0.03 * y + waveIndex * 0.5);
        const brightness = map(noiseVal, 0, 2, 0.7, 1);
        
        // Apply noise-based brightness to wave color
        const pixelColor = color(
          red(waveColor) * brightness,
          green(waveColor) * brightness,
          blue(waveColor) * brightness,
          alpha
        );
        
        fill(pixelColor);
        noStroke();
        rect(x, y, pixelSize, pixelSize);
      }
    }
  }

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
    textSize(TYPOGRAPHY.TITLE.SIZE);
    textLeading(TYPOGRAPHY.TITLE.SIZE * TYPOGRAPHY.TITLE.LEADING);
    
    // Add gentle floating motion to title
    const titleY = this.canvash / 3 + sin(frameCount * 0.02) * 5;
    
    // Add subtle text shadow for depth
    this.drawTextWithShadow(
      "The Merchant Poem",
      this.canvasw / 2,
      titleY,
      color(0, 0, 0, 100),  // Shadow color
      2                      // Shadow offset
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
 * Update the position of the start button
 * This function updates the position of the start button
 */
  updateButtonPosition() {
    this.startButtonX = this.canvasw / 2 - this.buttonWidth / 2;
    this.startButtonY = this.canvash / 2 - this.buttonHeight / 2;
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


} 