'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import { Plus, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [age, setAge] = useState('');
  const [store, setStore] = useState('');
  const [isRecommended, setIsRecommended] = useState(null);
  const [images, setImages] = useState([]); // 여러 이미지를 담을 배열
  const [isLoading, setIsLoading] = useState(false); // 추가: loading state
  const router = useRouter();

  useEffect(() => {
    console.log('[WritePage] Component mounted');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('[WritePage] Checking authentication...');
    const token = localStorage.getItem('access_token');
    console.log('[WritePage] Access token:', token ? 'Present' : 'Not found');

    if (!token) {
      console.log('[WritePage] No token found, redirecting to login');
      router.push('/login');
      return;
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const currentImagesCount = images.length;

    // 최대 9장까지 업로드 가능
    if (currentImagesCount + files.length <= 9) {
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    } else {
      alert('최대 9장까지만 업로드 가능합니다.');
    }
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[WritePage] Form submission started:', {
      title,
      content,
      age,
      store,
      isRecommended,
      images: images.length,
    });

    if (
      !title.trim() ||
      !content.trim() ||
      !age ||
      isRecommended === null ||
      images.length === 0
    ) {
      console.log('[WritePage] Validation failed:', {
        title: !title.trim(),
        content: !content.trim(),
        age: !age,
        isRecommended: isRecommended === null,
        images: images.length === 0,
      });
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    console.log('[WritePage] Preparing form data');

    try {
      // 이미지 업로드
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((image) => {
          imageFormData.append('files', image.file);
        });

        console.log('[WritePage] Uploading images...');
        const imageUploadResponse = await fetch('/api/upload/multiple', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: imageFormData,
        });

        if (!imageUploadResponse.ok) {
          console.error(
            '[WritePage] Image upload failed:',
            await imageUploadResponse.text()
          );
          throw new Error(`이미지 업로드 실패: ${imageUploadResponse.status}`);
        }

        const imageData = await imageUploadResponse.json();
        console.log('[WritePage] Image upload successful:', imageData);
      }

      // 리뷰 데이터 생성 및 전송
      const reviewData = {
        name: title.trim(),
        description: content.trim(),
        ageGroup: age.trim(),
        purchaseLink: store.trim() || null,
        recommended: isRecommended,
        imageUrls: images.map((image) => image.preview),
      };

      console.log('전송할 리뷰 데이터:', reviewData);

      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (!reviewResponse.ok) {
        console.error(
          '[WritePage] Review submission failed:',
          await reviewResponse.text()
        );
        throw new Error(`리뷰 등록 실패: ${reviewResponse.status}`);
      }

      const data = await reviewResponse.json();
      console.log('[WritePage] Review submission successful:', data);

      if (data.success) {
        console.log('[WritePage] Redirecting to community page');
        router.push('/community');
      }
    } catch (error) {
      console.error('[WritePage] Submission error:', error);
      alert(error.message || '게시글 작성에 실패했습니다.');
    } finally {
      console.log('[WritePage] Form submission completed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg mt-6">
        <h1 className="text-3xl font-bold mb-4">글 작성</h1>

        {/* 이미지 업로드 영역 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="relative w-32 h-32 flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer">
            <Plus size={32} />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-32 h-32 bg-gray-200 rounded-lg"
            >
              <img
                src={image.preview}
                alt={`Uploaded ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                className="absolute -top-2 -right-2 bg-white rounded-full"
                onClick={() => handleImageDelete(index)}
              >
                <XCircle size={20} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>

        {/* 추천/비추천 버튼 */}
        <div className="flex gap-4 mb-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
              isRecommended === true ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setIsRecommended(true)}
          >
            추천템
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg ${
              isRecommended === false ? 'bg-red-400 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setIsRecommended(false)}
          >
            비추천템
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">상품명</label>
            <input
              type="text"
              className="w-full border p-2 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">내용</label>
            <textarea
              className="w-full border p-2 rounded-lg"
              placeholder="상품의 장/단점을 작성해 주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">사용연령</label>
            <input
              type="text"
              className="w-full border p-2 rounded-lg"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold">구매처 (선택)</label>
            <input
              type="text"
              className="w-full border p-2 rounded-lg"
              value={store}
              onChange={(e) => setStore(e.target.value)}
            />
            {/* 업로드 버튼 */}
            <button
              className="mt-6 px-4 bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 ml-auto block"
              onClick={handleSubmit}
            >
              업로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
