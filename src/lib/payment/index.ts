/**
 * 支付系统统一入口
 * 导出所有支付相关类型、适配器和工厂函数
 */

// 类型定义
export * from './types';

// 工厂函数（主要使用这些）
export {
  getActiveProvider,
  getActiveAdapter,
  getAdapter,
  getAllAdapters,
  getPaymentConfig,
  getProvidersMetadata,
  isProviderAvailable,
  getRecommendedProvider,
} from './factory';

// 各适配器（直接使用时需要）
export { stripeAdapter, StripeAdapter } from './stripe';
export { creemAdapter, CreemAdapter } from './creem';
export { lemonSqueezyAdapter, LemonSqueezyAdapter } from './lemonsqueezy';
export { paddleAdapter, PaddleAdapter } from './paddle';
export { paypalAdapter, PayPalAdapter } from './paypal';