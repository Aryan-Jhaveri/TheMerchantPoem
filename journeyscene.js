class JourneyScene {
  constructor() {
    // Scene setup
  }

  preload() {
    // Add any asset preloading here
  }

  setup() {
    createCanvas(windowWidth, windowHeight);
  }

  draw() {
    background(0);
    // Draw scene elements
    fill(255);
    textAlign(CENTER, CENTER);
    text("Journey Scene - Coming Soon", width/2, height/2);
  }

  mousePressed() {
    // Handle mouse interactions
  }

  windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
} 