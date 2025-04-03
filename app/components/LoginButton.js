'use client';
import { useState } from 'react';

export default function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const googleId = '106517685696893761191'; // 고정된 Google ID 사용
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('access_token', data.meta.tokens.accessToken);
        localStorage.setItem('refresh_token', data.meta.tokens.refreshToken);
        window.location.reload();
      } else {
        console.error('로그인 실패:', data.error);
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
    >
      {loading ? '로그인 중...' : '로그인'}
    </button>
  );
} 