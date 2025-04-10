import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/header/logo";
import UserInfo from "@/components/header/userInfo";
import { MembershipModal } from "@/components/membership/MembershipModal";

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/editor"
              className="text-sm font-medium hover:text-primary hover:underline underline-offset-4"
            >
              首页
            </Link>
            <Link
              href="/desktop"
              className="text-sm font-medium hover:text-primary hover:underline underline-offset-4"
            >
              创做中心
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium hover:text-primary hover:underline underline-offset-4"
            >
              管理后台
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <UserInfo />
          </div>
        </div>
      </header>

      {/* <MembershipModal /> */}

      {/* Hero区域 */}
      <section className="py-12 md:py-24 lg:py-32 xl:py-36">
        <div className="container">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                GenLabs 生成实验室
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                强大的AI生成工具集，让创意无限可能
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/editor"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                开始使用
              </Link>
              <Link
                href="#features"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 功能展示 */}
      <section id="features" className="py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                强大功能，无限可能
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                探索GenLabs提供的丰富AI生成功能
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {/* 文本转语音功能卡片 */}
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <img src="/assets/toolbar/voice.svg" alt="语音图标" className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">文本转语音</h3>
              <p className="text-muted-foreground text-center">
                支持多种语音风格和语速调整，让您的文本变成自然流畅的语音内容
              </p>
            </div>
            {/* 文本生成图片功能卡片 */}
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">文本生成图片</h3>
              <p className="text-muted-foreground text-center">
                通过文本描述生成高质量图片，满足您的创意和设计需求
              </p>
            </div>
            {/* 高级编辑器功能卡片 */}
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">高级编辑器</h3>
              <p className="text-muted-foreground text-center">
                基于Lexical的专业编辑器，支持拼音标注、语速调整和多种语音风格
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 语音风格展示 */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                丰富的语音风格
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                支持多种语音风格，满足不同场景需求
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-8">
            {[
              "撒娇",
              "愤怒",
              "助理",
              "平静",
              "聊天",
              "愉悦",
              "客户服务",
              "友好",
              "温柔",
              "新闻",
              "诗歌朗诵",
              "悲伤"
            ].map((style, index) => (
              <div
                key={index}
                className="flex items-center justify-center rounded-lg border p-4 shadow-sm hover:bg-accent transition-colors"
              >
                <span>{style}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 应用场景 */}
      <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                广泛的应用场景
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                满足各行各业的AI生成需求
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-8">
            {[
              "影视解说",
              "政企宣传",
              "教育培训",
              "广告促销",
              "产品介绍",
              "有声读物",
              "手机彩铃",
              "游戏动漫",
              "新闻资讯",
              "自媒体",
              "情感电台",
              "搞笑娱乐"
            ].map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-center rounded-lg border p-4 shadow-sm hover:bg-accent transition-colors"
              >
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 快速开始 */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                快速开始
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                只需简单几步，即可体验GenLabs强大功能
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3 mt-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">注册账号</h3>
              <p className="text-muted-foreground">创建您的GenLabs账号，开启AI生成之旅</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">选择功能</h3>
              <p className="text-muted-foreground">根据您的需求选择相应的AI生成功能</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">开始创作</h3>
              <p className="text-muted-foreground">使用我们的编辑器，开始您的AI创作</p>
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <Link
              href="/editor"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              立即体验
            </Link>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} GenLabs 生成实验室. 保留所有权利.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              隐私政策
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              使用条款
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              联系我们
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
