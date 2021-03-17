const Inventario = require('../models/inventario.model');

// Create and Save a new item
exports.create = (req, res) => {
    // Validate request
    if(!req.body.nombre || !req.body.tipo_medicamento || !req.body.cantidad || !req.body.precio || !req.body.ubicacion) {
        return res.status(400).send({
            message: "Para insertar producto en inventario tiene que tener todos los valores asignados [nombre, tipo_medicamento, cantidad, precio, ubicación]"
        });
    }
    
    // Create a new item
    const item = new Inventario({
        nombre: req.body.nombre,
        tipo_medicamento: req.body.tipo_medicamento,
        cantidad: req.body.cantidad,
        precio: req.body.precio,
        ubicacion: req.body.ubicacion,
    });

    // Save item in the database
    item.save()
    .then(data => {
        var socketio = req.app.get('socketio');
        socketio.emit('Alert New Item', {message: '¡Se inserto un nuevo item en la base de datos!', item: data});
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Un error ocurrio al insertar un item al inventario."
        });
    });
};

// Retrieve and return all items from the database.
exports.findAll = (req, res) => {
    Inventario.find()
    .then(item => {
        res.send(item);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Un error ocurrio al consultar todo el inventario."
        });
    });
};

// Find a single item with a itemId
exports.findOne = (req, res) => {
    Inventario.findById(req.params.itemId)
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item no encontrado con id:" + req.params.itemId
            });            
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item no encontrado con id:" + req.params.itemId
            });                
        }
        return res.status(500).send({
            message: "Error al solicitar Item con id:" + req.params.itemId
        });
    });
};

// Update a item identified by the itemId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.params.itemId || !req.body.nombre || !req.body.tipo_medicamento || !req.body.cantidad || !req.body.precio || !req.body.ubicacion) {
        return res.status(400).send({
            message: "Para actualizar un item en inventario tiene que tener todos los valores asignados [nombre, tipo_medicamento, cantidad, precio, ubicación] y seleccionar un ID de Item"
        });
    }

    // Find item and update it with the request body
    Inventario.findByIdAndUpdate(req.params.itemId, {
        nombre: req.body.nombre,
        tipo_medicamento: req.body.tipo_medicamento,
        cantidad: req.body.cantidad,
        precio: req.body.precio,
        ubicacion: req.body.ubicacion,
    }, {new: true})
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item no encontrado con id: " + req.params.itemId
            });
        }
        res.send(item);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Item no encontrado con id: " + req.params.itemId
            });                
        }
        return res.status(500).send({
            message: "Error actualizando item con id: " + req.params.itemId
        });
    });
};

// Delete a item with the specified itemId in the request
exports.delete = (req, res) => {
    Inventario.findByIdAndRemove(req.params.itemId)
    .then(item => {
        if(!item) {
            return res.status(404).send({
                message: "Item no encontrado con id: " + req.params.itemId
            });
        }
        var socketio = req.app.get('socketio');
        socketio.emit('Alert Item Deleted', {message: '¡Se elimino un item en la base de datos!', item});
        res.send({message: "item deleted successfully!", item});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Item no encontrado con id: " + req.params.itemId
            });                
        }
        return res.status(500).send({
            message: "Error borrando item con id: " + req.params.itemId
        });
    });
};

exports.test = (req, res) => {
    var socketio = req.app.get('socketio');
    socketio.emit('alert_test', {message: 'Test Alert!'});
    res.send({
        alert_status: "ok"
    });
};