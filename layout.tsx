import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '一雄URL转换检测工具',
  description: '轻松转换和检查多个URL的可访问性和标题信息。提高您的网站管理效率。',
  openGraph: {
    title: '一雄URL转换检测工具',
    description: '轻松转换和检查多个URL的可访问性和标题信息。提高您的网站管理效率。',
    type: 'website',
    url: 'https://your-domain.com',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '一雄URL转换检测工具',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '一雄URL转换检测工具',
    description: '轻松转换和检查多个URL的可访问性和标题信息。提高您的网站管理效率。',
    images: ['https://your-domain.com/twitter-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

