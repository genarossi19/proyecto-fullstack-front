import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import Navbar from "../components/Navbar";
interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <nav>
          <Navbar />
        </nav>
        {children}
      </main>
    </div>
  );
}
