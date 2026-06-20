#!/bin/bash
# Vercel 部署验证脚本
# 使用方式: ./scripts/check-deploy.sh [deploy_id]

source /workspace/projects/.vercel-config

# 获取最新部署 ID
LATEST_DEPLOY_ID=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=$VERCEL_PROJECT_ID&limit=1" | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['deployments'][0]['uid'])")

DEPLOY_ID="${1:-$LATEST_DEPLOY_ID}"

echo "=== 检查部署状态 ==="
echo "Deploy ID: $DEPLOY_ID"

# 获取部署详情
DEPLOY_INFO=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v13/deployments/$DEPLOY_ID?teamId=$VERCEL_TEAM_ID")

STATE=$(echo "$DEPLOY_INFO" | python3 -c "import sys,json; print(json.load(sys.stdin).get('readyState', 'UNKNOWN'))")

echo "状态: $STATE"

if [ "$STATE" = "READY" ]; then
  echo "✅ 部署成功!"
elif [ "$STATE" = "ERROR" ]; then
  echo "❌ 部署失败!"
  echo "=== 获取构建日志 ==="
  curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v2/deployments/$DEPLOY_ID/events?teamId=$VERCEL_TEAM_ID" | \
    python3 -c "import sys,json; data=json.load(sys.stdin); [print(e.get('text', '')) for e in data.get('events', []) if e.get('type') == 'stderr' or 'error' in str(e.get('text', '').lower())]"
elif [ "$STATE" = "BUILDING" ] || [ "$STATE" = "QUEUED" ]; then
  echo "⏳ 正在构建中，请稍后再检查..."
else
  echo "⚠️ 未知状态: $STATE"
fi