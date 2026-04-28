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
Object.defineProperty(exports, '__esModule', { value: true });
exports.SignupDto = void 0;
const class_transformer_1 = require('class-transformer');
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');

class SignupDto {
  name;
  email;
  password;
  role;
  phone;
  profilePhoto;
  location; // ✅ FIX 1 — added location field
}
exports.SignupDto = SignupDto;

__decorate(
  [
    (0, swagger_1.ApiProperty)({ example: 'Jane Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata('design:type', String),
  ],
  SignupDto.prototype,
  'name',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ example: 'jane@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata('design:type', String),
  ],
  SignupDto.prototype,
  'email',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ minLength: 8, example: 'P@ssw0rd!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata('design:type', String),
  ],
  SignupDto.prototype,
  'password',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      enum: ['student', 'freelancer', 'vendor'],
      example: 'student',
    }),
    (0, class_validator_1.IsEnum)(['student', 'freelancer', 'vendor']),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) =>
      typeof value === 'string' ? value.toLowerCase() : value,
    ),
    __metadata('design:type', String),
  ],
  SignupDto.prototype,
  'role',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      maxLength: 40,
      example: '+201234567890',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata('design:type', String),
  ],
  SignupDto.prototype,
  'phone',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      maxLength: 500,
      example: 'https://cdn.example.com/avatar.png',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata('design:type', String),
  ],
  SignupDto.prototype,
  'profilePhoto',
  void 0,
);
// ✅ FIX 1 — location decorator added
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      maxLength: 200,
      example: 'Cairo, Egypt',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata('design:type', String),
  ],
  SignupDto.prototype,
  'location',
  void 0,
);
//# sourceMappingURL=signup.dto.js.map