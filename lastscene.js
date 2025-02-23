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
          y: height * (this.isMobile() ? 0.5 : 0.4)
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
    
    const resourcesContainer = createDiv('');
    this.domElements.push(resourcesContainer); // Track container
    resourcesContainer.class('resources-section');
    resourcesContainer.position(position.x, position.y);
    resourcesContainer.style('width', `${contentWidth * 100}%`);

    const resourcesTitle = createElement('h2', this.sections.resources.title);
    this.domElements.push(resourcesTitle); // Track title
    resourcesTitle.parent(resourcesContainer);
    resourcesTitle.style('color', '#ffffff');
    resourcesTitle.style('font-size', `${this.styles.heading.getSize()}px`);

    this.sections.resources.links.forEach(link => {
      const linkContainer = createDiv('');
      this.domElements.push(linkContainer); // Track link container
      linkContainer.parent(resourcesContainer);
      linkContainer.style('margin-bottom', this.isMobile() ? '15px' : '20px');

      const a = createA(link.url, link.title);
      this.domElements.push(a); // Track link
      a.parent(linkContainer);
      a.style('color', this.styles.link.color);
      a.style('text-decoration', 'none');
      a.style('font-size', `${this.styles.text.getSize()}px`);
      a.style('padding', this.isMobile() ? '2px 0' : '5px 0');
      a.mouseOver(() => a.style('color', this.styles.link.hoverColor));
      a.mouseOut(() => a.style('color', this.styles.link.color));

      const description = createP(link.description);
      this.domElements.push(description); // Track description
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
    
    // Remove any elements that might have been missed
    selectAll('.about-section').forEach(el => el.remove());
    selectAll('.resources-section').forEach(el => el.remove());
    
    // Clear the canvas
    clear();
  }
}