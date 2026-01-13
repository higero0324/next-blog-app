import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-strong)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Admin Studio</div>
            <h1 className="font-display text-3xl text-slate-900">管理スタジオ</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm font-medium">
            <Link
              href="/admin"
              className="rounded-full bg-slate-900 px-4 py-2 text-white"
            >
              ダッシュボード
            </Link>
            <Link
              href="/admin/posts"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700"
            >
              投稿一覧
            </Link>
            <Link
              href="/admin/posts/new"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700"
            >
              新規投稿
            </Link>
            <Link
              href="/admin/categories/new"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700"
            >
              新規カテゴリ
            </Link>
          </nav>
        </div>
      </section>
      {children}
    </div>
  );
};

export default AdminLayout;
