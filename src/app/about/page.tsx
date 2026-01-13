"use client";
import Image from "next/image";

const Page: React.FC = () => {
  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[var(--shadow-strong)]">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex justify-center">
            <Image
              src="/images/avatar.png"
              alt="Author"
              width={280}
              height={280}
              priority
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-3xl text-slate-900">
              Fuwa Note / ふわノート
            </h1>
            <p className="text-sm text-slate-600">
              UIと開発のメモを、やさしい言葉でまとめています。小さな改善を重ねて、
              読みやすい体験づくりを目指しています。
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                UX design
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                Writing
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                Next.js
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
          <div className="font-display text-xl">このブログについて</div>
          <p className="mt-3 text-sm text-slate-600">
            UI改善の記録や、制作の気づきをゆるく共有する場所です。
          </p>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
          <div className="font-display text-xl">得意なこと</div>
          <p className="mt-3 text-sm text-slate-600">
            読みやすさに配慮したレイアウトと、やさしいコピーづくり。
          </p>
        </div>
        <div className="rounded-[24px] border border-white/70 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
          <div className="font-display text-xl">大切にしていること</div>
          <p className="mt-3 text-sm text-slate-600">
            気づきを残し、次の改善につなげる習慣づくりです。
          </p>
        </div>
      </section>
    </main>
  );
};

export default Page;
