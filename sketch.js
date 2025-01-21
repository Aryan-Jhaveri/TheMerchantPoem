let fft;
let song;
let res = 100   ;//
let baseAmp = 150;
let time = 0;
let PI;

// Oscillation parameters
const oscillation = {
    baseFreq: 0.02,
    amplitude: 30,
    phaseShift: PI / 4
};

function setup() {
    createCanvas(1080, 1080);
    colorMode(HSB, 100);
    noFill();
    fft = new p5.FFT(0.8, 1024);
    song = loadSound('./public/Life of Pi.mp3',
        () => {
            console.log('Audio loaded');
            song.connect(fft);
        },
        (error) => console.error('Error loading audio:', error)
    );
}

function getFrequencyRangeEnergy(spectrum, lowFreq, highFreq) {
    let lowIndex = Math.floor(map(lowFreq, 0, 22050, 0, spectrum.length));
    let highIndex = Math.floor(map(highFreq, 0, 22050, 0, spectrum.length));
    let total = 0;
    
    for (let i = lowIndex; i <= highIndex; i++) {
        total += spectrum[i];
    }
    return total / (highIndex - lowIndex + 1);
}

function getPolarDistortion(angle, energy, bandConfig) {
    // Create multiple oscillating waves
    let wave1 = sin(angle * 3 + frameCount * 0.02) * oscillation.amplitude;
    let wave2 = cos(angle * 5 + frameCount * 0.015) * oscillation.amplitude;
    let wave3 = sin(angle * 2 + time * 2) * oscillation.amplitude;
    
    // Combine waves and make them energy-responsive
    return (wave1 + wave2 + wave3) * map(energy, 0, 255, 0.1, 1.0);
}

// Now we can define bands after the functions it uses
const bands = {
    lowBass: {
        iter: 12,
        offset: 0,
        noiseScale: 0.01,
        baseStrokeWidth: 2,
        color: [0, 0, 100],
        radiusOffset: 10,
        freqRange: [70, 100],
        energyScale: 1.4,
        polarScale: 1.2
    },
    midBass: {
        iter: 10,
        offset: 0,
        noiseScale: 0.008,
        baseStrokeWidth: 1.8,
        color: [0, 0, 90],
        radiusOffset: 180,
        freqRange: [160, 200],
        energyScale: 1.2,
        polarScale: 1.0
    },
    lowMid: {
        iter: 8,
        offset: 0,
        noiseScale: 0.006,
        baseStrokeWidth: 2,
        color: [0, 0, 80],
        radiusOffset: 360,
        freqRange: [300, 360],
        energyScale: 1.0,
        polarScale: 0.8
    },
    midMid: {
        iter: 8,
        offset: 0,
        noiseScale: 0.005,
        baseStrokeWidth: 3,
        color: [0, 0, 70],
        radiusOffset: 500,
        freqRange: [360, 2500],
        energyScale: 0.8,
        polarScale: 0.6
    },
    highMid: {
        iter: 6,
        offset: 0,
        noiseScale: 0.001,
        baseStrokeWidth: 1.5,
        color: [0, 0, 60],
        radiusOffset: 600,
        freqRange: [2500, 2800],
        energyScale: 0.6,
        polarScale: 0.4
    }
};

function drawFrequencyBand(bandConfig, energy, name) {
    for (let j = 0; j < bandConfig.iter; j++) {
        beginShape();
        
        let dynamicStrokeWeight = map(energy, 0, 255, 
            bandConfig.baseStrokeWidth, 
            bandConfig.baseStrokeWidth * 2
        );
        strokeWeight(dynamicStrokeWeight);
        
        let opacity = map(energy, 0, 255, 3, 9);
        stroke(
            bandConfig.color[0],
            bandConfig.color[1],
            bandConfig.color[2],
            opacity
        );
        
        for (let i = 0; i < res; i++) {
            let angle = i * TWO_PI / res;
            
            // Get noise distortion
            let n = map(noise(
                bandConfig.offset + sin(angle) * bandConfig.noiseScale * j,
                bandConfig.offset + cos(angle) * bandConfig.noiseScale * j,
                time
            ), 0, 1, 0.9, 1.1);
            
            // Get polar distortion
            let polarDist = getPolarDistortion(angle, energy, bandConfig) * bandConfig.polarScale;
            
            // Combine all effects
            let energyResponse = map(energy, 0, 255, 0.8, bandConfig.energyScale);
            let baseRadius = baseAmp * n * energyResponse;
            let finalRadius = baseRadius + bandConfig.radiusOffset + polarDist;
            
            // Add frameCount-based rotation
            let rotationOffset = frameCount * 0.001 * (j + 1);
            let x = sin(angle + rotationOffset) * finalRadius;
            let y = cos(angle + rotationOffset) * finalRadius;
            
            vertex(x, y);
        }
        endShape(CLOSE);
    }
}

function draw() {
    background(0, 0, 10);
    translate(width / 2, height / 2);
    
    let spectrum = fft.analyze();
    time += 0.0003;
    let timeOffset = time * 0.05;
    
    Object.keys(bands).forEach((bandName, index) => {
        bands[bandName].offset = sin(timeOffset + index * 0.5) * 50;
        
        let energy = getFrequencyRangeEnergy(
            spectrum,
            bands[bandName].freqRange[0],
            bands[bandName].freqRange[1]
        );
        
        drawFrequencyBand(bands[bandName], energy, bandName);
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === ' ') {
        if (song.isPlaying()) {
            song.pause();
        } else {
            song.play();
        }
    }
}