const express = require('express');
const router = express.Router();

//Controllers
const roleController = require('../controllers/role.controller');

router.get('/getAll', roleController.getRoles);

router.get('/duplicateRoles', roleController.getDuplicateRoles);

router.post('/create', roleController.create);

router.put('/save', roleController.save);

router.put('/addPermission/:id', roleController.addPermission);

router.put('/addPermissionToAllRoles', roleController.addPermissionToAllRoles);

router.put('/removePermissionToAllRoles', roleController.removePermissionToAllRoles);

router.put('/removePermission/:id', roleController.removePermission);

router.put('/removeAllPermissions/:id', roleController.removeAllPermissions);

router.delete('/remove/:id', roleController.remove);

module.exports = router;