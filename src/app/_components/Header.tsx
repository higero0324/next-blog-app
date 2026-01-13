"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandSparkles } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur">
      <div className="mx-4 flex max-w-5xl flex-wrap items-center justify-between gap-4 py-4 md:mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-200 text-pink-700 shadow-sm">
            <FontAwesomeIcon icon={faWandSparkles} />
          </span>
          <div>
            <div className="font-display text-2xl">Fuwa Note</div>
            <div className="text-xs text-slate-500">ときめきUIと日々のメモ</div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            ホーム
          </Link>
          <Link href="/about" className="hover:text-slate-900">
            プロフィール
          </Link>
          <Link
            href="/admin"
            className="rounded-full bg-slate-900 px-4 py-2 text-white shadow-sm hover:bg-slate-700"
          >
            管理ページ
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
