'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@nestjs/core');
const app_module_1 = require('./app.module');
const common_1 = require('@nestjs/common');
const crypto_1 = require('crypto');
const all_exceptions_filter_1 = require('./common/filters/all-exceptions.filter');
const swagger_1 = require('@nestjs/swagger');
function renderDashboardHtml(port) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Eqply Backend Dashboard</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --card: #ffffff;
      --text: #1b1f2a;
      --muted: #637086;
      --primary: #0d6efd;
      --border: #e7ebf3;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: radial-gradient(circle at top right, #e6efff, var(--bg) 50%);
      color: var(--text);
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
    }
    .card {
      width: 100%;
      max-width: 720px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 20px 40px rgba(23, 42, 79, 0.08);
    }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p { margin: 0 0 18px; color: var(--muted); }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-top: 14px;
    }
    a {
      display: block;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px;
      text-decoration: none;
      color: var(--text);
      transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
      background: #fff;
    }
    a:hover {
      transform: translateY(-2px);
      border-color: #c9dafd;
      box-shadow: 0 10px 24px rgba(13, 110, 253, 0.12);
    }
    .k { font-weight: 600; margin-bottom: 6px; color: var(--primary); }
    code {
      display: inline-block;
      margin-top: 12px;
      padding: 6px 10px;
      background: #f0f5ff;
      border: 1px solid #dce8ff;
      border-radius: 8px;
      color: #1a3f8a;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1>Eqply Backend Dashboard</h1>
    <p>Service is running. Use the links below to explore API docs and health endpoints.</p>
    <div class="grid">
      <a href="/api/docs">
        <div class="k">Swagger UI</div>
        <div>Interactive API documentation</div>
      </a>
      <a href="/api/docs-json">
        <div class="k">OpenAPI JSON</div>
        <div>Machine-readable API spec</div>
      </a>
      <a href="/health">
        <div class="k">Health Check</div>
        <div>Runtime readiness/status payload</div>
      </a>
      <a href="/api">
        <div class="k">API Base</div>
        <div>Global API prefix routes</div>
      </a>
    </div>
    <code>http://localhost:${port}</code>
  </main>
</body>
</html>`;
}
async function bootstrap() {
  const app = await core_1.NestFactory.create(app_module_1.AppModule);
  const apiPrefix = 'api';
  const swaggerPath = 'docs';
  const swaggerJsonPath = 'docs-json';
  const httpAdapter = app.getHttpAdapter().getInstance();
  app.use((req, res, next) => {
    const headerId = req.headers['x-request-id'];
    const requestId =
      typeof headerId === 'string' && headerId.trim()
        ? headerId
        : (0, crypto_1.randomUUID)();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  });
  app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
  app.useGlobalPipes(
    new common_1.ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix(apiPrefix);
  const swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Eqply API')
    .setDescription('Eqply backend API documentation and endpoints')
    .setVersion('1.1.0')
    .addTag('auth', 'Authentication and account endpoints')
    .addTag('users', 'User profile and user details endpoints')
    .addBearerAuth()
    .build();
  const swaggerDocument = swagger_1.SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  swagger_1.SwaggerModule.setup(swaggerPath, app, swaggerDocument, {
    useGlobalPrefix: true,
    jsonDocumentUrl: swaggerJsonPath,
  });
  const port = process.env.PORT || 3000;
  httpAdapter.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'eqply-backend',
      swagger: `/${apiPrefix}/${swaggerPath}`,
      docsJson: `/${apiPrefix}/${swaggerJsonPath}`,
      timestamp: new Date().toISOString(),
    });
  });
  httpAdapter.get(['/', '/dashboard'], (_req, res) => {
    res.type('html').send(renderDashboardHtml(port));
  });
  await app.listen(port);
  console.log(`🚀 Eqply backend running on port ${port}`);
  console.log(
    `📘 Swagger UI: http://localhost:${port}/${apiPrefix}/${swaggerPath}`,
  );
  console.log(
    `🧾 OpenAPI JSON: http://localhost:${port}/${apiPrefix}/${swaggerJsonPath}`,
  );
  console.log(`🖥️ Dashboard: http://localhost:${port}/dashboard`);
}
bootstrap();
//# sourceMappingURL=main.js.map
