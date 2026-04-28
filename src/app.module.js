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
Object.defineProperty(exports, '__esModule', { value: true });
exports.AppModule = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const config_1 = require('@nestjs/config');
const auth_module_1 = require('./auth/auth.module');
const mail_module_1 = require('./mail/mail.module');
const users_module_1 = require('./users/users.module');
const normalizeBooleanEnv = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'false' || normalized === '0' || normalized === 'no') {
    return false;
  }
  if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
    return true;
  }
  return defaultValue;
};
const databaseEnabled = normalizeBooleanEnv(process.env.MONGODB_ENABLED, true);
const moduleImports = [
  config_1.ConfigModule.forRoot({ isGlobal: true }),
  users_module_1.UsersModule,
  mail_module_1.MailModule,
  auth_module_1.AuthModule,
];
if (databaseEnabled) {
  moduleImports.push(
    mongoose_1.MongooseModule.forRootAsync({
      imports: [config_1.ConfigModule],
      useFactory: async (configService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [config_1.ConfigService],
    }),
  );
} else {
  common_1.Logger.warn(
    'MONGODB_ENABLED=false detected. Database connection is disabled; API routes stay visible in Swagger but DB operations will return 503.',
    'AppModule',
  );
}
let AppModule = class AppModule {};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate(
  [
    (0, common_1.Module)({
      imports: moduleImports,
    }),
  ],
  AppModule,
);
//# sourceMappingURL=app.module.js.map
