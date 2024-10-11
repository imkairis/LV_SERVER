const ProductType = require('../models/ProductType');
const Product = require('../models/Product');
const {deleteFile} = require('../utils/deleteFile');
const { getAllDocuments } = require('../utils/querryDocument');


exports.getAll = async (req, res) => {
  const query = { 
    name: req.query.search ? { $regex: req.query.search, $options: 'i' } : null
  };

  const defaultField = 'name';
  getAllDocuments(ProductType, query, defaultField, req, res);
};

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id
    
    const object = await ProductType.findById(id)

    res.status(200).json({
      data: object
    })
  }
  catch(err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.createOne = async (req, res) => {
  try {
    const { name, description } = req.body;

    const object = new ProductType({
      name,
      description
    })

    if (req.files?.['image']?.[0]) {
      object.image = req.files['image'][0].filename;
    }

    await object.save()
    res.status(201).json({
      data: object
    })

  }
  catch(err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.updateOne = async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = req.params.id;
  
    const object = await ProductType.findById(id);
  
    if (!object) {
      return res.status(404).json({ error: 'Not found' });
    }

    object.name = name || object.name;
    object.description = description || object.description;

    if (req.files?.['image']?.[0]) {
      if (object.image) {
        deleteFile(object.image, res);
      }
      object.image = req.files['type'][0].filename;
    }

    await object.save();

    res.status(200).json({ data: object });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    const object = await ProductType.findByIdAndDelete(id)
    
    if(object.image) {
      deleteFile(object.image, res)
    }

    res.status(204).send()
  }
  catch(err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.getProductByType = async (req, res) => {
  const id = res.params.id;

  try {
    const type = await ProductType.findById(id)
  
    const query = { 
      type: type.id,
      name: req.query.search ? { $regex: req.query.search, $options: 'i' } : null,
    };

    const defaultField = 'name';
    getAllDocuments(Product, query, defaultField, req, res);
  }
  catch(err) {
    console.error(err.message)
    res.status(500).json({
      error: err.message
    })
  }  
}