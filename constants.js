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

// Centralized menu configuration
const MENU_CONFIG = {
  BUTTON: {
    WIDTH_PERCENTAGE: {
      MOBILE: 0.25,    // 25% of screen width on mobile
      TABLET: 0.15,    // 15% of screen width on tablet
      DESKTOP: 0.05    // 5% of screen width on desktop
    },
    MAX_WIDTH: {
      MOBILE: 150,     // Max width in pixels for mobile
      TABLET: 175,     // Max width in pixels for tablet
      DESKTOP: 200     // Max width in pixels for desktop
    },
    FONT_SIZE: {
      MOBILE: 16,      // Font size in pixels for mobile
      TABLET: 18,      // Font size in pixels for tablet
      DESKTOP: 20      // Font size in pixels for desktop
    },
    PADDING: {
      MOBILE: '4px 8px',
      TABLET: '5px 10px',
      DESKTOP: '6px 12px'
    },
    GAP: {
      MOBILE: '5px',
      TABLET: '10px',
      DESKTOP: '15px'
    }
  },
  POSITION: {
    TOP_OFFSET_PERCENTAGE: 0.03,
    LEFT_OFFSET_PERCENTAGE: 0.02
  }
};

// Base button style that won't change with screen size
const BUTTON_STYLE = {
  'font-family': 'Jacquard12-Regular',
  'background': 'rgba(0, 0, 0, 0.5)',
  'color': 'white',
  'border': 'none',
  'cursor': 'pointer',
  'border-radius': '5px',
  'text-align': 'center',
  'transition': 'all 0.3s ease'
};