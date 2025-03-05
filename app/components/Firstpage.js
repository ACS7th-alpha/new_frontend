'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

const images = [
  '/images/test.png',
  '/images/test2.png',
  '/images/test3.png',
];

export default function Firstpage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-50 to-blue-50 py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-4xl">👶</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="text-yellow-400">HAMA</span>와 함께
            <span className="inline-block animate-bounce ml-2">🎈</span>
          </h1>
          <p className="text-xl text-gray-700 font-semibold mb-4">
            최저가 육아 용품 구매, 소비패턴 분석을 한 곳에서
            <span className="inline-block ml-2">✨</span>
          </p>
          <p className="max-w-2xl mx-auto text-gray-700 mb-6 leading-relaxed">
            온라인 쇼핑 예산, 아기 정보(생년월일, 성별)을 입력하면 
            해당 조건에 맞는 최저가 육아 용품을 추천합니다.
            월별 소비 내역 및 카테고리별 지출 통계를 통해 
            육아 비용을 체계적으로 관리합니다.
          </p>
        </div>
        <div className="relative mt-10">
          <div className="max-w-3xl mx-auto relative">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={3} // 중앙 슬라이드와 양옆 슬라이드를 보여줌
              spaceBetween={30} // 슬라이드 간격 설정
              coverflowEffect={{
                rotate: 0, // 슬라이드 회전 각도
                stretch: 0, // 슬라이드 간 거리 조정
                depth: 300, // 슬라이드 깊이감 설정
                modifier: 2, // 효과 강도 조정
                slideShadows: false, // 그림자 비활성화
              }}
              navigation={true} // 네비게이션 활성화 (좌/우 버튼)
              modules={[EffectCoverflow, Navigation]}
              className="mySwiper"
            >
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img src={src} alt={`이미지 ${index + 1}`} className="w-full h-full" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
