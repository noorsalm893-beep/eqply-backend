'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrdersService = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
const order_schema_1 = require('./order.schema');
const cart_service_1 = require('../cart/cart.service');

let OrdersService = class OrdersService {
  orderModel;
  cartService;
  constructor(orderModel, cartService) {
    this.orderModel = orderModel;
    this.cartService = cartService;
  }
  getModelOrThrow() {
    if (!this.orderModel) {
      throw new common_1.ServiceUnavailableException(
        'Database is currently disabled or unavailable',
      );
    }
    return this.orderModel;
  }
  async create(createOrderData) {
    const model = this.getModelOrThrow();
    const order = new model(createOrderData);
    return order.save();
  }
  async findById(id) {
    return this.getModelOrThrow()
      .findById(id)
      .populate('items.productId')
      .exec();
  }
  // ✅ UPGRADED — returns only logged-in user orders, populates product details,
  //               and maps items to { product, quantity } response shape
  async findByUserId(userId) {
    const orders = await this.getModelOrThrow()
      .find({ userId })
      .populate('items.productId', '_id name buyPrice picture')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return orders.map((order) => ({
      _id: order._id,
      status: order.status,
      total: order.totalAmount,
      createdAt: order.createdAt,
      items: (order.items || []).map((item) => ({
        product: item.productId,   // populated product document
        quantity: item.quantity,
      })),
    }));
  }
  async findByUserIdAndStatus(userId, status) {
    const orders = await this.getModelOrThrow()
      .find({ userId, status })
      .populate('items.productId', '_id name buyPrice picture')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return orders.map((order) => ({
      _id: order._id,
      status: order.status,
      total: order.totalAmount,
      createdAt: order.createdAt,
      items: (order.items || []).map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
    }));
  }
  async createOrderFromCart(userId) {
    const cart = await this.cartService.findByUserId(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new common_1.BadRequestException('Cart is empty');
    }
    let totalAmount = 0;
    const orderItems = [];
    for (const item of cart.items) {
      const price = item.price || 0;
      totalAmount += price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price,
      });
    }
    const orderData = {
      userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
    };
    const order = await this.create(orderData);
    await this.cartService.clearCart(userId);
    return order;
  }
  async updateOrderStatus(id, status) {
    return this.getModelOrThrow()
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('items.productId')
      .exec();
  }
  async getOrderCountsByStatus(userId) {
    const objectId = new mongoose_2.Types.ObjectId(userId);
    return this.getModelOrThrow()
      .aggregate([
        { $match: { userId: objectId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ])
      .exec();
  }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name), (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)(cart_service_1.CartService)),
    __metadata('design:paramtypes', [mongoose_2.Model, cart_service_1.CartService]),
  ],
  OrdersService,
);
//# sourceMappingURL=orders.service.js.map