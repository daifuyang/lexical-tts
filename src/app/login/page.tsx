"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from 'react';
import { login } from "./actions";
import BrandIntro from "./components/BrandIntro";
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from "./components/Icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import "./login.css";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, loginAction, pending] = useActionState(login, undefined );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-background" style={{ backgroundImage: `url('/assets/login-bg-white.svg')` }}>
        <div className="login-wrapper">
          {/* 左侧品牌介绍 */}
          <div className="login-brand-section">
            <BrandIntro />
          </div>
          
          {/* 右侧登录表单 */}
          <div className="login-form-section">
            <div className="login-card">
              <div className="login-logo">
                <h1 className="login-title">{process.env.NEXT_PUBLIC_TITLE || "语音合成平台"}</h1>
              </div>
              
              {!state?.success && state?.message && (
                <Alert variant="destructive" className="mb-4">
                  <div className="flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertDescription>
                      {state.message}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <form className="login-form" action={loginAction}>
                <div className="input-group">
                  <label htmlFor="account">账号</label>
                  <div className="input-with-icon">
                    <span className="input-icon">
                      <UserIcon />
                    </span>
                    <input
                      id="account"
                      name="account"
                      type="text"
                      placeholder="请输入您的账号"
                      className="login-input"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="label-row">
                    <label htmlFor="password">密码</label>
                    <a href="#" className="login-link forgot-password">忘记密码？</a>
                  </div>
                  <div className="input-with-icon">
                    <span className="input-icon">
                      <LockIcon />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入您的密码"
                      autoComplete="current-password"
                      className="login-input"
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle" 
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="remember-me">
                  <input type="checkbox" id="remember" name="remember" />
                  <label htmlFor="remember">记住我</label>
                </div>

                <button type="submit" disabled={pending} className="login-button">
                  登录
                </button>
              </form>

              <div className="login-footer">
                <p>
                  还没有账号？
                  <a href="#" className="login-link">立即注册享受10次免费体验</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
