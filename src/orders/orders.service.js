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
    return this.getModelOrThrow().findById(id).populate('items.productId').exec();
  }
  async findByUserId(userId) {
    return this.getModelOrThrow().find({ userId }).populate('items.productId').sort({ createdAt: -1 }).exec();
  }
  async findByUserIdAndStatus(userId, status) {
    return this.getModelOrThrow().find({ userId, status }).populate('items.productId').sort({ createdAt: -1 }).exec();
  }
  async createOrderFromCart(userId) {
    // Get user's cart
    const cart = await this.cartService.findByUserId(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new common_1.BadRequestException('Cart is empty');
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      // In a real implementation, you would fetch product details to get current price
      // For now, we'll assume price is stored in the cart item or we'll use a placeholder
      const price = item.price || 0; // This would need to be implemented properly
      totalAmount += price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: price
      });
    }

    // Create order
    const orderData = {
      userId,
      items: orderItems,
      totalAmount,
      status: 'pending'
    };

    const order = await this.create(orderData);

    // Clear cart after creating order
    await this.cartService.clearCart(userId);

    return order;
  }
  async updateOrderStatus(id, status) {
    return this.getModelOrThrow().findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('items.productId').exec();
  }

  async getOrderCountsByStatus(userId) {
    const pipeline = [
      { $match: { userId: this.getModelOrThrow().Schema.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ];
    return this.getModelOrThrow().aggregate(pipeline).exec();
  }
};
exports.OrdersService = OrdersService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name), (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)()),
    __metadata('design:paramtypes', [mongoose_2.Model, cart_service_1.CartService]),
  ],
  OrdersService,
);
//# sourceMappingURL=orders.service.js.map