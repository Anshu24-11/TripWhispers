const { cloudinary } = require('./cloudinary');
const path = require('path');
const fs = require('fs');

const uploadImages = async () => {
  const imageDir = './seed_images'; // directory where the images are saved
  const files = fs.readdirSync(imageDir);

  const uploadResults = [];

  for (const file of files) {
    const filePath = path.join(imageDir, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'AirbnbClone'
      });

      uploadResults.push({
        url: result.secure_url,
        filename: result.public_id
      });

      console.log(`✅ Uploaded: ${file}`);
    } catch (err) {
      console.error(`❌ Error uploading ${file}:`, err.message);
    }
  }

  console.log('\n🌐 Uploaded Image Data:\n');
  console.log(JSON.stringify(uploadResults, null, 2));
};

uploadImages();
