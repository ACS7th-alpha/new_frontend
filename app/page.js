'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Loading from './components/Loading';
import HeroSection from './components/HeroSection';
import ConsumptionAnalysis from './components/ConsumptionAnalysis';
import Footer from './components/Footer';
import ProductList from './product/page';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [childAge, setChildAge] = useState(null);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    setLoading(false);
    // URL에서 회원가입 완료 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const signupComplete = urlParams.get('signupComplete');
    const token = urlParams.get('token');

    // console.log('[HomePage] URL Parameters:', {
    //   signupComplete,
    //   hasToken: !!token,
    //   tokenPreview: token ? `...${token.slice(-10)}` : 'none',
    // });

    if (signupComplete && token) {
      // 토큰 저장 및 자동 로그인 처리
      localStorage.setItem('access_token', token);
      // URL 파라미터 제거
      window.history.replaceState({}, document.title, '/');
    }

    const fetchData = async () => {
      const userData = localStorage.getItem('user');
      const accessToken = localStorage.getItem('access_token');

      console.log('[HomePage] Storage Check:', {
        hasUserData: !!userData,
        hasAccessToken: !!accessToken,
        tokenPreview: accessToken ? `...${accessToken.slice(-10)}` : 'none',
      });

      if (userData && accessToken) {
        const parsedUser = JSON.parse(userData);
        setUserInfo(parsedUser);

        // 아기의 개월 수 계산
        // console.log('[HomePage] User data for age calculation:', {
        //   hasChildren: !!parsedUser?.user?.children,
        //   children: parsedUser?.user?.children,
        //   firstChild: parsedUser?.user?.children?.[0],
        // });

        if (parsedUser?.user?.children && parsedUser?.user?.children[0]) {
          const birthDate = new Date(parsedUser?.user?.children[0]?.birthdate);
          const today = new Date();

          // console.log('[HomePage] Child age calculation:', {
          //   birthDateString: parsedUser?.user?.children[0]?.birthdate,
          //   parsedBirthDate: birthDate,
          //   today,
          //   yearDiff: today.getFullYear() - birthDate.getFullYear(),
          //   monthDiff: today.getMonth() - birthDate.getMonth(),
          //   calculation: {
          //     yearPart: (today.getFullYear() - birthDate.getFullYear()) * 12,
          //     monthPart: today.getMonth() - birthDate.getMonth(),
          //   },
          // });

          const monthDiff =
            (today.getFullYear() - birthDate.getFullYear()) * 12 +
            (today.getMonth() - birthDate.getMonth());

          // console.log('[HomePage] Final monthDiff:', monthDiff);

          setChildAge(monthDiff);
        }

        // 인기 상품 데이터 가져오기
        try {
          console.log('[HomePage] 랭킹 상품 데이터 요청 시작');
          const response = await fetch('/api/data/users/top-products', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log('[HomePage] 랭킹 상품 API 응답:', {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
          });

          if (response.ok) {
            const result = await response.json();
            console.log('[HomePage] 랭킹 상품 데이터:', {
              success: result.success,
              productsCount: result.data?.length || 0,
              categories: result.meta?.categories,
              timestamp: result.timestamp,
            });

            if (result.data) {
              setTopProducts(result.data);
            }
          } else {
            const errorText = await response.text();
            console.error('[HomePage] 랭킹 상품 API 에러:', {
              status: response.status,
              error: errorText,
            });
          }
        } catch (error) {
          console.error('[HomePage] 랭킹 상품 데이터 조회 실패:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
          });
        }

        // 지출 내역 조회 및 현재 월 지출액 계산
        try {
          console.log(
            '[HomePage] Fetching budget data with token:',
            accessToken?.slice(-10)
          );

          const response = await fetch('/api/budget/spending', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // console.log('[HomePage] Budget API Response:', {
          //   status: response.status,
          //   ok: response.ok,
          // });

          if (response.ok) {
            const spendingData = await response.json();
            console.log('[HomePage] Raw spending data:', spendingData);

            const { spending, period } = spendingData.data;
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // JavaScript의 월은 0부터 시작

            let currentMonthTotal = 0;
            if (Array.isArray(spending)) {
              // 현재 년월의 지출만 합산
              currentMonthTotal = spending.reduce((total, category) => {
                const categoryTotal = category.details.reduce((sum, detail) => {
                  const detailDate = new Date(detail.date);
                  if (
                    detailDate.getFullYear() === currentYear &&
                    detailDate.getMonth() + 1 === currentMonth
                  ) {
                    return sum + (Number(detail.amount) || 0);
                  }
                  return sum;
                }, 0);
                return total + categoryTotal;
              }, 0);
            }

            console.log('[HomePage] Current month total:', currentMonthTotal);
            setMonthlySpending(currentMonthTotal);
          } else {
            const errorText = await response.text();
            // console.error('[HomePage] Budget API Error:', {
            //   status: response.status,
            //   error: errorText,
            // });
            setMonthlySpending(0);
          }
        } catch (error) {
          // console.error('[HomePage] Budget fetch error:', {
          //   message: error.message,
          //   stack: error.stack,
          // });
          setMonthlySpending(0);
        }
      }
    };

    fetchData();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true); // 로딩 상태 시작
      const googleId = '106517685696893761191';
      
      // 1. 로그인 API 호출
      const response = await fetch('/api/auth/google/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }

      // 2. 토큰과 사용자 정보 저장
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify({
        user: data.user
      }));
      localStorage.removeItem('spendingData');
      localStorage.removeItem('budget');

      // 3. 사용자 정보 상태 업데이트
      setUserInfo({
        user: data.user
      });

      // 4. 아기 나이 계산 및 업데이트
      if (data.user?.children && data.user.children[0]) {
        const birthDate = new Date(data.user.children[0].birthdate);
        const today = new Date();
        const monthDiff = (today.getFullYear() - birthDate.getFullYear()) * 12 +
                         (today.getMonth() - birthDate.getMonth());
        setChildAge(monthDiff);
      }

      // 5. 모든 필요한 데이터를 병렬로 가져오기
      const [budgetResponse, spendingResponse, topProductsResponse] = await Promise.all([
        fetch('/api/budget', {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }),
        fetch('/api/budget/spending', {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }),
        fetch('/api/data/users/top-products', {
          headers: { Authorization: `Bearer ${data.access_token}` },
        })
      ]);

      // 6. 예산 데이터 처리
      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();
        localStorage.setItem('budget', JSON.stringify(budgetData));
      }

      // 7. 지출 데이터 처리
      if (spendingResponse.ok) {
        const spendingData = await spendingResponse.json();
        const { spending } = spendingData.data;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        let currentMonthTotal = 0;
        if (Array.isArray(spending)) {
          currentMonthTotal = spending.reduce((total, category) => {
            const categoryTotal = category.details.reduce((sum, detail) => {
              const detailDate = new Date(detail.date);
              if (detailDate.getFullYear() === currentYear && 
                  detailDate.getMonth() + 1 === currentMonth) {
                return sum + (Number(detail.amount) || 0);
              }
              return sum;
            }, 0);
            return total + categoryTotal;
          }, 0);
        }
        setMonthlySpending(currentMonthTotal);
      }

      // 8. 인기 상품 데이터 처리
      if (topProductsResponse.ok) {
        const result = await topProductsResponse.json();
        if (result.data) {
          setTopProducts(result.data);
        }
      }

    } catch (error) {
      console.error('[Login] Error:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleGoToStatistics = async () => {
    console.log('[Statistics] Starting navigation');
    setLoading(true);
    const accessToken = localStorage.getItem('access_token');

    // console.log('[Statistics] Token check:', {
    //   hasToken: !!accessToken,
    //   tokenPreview: accessToken ? `...${accessToken.slice(-10)}` : 'none',
    // });

    try {
      //console.log('[Statistics] Fetching spending data');
      const response = await fetch('/api/budget/spending', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // console.log('[Statistics] Spending response:', {
      //   status: response.status,
      //   ok: response.ok,
      // });

      if (response.ok) {
        const data = await response.json();
        // console.log('[Statistics] Data received:', {
        //   success: data.success,
        //   hasData: !!data.spending,
        //   categoriesCount: data.spending?.length,
        // });

        localStorage.setItem('spendingData', JSON.stringify(data));
        // console.log('[Statistics] Data stored, navigating to statistics page');
        router.push('/statistics');
      } else {
        const errorText = await response.text();
        // console.error('[Statistics] Failed to fetch spending data:', {
        //   status: response.status,
        //   error: errorText,
        // });
      }
    } catch (error) {
      // console.error('[Statistics] Error:', {
      //   message: error.message,
      //   stack: error.stack,
      //   timestamp: new Date().toISOString(),
      // });
    } finally {
      setLoading(false);
      // console.log('[Statistics] Loading state cleared');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onLogin={handleLogin} />
      <HeroSection
        userInfo={userInfo}
        childAge={childAge}
        monthlySpending={monthlySpending}
        topProducts={topProducts}
      />
      <ConsumptionAnalysis />
      <ProductList />
      <Footer />
    </div>
  );
}
