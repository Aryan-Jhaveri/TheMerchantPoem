class LastScene {
  constructor() {
    this.stars = [];
    this.domElements = []; // Track all created DOM elements
    this.isActive = false; // Track if scene is currently active
    this.sections = {
      about: {
        title: "About This Project",
        content: "The Merchant Poem, is an interactive media project of a poem I wrote about my Land's Grandmother telling me to strictly do better, in the face of the world's challenges.<br>" +
        "With the treasure trove of information out there, and a seemingly impossible world to navigate, I hope this project can be a helpful guide and a source of motivation<br>" +
        "Do not give into despair, and do not stop learning.<br>" +
        "We are all in this together."
      },
      resources: {
        title: "Resources",
        links: [
          {
            title: "St. Catharines Public Library Card Registration",
            url: "https://www.myscpl.ca/",
            description: "For those in Niagara, access thousands of books, free linkedin learning, digital resources, and community programs"
          },
          {
            title: "Open Educational Resources (OER)",
            url: "https://www.oercommons.org/",
            description: "Free and open digital textbooks, and learning materials"
          },
          {
            title: "Github Awesome Lists Repository",
            url: "https://github.com/topics/awesome-list",
            description: "An Awesome collection of lists compiled by the internet, with roadmaps, guides, and a trasure trove of resources"
          },
          {
            title: "COMP-Sci Reference sheets",
            url: "https://quickref.me/",
            description: "Quick reference guides and cheat sheets for programming languages and tools"
          },
          {
            title: "MerLOT Data Base",
            url: "https://www.merlot.org/merlot/",
            description: "Multimedia Educational Resource for Learning and Online Teaching"
          },
          {
            title: "Stanford Engineering Everywhere",
            url: "https://see.stanford.edu/",
            description: "Free engineering courses and materials from Stanford University"
          },
          {
            title: "Physlet Physics",
            url: "https://www.compadre.org/physlets/",
            description: "Interactive physics simulations and educational resources"
          },
          {
            title: "LearnChemE",
            url: "https://learncheme.com/",
            description: "Chemical engineering educational resources and simulations"
          }
        ]
      }
    };
    
  // Add responsive layout settings
  this.layout = {
    breakpoints: {
      mobile: 768,
      tablet: 1024
    },
    spacing: {
      getSectionMargin: () => {
        return this.isMobile() ? 0.05 : 0.1;
      },
      getContentWidth: () => {
        return this.isMobile() ? 0.9 : 0.8;
      }
    },
    positioning: {
      getAboutPosition: () => {
        const margin = this.layout.spacing.getSectionMargin();
        return {
          x: width * margin,
          y: height * (this.isMobile() ? 0.08 : 0.1)
        };
      },
      getResourcesPosition: () => {
        const margin = this.layout.spacing.getSectionMargin();
        return {
          x: width * margin,
          y: height * (this.isMobile() ? 0.4 : 0.4)
        };
      }
    }
  };

  this.styles = {
    text: {
      getSize: () => this.isMobile() ? 14 : 16,
      lineHeight: 24,
      color: 255
    },
    heading: {
      getSize: () => this.isMobile() ? 24 : 32,
      color: 255
    },
    link: {
      color: '#64B5F6',
      hoverColor: '#90CAF9'
    }
  };

  this.font = null;
  }

  enter() {
    //this.isActive = true;
    this.preload();
    this.setup();
  }
  /**
 * Preload assets before setup
 */
  preload() {
    this.font = loadFont("assets/Jacquard12-Regular.ttf");
  }

  /**
   * Setup the scene
   */
  setup() {
    createCanvas(windowWidth, windowHeight);
    this.initializeStars();
  }

  /**
   * Enter the scene
   * - Create and display all necessary elements
   */
  enter() {
    console.log('Entering LastScene...');
    // Ensure clean slate
    this.exit();
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      // Create section containers
      this.createAboutSection();
      this.createResourcesSection();
    }, 50);
  }

  /**
   * Create the about section
   * - Title
   * - Content
   */
  createAboutSection() {
    // Remove existing section if it exists
    const existingSection = select('.about-section');
    if (existingSection) {
      existingSection.remove();
    }

    const position = this.layout.positioning.getAboutPosition();
    const contentWidth = this.layout.spacing.getContentWidth();
    
    const aboutContainer = createDiv('');
    this.domElements.push(aboutContainer); // Track the container
    aboutContainer.class('about-section');
    aboutContainer.position(position.x, position.y);
    aboutContainer.style('width', `${contentWidth * 100}%`);
    
    const aboutTitle = createElement('h2', this.sections.about.title);
    this.domElements.push(aboutTitle); // Track the title
    aboutTitle.parent(aboutContainer);
    aboutTitle.style('color', '#ffffff');
    aboutTitle.style('font-size', `${this.styles.heading.getSize()}px`);
    
    const aboutContent = createP(this.sections.about.content);
    this.domElements.push(aboutContent); // Track the content
    aboutContent.parent(aboutContainer);
    aboutContent.style('color', '#ffffff');
    aboutContent.style('line-height', '1.6');
    aboutContent.style('font-size', `${this.styles.text.getSize()}px`);
  }

  /**
   * Create the resources section
   * - Title
   * - List of links
   */
  createResourcesSection() {
    // Remove existing section if it exists
    const existingSection = select('.resources-section');
    if (existingSection) {
      existingSection.remove();
    }

    const position = this.layout.positioning.getResourcesPosition();
    const contentWidth = this.layout.spacing.getContentWidth();
    
    // Create outer container with fixed height
    const resourcesContainer = createDiv('');
    this.domElements.push(resourcesContainer);
    resourcesContainer.class('resources-section');
    resourcesContainer.position(position.x, position.y);
    resourcesContainer.style('width', `${contentWidth * 100}%`);
    resourcesContainer.style('height', '60vh'); // Set fixed height
    resourcesContainer.style('overflow-y', 'auto'); // Enable vertical scrolling
    resourcesContainer.style('padding-right', '20px'); // Add padding for scrollbar
    resourcesContainer.style('-webkit-overflow-scrolling', 'touch'); // Enable momentum scrolling on iOS
    resourcesContainer.style('touch-action', 'manipulation'); // Optimize touch handling
    resourcesContainer.style('user-select', 'none'); // Prevent text selection while scrolling
    resourcesContainer.style('cursor', 'default'); // Default cursor
    resourcesContainer.style('overscroll-behavior', 'contain'); // Prevent scroll chain
    resourcesContainer.style('scroll-behavior', 'smooth'); // Smooth scrolling
    resourcesContainer.style('-webkit-tap-highlight-color', 'rgba(0,0,0,0)'); // Remove tap highlight on mobile
    
    // Mobile-specific styles
    if (this.isMobile()) {
      resourcesContainer.style('overflow-y', 'scroll');
      resourcesContainer.style('height', '50vh'); // Slightly smaller height on mobile
      resourcesContainer.style('padding-right', '10px'); // Smaller padding on mobile
    }
    
    // Add smooth scrolling for non-touch devices
    if (!this.isMobile()) {
      resourcesContainer.style('scroll-behavior', 'smooth');
    }

    // Style the scrollbar
    resourcesContainer.style('scrollbar-width', 'thin');
    resourcesContainer.style('scrollbar-color', '#ffffff40 transparent');

    // Webkit scrollbar styles
    resourcesContainer.style('&::-webkit-scrollbar', '{ width: 8px; }');
    resourcesContainer.style('&::-webkit-scrollbar-track', '{ background: transparent; }');
    resourcesContainer.style('&::-webkit-scrollbar-thumb', '{ background: #ffffff40; border-radius: 4px; }');

    const resourcesTitle = createElement('h2', this.sections.resources.title);
    this.domElements.push(resourcesTitle);
    resourcesTitle.parent(resourcesContainer);
    resourcesTitle.style('color', '#ffffff');
    resourcesTitle.style('font-size', `${this.styles.heading.getSize()}px`);
    resourcesTitle.style('margin-bottom', '20px');

    // Create inner content container
    const contentContainer = createDiv('');
    this.domElements.push(contentContainer);
    contentContainer.parent(resourcesContainer);
    contentContainer.style('padding-bottom', '20px'); // Add bottom padding for last item

    this.sections.resources.links.forEach(link => {
      const linkContainer = createDiv('');
      this.domElements.push(linkContainer);
      linkContainer.parent(contentContainer);
      linkContainer.style('margin-bottom', this.isMobile() ? '15px' : '20px');

      const a = createA(link.url, link.title);
      this.domElements.push(a);
      a.parent(linkContainer);
      a.style('color', this.styles.link.color);
      a.style('text-decoration', 'none');
      a.style('font-size', `${this.styles.text.getSize()}px`);
      a.style('padding', this.isMobile() ? '8px 0' : '5px 0'); // Larger touch target
      a.style('display', 'inline-block'); // Make the full area clickable
      a.style('cursor', 'pointer'); // Show pointer cursor
      a.style('touch-action', 'manipulation'); // Optimize for touch
      a.style('-webkit-tap-highlight-color', 'rgba(100,181,246,0.2)'); // Subtle tap highlight
      a.mouseOver(() => a.style('color', this.styles.link.hoverColor));
      a.mouseOut(() => a.style('color', this.styles.link.color));
      a.touchStarted(() => a.style('color', this.styles.link.hoverColor));
      a.touchEnded(() => a.style('color', this.styles.link.color));

      const description = createP(link.description);
      this.domElements.push(description);
      description.parent(linkContainer);
      description.style('color', '#ffffff');
      description.style('margin-top', '5px');
      description.style('font-size', `${this.styles.text.getSize() - 2}px`);
      description.style('line-height', '1.6');
    });
  }

  /**
   * 
   * @returns {boolean} Whether the current viewport is mobile
   */
  isMobile() {
    return windowWidth < this.layout.breakpoints.mobile;
  }

  /**
   * 
   * @returns {boolean} Whether the current viewport is tablet
   * - Excludes mobile
   * - Includes tablet
   */
  isTablet() {
    return windowWidth >= this.layout.breakpoints.mobile && 
           windowWidth < this.layout.breakpoints.tablet;
  }

  /**
   * Initialize the star field
   */
  initializeStars() {
    for (let i = 0; i < VISUAL_SETTINGS.STAR_COUNT; i++) {
      this.stars.push(new Star());
    }
  }

  /**
   * Draw the starry background
   */
  drawStarryBackground() {
    this.stars.forEach(star => {
      star.update();
      star.display();
    });
  }

  /**
   * Draw the scene
   */
  draw() {
    background(0,255);
    this.drawStarryBackground();
  }

  /**
   * Handle touch start event
   */
  touchStarted(event) {
    // Initialize touch tracking if not exists
    if (!this.touchTracker) {
      this.touchTracker = {
        startY: 0,
        startX: 0,
        lastY: 0,
        startTime: 0,
        isScrolling: false,
        scrollVelocity: 0,
        targetLink: null,
        momentumRAF: null
      };
    }

    const resourcesSection = select('.resources-section');
    if (!resourcesSection || !touches || touches.length === 0) return true;

    const touch = touches[0];
    const rect = resourcesSection.elt.getBoundingClientRect();

    // Cancel any ongoing momentum scrolling
    if (this.touchTracker.momentumRAF) {
      cancelAnimationFrame(this.touchTracker.momentumRAF);
      this.touchTracker.momentumRAF = null;
    }

    // Store touch start information
    this.touchTracker.startY = touch.y;
    this.touchTracker.startX = touch.x;
    this.touchTracker.lastY = touch.y;
    this.touchTracker.startTime = millis();
    this.touchTracker.isScrolling = touch.y >= rect.top && touch.y <= rect.bottom;
    this.touchTracker.scrollVelocity = 0;

    // Check if touch started on a link
    const element = document.elementFromPoint(touch.x, touch.y);
    this.touchTracker.targetLink = element && element.tagName === 'A' ? element : null;

    // Prevent default only if we're handling the scroll
    return !this.touchTracker.isScrolling;
  }

  /**
   * Handle touch moved event
   */
  touchMoved(event) {
    if (!this.touchTracker) return true;

    const resourcesSection = select('.resources-section');
    if (!resourcesSection || !touches || touches.length === 0) return true;

    const touch = touches[0];
    const deltaY = this.touchTracker.lastY - touch.y;
    const deltaX = Math.abs(this.touchTracker.startX - touch.x);
    const timeDelta = millis() - this.touchTracker.startTime;

    // Calculate scroll velocity (pixels per millisecond)
    this.touchTracker.scrollVelocity = deltaY / Math.max(1, timeDelta);

    // If significant horizontal movement, cancel potential link activation
    if (deltaX > 10) {
      this.touchTracker.targetLink = null;
    }

    // Handle scrolling with enhanced sensitivity
    if (this.isScrolling) {
      // Smooth scrolling with momentum
      const scrollSpeed = constrain(deltaY * 1.2, -50, 50);
      resourcesSection.elt.scrollBy(0, scrollSpeed);
      return false; // Prevent default scrolling
    }

    return true;
  }

  /**
   * Handle touch ended event
   */
  touchEnded(event) {
    // Check if this was a tap on a link
    if (this.touchedLink && millis() - this.touchStartTime < 300) {
      const deltaY = Math.abs(touches && touches[0] ? touches[0].y - this.touchStartY : 0);
      const deltaX = Math.abs(touches && touches[0] ? touches[0].x - this.touchStartX : 0);
      
      // If movement was minimal, trigger the link
      if (deltaY < 10 && deltaX < 10) {
        this.touchedLink.click();
      }
    }

    // Reset touch tracking variables
    this.touchStartY = null;
    this.touchStartX = null;
    this.lastTouchY = null;
    this.touchStartTime = null;
    this.isScrolling = false;
    this.touchedLink = null;
    
    return true;
  }

  /**
   * Handle mouse press event
   */
  mousePressed() {
  }

  /**
   * Handle window resize event
   */
  windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    this.createAboutSection();
    this.createResourcesSection();
  }

  /**
   * Exit the scene
   * - Remove all tracked elements
   * - Clear the canvas
   */
  exit() {
    console.log('Cleaning up LastScene...');
    // Remove all tracked DOM elements
    this.domElements.forEach(element => {
      if (element) {
        element.remove();
      }
    });
    // Clear the tracking array
    this.domElements = [];
    
    this.star = []; // Reset

    // Remove any elements that might have been missed
    selectAll('.about-section').forEach(el => el.remove());
    selectAll('.resources-section').forEach(el => el.remove());
    
    // Clear the canvas
    clear();
  }
}