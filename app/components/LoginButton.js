'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      console.log('로그인 응답:', data);

      if (response.ok) {
        // 토큰 저장
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // 사용자 정보 저장
        localStorage.setItem('user', JSON.stringify({
          user: data.user
        }));

        console.log('로그인 성공! 저장된 정보:', {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: data.user
        });

        // 메인 페이지로 리다이렉트
        router.push('/');
      } else {
        console.error('로그인 실패:', data.message);
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
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