module.exports = (app, authenticateRequest) => {
    const inventario = require('../controllers/inventario.controller');

    // Create a new item
    app.post('/inventario', authenticateRequest, inventario.create);

    // Retrieve all items
    app.get('/inventario', authenticateRequest, inventario.findAll);

    // Retrieve a single item with itemId
    app.get('/inventario/:itemId', authenticateRequest, inventario.findOne);

    // Update a item with itemId
    app.put('/inventario/:itemId', authenticateRequest, inventario.update);

    // Delete a item with itemId
    app.delete('/inventario/:itemId', authenticateRequest, inventario.delete);
    
    app.get('/inventario_test/test', inventario.test);
}