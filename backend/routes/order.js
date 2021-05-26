const express = require('express')
const router = express.Router();

const { 
    newOrder,
    myOrder,
    getSingleOrder,
    allOrder, 
    updateOrder,
    deleteOrder
} =require('../controllers/orderController')

const { isAuthenticatedUser,authorizeRoles}= require('../middlewares/auth')

router.route('/order/new').post(isAuthenticatedUser,newOrder);

router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser,myOrder);

router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles('admin'),allOrder);
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
                                .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder);



module.exports = router;
