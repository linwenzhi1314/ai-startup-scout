/**
 * 支付系统类型定义
 * 所有支付适配器必须遵循这些接口
 */

// 支付方案类型
export type PaymentProvider = 'stripe' | 'creem' | 'lemonsqueezy' | 'paddle' | 'paypal';

// 订阅计划
export type PlanId = 'pro_monthly' | 'investor_monthly' | 'enterprise';

// 订阅计划配置
export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number; // 月付价格（美元）
  currency: string;
  description?: string;
}

// Checkout Session 创建请求
export interface CreateCheckoutRequest {
  planId: PlanId;
  userId: string;
  locale?: string;
  successUrl?: string;
  cancelUrl?: string;
}

// Checkout Session 创建响应
export interface CreateCheckoutResponse {
  success: boolean;
  sessionId?: string;
  url?: string; // 支付页面 URL
  provider: PaymentProvider;
  error?: string;
}

// Webhook 事件类型
export interface WebhookEvent {
  type: string;
  provider: PaymentProvider;
  data: unknown;
  timestamp: number;
}

// Webhook 处理结果
export interface WebhookResult {
  success: boolean;
  event?: WebhookEvent;
  error?: string;
}

// 订阅状态
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

// 用户订阅信息
export interface UserSubscription {
  id: string;
  userId: string;
  planId: PlanId;
  provider: PaymentProvider;
  status: SubscriptionStatus;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

// 支付适配器接口（所有适配器必须实现）
export interface PaymentAdapter {
  // 适配器名称
  name: PaymentProvider;
  
  // 显示名称
  displayName: string;
  
  // 是否需要公司实体
  requiresCompany: boolean;
  
  // 是否自动处理税务
  handlesTax: boolean;
  
  // 费率描述
  feeDescription: string;
  
  // 检查是否已配置（环境变量等）
  isConfigured(): boolean;
  
  // 创建 Checkout Session
  createCheckoutSession(request: CreateCheckoutRequest): Promise<CreateCheckoutResponse>;
  
  // 处理 Webhook
  handleWebhook(
    body: string,
    headers: Record<string, string | null>
  ): Promise<WebhookResult>;
  
  // 获取用户订阅信息（可选）
  getSubscription?(subscriptionId: string): Promise<UserSubscription | null>;
  
  // 取消订阅（可选）
  cancelSubscription?(subscriptionId: string): Promise<boolean>;
}

// 支付配置（存储在数据库或环境变量）
export interface PaymentConfig {
  activeProvider: PaymentProvider;
  enabledProviders: PaymentProvider[];
  fallbackProvider?: PaymentProvider;
}

// 支付方案元数据（用于后台显示）
export interface ProviderMetadata {
  name: PaymentProvider;
  displayName: string;
  requiresCompany: boolean;
  handlesTax: boolean;
  feeDescription: string;
  website: string;
  configured: boolean;
  enabled: boolean;
  features: string[];
}