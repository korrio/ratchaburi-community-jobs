import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import Head from 'next/head';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <>
      <Head>
        <title>ราชบุรีงานชุมชน - แพลตฟอร์มจับคู่งานชุมชน</title>
        <meta name="description" content="แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้ต้องการจ้างงานในชุมชนราชบุรี" />
        <meta name="keywords" content="ราชบุรี, งานชุมชน, จับคู่งาน, ผู้ให้บริการ, ช่าง, บริการ" />
        <meta name="author" content="ศูนย์จัดการแรงงานระดับพื้นที่ตำบลแพงพวย" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ratchaburi-community-jobs.vercel.app/" />
        <meta property="og:title" content="ราชบุรีงานชุมชน - แพลตฟอร์มจับคู่งานชุมชน" />
        <meta property="og:description" content="แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้ต้องการจ้างงานในชุมชนราชบุรี" />
        <meta property="og:image" content="/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ratchaburi-community-jobs.vercel.app/" />
        <meta name="twitter:title" content="ราชบุรีงานชุมชน - แพลตฟอร์มจับคู่งานชุมชน" />
        <meta name="twitter:description" content="แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้ต้องการจ้างงานในชุมชนราชบุรี" />
        <meta name="twitter:image" content="/og-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </QueryClientProvider>
    </>
  );
}