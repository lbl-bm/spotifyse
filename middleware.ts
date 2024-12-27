import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // 创建一个响应对象
  const res = NextResponse.next();
  // 创建 Supabase 中间件客户端
  const supabase = createMiddlewareClient({ req, res });
  // 获取用户会话
  await supabase.auth.getSession();
  // 返回响应
  return res;
}
