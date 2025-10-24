export class Config {
  private static instance: Config;
  private _config: any = {};

  private constructor() { }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  load() {
    this._config = {
      port: parseInt(process.env.PORT!) || 3000,
      mongoUser: process.env.MONGO_USER || 'mongo',
      mongoPassword: process.env.MONGO_PASS || 'mongo',
      mongoDB: process.env.MONGO_DB || 'mongo',
      jwtSecret: process.env.JWT_SECRET || 'secret',
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
      isDevelopment: process.env.NODE_ENV || 'development'
    };
    this._config.mongoUri = process.env.MONGO_URI || `mongodb://${this._config.mongoUser}:${this._config.mongoPassword}@mongodb:27017/${this._config.mongoDB}`

    this._config.stripeApiKey = process.env.STRIPE_API_KEY || ''

    this._config.stripeCheckoutSuccessUrl =
      process.env.STRIPE_CHECKOUT_SUCCESS_URL || 'http://localhost:3000/checkout/success'

    this._config.stripeCheckoutCancelUrl =
      process.env.STRIPE_CHECKOUT_CANCEL_URL || 'http://localhost:3000/checkout/cancel'

    this._config.stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ||
      'http://localhost:3000/stripe-webhook'

    return this;
  }

  get isDevelopment() { return this._config.isDevelopment }
  get jwtExpiresIn() { return this._config.jwtExpiresIn }
  get port() { return this._config.port }
  get mongoUri() { return this._config.mongoUri }
  get jwtSecret() { return this._config.jwtSecret }
  get mongoDB() { return this._config.mongoDB }
  get mongoUser() { return this._config.mongoUser }
  get mongoPassword() { return this._config.mongoPassword }
  get stripeApiKey() { return this._config.stripeApiKey }
  get stripeCheckoutSuccessUrl() { return this._config.stripeCheckoutSuccessUrl }
  get stripeCheckoutCancelUrl() { return this._config.stripeCheckoutCancelUrl }
  get stripeWebhookSecret() { return this._config.stripeWebhookSecret }

  get(key: string) {
    return this._config[key];
  }

  getAll() {
    return { ...this._config };
  }
}

export const config = Config.getInstance();
