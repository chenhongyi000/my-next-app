import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { signToken, setTokenCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 验证输入（password 应为 64 字符的 SHA-256 hex）
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "请输入用户名和密码" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ username });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // 验证密码：客户端传来的 SHA-256 哈希值 与 数据库中 bcrypt(SHA-256) 比对
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // 登录成功，签发 JWT 并写入 cookie
    const payload = {
      userId: user._id.toString(),
      username: user.username,
    };
    const token = await signToken(payload);
    await setTokenCookie(token);

    return NextResponse.json({
      success: true,
      message: "登录成功",
      user: payload,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 }
    );
  }
}
