/**
 * 支付工厂
 * 根据配置选择正确的支付适配器
 */

import { PaymentAdapter, PaymentProvider, PaymentConfig, ProviderMetadata } from './types';
import { stripeAdapter } from './stripe';
import { creemAdapter } from './creem';
import { lemonSqueezyAdapter } from './lemonsqueezy';
import { paddleAdapter } from './paddle';
import { paypalAdapter } from './paypal';

// 所有适配器实例
const adapters: Record<PaymentProvider, PaymentAdapter> = {
  stripe: stripeAdapter,
  creem: creemAdapter,
  lemonsqueezy: lemonSqueezyAdapter,
  paddle: paddleAdapter,
  paypal: paypalAdapter,
};

// 适配器特性描述
const providerFeatures: Record<PaymentProvider, string[]> = {
  stripe: ['订阅支持', '全球支付', '需要公司实体', '自行处理税务', '成熟的文档'],
  creem: ['订阅支持', '全球支付', '个人可用', '自动税务处理', '费率低', 'SaaS 专属'],
  lemonsqueezy: ['订阅支持', '全球支付', '个人可用', '自动税务处理', '数字产品专属', '成熟文档'],
  paddle: ['订阅支持', '全球支付', '需要审核', '自动税务处理', '成熟平台', '用户信任度高'],
  paypal: ['订阅支持', '全球支付', '个人可用', '自行处理税务', '用户基数大', '支付快速'],
};

const providerWebsites: Record<PaymentProvider, string> = {
  stripe: 'https://stripe.com',
  creem: 'https://creem.io',
  lemonsqueezy: 'https://lemonsqueezy.com',
  paddle: 'https://paddle.com',
  paypal: 'https://developer.paypal.com',
};

/**
 * 获取当前激活的支付方案
 * 优先级：环境变量 > 默认值
 */
export function getActiveProvider(): PaymentProvider {
  const envProvider = process.env.PAYMENT_PROVIDER as PaymentProvider;
  
  if (envProvider && adapters[envProvider]) {
    return envProvider;
  }

  // 默认方案：优先使用已配置的方案
  const configuredProviders: PaymentProvider[] = [];
  
  for (const [name, adapter] of Object.entries(adapters)) {
    if (adapter.isConfigured()) {
      configuredProviders.push(name as PaymentProvider);
    }
  }

  // 优先级顺序：creem > lemonsqueezy > paddle > stripe > paypal
  const priorityOrder: PaymentProvider[] = ['creem', 'lemonsqueezy', 'paddle', 'stripe', 'paypal'];
  
  for (const provider of priorityOrder) {
    if (configuredProviders.includes(provider)) {
      return provider;
    }
  }

  // 如果没有任何配置，返回 creem（推荐方案）
  return 'creem';
}

/**
 * 获取当前激活的适配器
 */
export function getActiveAdapter(): PaymentAdapter {
  const provider = getActiveProvider();
  return adapters[provider];
}

/**
 * 获取指定适配器
 */
export function getAdapter(provider: PaymentProvider): PaymentAdapter {
  return adapters[provider];
}

/**
 * 获取所有适配器
 */
export function getAllAdapters(): Record<PaymentProvider, PaymentAdapter> {
  return adapters;
}

/**
 * 获取支付配置信息
 */
export function getPaymentConfig(): PaymentConfig {
  const activeProvider = getActiveProvider();
  
  const enabledProviders: PaymentProvider[] = [];
  for (const [name, adapter] of Object.entries(adapters)) {
    if (adapter.isConfigured()) {
      enabledProviders.push(name as PaymentProvider);
    }
  }

  // 设置备用方案
  const fallbackProvider = enabledProviders.find(p => p !== activeProvider);

  return {
    activeProvider,
    enabledProviders,
    fallbackProvider,
  };
}

/**
 * 获取所有支付方案元数据（用于后台管理界面）
 */
export function getProvidersMetadata(): ProviderMetadata[] {
  const config = getPaymentConfig();
  
  return Object.entries(adapters).map(([name, adapter]) => ({
    name: name as PaymentProvider,
    displayName: adapter.displayName,
    requiresCompany: adapter.requiresCompany,
    handlesTax: adapter.handlesTax,
    feeDescription: adapter.feeDescription,
    website: providerWebsites[name as PaymentProvider],
    configured: adapter.isConfigured(),
    enabled: config.enabledProviders.includes(name as PaymentProvider),
    features: providerFeatures[name as PaymentProvider],
  }));
}

/**
 * 检查指定方案是否可用
 */
export function isProviderAvailable(provider: PaymentProvider): boolean {
  return adapters[provider]?.isConfigured() ?? false;
}

/**
 * 获取推荐的支付方案（用于引导用户配置）
 */
export function getRecommendedProvider(): PaymentProvider {
  // 推荐 Creem 或 LemonSqueezy（个人可用，自动税务）
  if (creemAdapter.isConfigured()) return 'creem';
  if (lemonSqueezyAdapter.isConfigured()) return 'lemonsqueezy';
  if (paddleAdapter.isConfigured()) return 'paddle';
  if (stripeAdapter.isConfigured()) return 'stripe';
  if (paypalAdapter.isConfigured()) return 'paypal';
  
  // 默认推荐 Creem
  return 'creem';
}

// 导出类型和适配器
export { adapters };
export * from './types';