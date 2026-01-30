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
            y: height * (this.isMobile() ? 0.45 : 0.48)
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
    this.hideWheelTimeout = null;
  }

  // Simplified and improved mobile scrolling
  enableMobileScrolling() {
    // Get the resources container element
    const resourcesContainer = select('.resources-section');
    if (!resourcesContainer) return;

    // Get the actual DOM element
    const containerElement = resourcesContainer.elt;

    // CRITICAL: Completely remove p5's touch event prevention on this container
    // This allows native browser scrolling to work properly
    containerElement.style.touchAction = 'auto';

    // Stop p5.js from preventing default touch behavior by capturing events
    // at the container level and stopping propagation to p5
    ['touchstart', 'touchmove', 'touchend'].forEach(eventType => {
      containerElement.addEventListener(eventType, (e) => {
        // Don't let the event bubble up to p5's handlers
        e.stopPropagation();
      }, { passive: true });
    });

    // Enhanced mobile scrolling behavior
    resourcesContainer.style('overflow-y', 'scroll'); // Use 'scroll' instead of 'auto' on mobile
    resourcesContainer.style('-webkit-overflow-scrolling', 'touch'); // iOS momentum scrolling
    resourcesContainer.style('overscroll-behavior', 'contain'); // Prevent scroll chain
    resourcesContainer.style('scroll-behavior', 'smooth'); // Smooth scrolling

    // Make sure touch actions work as expected
    resourcesContainer.style('touch-action', 'pan-y'); // Optimize for vertical touch gestures

    // Set appropriate sizing for the container based on device
    resourcesContainer.style('max-height', this.isMobile() ? '45vh' : '60vh'); // Reduced height on mobile

    // Create a better scrollable area with padding
    const contentContainer = select('.resources-section > div:last-child');
    if (contentContainer) {
      contentContainer.style('padding-bottom', '100px'); // Add extra space at the bottom
      contentContainer.style('padding-top', '10px'); // Small padding at the top
    }

    // Add swipe indicator only on mobile
    if (this.isMobile()) {
      // Remove any existing indicators
      selectAll('.scroll-indicator').forEach(el => el.remove());

      // Create a simpler, more visible scroll indicator
      const scrollIndicator = createDiv('↓ Swipe to see more ↓');
      this.domElements.push(scrollIndicator);
      scrollIndicator.class('scroll-indicator');
      scrollIndicator.parent(resourcesContainer);
      scrollIndicator.style('text-align', 'center');
      scrollIndicator.style('color', '#ffffffcc');
      scrollIndicator.style('background', 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4))');
      scrollIndicator.style('padding', '8px 0');
      scrollIndicator.style('font-size', '14px');
      scrollIndicator.style('position', 'sticky');
      scrollIndicator.style('top', '0');
      scrollIndicator.style('margin-bottom', '5px');
      scrollIndicator.style('border-radius', '0 0 8px 8px');
      scrollIndicator.style('z-index', '100');
      scrollIndicator.style('pointer-events', 'none'); // Don't interfere with touch events
      scrollIndicator.style('transition', 'opacity 0.5s ease');

      // Automatically hide the indicator after user scrolls a bit
      containerElement.addEventListener('scroll', () => {
        if (containerElement.scrollTop > 20) {
          scrollIndicator.style('opacity', '0');
        } else {
          scrollIndicator.style('opacity', '1');
        }
      });
    }

    // Simple inertia scrolling for desktop without competing with mobile behavior
    if (!this.isMobile()) {
      containerElement.addEventListener('wheel', function (e) {
        if (e.deltaMode === 1) {
          // For Firefox compatibility
          e.preventDefault();
          containerElement.scrollTop += e.deltaY * 10;
        }
      }, { passive: false });
    }
  }

  // Removed all scroll wheel related methods - using native scrolling instead

  // Removed scroll wheel - using native scrolling instead

  // This duplicate enter method can be removed

  improveMobileExperience() {
    if (!this.isMobile()) return;

    // Get the resources container
    const resourcesContainer = select('.resources-section');
    if (!resourcesContainer) return;

    // Simple mobile-friendly adjustments
    resourcesContainer.style('padding-bottom', '30px');

    // Increase touch target size for links on mobile
    selectAll('.resources-section a').forEach(a => {
      // Make links easier to tap
      a.style('padding', '12px 0');
      a.style('margin-bottom', '5px');

      a.style('display', 'block'); // Full width

      // Find the link icon that was created with each link
      // Search for the span element created inside the parent wrapper
      let linkIcon = null;

      // First try the direct approach
      const wrapper = a.parent();
      if (wrapper) {
        // Look for span elements in the wrapper
        selectAll('span', wrapper.elt).forEach(span => {
          // This is likely our link icon
          linkIcon = span;
        });
      }

      // If we found the icon, enhance it for mobile
      if (linkIcon) {
        linkIcon.style('opacity', '0.9');
        linkIcon.style('margin-left', '8px');
        linkIcon.style('font-size', '16px'); // Make it more visible
      }
    });

    // Make all link descriptions easier to read on mobile
    selectAll('.resources-section p').forEach(p => {
      p.style('font-size', '14px');
      p.style('line-height', '1.4');
      p.style('margin-bottom', '15px');
    });

    // Ensure container has appropriate dimensions for mobile
    resourcesContainer.style('height', '50vh');
    resourcesContainer.style('width', '90%');
  }

  /**
 * Preload assets before setup
 */
  preload() {
    this.font = loadFont("assets/MedievalSharp-Regular.ttf");
  }

  /**
   * Setup the scene
   */
  setup() {
    createCanvas(windowWidth, windowHeight);
    this.initializeStars();

    // Ensure the canvas doesn't interfere with touch events
    const canvas = document.querySelector('canvas');
    if (canvas) {
      // Allow all touch actions including native scrolling
      canvas.style.touchAction = 'auto';

      // Make sure we're not preventing default touch events in this scene
      canvas.addEventListener('touchstart', (e) => {
        // Only stop propagation for the canvas itself, not its children
        if (e.target === canvas) {
          e.stopPropagation();
        }
      }, { passive: true });

      canvas.addEventListener('touchmove', (e) => {
        // Only stop propagation for the canvas itself, not its children
        if (e.target === canvas) {
          e.stopPropagation();
        }
      }, { passive: true });
    }

    // Ensure body allows touch actions too
    document.body.style.touchAction = 'auto';
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
      // Create section containers - same for both desktop and mobile
      this.createAboutSection();
      this.createResourcesSection();

      // Enable mobile-specific enhancements
      this.enableMobileScrolling();

      // Apply mobile-specific styles if needed
      if (this.isMobile()) {
        this.improveMobileExperience();
      }
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

    // Create outer container
    const resourcesContainer = createDiv('');
    this.domElements.push(resourcesContainer);
    resourcesContainer.class('resources-section');
    resourcesContainer.position(position.x, position.y);

    // Set consistent container width for all devices
    if (this.isMobile()) {
      // Mobile-optimized width
      resourcesContainer.style('width', '90%');
      resourcesContainer.style('max-width', '450px');
    } else {
      // Desktop width
      resourcesContainer.style('width', `${contentWidth * 100}%`);
    }

    // Set appropriate height (same content, different proportions)
    resourcesContainer.style('height', '50vh');

    // Consistent scrolling properties for all devices
    resourcesContainer.style('overflow-y', 'scroll');
    resourcesContainer.style('padding-right', '15px');
    resourcesContainer.style('-webkit-overflow-scrolling', 'touch');
    resourcesContainer.style('overscroll-behavior', 'contain');

    // Add subtle border for better visibility
    resourcesContainer.style('border-radius', '8px');
    resourcesContainer.style('background-color', 'rgba(0, 0, 0, 0.2)');
    resourcesContainer.style('box-shadow', '0 2px 10px rgba(0, 0, 0, 0.3)');

    // Simple, clean section title
    const resourcesTitle = createElement('h2', this.sections.resources.title);
    this.domElements.push(resourcesTitle);
    resourcesTitle.parent(resourcesContainer);
    resourcesTitle.style('color', '#ffffff');
    resourcesTitle.style('font-size', `${this.styles.heading.getSize()}px`);
    resourcesTitle.style('margin', '15px 0');
    resourcesTitle.style('padding', '0 15px');

    // Create inner content container
    const contentContainer = createDiv('');
    this.domElements.push(contentContainer);
    contentContainer.parent(resourcesContainer);
    contentContainer.style('padding', '0 15px 30px 15px');

    // Create a timestamp to prevent duplicate touch events
    let lastTouchTime = 0;
    const touchDebounceTime = 300; // milliseconds

    // Create links - track containers to remove last border
    const linkContainers = [];
    this.sections.resources.links.forEach(link => {
      // Link container for each resource
      const linkContainer = createDiv('');
      this.domElements.push(linkContainer);
      linkContainer.parent(contentContainer);
      linkContainer.style('margin-bottom', '15px');
      linkContainer.style('padding-bottom', '10px');
      linkContainer.style('border-bottom', '1px solid rgba(255, 255, 255, 0.15)');
      linkContainers.push(linkContainer);

      // Link wrapper with icon
      const linkWrapper = createDiv('');
      this.domElements.push(linkWrapper);
      linkWrapper.parent(linkContainer);
      linkWrapper.style('display', 'flex');
      linkWrapper.style('align-items', 'center');

      // Create the actual link
      const a = createA(link.url, link.title);
      this.domElements.push(a);
      a.parent(linkWrapper);
      a.style('color', this.styles.link.color);
      a.style('text-decoration', 'none');
      a.style('font-size', `${this.styles.text.getSize()}px`);
      a.style('padding', '10px 0');
      a.style('flex-grow', '1');
      a.style('font-weight', 'bold');

      // Add external link icon
      const linkIcon = createSpan('↗');
      this.domElements.push(linkIcon);
      linkIcon.parent(linkWrapper);
      linkIcon.style('color', this.styles.link.color);
      linkIcon.style('font-size', this.styles.text.getSize() + 'px');
      linkIcon.style('margin-left', '8px');
      linkIcon.style('opacity', '0.7');

      // Mouse events for desktop
      a.mouseOver(() => a.style('color', this.styles.link.hoverColor));
      a.mouseOut(() => a.style('color', this.styles.link.color));

      // Store URL as data attribute for touch handling
      a.attribute('data-url', link.url);

      // Get actual DOM element for adding native event listeners
      const linkElement = a.elt;

      // Improved touch handling for links on mobile
      let touchStartY = 0;
      let touchStartX = 0;
      let hasMoved = false;
      const moveThreshold = 10; // pixels to consider a scroll vs. a tap

      // Touch start - track position without preventing defaults
      linkElement.addEventListener('touchstart', (e) => {
        // Record start position
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        hasMoved = false;

        // Visual feedback
        a.style('color', this.styles.link.hoverColor);
      }, { passive: true });

      // Touch move - detect if user is scrolling
      linkElement.addEventListener('touchmove', (e) => {
        // Calculate distance moved
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        const dx = Math.abs(e.touches[0].clientX - touchStartX);

        // If moved beyond threshold, consider it a scroll not a tap
        if (dy > moveThreshold || dx > moveThreshold) {
          hasMoved = true;
          a.style('color', this.styles.link.color); // Reset color during scroll
        }
      }, { passive: true });

      // Touch end - only activate link if it wasn't a scroll
      linkElement.addEventListener('touchend', (e) => {
        // Reset appearance
        a.style('color', this.styles.link.color);

        // Only activate if it wasn't a scroll attempt
        if (!hasMoved) {
          const currentTime = new Date().getTime();

          // Debounce to prevent double-activation
          if (currentTime - lastTouchTime > touchDebounceTime) {
            lastTouchTime = currentTime;

            // Prevent default only when actually activating link
            e.preventDefault();

            // Get URL and navigate
            const url = e.currentTarget.getAttribute('data-url');
            if (url) {
              window.open(url, '_blank');
            }
          }
        }
      });

      // Touch cancel - reset appearance
      linkElement.addEventListener('touchcancel', (e) => {
        a.style('color', this.styles.link.color);
      });

      // Create description with consistent styling across devices
      const description = createP(link.description);
      this.domElements.push(description);
      description.parent(linkContainer);
      description.style('color', '#ffffff');
      description.style('margin-top', '5px');
      description.style('margin-bottom', '0'); // Prevent browser default margin
      description.style('font-size', '14px'); // Consistent size across devices
      description.style('line-height', '1.5');
      description.style('opacity', '0.9');

      // Make description non-interactive for touch events
      description.style('pointer-events', 'none');
    });

    // Remove border from last link container to prevent trailing divider
    if (linkContainers.length > 0) {
      linkContainers[linkContainers.length - 1].style('border-bottom', 'none');
      linkContainers[linkContainers.length - 1].style('margin-bottom', '0');
      linkContainers[linkContainers.length - 1].style('padding-bottom', '0');
    }

    // Enable mobile scrolling enhancements
    this.enableMobileScrolling();
  }

  // Add this as a separate method to handle touch events globally
  touchEnded() {
    // This will be called automatically by p5.js when touch ends
    // Return true to allow default browser behavior
    return true;
  }

  /**
   * 
   * @returns {boolean} Whether the current viewport is mobile
   */
  isMobile() {
    return windowWidth < BREAKPOINTS.MOBILE;
  }

  /**
   * 
   * @returns {boolean} Whether the current viewport is tablet
   * - Excludes mobile
   * - Includes tablet
   */
  isTablet() {
    return windowWidth >= BREAKPOINTS.MOBILE &&
      windowWidth < BREAKPOINTS.TABLET;
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
    background(0, 255);
    this.drawStarryBackground();
  }

  /**
   * Handle touch start event
   */
  touchStarted(event) {
    return true;
  }

  /**
   * Handle touch moved event
   */
  touchMoved(event) {
    return true;
  }

  /**
   * Handle touch ended event
   */
  touchEnded(event) {
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
    // Resize canvas
    resizeCanvas(windowWidth, windowHeight);

    // Clear previous layout
    this.exit();

    // Recreate sections with updated dimensions
    this.createAboutSection();
    this.createResourcesSection();

    // Re-apply scrolling improvements
    this.enableMobileScrolling();

    // Apply mobile-specific styles if needed
    if (this.isMobile()) {
      this.improveMobileExperience();
    }

    // Ensure stars scale correctly
    this.stars.forEach(star => {
      if (typeof star.handleResize === 'function') {
        star.handleResize();
      }
    });
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