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
exports.PaymentsController = void 0;
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const jwt_auth_guard_1 = require('../common/guards/jwt-auth.guard');
const current_user_decorator_1 = require('../common/decorators/current-user.decorator');
const payments_service_1 = require('./payments.service');
const upload_proof_dto_1 = require('./dto/upload-proof.dto');

let PaymentsController = class PaymentsController {
  constructor(paymentsService) {
    this.paymentsService = paymentsService;
  }

  // POST /payments/upload-proof
  // Body: { imageBase64: "data:image/png;base64,...", orderId?: "...", note?: "..." }
  uploadProof(user, dto) {
    if (!user) throw new common_1.UnauthorizedException();
    return this.paymentsService.uploadProof(user._id, dto);
  }

  // GET /payments/my-proofs
  getMyProofs(user) {
    if (!user) throw new common_1.UnauthorizedException();
    return this.paymentsService.getProofsByUser(user._id);
  }

  // GET /payments/all  (vendor / admin)
  getAllProofs() {
    return this.paymentsService.getAllProofs();
  }

  // GET /payments/:id  — shows the actual screenshot image
  getProofById(id) {
    return this.paymentsService.getProofById(id);
  }

  // PATCH /payments/:id/status
  // Body: { status: "approved" }  or  { status: "rejected" }
  updateStatus(id, status) {
    return this.paymentsService.updateStatus(id, status);
  }
};
__decorate([
  (0, common_1.Post)('upload-proof'),
  (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
  (0, swagger_1.ApiBearerAuth)(),
  (0, swagger_1.ApiOperation)({ summary: 'Upload payment proof screenshot as Base64' }),
  __param(0, (0, current_user_decorator_1.CurrentUser)()),
  __param(1, (0, common_1.Body)()),
  (0, common_1.HttpCode)(common_1.HttpStatus.OK),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', [Object, upload_proof_dto_1.UploadProofDto]),
  __metadata('design:returntype', Promise),
], PaymentsController.prototype, 'uploadProof', null);
__decorate([
  (0, common_1.Get)('my-proofs'),
  (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
  (0, swagger_1.ApiBearerAuth)(),
  __param(0, (0, current_user_decorator_1.CurrentUser)()),
  (0, common_1.HttpCode)(common_1.HttpStatus.OK),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', [Object]),
  __metadata('design:returntype', Promise),
], PaymentsController.prototype, 'getMyProofs', null);
__decorate([
  (0, common_1.Get)('all'),
  (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
  (0, swagger_1.ApiBearerAuth)(),
  (0, common_1.HttpCode)(common_1.HttpStatus.OK),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', []),
  __metadata('design:returntype', Promise),
], PaymentsController.prototype, 'getAllProofs', null);
__decorate([
  (0, common_1.Get)(':id'),
  (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
  (0, swagger_1.ApiBearerAuth)(),
  __param(0, (0, common_1.Param)('id')),
  (0, common_1.HttpCode)(common_1.HttpStatus.OK),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', [String]),
  __metadata('design:returntype', Promise),
], PaymentsController.prototype, 'getProofById', null);
__decorate([
  (0, common_1.Patch)(':id/status'),
  (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
  (0, swagger_1.ApiBearerAuth)(),
  __param(0, (0, common_1.Param)('id')),
  __param(1, (0, common_1.Body)('status')),
  (0, common_1.HttpCode)(common_1.HttpStatus.OK),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', [String, String]),
  __metadata('design:returntype', Promise),
], PaymentsController.prototype, 'updateStatus', null);
exports.PaymentsController = PaymentsController = __decorate([
  (0, common_1.Controller)('payments'),
  (0, swagger_1.ApiTags)('payments'),
  __metadata('design:paramtypes', [payments_service_1.PaymentsService]),
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map