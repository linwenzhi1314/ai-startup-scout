/**
 * @file robots.txt 生成器
 * @description 配置搜索引擎爬虫的抓取规则。
 *              允许抓取页面内容，禁止抓取 API 路由和 Next.js 内部路径。
 */

// 导入 Next.js 元数据路由类型
import { MetadataRoute } from 'next';

/**
 * 生成 robots.txt 配置
 * - allow: 允许爬虫抓取所有页面
 * - disallow: 禁止抓取 API 路由、Next.js 内部资源、静态文件
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',                             // 适用于所有爬虫
      allow: '/',                                 // 允许抓取根路径及子路径
      disallow: ['/api/', '/_next/', '/static/'], // 禁止抓取的路径
    },
  };
}
