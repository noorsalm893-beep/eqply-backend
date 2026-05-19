'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function') r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return (c > 3 && r && Object.defineProperty(target, key, r), r);
};
var __metadata = (this && this.__metadata) || function (k, v) {
  if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.PaymentProofSchema = exports.PaymentProof = void 0;
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');

let PaymentProof = class PaymentProof {};
__decorate([
  (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
  __metadata('design:type', Object),
], PaymentProof.prototype, 'userId', void 0);
__decorate([
  (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Order', default: null }),
  __metadata('design:type', Object),
], PaymentProof.prototype, 'orderId', void 0);
// Screenshot stored as Base64 string directly in MongoDB
__decorate([
  (0, mongoose_1.Prop)({ required: true }),
  __metadata('design:type', String),
], PaymentProof.prototype, 'imageBase64', void 0);
// pending | approved | rejected
__decorate([
  (0, mongoose_1.Prop)({ default: 'pending' }),
  __metadata('design:type', String),
], PaymentProof.prototype, 'status', void 0);
__decorate([
  (0, mongoose_1.Prop)({ default: '' }),
  __metadata('design:type', String),
], PaymentProof.prototype, 'note', void 0);

exports.PaymentProof = PaymentProof = __decorate([
  (0, mongoose_1.Schema)({ timestamps: true }),
], PaymentProof);
exports.PaymentProofSchema = mongoose_1.SchemaFactory.createForClass(PaymentProof);
//# sourceMappingURL=payment-proof.schema.js.map