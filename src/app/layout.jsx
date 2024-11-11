import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Vazirmatn } from "next/font/google";
import ThemeRegistry from "@/MUI-RTL";
import { Toaster } from "sonner";

const vazir = Vazirmatn({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["arabic"],
  preload: true,
  display: "block",
  adjustFontFallback: false,
  fallback: ["Roboto", "sans-serif", "Helvetica", "Arial"],
  variable: "--font-vazir",
});

export const metadata = {
  title: "تفکیک",
  description: "تفکیک",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  shrinkToFit: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} `}>
        <AppRouterCacheProvider CacheProvider={ThemeRegistry}>
          {children}
          <Toaster
            position="bottom-left"
            dir="rtl"
            className={vazir.className}
            duration={5000}
            richColors 
            expand={false}
          />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
