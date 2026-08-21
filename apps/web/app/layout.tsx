import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from './components/ClientProviders';
import AppShell from './components/AppShell';

export const metadata: Metadata = {
  title: 'ChayFood - Ẩm Thực Chay Dinh Dưỡng Khoa Học',
  description: 'Nền tảng ẩm thực chay và gói ăn định kỳ chuẩn Macro Calo và Protein thực vật. Thực phẩm hữu cơ tươi sạch giao tận nơi mỗi ngày.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body>
        <ClientProviders>
          <AppShell>
            {children}
          </AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}