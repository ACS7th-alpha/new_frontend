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
          console.log('[HomePage] 인기 상품 데이터 요청 시작');
          const response = await fetch('/api/data/users/top-products', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log('[HomePage] 인기 상품 API 응답:', {
            status: response.status,
            ok: response.ok,
            statusText: response.statusText,
          });

          if (response.ok) {
            const result = await response.json();
            console.log('[HomePage] 인기 상품 데이터:', {
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
            console.error('[HomePage] 인기 상품 API 에러:', {
              status: response.status,
              error: errorText,
            });
          }
        } catch (error) {
          console.error('[HomePage] 인기 상품 데이터 조회 실패:', {
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('[GoogleLogin] Received response:', {
        hasCredential: !!credentialResponse.credential,
        credentialPreview: credentialResponse.credential
          ? `...${credentialResponse.credential.slice(-10)}`
          : 'none',
      });

      const decoded = jwtDecode(credentialResponse.credential);
      console.log('[GoogleLogin] Decoded token:', {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: decoded.sub,
        }),
      });

      const data = await response.json();
      // console.log('[GoogleLogin] Full data structure:', data);
      // console.log('[GoogleLogin] Auth response:', {
      //   status: response.status,
      //   ok: response.ok,
      //   success: data.success,
      //   hasTokens: !!data.meta?.tokens,
      // });

      if (response.ok && data.success) {
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.data));
        localStorage.removeItem('spendingData');
        localStorage.removeItem('budget');

        // 예산 데이터 가져오기
        try {
          // console.log('[GoogleLogin] Fetching budget data with new token');
          const budgetResponse = await fetch('/api/budget', {
            headers: {
              Authorization: `Bearer ${data.data.access_token}`,
            },
          });

          // console.log('[GoogleLogin] Budget response:', {
          //   status: budgetResponse.status,
          //   ok: budgetResponse.ok,
          // });

          if (budgetResponse.ok) {
            const budgetData = await budgetResponse.json();
            // console.log('[GoogleLogin] Budget data received:', {
            //   success: budgetData.success,
            //   hasData:
            //     Array.isArray(budgetData.data) && budgetData.data.length > 0,
            //   dataLength: budgetData.data?.length || 0,
            //   sampleData: budgetData.data?.[0],
            // });
            localStorage.setItem('budget', JSON.stringify(budgetData));
          }
        } catch (error) {
          // console.error('[GoogleLogin] Budget fetch error:', {
          //   message: error.message,
          //   stack: error.stack,
          // });
        }

        //console.log('[GoogleLogin] Reloading page');
        window.location.reload();
      } else {
        //console.log('[GoogleLogin] New user detected, redirecting to signup');
        const userData = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        };
        router.push(
          `/signup?userData=${encodeURIComponent(JSON.stringify(userData))}`
        );
      }
    } catch (error) {
      console.error('[GoogleLogin] Error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
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
      <Header onLogin={handleGoogleSuccess} />
      <HeroSection
        userInfo={userInfo}
        childAge={childAge}
        monthlySpending={monthlySpending}
      />
      <ConsumptionAnalysis />
      <ProductList />
      <Footer />
    </div>
  );
}
