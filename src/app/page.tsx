/**
 * @file 根路径首页 - 语言检测入口
 * @description 此页面由 middleware 自动重定向到对应语言版本
 *              middleware 在请求到达此页面之前就已经完成重定向
 *              此页面仅作为备用，显示一个简单的加载状态
 */

// 强制动态渲染
export const dynamic = 'force-dynamic';

export default function RootPage() {
  // 不执行任何重定向，让 middleware 处理
  // 此页面理论上不会被访问，因为 middleware 会先拦截并重定向
  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
      <div className="text-slate-400 text-sm">
        正在加载...
      </div>
    </div>
  );
}