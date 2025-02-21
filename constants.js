// Constants for visual elements
const VISUAL_SETTINGS = {
  // Star field configuration
  STAR_COUNT: 240,
  STAR_SIZE: {
    MIN: 0.5,
    MAX: 2
  },
  STAR_OPACITY: {
    MIN: 50,
    MAX: 200
  },
  
  // Wave animation properties
  WAVE: {
    Y_OFFSET_START: 0.09,
    STEP: 3,
    NOISE_SCALE: 0.0001,
    Y_INCREMENT: 0.004
  },
  
  // Canvas layout defaults
  CANVAS: {
    BUTTON_WIDTH_PERCENT: 0.3,
    BUTTON_HEIGHT_PERCENT: 0.1,
    MAX_BUTTON_WIDTH: 200,
    MAX_BUTTON_HEIGHT: 60
  }
};

// Add breakpoints
const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024
};

// Typography settings
const TYPOGRAPHY = {
  TITLE: {
    FONT: 'Jacquard12',
    SIZE: {
      MOBILE: 55,    // Smaller size for mobile
      TABLET: 55,    // Medium size for tablet
      DESKTOP: 64    // Original size for desktop
    },
    LEADING: 1.2,
    COLOR: '#FFFFFF'
  },
  BUTTON: {
    FONT: 'Jacquard12',
    SIZE: 24,
    LEADING: 1.1,
    COLOR: '#FFFFFF'
  },
  POETRY: {
    FONT: 'Jacquard12',
    SIZE: 32,
    LEADING: 1.4,
    COLOR: '#FFFFFF'
  }
}; 