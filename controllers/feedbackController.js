const Feedback = require('../models/Feedback');
const { getAllDocuments } = require('../utils/querryDocument');

exports.getAllFeedbacks = async (req, res) => {
  const query = { user: req.user.id };
  const defaultField = 'createdAt';
  getAllDocuments(Feedback, query, defaultField, req, res, ['book']);
};

exports.createFeedback = async (req, res) => {
  try {
    const { book, rating, comment } = req.body;
    const user = req.user.id;

    const feedback = new Feedback({
      book,
      rating,
      comment,
      user,
    });

    await feedback.save();
    res.status(201).json({ data: feedback });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllFeedbacksForAdmin = async (req, res) => {
  const query = {}; 
  const defaultField = 'createdAt';
  getAllDocuments(Feedback, query, defaultField, req, res, ['book', 'user']);
};

exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('book user');
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json({ data: feedback });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    await feedback.remove();
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllFeedbackByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const query = { book: bookId };

    const defaultField = 'createdAt';
    getAllDocuments(Feedback, query, defaultField, req, res, 'user');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};