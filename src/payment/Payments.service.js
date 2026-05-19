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
var __param = (this && this.__param) || function (paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.PaymentsService = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
const payment_proof_schema_1 = require('./payment-proof.schema');

let PaymentsService = class PaymentsService {
  constructor(paymentProofModel) {
    this.paymentProofModel = paymentProofModel;
  }

  // POST /payments/upload-proof
  // Buyer uploads screenshot — stored as Base64 in MongoDB
  async uploadProof(userId, dto) {
    const proof = new this.paymentProofModel({
      userId,
      imageBase64: dto.imageBase64,
      orderId: dto.orderId || null,
      note: dto.note || '',
      status: 'pending',
    });
    return proof.save();
  }

  // GET /payments/my-proofs — buyer sees their own submissions (no image data in list)
  async getProofsByUser(userId) {
    return this.paymentProofModel
      .find({ userId })
      .select('-imageBase64')
      .sort({ createdAt: -1 })
      .exec();
  }

  // GET /payments/:id — vendor/admin views one proof WITH the screenshot
  async getProofById(proofId) {
    const proof = await this.paymentProofModel
      .findById(proofId)
      .populate('userId', 'name email')
      .exec();
    if (!proof) throw new common_1.NotFoundException('Payment proof not found');
    return proof;
  }

  // GET /payments/all — vendor/admin sees all (list, no heavy image data)
  async getAllProofs() {
    return this.paymentProofModel
      .find()
      .select('-imageBase64')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  // PATCH /payments/:id/status — approve or reject
  async updateStatus(proofId, status) {
    const proof = await this.paymentProofModel.findByIdAndUpdate(
      proofId,
      { status },
      { new: true },
    );
    if (!proof) throw new common_1.NotFoundException('Payment proof not found');
    return proof;
  }
};
exports.PaymentsService = PaymentsService = __decorate([
  (0, common_1.Injectable)(),
  __param(0, (0, mongoose_1.InjectModel)(payment_proof_schema_1.PaymentProof.name)),
  __metadata('design:paramtypes', [mongoose_2.Model]),
], PaymentsService);
//# sourceMappingURL=payments.service.js.map