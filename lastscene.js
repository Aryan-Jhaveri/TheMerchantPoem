class LastScene {
  constructor() {
    this.stars = [];
    this.sections = {
      about: {
        title: "About This Project",
        content: "The Merchant Poem, is an interactive media project of a poem I wrote with the goal to share resources with my peers.<br>" +
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
            description: "Access thousands of books, free linkined learning, digital resources, and community programs"
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
    
    this.styles = {
      text: {
        size: 16,
        lineHeight: 24,
        color: 255
      },
      heading: {
        size: 32,
        color: 255
      },
      link: {
        color: '#64B5F6',
        hoverColor: '#90CAF9'
      }
    };

    this.font = null;
  }

  preload() {
    // Load custom font if needed
    this.font = loadFont("assets/Jacquard12-Regular.ttf");
  }

  setup() {
    createCanvas(windowWidth, windowHeight);
    textSize(this.styles.text.size);
    
    // Create section containers
    this.createAboutSection();
    this.createResourcesSection();
  }

  createAboutSection() {
    const aboutContainer = createDiv('');
    aboutContainer.class('about-section');
    aboutContainer.position(width * 0.1, height * 0.1);
    aboutContainer.style('width', '80%');
    
    const aboutTitle = createElement('h2', this.sections.about.title);
    aboutTitle.parent(aboutContainer);
    aboutTitle.style('color', '#ffffff');
    aboutTitle.style('font-size', '2em');
    
    const aboutContent = createP(this.sections.about.content);
    aboutContent.parent(aboutContainer);
    aboutContent.style('color', '#ffffff');
    aboutContent.style('line-height', '1.6');
  }

  // Add mobile detection method
  isMobile() {
    return windowWidth < 768; // Common mobile breakpoint
  }

  createResourcesSection() {
    const resourcesContainer = createDiv('');
    resourcesContainer.class('resources-section');
    
    // Responsive positioning
    const yPosition = this.isMobile() ? height * 0.6 : height * 0.4;
    resourcesContainer.position(width * 0.1, yPosition);
    resourcesContainer.style('width', '80%');

    const resourcesTitle = createElement('h2', this.sections.resources.title);
    resourcesTitle.parent(resourcesContainer);
    resourcesTitle.style('color', '#ffffff');
    resourcesTitle.style('font-size', this.isMobile() ? '1.5em' : '2em'); // Smaller title on mobile

    this.sections.resources.links.forEach(link => {
      const linkContainer = createDiv('');
      linkContainer.parent(resourcesContainer);
      linkContainer.style('margin-bottom', this.isMobile() ? '15px' : '20px');

      const a = createA(link.url, link.title);
      a.parent(linkContainer);
      a.style('color', this.styles.link.color);
      a.style('text-decoration', 'none');
      a.style('font-size', this.isMobile() ? '14px' : '16px'); // Responsive link size
      a.style('padding', this.isMobile() ? '2px 0' : '5px 0'); // Tighter padding on mobile
      a.mouseOver(() => a.style('color', this.styles.link.hoverColor));
      a.mouseOut(() => a.style('color', this.styles.link.color));

      const description = createP(link.description);
      description.parent(linkContainer);
      description.style('color', '#ffffff');
      description.style('margin-top', '5px');
      description.style('font-size', this.isMobile() ? '12px' : '14px'); // Smaller description text
      description.style('line-height', this.isMobile() ? '1.4' : '1.6');
    });
  }

   // Add star initialization method
   initializeStars() {
    for (let i = 0; i < VISUAL_SETTINGS.STAR_COUNT; i++) {
      this.stars.push(new Star());
    }
  }

  // Add star background drawing method
  drawStarryBackground() {
    this.stars.forEach(star => {
      star.update();
      star.display();
    });
  }

  draw() {
    background(0,255);
    this.drawStarryBackground();
  }

  mousePressed() {
  }

  windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Update positions of elements
    this.createAboutSection();
    this.createResourcesSection();
  }
}