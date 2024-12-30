import * as tf from '@tensorflow/tfjs';

export const analyzeSkinColor = async (videoFrame, facePosition, formula) => {
  // Extract face region coordinates
  const startX = Math.max(0, Math.floor(facePosition.topLeft[0]));
  const startY = Math.max(0, Math.floor(facePosition.topLeft[1]));
  const width = Math.floor(facePosition.bottomRight[0] - facePosition.topLeft[0]);
  const height = Math.floor(facePosition.bottomRight[1] - facePosition.topLeft[1]);

  // Define sample points (relative to face bounds)
  const samplePoints = [
    { x: 0.3, y: 0.4 },  // Left cheek
    { x: 0.7, y: 0.4 },  // Right cheek
    { x: 0.5, y: 0.2 },  // Forehead
  ];

  // Extract face region tensor
  const faceRegion = tf.tidy(() => {
    const region = videoFrame.slice([startY, startX, 0], [height, width, 3]);
    
    // Sample specific points instead of averaging whole region
    const samples = samplePoints.map(point => {
      const y = Math.floor(height * point.y);
      const x = Math.floor(width * point.x);
      return region.slice([y, x, 0], [1, 1, 3]);
    });
    
    // Average the sample points
    return tf.stack(samples).mean(0);
  });

  // Get RGB values
  const rgbValues = await faceRegion.data();

  // Calculate brightness before returning
  const brightness = (rgbValues[0] + rgbValues[1] + rgbValues[2]) / 3;
  console.log('RGB Values:', {
    r: rgbValues[0],
    g: rgbValues[1],
    b: rgbValues[2]
  });
  console.log('Calculated Brightness:', brightness);

  // Cleanup
  faceRegion.dispose();
  videoFrame.dispose();

  return {
    r: rgbValues[0],
    g: rgbValues[1],
    b: rgbValues[2]
  };
};

export const determineSkinToneCategory = (brightness, origin = 'asian') => {
  console.log('Analyzing skin tone for origin:', origin);
  console.log('Input brightness:', brightness);
  
  const formulas = {
    asian: {
      light: { min: 140, max: 255 },
      medium: { min: 100, max: 139 },
      dark: { min: 0, max: 99 }
    },
    caucasian: {
      light: { min: 160, max: 255 },  // Caucasian skin tends to have higher brightness values
      medium: { min: 120, max: 159 },
      dark: { min: 0, max: 119 }
    }
  };

  const ranges = formulas[origin];
  let category;

  if (brightness >= ranges.light.min) {
    category = 'light';
  } else if (brightness >= ranges.medium.min) {
    category = 'medium';
  } else {
    category = 'dark';
  }

  console.log('Determined skin tone category:', category);
  return category;
};