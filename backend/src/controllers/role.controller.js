const Role = require('../model/role');


function getRoles(req, res) {
    Role.find({}, (err, result) => {
        if (err) {
            res.status(500).json(err)
        }
        else {
            res.status(200).json(result);
        }
    });
}

function getDuplicateRoles(req, res) {

    Role.aggregate([
            {
                $group: {
                    _id: {permissions: "$permissions"},
                    uniqueIds: {$addToSet: "$name"},
                    count: {$sum: 1}
                },
            },
            {
                $match: {
                    count: {"$gt": 1},
                    "_id.permissions.0": {"$exists": true}
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ],
        function (err, result) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).json(result)
            }
        })
}

function create(req, res) {
    const newRole = Role(req.body);
    newRole.save(function (err, result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    })
}

function save(req, res) {
    const roles = req.body;

    roles.forEach(role => {
        if (role._id) {
            Role.findOneAndUpdate({_id: role._id},
                {
                    $set: {
                        name: role.name,
                        permissions: role.permissions
                    }
                },
                function (err, result) {
                    if (err || result.ok === 0) {
                        res.status(500).json(err)
                    } else if (result.nModified === 0) {
                        res.status(400).json(err)
                    } else if (result.n === 0) {
                        res.status(400).json(err)
                    } else {

                    }

                });
        }
        else {
            const newRole = Role(role);
            newRole.save().catch(err => res.status(400).json(err))
        }
    });

    res.status(200).json({
        task: "Successfully "
    })
}

function addPermissionToAllRoles(req, res) {
    const {perm} = req.body;

    Role.find({permissions: {$nin: perm}},
        function (err, result) {
            result.forEach(rol => {
                rol.permissions.push(perm);
                rol.save(function (err) {
                    if (err) {
                        res.status(400).json({
                            task: "Error to save " + rol.name,
                            error: err
                        })
                    }
                });
            });

            res.status(200).json({
                task: "Successfully completed"
            })
        })


}

function removePermissionToAllRoles(req, res) {
    const {perm} = req.body;
    console.log(perm)
    Role.find({permissions: {$in: perm}},
        function (err, result) {
            for (let i = 0; result.length > i; i++) {
                result[i].permissions.pull(perm);
                result[i].save(function (err) {
                    if (err) {
                        res.status(400).json({
                            task: "Error to save " + result[i].name,
                            error: err
                        })
                    }
                });
            }

            res.status(200).json({
                task: "Successfully completed"
            })
        })
}

function addPermission(req, res) {
    const {perm} = req.body;
    const id = req.params.id;

    Role.update({_id: id},
        {$push: {'permissions': perm}},
        function (err, result) {
            if (err || result.ok === 0) {
                res.status(500).json(err)
            } else if (result.nModified === 0) {
                res.status(400).json(err)
            } else if (result.n === 0) {
                res.status(400).json(err)
            } else {
                res.status(200).json(result)
            }

        });
}

function removePermission(req, res) {
    const {perm} = req.body;
    const id = req.params.id;
    Role.update({_id: id},
        {$pull: {'permissions': perm}},
        function (err, result) {
            if (err || result.ok === 0) {
                res.status(500).json(err)
            } else if (result.nModified === 0) {
                res.status(400).json(err)
            } else if (result.n === 0) {
                res.status(400).json(err)
            } else {
                res.status(200).json(result)
            }

        })
}

function removeAllPermissions(req, res) {
    const id = req.params.id;
    Role.update({_id: id},
        {$set: {'permissions': []}},
        function (err, result) {
            if (err || result.ok === 0) {
                res.status(500).json(err)
            } else if (result.nModified === 0) {
                res.status(400).json(err)
            } else if (result.n === 0) {
                res.status(400).json(err)
            } else {
                res.status(200).json(result)
            }

        })
}

function remove(req, res) {
    const id = req.params.id;
    Role.findByIdAndRemove({_id: id}, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        else {
            res.status(200).json(result)
        }
    })
}


module.exports = {
    getRoles,
    getDuplicateRoles,
    create,
    addPermission,
    removePermission,
    removeAllPermissions,
    remove,
    save,
    addPermissionToAllRoles,
    removePermissionToAllRoles
};