const express = require('express');
const {
    getStatistics,
    //   getProductStatistics,
    //   getTypeStatistics,
} = require('../controllers/staticController');

const router = express.Router();

router.get('/', getStatistics);

// router.get('/products', async (req, res) => {
//   try {
//     const productStatistics = await getProductStatistics();
//     res.status(200).json(productStatistics);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/types', async (req, res) => {
//   try {
//     const typeStatistics = await getTypeStatistics();
//     res.status(200).json(typeStatistics);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });




module.exports = router;