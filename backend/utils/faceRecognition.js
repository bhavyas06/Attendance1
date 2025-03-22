const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');
const { Canvas, Image } = canvas;

// Monkey patch face-api to use the canvas module
faceapi.env.monkeyPatch({ Canvas, Image });

// Load face-api models
const loadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('models');
};

// Initialize models
loadModels().catch(error => {
    console.error('Error loading face-api models:', error);
});

/**
 * Generates face embedding from an image
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Float32Array|null>} Face embedding or null if no face detected
 */
const getFaceEmbedding = async (imagePath) => {
    try {
        // Load the image
        const img = await canvas.loadImage(imagePath);
        
        // Detect face and get descriptor
        const detections = await faceapi.detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detections) {
            console.log('No face detected in the image');
            return null;
        }

        // Return face descriptor (embedding)
        return detections.descriptor;

    } catch (error) {
        console.error('Error generating face embedding:', error);
        throw error;
    }
};

module.exports = { getFaceEmbedding };
