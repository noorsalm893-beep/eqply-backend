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
const paymentproof_schema_1 = require('./paymentproof.schema');

let PaymentsService = class PaymentsService {
  paymentProofModel;
  constructor(paymentProofModel) {
    this.paymentProofModel = paymentProofModel;
  }

  async uploadProof(userId, dto) {
    // Run DTO validation
    const errors = dto.validate ? dto.validate() : [];
    if (errors.length > 0) {
      throw new common_1.BadRequestException(errors);
    }

    if (!dto.imageBase64) {
      throw new common_1.BadRequestException('imageBase64 is required');
    }

    try {
      const proof = new this.paymentProofModel({
        userId,
        // Core
        orderId:        dto.orderId        ?? null,
        imageBase64:    dto.imageBase64,
        note:           dto.note           ?? '',
        status:         'pending',
        // Address
        streetAddress:  dto.streetAddress  ?? null,
        apartmentNumber:dto.apartmentNumber?? null,
        city:           dto.city           ?? null,
        postalCode:     dto.postalCode      ?? null,
        country:        dto.country        ?? null,
        // Payment details
        paymentMethod:  dto.paymentMethod  ?? null,
        transactionId:  dto.transactionId  ?? null,
        amountPaid:     dto.amountPaid     ?? null,
        currency:       dto.currency       ?? 'USD',
        paymentDate:    dto.paymentDate    ?? null,
      });

      return await proof.save();
    } catch (err) {
      console.error('[PaymentsService] uploadProof error:', err);
      throw new common_1.InternalServerErrorException('Failed to save payment proof');
    }
  }

  async getByUser(userId) {
    try {
      return await this.paymentProofModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .exec();
    } catch (err) {
      console.error('[PaymentsService] getByUser error:', err);
      throw new common_1.InternalServerErrorException('Failed to fetch payment proofs');
    }
  }
};

exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
  (0, common_1.Injectable)(),
  __param(0, (0, mongoose_1.InjectModel)(paymentproof_schema_1.PaymentProof.name)),
  __metadata('design:paramtypes', [mongoose_2.Model]),
], PaymentsService);
//# sourceMappingURL=Payments.service.js.map