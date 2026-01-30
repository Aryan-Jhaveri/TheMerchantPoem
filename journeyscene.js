class JourneyScene {
  constructor() {
    console.log('JourneyScene initialized');
    // Add stars array
    this.stars = [];

    // Add new properties for scrolling
    this.currentSection = 0;
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.sections = [];
    this.isDesktopView = window.innerWidth > 768;
    this.isSnapping = false;
    this.snapTarget = 0;
    this.totalScrollHeight = 0;

    this.font = null;

    // Add wave properties
    this.yoff = VISUAL_SETTINGS.WAVE.Y_OFFSET_START;
    this.yRange = {
      min: 450,
      max: 460
    };

    this.moon = null;
    this.assets = {
      moonImage: null
    };
    this.loadedAssets = {
      moon: false
    };

    // Add FloatingMerchant properties
    this.floatingMerchant = null;
    this.assets = {
      ...this.assets, // Keep existing assets
      merchantImage: null
    };
    this.loadedAssets = {
      ...this.loadedAssets, // Keep existing loaded assets
      merchant: false
    };
  }
  /*
  * Preload function for the scene
  */
  enter() {
    // Load font when scene enters
    this.preload();
  }
  /**
  * Preload function for the scene
  */
  preload() {
    // Add font loading
    this.font = loadFont("assets/MedievalSharp-Regular.ttf");

    // Load moon image
    this.assets.moonImage = loadImage("assets/moon.png",
      () => {
        console.log("Moon image loaded successfully");
        this.loadedAssets.moon = true;
        this.checkAllAssetsLoaded();
      },
      (err) => console.error('Failed to load moon image:', err)
    );

    // Load merchant image
    this.assets.merchantImage = loadImage("assets/merch.png",
      () => {
        console.log("Merchant image loaded successfully");
        this.loadedAssets.merchant = true;
        this.checkAllAssetsLoaded();
      },
      (err) => console.error('Failed to load merchant image:', err)
    );
  }
  /**
   * Check if all assets are loaded
   */
  checkAllAssetsLoaded() {
    if (Object.values(this.loadedAssets).every(loaded => loaded)) {
      console.log("All assets loaded");
      this.setupMoon();
      this.setupMerchant();
    }
  }
  /**
   * Setup function for the scene
   */
  setupMoon() {
    this.moon = new Moon(this.assets.moonImage);
  }

  /**
   * Setup function for the scene
   * This function initializes the canvas and stars
   * It also sets up the moon and floating merchant
   */
  setupMerchant() {
    this.floatingMerchant = new FloatingImage(this.assets.merchantImage);
    this.floatingMerchant.yoff = this.yoff;
    this.floatingMerchant.yRange = this.yRange;
  }

  /**
   * Setup function for the scene
   */
  setup() {
    createCanvas(windowWidth, windowHeight);
    this.initializeStars();
    this.setupSections();
    this.isDesktopView = window.innerWidth > 768;
  }

  /**
   * Setup function for the scene
   */
  setupSections() {
    this.sections = [
      {
        text: "I take after my forefathers of the lush gardens of hind,\n" +
          "And my blood takes after my seafaring grand uncles that sold merch's;\n" +
          "They gifted me with the wisdom to find all that is diplomatic,\n" +
          "and with the sight to see at all our world's opportunities,\n" +
          "\n \n{Swipe down}",
        yPos: 0
      },
      {
        text: "I hope to see more green, and more blue,\n" +
          "Hope our kins' minds and health are freed,",
        yPos: windowHeight
      },
      {
        text: "But I am disappointed in this world's bright red hue,\n" +
          "And its archaic autocrats,\n" +
          "With their crowns shining it's zirconium streak,",
        yPos: windowHeight * 2
      },
      {
        text: "My land's grandmother paralyzes me in my slumber,\n" +
          "She's there, as I try to to fight the images of wars,\n" +
          "As I hope to bargain for some peace in my sleep.\n\n" +
          "But I see my stubbornness in her,\n" +
          "I see her going through my drawers and stash,\n" +
          "Frantically even, I see her balancing my sheets,",
        yPos: windowHeight * 3
      },
      {
        text: "Her cold face cannot hide her paranoia,\n" +
          "Her forehead and neck failing to contain her sweat,\n" +
          "That loving phantom is funnily scared much like me,\n" +
          "My crystal image, in her, I see.",
        yPos: windowHeight * 4
      },
      {
        text: "She's worried if I am keeping my stomach fed and my back warm,\n" +
          "warm is her demeanour usually,\n\n" +
          "But she started seething when I turned 23.\n" +
          "\"23?!\", \"Ba-trees?!\"",
        yPos: windowHeight * 5
      },
      {
        text: "\"You better be planting those trees when you're on my sister's land,\n" +
          "Turtle island blemished with the their greedy plans;\n" +
          "Pillaged my nephews and nieces,\n" +
          "Under the guise of the ol' divine providence;\n" +
          "They killed her kin with no remorse," +
          "and I haven't seen my sister's weeping stop ever since\"",
        yPos: windowHeight * 6
      },
      {
        text: "She's telling me to be humble\n" +
          "She's yelling at me to do better,",
        yPos: windowHeight * 7
      },
      {
        text: "Get a kevlar, graphite or carbon leaded fibres covering my spinal,\n" +
          "\"Better now!\" she thinks, -\n" +
          "Learnt from the cycles of the eons, she's seen,\n" +
          "before she too has to see my head anchored off my body,\n" +
          "chopped, and rolling down some random hill\n" +
          "victim again of the fanatics of the world\n",
        yPos: windowHeight * 8
      },
      {
        text: "She's telling me about Dara Shikoh,\n" +
          "Shankracharya and Rumi;\n" +
          "Twisting my neck; She's stretching my ears,\n" +
          "From across the world, and back to the East,\n" +
          "So I don't discriminate against Tzu, and Han's Philosophies,",
        yPos: windowHeight * 9
      },
      {
        text: "She's telling me to be humble when Bakr calls me a Blasphemer,\n" +
          "And Augustine labels me a Heretic,\n" +
          "\"Don't take it to heart, that's not what matters\",\n" +
          "You need their vision and wisdom, don't discriminate with good data,\n" +
          "The good ideas,\n" +
          "Good morals,\n" +
          "Good will,\n" +
          "and the good Ethics,\n" +
          "Be it Christ, Vishnu, Buddha,\n" +
          "or through the One for whom the whole world wishes bundles of peace.",
        yPos: windowHeight * 10
      },
      {
        text: "Bow down your bony occipital,\n" +
          "Don't rush to judge all of our global wisdom,\n" +
          "Let it through your top that I know is thick,\n\n" +
          "She's telling me..\n\n" +
          "She's telling me to be humble\n" +
          "She's yelling at me to do better,\n" +
          "Cover my neck, and balance my sheets,\n" +
          "\"Never stop that education !\"\n" +
          "Just so I can make arrangements for my own personal peace.",
        yPos: windowHeight * 11
      },
      {
        text: "Be it dusty leather bond books,\n" +
          "Or Einstein's and Curie's papers about this world as they See.",
        yPos: windowHeight * 12
      },
      {
        text: "She's telling me to be humble\n" +
          "She's yelling at me to do better,\n" +
          "Cover my neck, and balance my sheets,\n" +
          "\"Never stop that education !\"\n" +
          "Just so I can make arrangements for my own personal peace.",
        yPos: windowHeight * 13
      }
    ];
  }

  /**
   * Initialize the starry background
   * This function creates a number of Star objects
   * and adds them to the stars array
   */
  initializeStars() {
    for (let i = 0; i < VISUAL_SETTINGS.STAR_COUNT; i++) {
      this.stars.push(new Star());
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
   *  Draw the scrolling content
   */
  drawScrollingContent() {
    push();
    resetMatrix();
    translate(0, -this.scrollY);

    this.sections.forEach((section, index) => {
      let sectionY = index * windowHeight;

      // Skip sections that are far outside the viewport
      if (sectionY + windowHeight < this.scrollY - windowHeight ||
        sectionY > this.scrollY + windowHeight * 2) {
        return;
      }

      // Text styling
      fill(TYPOGRAPHY.TITLE.COLOR);
      stroke(0);  // Black border
      strokeWeight(1.5);  // Slight stroke width
      textAlign(CENTER, TOP);
      textFont(this.font);

      if (this.isDesktopView) {
        // Desktop view
        const textPadding = width * 0.1; // 10% padding on each side
        const textWidth = width - (textPadding * 2);
        const textY = sectionY + (height * 0.05);

        textSize(TYPOGRAPHY.TITLE.SIZE.DESKTOP * 0.5);
        textLeading(TYPOGRAPHY.TITLE.SIZE.DESKTOP * 0.5);

        text(section.text, textPadding, textY, textWidth, height * 0.8);
      } else {
        // Mobile view
        const textPadding = width * 0.15; // 15% padding on each side for mobile
        const textWidth = width - (textPadding * 2);
        const textY = sectionY + (height * 0.15);

        textSize(TYPOGRAPHY.TITLE.SIZE.MOBILE * 0.4);
        textLeading(TYPOGRAPHY.TITLE.SIZE.MOBILE * 0.5);

        text(section.text, textPadding, textY, textWidth, height * 0.8);
      }
    });
    pop();
  }

  /**
   * Draw function for the scene
   * This function draws the starry background, scrolling content,
   * moon, waves, and floating merchant
   */
  draw() {
    background(0, 255);
    this.drawStarryBackground();

    // Draw moon after stars but before text (only on desktop)
    if (this.isDesktopView && this.moon) {
      this.moon.update();
      this.moon.display();
    }

    this.drawScrollingContent();

    // Draw waves and merchant on desktop (after text, in front)
    if (this.isDesktopView) {
      this.drawWave();

      if (this.floatingMerchant) {
        this.floatingMerchant.yoff = this.yoff;
        this.floatingMerchant.update();
        this.floatingMerchant.display();
      }
    }

    // Handle smooth scrolling with easing
    const scrollEasing = this.isSnapping ? 0.05 : 0.02;
    this.scrollY = lerp(this.scrollY, this.targetScrollY, scrollEasing);

    if (Math.abs(this.scrollY - this.targetScrollY) < 0.1) {
      this.scrollY = this.targetScrollY;
    }

    this.currentSection = floor(this.scrollY / windowHeight);

    // Check if we should transition to the last scene
    const isAtLastSection = this.currentSection >= this.sections.length - 1;
    const hasScrolledPastEnd = this.scrollY > (this.sections.length - 0.7) * windowHeight;

    if (isAtLastSection && hasScrolledPastEnd) {
      window.mgr.showScene(LastScene);
    }
  }

  /**
   * Mouse pressed function for the scene
   *  This function handles mouse interactions
   */
  mousePressed() {
    // Handle mouse interactions
  }

  /**
   * Mouse wheel and touch scroll function for the scene
   * This function handles both mouse wheel and touch scroll interactions
   * @param {*} event - Mouse wheel event or touch event with delta property
   * @returns {boolean} Whether default behavior should be prevented
   */
  mouseWheel(event) {
    // Skip if already in a snap animation
    if (this.isSnapping) {
      console.log("Ignoring scroll - snapping in progress");
      return false;
    }

    // Determine if this is from touch or mouse wheel
    const isTouchEvent = 'touches' in window && touches.length > 0;

    // Apply different thresholds for mouse wheel vs. touch
    const minDelta = isTouchEvent ? 15 : 10;

    if (Math.abs(event.delta) < minDelta) {
      console.log("Ignoring small delta:", event.delta);
      return false;
    }

    // Touch events are typically opposite direction, so we adjust if needed
    const direction = event.delta > 0 ? 1 : -1;
    let currentSection = Math.round(this.scrollY / windowHeight);

    console.log("Processing scroll - current section:", currentSection,
      "direction:", direction, "delta:", event.delta);

    // Check if we're at the last section and scrolling down
    if (currentSection >= this.sections.length - 1 && direction > 0) {
      this.targetScrollY = this.sections.length * windowHeight;
      this.isSnapping = true;
      console.log("Transitioning to LastScene");
      setTimeout(() => {
        window.mgr.showScene(LastScene);
      }, 500);
      return false;
    }

    // Calculate target section with constraints
    let targetSection = currentSection + direction;
    targetSection = constrain(targetSection, 0, this.sections.length - 1);
    this.targetScrollY = targetSection * windowHeight;

    console.log("Moving to section:", targetSection);

    // Set snapping and clear it after animation completes
    this.isSnapping = true;
    setTimeout(() => {
      this.isSnapping = false;
      console.log("Snap completed");
    }, 950);

    return false;
  }

  /**
   * Window resized function for the scene
   * This function resizes the canvas and stars
   */
  windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    this.stars.forEach(star => star.handleResize());
    this.isDesktopView = window.innerWidth > 768;
    this.totalScrollHeight = this.sections.length * windowHeight;

    // Adjust scroll position for new window size
    const currentSection = Math.floor(this.scrollY / windowHeight);
    this.scrollY = currentSection * windowHeight;
    this.targetScrollY = this.scrollY;

    // Update wave boundaries
    this.yRange = {
      min: this.canvash * 0.6,
      max: this.canvash * 0.8
    };

    if (this.moon) {
      this.moon.handleResize();
    }

    // Update floating merchant if it exists
    if (this.floatingMerchant) {
      this.floatingMerchant.initializeProperties();
    }
  }

  /**
   * Draw the ocean waves
   * This function updates and displays the ocean waves
   */
  drawWave() {
    // Use the shared wave drawing utility with journey scene-specific settings
    globalYoff = drawWaves({
      yRange: this.yRange,
      layerCount: 3,
      colorScheme: 'UNIFIED',  // Use the unified color scheme
      timeScale: 0.0003,
      updateYoff: true
    });

    // Update our local reference to the global yoff for use with the merchant
    this.yoff = globalYoff;
  }

  // The addWaveTexture method has been moved to sketch.js as a global function

  exit() {
    // Clear the stars array
    // Clear the canvas
    clear();
  }
} 