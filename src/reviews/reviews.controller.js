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
exports.ReviewsController = void 0;
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const reviews_service_1 = require('./reviews.service');
const jwt_auth_guard_1 = require('../common/guards/jwt-auth.guard');
const current_user_decorator_1 = require('../common/decorators/current-user.decorator');
const create_review_dto_1 = require('./dto/create-review.dto');
let ReviewsController = class ReviewsController {
  reviewsService;
  constructor(reviewsService) {
    this.reviewsService = reviewsService;
  }
  createReview(user, createReviewDto) {
    if (!user) {
      throw new common_1.UnauthorizedException('User not found or unauthorized');
    }
    return this.reviewsService.create({
      ...createReviewDto,
      userId: user._id,
    });
  }
  getRecentReviews() {
    return this.reviewsService.findRecent();
  }
  getUserRecent(user) {
    if (!user) {
      throw new common_1.UnauthorizedException('User not found or unauthorized');
    }
    return this.reviewsService.findRecent();
  }
};
__decorate(
  [
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      Object,
      create_review_dto_1.CreateReviewDto,
    ]),
    __metadata('design:returntype', void 0),
  ],
  ReviewsController.prototype,
  'createReview',
  null,
);
__decorate(
  [
    (0, common_1.Get)('recent'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata('design:type', Function),
    __metadata('design:returntype', void 0),
  ],
  ReviewsController.prototype,
  'getRecentReviews',
  null,
);
__decorate(
  [
    (0, common_1.Get)('user-reviews'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ReviewsController.prototype,
  'getUserRecent',
  null,
);
exports.ReviewsController = ReviewsController = __decorate(
  [
    (0, common_1.Controller)('reviews'),
    (0, swagger_1.ApiTags)('reviews'),
  ],
  ReviewsController,
);
//# sourceMappingURL=reviews.controller.js.map