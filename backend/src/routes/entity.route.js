const express = require('express');
const router = express.Router();

//Controllers
const entityController = require('../controllers/entity.controller');

router.get('/getAll', entityController.getEntities);

router.post('/create', entityController.create);

router.post('/addPermission/:id', entityController.addPermission);

router.delete('/remove/:id', entityController.remove);

module.exports = router;