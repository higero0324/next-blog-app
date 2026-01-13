import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/_components/Header";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Fuwa Note",
  description: "A cozy blog crafted with Next.js and a touch of wonder.",
};

type Props = {
  children: React.ReactNode;
};

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen">
          <Header />
          <div className="mx-4 mt-6 max-w-5xl pb-16 md:mx-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
