import * as tf from '@tensorflow/tfjs';

export const analyzeSkinColor = async (videoFrame, face) => {
  // Extract face region coordinates
  const startX = Math.max(0, Math.floor(face.topLeft[0]));
  const startY = Math.max(0, Math.floor(face.topLeft[1]));
  const width = Math.floor(face.bottomRight[0] - face.topLeft[0]);
  const height = Math.floor(face.bottomRight[1] - face.topLeft[1]);

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

  // Cleanup
  faceRegion.dispose();
  videoFrame.dispose();

  return {
    r: rgbValues[0],
    g: rgbValues[1],
    b: rgbValues[2]
  };
};

export const determineSkinToneCategory = (skinTone) => {
  const brightness = 0.299 * skinTone.r + 0.587 * skinTone.g + 0.114 * skinTone.b;
  const warmth = skinTone.r / ((skinTone.g + skinTone.b) / 2);
  
  console.log('=== Skin Tone Analysis ===');
  console.log('RGB Values:', {
    red: Math.round(skinTone.r),
    green: Math.round(skinTone.g),
    blue: Math.round(skinTone.b)
  });
  console.log('Brightness:', Math.round(brightness));
  console.log('Warmth ratio:', warmth.toFixed(2));
  
  let category;
  if (brightness >= 140) {
    category = "light";
  } else if (brightness >= 100) {
    category = "medium";
  } else {
    category = "dark";
  }
  
  console.log('Determined category:', category);
  console.log('=====================');
  
  return category;
};