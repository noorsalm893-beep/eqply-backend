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
exports.UpdatePreferencesDto = exports.LanguageOption = void 0;
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');

var LanguageOption;
(function (LanguageOption) {
  LanguageOption['EN'] = 'en';
  LanguageOption['AR'] = 'ar';
  LanguageOption['FR'] = 'fr';
})(LanguageOption || (exports.LanguageOption = LanguageOption = {}));

class UpdatePreferencesDto {}
exports.UpdatePreferencesDto = UpdatePreferencesDto;
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Enable or disable notifications',
      example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata('design:type', Boolean),
  ],
  UpdatePreferencesDto.prototype, 'notifications', void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Preferred language',
      enum: LanguageOption,
      example: LanguageOption.EN,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LanguageOption, {
      message: 'language must be one of: en, ar, fr',
    }),
    __metadata('design:type', String),
  ],
  UpdatePreferencesDto.prototype, 'language', void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Enable or disable dark mode',
      example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata('design:type', Boolean),
  ],
  UpdatePreferencesDto.prototype, 'darkMode', void 0,
);