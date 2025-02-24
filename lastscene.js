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
  this.hideWheelTimeout = null;
  }

  // Improved mobile scrolling implementation
  enableMobileScrolling() {
    // Get the resources container element
    const resourcesContainer = select('.resources-section');
    if (!resourcesContainer) return;
    
    // Get the actual DOM element
    const containerElement = resourcesContainer.elt;
    
    // Stop p5.js from preventing default touch behavior
    // This is critical for enabling native scrolling
    ['touchstart', 'touchmove', 'touchend'].forEach(eventType => {
      containerElement.addEventListener(eventType, (e) => {
        // Allow event to propagate but don't prevent default
        e.stopPropagation();
      }, { passive: true });
    });
    
    // Ensure the container has proper CSS for scrolling
    resourcesContainer.style('overflow-y', 'scroll');
    resourcesContainer.style('-webkit-overflow-scrolling', 'touch'); // iOS momentum scrolling
    resourcesContainer.style('overscroll-behavior', 'contain'); // Prevent scroll chain
    
    // Set appropriate height for mobile vs desktop
    resourcesContainer.style('max-height', this.isMobile() ? '50vh' : '60vh');
    
    // Add padding to ensure content can be scrolled completely
    const contentContainer = select('.resources-section > div:last-child');
    if (contentContainer) {
      contentContainer.style('padding-bottom', '100px');
    }
    
    // Add subtle scroll indicator that fades out
    if (this.isMobile()) {
      // Remove existing scroll indicator if it exists
      selectAll('.scroll-indicator').forEach(el => el.remove());
      
      const scrollIndicator = createDiv('Scroll for more ↓');
      this.domElements.push(scrollIndicator);
      scrollIndicator.class('scroll-indicator');
      scrollIndicator.parent(resourcesContainer);
      scrollIndicator.style('text-align', 'center');
      scrollIndicator.style('color', '#ffffff80');
      scrollIndicator.style('padding', '10px 0');
      scrollIndicator.style('font-size', '14px');
      scrollIndicator.style('position', 'sticky');
      scrollIndicator.style('top', '0');
      scrollIndicator.style('background-color', 'rgba(0,0,0,0.5)');
      scrollIndicator.style('z-index', '100');
      scrollIndicator.style('pointer-events', 'none');
      scrollIndicator.style('transition', 'opacity 1s ease-out');
      
      // Auto-hide the scroll indicator after 3 seconds
      setTimeout(() => {
        scrollIndicator.style('opacity', '0');
      }, 3000);
    }
  }

  updateHandlePosition(scrollHandle, container, maxTop) {
    const scrollHeight = container.scrollHeight - container.clientHeight;
    if (scrollHeight <= 0) return; // Avoid division by zero
    
    const scrollPercentage = container.scrollTop / scrollHeight;
    const newTop = scrollPercentage * maxTop;
    scrollHandle.style('top', `${newTop}px`);
  }


  setupScrollWheelHandlers(resourcesContainer, upButton, downButton, scrollHandle, scrollTrack, wheelContainer) {
    // Variables for tracking scroll state
    let isDragging = false;
    let startY = 0;
    let startTop = 0;
    const trackHeight = 60;
    const handleHeight = 16;
    const maxTop = trackHeight - handleHeight;
    
    // Function to scroll the container
    const scrollResources = (delta) => {
      const container = resourcesContainer.elt;
      container.scrollTop += delta;
      this.updateHandlePosition(scrollHandle, container, maxTop);
    };
    
    // Function to scroll to a specific percentage
    const scrollToPercent = (percentage) => {
      const container = resourcesContainer.elt;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      container.scrollTop = scrollHeight * percentage;
      this.updateHandlePosition(scrollHandle, container, maxTop);
    };
    
    // Update handle position when resources are scrolled
    resourcesContainer.elt.addEventListener('scroll', () => {
      if (!isDragging) {
        this.updateHandlePosition(scrollHandle, resourcesContainer.elt, maxTop);
      }
    });
    
    // Up button touch/click event - simplified with passive touch events
    upButton.elt.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      scrollResources(-80); // Scroll up by 80px
      
      // Active state
      upButton.style('background-color', 'rgba(100, 181, 246, 0.9)');
      setTimeout(() => {
        upButton.style('background-color', 'rgba(100, 181, 246, 0.6)');
      }, 200);
    });
    
    // Down button touch/click event - simplified with passive touch events  
    downButton.elt.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      scrollResources(80); // Scroll down by 80px
      
      // Active state
      downButton.style('background-color', 'rgba(100, 181, 246, 0.9)');
      setTimeout(() => {
        downButton.style('background-color', 'rgba(100, 181, 246, 0.6)');
      }, 200);
    });
    
    // Handle pointer events for the scroll handle (works for both touch and mouse)
    const handleElement = scrollHandle.elt;
    
    // Pointer down event
    handleElement.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      isDragging = true;
      startY = e.clientY;
      startTop = parseInt(scrollHandle.style('top')) || 0;
      
      // Add active styling
      scrollHandle.style('background-color', 'rgba(100, 181, 246, 0.8)');
      
      // Show the scroll wheel while dragging
      this.showScrollWheel(wheelContainer);
    });
    
    // Pointer move event
    document.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      
      const deltaY = e.clientY - startY;
      let newTop = startTop + deltaY;
      
      // Constrain to track
      newTop = Math.max(0, Math.min(maxTop, newTop));
      
      // Update handle position
      scrollHandle.style('top', `${newTop}px`);
      
      // Calculate scroll percentage and update container
      const scrollPercentage = newTop / maxTop;
      scrollToPercent(scrollPercentage);
    });
    
    // Pointer up event
    document.addEventListener('pointerup', () => {
      if (isDragging) {
        isDragging = false;
        scrollHandle.style('background-color', 'rgba(255, 255, 255, 0.8)');
      }
    });
    
    // Show wheel initially and set up auto-hide
    this.showScrollWheel(wheelContainer);
    
    // Show wheel when interacting with the container
    resourcesContainer.elt.addEventListener('pointerdown', () => {
      this.showScrollWheel(wheelContainer);
    });
  }

  showScrollWheel(wheelContainer) {
    wheelContainer.style('opacity', '1');
    clearTimeout(this.hideWheelTimeout);
    this.hideWheelTimeout = setTimeout(() => {
      wheelContainer.style('opacity', '0.3');
    }, 5000);
  }

  createScrollWheel() {
    // Only create scroll wheel for mobile devices
    if (!this.isMobile()) return;
    
    // Get the resources container
    const resourcesContainer = select('.resources-section');
    if (!resourcesContainer) return;
    
    // Remove existing scroll wheel if it exists
    selectAll('.scroll-wheel-container').forEach(el => el.remove());
    
    // Create scroll wheel container
    const wheelContainer = createDiv('');
    this.domElements.push(wheelContainer);
    wheelContainer.class('scroll-wheel-container');
    wheelContainer.style('position', 'fixed');
    wheelContainer.style('right', '10px');
    wheelContainer.style('top', '50%');
    wheelContainer.style('transform', 'translateY(-50%)');
    wheelContainer.style('width', '40px');
    wheelContainer.style('height', '160px');
    wheelContainer.style('background-color', 'rgba(0, 0, 0, 0.3)');
    wheelContainer.style('border-radius', '20px');
    wheelContainer.style('z-index', '1000');
    wheelContainer.style('display', 'flex');
    wheelContainer.style('flex-direction', 'column');
    wheelContainer.style('justify-content', 'space-between');
    wheelContainer.style('align-items', 'center');
    wheelContainer.style('padding', '15px 0');
    wheelContainer.style('backdrop-filter', 'blur(5px)');
    wheelContainer.style('transition', 'opacity 0.5s ease');
    wheelContainer.style('opacity', '1');
    
    // Up button
    const upButton = createDiv('↑');
    this.domElements.push(upButton);
    upButton.class('wheel-up-button');
    upButton.parent(wheelContainer);
    upButton.style('width', '30px');
    upButton.style('height', '30px');
    upButton.style('border-radius', '50%');
    upButton.style('background-color', 'rgba(100, 181, 246, 0.6)');
    upButton.style('color', 'white');
    upButton.style('display', 'flex');
    upButton.style('justify-content', 'center');
    upButton.style('align-items', 'center');
    upButton.style('font-size', '20px');
    upButton.style('cursor', 'pointer');
    upButton.style('user-select', 'none');
    
    // Scroll track
    const scrollTrack = createDiv('');
    this.domElements.push(scrollTrack);
    scrollTrack.class('wheel-track');
    scrollTrack.parent(wheelContainer);
    scrollTrack.style('width', '4px');
    scrollTrack.style('height', '60px');
    scrollTrack.style('background-color', 'rgba(255, 255, 255, 0.2)');
    scrollTrack.style('border-radius', '2px');
    scrollTrack.style('position', 'relative');
    
    // Scroll handle
    const scrollHandle = createDiv('');
    this.domElements.push(scrollHandle);
    scrollHandle.class('wheel-handle');
    scrollHandle.parent(scrollTrack);
    scrollHandle.style('width', '16px');
    scrollHandle.style('height', '16px');
    scrollHandle.style('background-color', 'rgba(255, 255, 255, 0.8)');
    scrollHandle.style('border-radius', '50%');
    scrollHandle.style('position', 'absolute');
    scrollHandle.style('left', '50%');
    scrollHandle.style('transform', 'translateX(-50%)');
    scrollHandle.style('top', '0');
    scrollHandle.style('cursor', 'pointer');
    scrollHandle.style('transition', 'background-color 0.2s ease');
    
    // Down button
    const downButton = createDiv('↓');
    this.domElements.push(downButton);
    downButton.class('wheel-down-button');
    downButton.parent(wheelContainer);
    downButton.style('width', '30px');
    downButton.style('height', '30px');
    downButton.style('border-radius', '50%');
    downButton.style('background-color', 'rgba(100, 181, 246, 0.6)');
    downButton.style('color', 'white');
    downButton.style('display', 'flex');
    downButton.style('justify-content', 'center');
    downButton.style('align-items', 'center');
    downButton.style('font-size', '20px');
    downButton.style('cursor', 'pointer');
    downButton.style('user-select', 'none');
    
    // Add scroll wheel event handlers
    this.setupScrollWheelHandlers(resourcesContainer, upButton, downButton, scrollHandle, scrollTrack, wheelContainer);
  }

  enter() {
    console.log('Entering LastScene...');
    // Ensure clean slate
    this.exit();
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      // Create section containers
      this.createAboutSection();
      this.createResourcesSection();
      
      // Make sure the scroll wheel is visible initially for mobile
      if (this.isMobile()) {
        const wheelContainer = select('.scroll-wheel-container');
        if (wheelContainer) {
          wheelContainer.style('opacity', '1');
        }
      }
    }, 50);
  }

  improveMobileExperience() {
    if (!this.isMobile()) return;
    
    // Get the resources container
    const resourcesContainer = select('.resources-section');
    if (!resourcesContainer) return;
    
    // Additional mobile-friendly styles
    resourcesContainer.style('padding-bottom', '30px');
    resourcesContainer.style('padding-right', '50px'); // Make room for scroll wheel
    
    // Increase touch target size for links on mobile
    selectAll('.resources-section a').forEach(a => {
      a.style('padding', '15px 0');
      a.style('margin-bottom', '5px');
      a.style('border-bottom', '1px solid rgba(255, 255, 255, 0.1)');
      
      // Variables for touch handling with reduced sensitivity
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      const touchThreshold = 10; // pixels - movement allowed before canceling click
      const longPressThreshold = 500; // milliseconds - time required for "intentional" click
      let isLongPressTriggered = false;
      let longPressTimer = null;
      
      // Handle touch start
      a.elt.addEventListener('touchstart', (e) => {
        // Store initial touch position and time
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isLongPressTriggered = false;
        
        // Show visual feedback that touch was detected
        a.style('color', this.styles.link.hoverColor);
        
        // Set up long press timer
        longPressTimer = setTimeout(() => {
          isLongPressTriggered = true;
          
          // Add extra visual feedback for long press
          a.style('text-decoration', 'underline');
          
          // Optional: Add subtle vibration feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(50); // 50ms vibration
          }
        }, longPressThreshold);
      }, { passive: true });
      
      // Handle touch move - cancel if moving too much
      a.elt.addEventListener('touchmove', (e) => {
        if (longPressTimer) {
          // Calculate distance moved
          const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
          const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
          
          // If moved beyond threshold, cancel the long press and revert styling
          if (deltaX > touchThreshold || deltaY > touchThreshold) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
            a.style('color', this.styles.link.color);
            a.style('text-decoration', 'none');
          }
        }
      }, { passive: true });
      
      // Handle touch end
      a.elt.addEventListener('touchend', (e) => {
        // Clear the long press timer
        clearTimeout(longPressTimer);
        
        // Remove visual feedback
        a.style('text-decoration', 'none');
        
        // Calculate touch duration
        const touchDuration = Date.now() - touchStartTime;
        
        // Only trigger link if it was a long press or we're not using long press mode
        if (isLongPressTriggered) {
          e.preventDefault(); // Prevent default only when we're taking action
          
          // Reset color with slight delay for visual feedback
          setTimeout(() => {
            a.style('color', this.styles.link.color);
          }, 150);
          
          // Get URL and open in new tab with slight delay
          const url = a.elt.getAttribute('href');
          if (url) {
            setTimeout(() => {
              window.open(url, '_blank');
            }, 50);
          }
        } else {
          // Not a long press, just reset the style
          a.style('color', this.styles.link.color);
        }
      });
      
      // Handle touch cancel
      a.elt.addEventListener('touchcancel', () => {
        clearTimeout(longPressTimer);
        a.style('color', this.styles.link.color);
        a.style('text-decoration', 'none');
      });
      
      // Keep mouse events for desktop
      a.mouseOver(() => a.style('color', this.styles.link.hoverColor));
      a.mouseOut(() => a.style('color', this.styles.link.color));
    });
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

    // This prevents p5.js from blocking touch events
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('touch-action', 'auto');
    
    // This prevents the canvas from capturing all touch events
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
    resourcesContainer.style('touch-action', 'pan-y'); // Optimize touch handling
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

    // Create a timestamp to prevent duplicate touch events (debounce)
    let lastTouchTime = 0;
    const touchDebounceTime = 300; // milliseconds
    
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
      a.style('padding', this.isMobile() ? '12px 0' : '8px 0'); // Increased touch target size
      a.style('display', 'block'); // Make the full area clickable
      a.style('cursor', 'pointer'); // Show pointer cursor
      a.style('touch-action', 'manipulation'); // Optimize for touch
      a.style('-webkit-tap-highlight-color', 'rgba(100,181,246,0.2)'); // Subtle tap highlight
      
      // Mouse events for desktop
      a.mouseOver(() => a.style('color', this.styles.link.hoverColor));
      a.mouseOut(() => a.style('color', this.styles.link.color));
      
      // Enhanced touch events
      a.attribute('data-url', link.url); // Store URL as data attribute
      
      // Add direct touch event handlers
      const linkElement = a.elt; // Get the actual DOM element
      
      // Add touch start event
      linkElement.addEventListener('touchstart', (e) => {
        a.style('color', this.styles.link.hoverColor);
        // Don't prevent default here to allow scrolling if needed
      }, { passive: true }); // Using passive to improve performance
      
      // Add touch end event with navigation
      linkElement.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        
        // Debounce touch events to prevent double-firing
        if (currentTime - lastTouchTime > touchDebounceTime) {
          lastTouchTime = currentTime;
          
          // Change color back
          a.style('color', this.styles.link.color);
          
          // Prevent ghost clicks
          e.preventDefault();
          
          // Get URL from data attribute
          const url = e.currentTarget.getAttribute('data-url');
          
          // Navigate after a slight delay to show the touch feedback
          setTimeout(() => {
            window.open(url, '_blank');
          }, 50);
        }
      });
      
      // Add touch cancel event
      linkElement.addEventListener('touchcancel', (e) => {
        a.style('color', this.styles.link.color);
      });

      const description = createP(link.description);
      this.domElements.push(description);
      description.parent(linkContainer);
      description.style('color', '#ffffff');
      description.style('margin-top', '5px');
      description.style('font-size', `${this.styles.text.getSize() - 2}px`);
      description.style('line-height', '1.6');
      
      // Make description non-interactive for touch events
      description.style('pointer-events', 'none');
    });
    
    // Add touch ended event to the p5 canvas
    this.registerMethod('touchEnded', this);
    this.enableMobileScrolling();
    this.createScrollWheel();
    this.improveMobileExperience();
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
    background(0,255);
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
    resizeCanvas(windowWidth, windowHeight);
    this.createAboutSection();
    this.createResourcesSection();
    
    // Force update the scroll wheel position
    if (this.isMobile()) {
      setTimeout(() => {
        const resourcesContainer = select('.resources-section');
        const wheelContainer = select('.scroll-wheel-container');
        if (resourcesContainer && wheelContainer) {
          // Trigger a scroll event to update handle position
          resourcesContainer.elt.dispatchEvent(new Event('scroll'));
        }
      }, 100);
    }
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