const Payment = require('../models/Payment')
const { getAllDocuments } = require('../utils/querryDocument');


exports.getAll = async (req, res) => {
  const query = { 
    name: req.query.search ? { $regex: req.query.search, $options: 'i' } : null
  };

  const defaultField = 'name';
  getAllDocuments(Payment, query, defaultField, req, res);
}

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id
    
    const object = await Payment.findById(id)

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

    const object = new Payment({
      name,
      description
    })

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
  
    const object = await Payment.findById(id);
  
    if (!object) {
      return res.status(404).json({ error: 'Not found' });
    }

    object.name = name || object.name;
    object.description = description || object.description;

    await object.save();

    res.status(200).json({ data: object });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

exports.deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    await Payment.findByIdAndDelete(id)

    res.status(204).send()
  }
  catch(err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}