/**
 * @file 健康检查 API 路由
 * @description 提供轻量级健康检查接口，供 Chrome 扩展的 Service Worker 定时 ping，
 *              防止沙箱环境因长时间空闲而休眠。
 * @endpoint GET /api/health
 * @response { status: "ok", timestamp: number }
 */

/**
 * GET 处理函数：返回服务健康状态
 * - status: 固定返回 "ok"，表示服务正常运行
 * - timestamp: 当前时间戳（毫秒），用于验证服务响应的实时性
 */
export async function GET() {
  return Response.json({
    status: 'ok',             // 服务状态标识
    timestamp: Date.now(),    // 当前时间戳（毫秒）
  });
}
