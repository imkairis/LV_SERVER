const Config = require('../models/Config')
 
exports.createOrUpdate = async (req, res) => {
  const configData = req.body;

  if (req.files) {
    if (req.files.logo) {
      configData.logo = req.files.logo[0].filename; 
    }
    if (req.files.poster) {
      configData.poster = req.files.poster[0].filename; 
    }
    if (req.files.images) {
      const uploadedImages = req.files.images.map(file => file.filename);
      if (uploadedImages.length > 0) {
        configData.images = uploadedImages;
      }
    }
  }

  try {
    let config = await Config.findOne();

    if (config) {
      if (config.images && configData.images) {
        configData.images = [...config.images, ...configData.images];
      }

      config = await Config.findOneAndUpdate({}, configData, { new: true });
      res.status(200).json({
        data: config
      });
    } else {
      const newConfig = new Config(configData);
      await newConfig.save();
      res.status(201).json({
        data: newConfig
      });
    }
  } catch (error) {
    console.error('error', error.message);
    res.status(500).json({
      error: error.message
    });
  }
};

exports.deleteImage = async (req, res) => {
  const { field, image } = req.params; 

  try {
    let config = await Config.findOne();
    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', image);
    if (field === 'logo' && config.logo === image) {
      config.logo = null;
    } else if (field === 'poster' && config.poster === image) {
      config.poster = null;
    } else if (field === 'images') {
      if (!config.images.includes(image)) {
        return res.status(404).json({ error: 'Image not found in images array' });
      }
      config.images = config.images.filter(img => img !== image);
    } else {
      return res.status(400).json({ error: 'Invalid field' });
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to delete image file' });
      }
    });
    await config.save();

    res.json({ msg: 'Image deleted successfully', data: config });
  } catch (err) {
    console.error('Error deleting image:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};