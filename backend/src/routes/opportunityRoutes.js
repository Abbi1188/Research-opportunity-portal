const express = require('express');
const controller = require('../controllers/opportunityController');
const { validateCreate, validateUpdate, validateId } = require('../middleware/validateOpportunity');

const router = express.Router();

router.post('/', validateCreate, controller.createOpportunity);           // 1. Create
router.get('/', controller.getAllOpportunities);                          // 2. Get all
router.get('/:id', validateId, controller.getOpportunity);                // 3. Get one
router.put('/:id', validateId, validateUpdate, controller.updateOpportunity); // 4. Update
router.delete('/:id', validateId, controller.deleteOpportunity);          // 5. Delete

module.exports = router;
