const consts = require('../consts')
let express = require('express');
let router = express.Router();
const Order = require('../entities/Order');
const State = require('../entities/State');
const Position = require('../entities/Position');
const Product = require('../entities/Product');

router.get('/', async function (req, res, next) {
    const content = await Order.fetchAll({withRelated: [consts.state]});
    res.send(content);
});

router.get('/:id', async function (req, res, next) {
    try {
        const orderID = req.params.id;
        const order = await Order.where(consts.id, orderID).fetch({withRelated: [consts.state]});

        if (order) {
            res.status(consts.OK_CODE).json(order);
        } else {
            res.status(consts.PAGE_NOT_FOUND).json({message: 'Order not found'});
        }
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message})

    }
});

router.post('/', async function (req, res, next) {
    try {
        const orderData = req.body;

        if (!orderData.userName) {
            res.status(consts.BAD_REQUEST).json({message: 'Name must be specified'});
            return;
        }
        if (!orderData.email) {
            res.status(consts.BAD_REQUEST).json({message: 'Email must be specified'});
            return;
        }
        if (!orderData.phoneNumber) {
            res.status(consts.BAD_REQUEST).json({message: 'Phone number must be specified'});
            return;
        }
        if (/[a-zA-Z]/.test(orderData.phoneNumber)) {
            res.status(consts.BAD_REQUEST).json({message: 'Phone number cannot contain letters'});
            return;
        }
        if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(orderData.email)) {
            res.status(consts.BAD_REQUEST).json({message: 'Incorrect email pattern'});
            return;
        }

        const order = await Order.forge(orderData).save();

        res.status(consts.OK_CODE).json(order);
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message});
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        const orderID = req.params.id;
        const updatedOrderData = req.body;

        if (!updatedOrderData.userName) {
            res.status(consts.BAD_REQUEST).json({message: 'Name must be specified'});
            return;
        }
        if (!updatedOrderData.email) {
            res.status(consts.BAD_REQUEST).json({message: 'Email must be specified'});
            return;
        }
        if (!updatedOrderData.phoneNumber) {
            res.status(consts.BAD_REQUEST).json({message: 'Phone number must be specified'});
            return;
        }
        if (/[a-zA-Z]/.test(updatedOrderData.phoneNumber)) {
            res.status(consts.BAD_REQUEST).json({message: 'Phone number cannot contain letters'});
            return;
        }

        const order = await Order.where(consts.id, orderID).fetch();

        if (order.get(consts.state) === 3 && order.get(consts.state) !== updatedOrderData.state) {
            res.status(consts.BAD_REQUEST).json({message: 'Order is already canceled'});
            return;
        }
        if (order.get(consts.state) === 4 && order.get(consts.state) !== updatedOrderData.state) {
            res.status(consts.BAD_REQUEST).json({message: 'Order is already finished'});
            return;
        }
        if (order.get(consts.state) > updatedOrderData.state) {
            res.status(consts.BAD_REQUEST).json({message: 'Order is already confirmed'});
            return;
        }

        if (order) {
            await order.save(updatedOrderData);
            res.status(consts.OK_CODE).json(await Order.where(consts.id, orderID).fetch());
        } else {
            res.status(consts.PAGE_NOT_FOUND).json({message: 'Order not found'});
        }
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message});
    }
});

router.get('/state/:state', async function (req, res, next) {
    try {
        const orderState = req.params.state;
        const stateID = await State.where(consts.name, orderState).fetch().get(consts.id);
        const orders = await Order.where(consts.state, stateID).fetchAll({withRelated: [consts.state]});

        res.send(orders);
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message});
    }
});

router.get('/positions/:id', async function (req, res, next) {
    try {
        const orderID = req.params.id;
        const order = await Order.where(consts.id, orderID).fetch();
        if (order) {
            const positions = await Position.where(consts.order, orderID).fetchAll({withRelated: [consts.order, consts.product]});

            res.send(positions);
        } else {
            res.status(consts.PAGE_NOT_FOUND).json({message: 'Order not found'});
        }
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message});
    }
});

router.post('/positions', async function (req, res, next) {
    try {
        const positionData = req.body;

        if (/[a-zA-Z]/.test(positionData.quantity)) {
            res.status(consts.BAD_REQUEST).json({message: 'Quantity cannot contain letters'});
            return;
        }
        if (!Number.isInteger(positionData.quantity) || positionData.quantity < 1) {
            res.status(consts.BAD_REQUEST).json({message: 'Quantity must be an integer greater than 0'});
            return;
        }

        const order = await Order.where(consts.id, positionData.order).fetch();
        if (!order) {
            res.status(consts.PAGE_NOT_FOUND).json({message: 'Order not found'});
            return;
        }

        const product = await Product.where(consts.id, positionData.product).fetch();
        if (!product) {
            res.status(consts.PAGE_NOT_FOUND).json({message: 'Product not found'});
            return;
        }

        const position = await Position.forge(positionData).save();

        res.status(consts.OK_CODE).json(position);
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message});
    }
})

router.put('/positions/:id', async function (req, res, next) {
    try {
        const positionID = req.params.id;
        const updatedPositionData = req.body;

        if (updatedPositionData.quantity < 1) {
            return;
        }

        const position = await Position.where(consts.id, positionID).fetch();
        if (position) {
            await position.save(updatedPositionData);

            res.status(consts.OK_CODE).json(await Position.where(consts.id, positionID).fetch());
        } else {
            res.status(consts.PAGE_NOT_FOUND).json({message: 'Position not found'});
        }
    } catch (error) {
        res.status(consts.SERVER_ERROR).json({message: 'Error from the server part', error: error.message});
    }
})

module.exports = router;
