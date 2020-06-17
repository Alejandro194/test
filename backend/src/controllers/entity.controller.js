const Entity = require('../model/entity');

function getEntities(req, res) {
    Entity.find({},  'name permissions', (err, result) => {
        if (err) {
            res.status(500).json(err)
        }
        else {
            res.status(200).json(result);
        }
    });
}

function create(req, res) {
    const newEntity = Entity(req.body);
    newEntity.save(function (err , result) {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(result)
        }
    })
}

function addPermission(req, res) {
    const {perm} = req.body;
    const id = req.params.id;

    Entity.update({_id: id},
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

function remove(req, res) {
    const id = req.params.id;
    Entity.findByIdAndRemove({_id: id}, function (err, result) {
        if (err) {
            res.status(500).json(err)
        }
        else {
            res.status(200).json(result)
        }
    })
}

module.exports = {
    getEntities,
    create,
    addPermission,
    remove,
};