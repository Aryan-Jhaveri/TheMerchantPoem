
class JourneyScene {
  constructor() {
    // Add stars array
    this.stars = [];
  }

  preload() {
    // Add any asset preloading here
  }

  setup() {
    createCanvas(windowWidth, windowHeight);
    // Initialize stars
    this.initializeStars();
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
    background(0, 45);
    // Draw starry background
    this.drawStarryBackground();
    
    // Draw scene elements
    fill(255);
    textAlign(CENTER, CENTER);
    text("Journey Scene - Coming Soon", width/2, height/2);
    textFont("Jacquard12");
  }

  mousePressed() {
    // Handle mouse interactions
  }

  windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // Update stars on resize
    this.stars.forEach(star => star.handleResize());
  }
} 