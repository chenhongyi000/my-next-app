import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import SHA256 from "crypto-js/sha256";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { username, password, confirmPassword } = await request.json();

    // 验证输入
    if (!username || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "请填写所有字段" },
        { status: 400 }
      );
    }

    // 验证用户名长度
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { success: false, message: "用户名长度应为 3-20 个字符" },
        { status: 400 }
      );
    }

    // 验证密码长度（SHA-256 哈希后为 64 字符 hex）
    if (password.length !== 64) {
      return NextResponse.json(
        { success: false, message: "密码格式不正确" },
        { status: 400 }
      );
    }

    // 验证两次密码一致
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "两次输入的密码不一致" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // 检查用户名是否已存在
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "该用户名已被注册" },
        { status: 409 }
      );
    }

    // 对客户端传来的 SHA-256 哈希值再用 bcrypt 加密存储
    const hashedPassword = await bcrypt.hash(password, 12);

    // 插入用户
    const result = await db.collection("users").insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "注册成功",
      user: {
        id: result.insertedId.toString(),
        username,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "服务器内部错误" },
      { status: 500 }
    );
  }
}
