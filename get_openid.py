import requests

# 替换成你自己的信息
APP_ID = "cli_a97acb7154ba9bd2"
APP_SECRET = "3Cf6cEjwEtjgiyjshNd8IhrAe21ztfKK"
YOUR_PHONE = "13313882589"

# 1. 获取应用的访问令牌
token_url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
token_resp = requests.post(token_url, json={
    "app_id": APP_ID,
    "app_secret": APP_SECRET
})
token_data = token_resp.json()
tenant_token = token_data["tenant_access_token"]

# 2. 通过手机号获取你的open_id
user_url = f"https://open.feishu.cn/open-apis/contact/v3/users/find_by_phone?phone={YOUR_PHONE}"
user_resp = requests.get(user_url, headers={
    "Authorization": f"Bearer {tenant_token}"
})
user_data = user_resp.json()
open_id = user_data["data"]["user"]["open_id"]

print("✅ 你的飞书用户OpenID是：", open_id)