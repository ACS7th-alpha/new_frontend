'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './globals.css';
import { useEffect, useState } from 'react';
import ChatButton from './components/ChatButton';
import { SessionProvider } from 'next-auth/react';

// _app.js (또는 app/layout.js)
import localFont from 'next/font/local';
import './globals.css';

// const geistSans = localFont({
//   src: '../public/fonts/GeistVF.woff',
//   variable: '--font-geist-sans',
//   weight: '100 900',
// });

// const geistMono = localFont({
//   src: '../public/fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// });

export default function RootLayout({ children }) {
  // isLoggedIn state 제거 (더 이상 필요하지 않음)

  // 클라이언트 ID를 직접 문자열로 입력
  const clientId =
    '140823084109-9phm7467tp421u96g73ffb4vtj4i6gg8.apps.googleusercontent.com';

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hama - 합리적인 엄마의 스마트한 선택</title>
        <meta name="description" content="Hama는 소비자 맞춤형 육아용품을 추천하고 소비패턴을 분석해주는 서비스입니다." />
      </head>

      <body>
        <GoogleOAuthProvider clientId={clientId}>
          <main>{children}</main>
          <ChatButton /> {/* isLoggedIn 조건 제거 */}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}