import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { headers } from "next/headers";

interface LayoutProps {
  children: React.ReactNode;
  params: any;
}

export default async function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="flex-1 h-0 flex">
        <Sidebar />
        <main className="flex-1 overflow-auto p-3">
          <div className="rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
