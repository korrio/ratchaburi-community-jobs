import React, { useState } from 'react';
import Head from 'next/head';
import { QRCode } from '@/components/QRCode';

const slides = [
  {
    id: 1,
    background: 'linear-gradient(45deg, #1e40af, #3b82f6)',
    content: (
      <div className="h-screen flex items-center justify-center text-white text-center">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-6xl mb-8">🤝</div>
          <h1 className="text-5xl font-bold mb-6">ราชบุรีงานชุมชน</h1>
          <h2 className="text-2xl mb-12 opacity-90">
            แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้รับบริการในชุมชน
          </h2>
          
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto text-lg mb-12">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl">📱</span>
              <span>ใช้งานง่าย ผ่าน Web และ LINE</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl">🤝</span>
              <span>เชื่อมต่อคนในชุมชนเดียวกัน</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl">⚡</span>
              <span>รวดเร็ว ปลอดภัย เชื่อถือได้</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-3xl">🌟</span>
              <span>สร้างโอกาสรายได้ให้ชุมชน</span>
            </div>
          </div>

          <div className="text-lg opacity-80">
            <p className="font-semibold mb-2">ศูนย์จัดการแรงงานระดับพื้นที่ตำบลแพงพวย</p>
            <p>อำเภอดำเนินสะดวก จังหวัดราชบุรี</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    background: '#f8fafc',
    content: (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-12">ปัญหาในชุมชนปัจจุบัน</h1>
          
          <div className="grid grid-cols-2 gap-12 mb-8">
            <div className="bg-red-50 p-8 rounded-2xl border border-red-200">
              <h2 className="text-2xl font-bold text-red-700 mb-6">ผู้ที่ต้องการจ้างงาน</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔍</span>
                  <span>หาคนทำงานยาก ไม่รู้จะติดต่อใคร</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📞</span>
                  <span>พึ่งพาการบอกต่อ หรือการโทรหาเท่านั้น</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⏰</span>
                  <span>เสียเวลาในการค้นหาและติดต่อ</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💰</span>
                  <span>ไม่รู้ราคามาตรฐาน อาจโดนเอารัดเอาเปรียบ</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-8 rounded-2xl border border-orange-200">
              <h2 className="text-2xl font-bold text-orange-700 mb-6">ผู้ที่ต้องการหางาน</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">👂</span>
                  <span>รอฟังข่าวจากคนรู้จักเท่านั้น</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📱</span>
                  <span>ไม่มีช่องทางประชาสัมพันธ์ตัวเอง</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🎯</span>
                  <span>ไม่สามารถเข้าถึงลูกค้าใหม่ได้</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💼</span>
                  <span>รายได้ไม่สม่ำเสมอ</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            → เราสร้างแพลตฟอร์มเพื่อแก้ปัญหานี้!
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    background: '#fefefe',
    content: (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-12">ราชบุรีงานชุมชน คือคำตอบ</h1>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200">
              <div className="text-5xl mb-4">🌐</div>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">เว็บแอปพลิเคชัน</h2>
              <div className="space-y-3 text-left">
                <p>• ค้นหาผู้ให้บริการตามประเภทงาน</p>
                <p>• ดูรายละเอียด ราคา และรีวิว</p>
                <p>• ติดต่อโดยตรงผ่านระบบ</p>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
              <div className="text-5xl mb-4">💬</div>
              <h2 className="text-2xl font-bold text-green-700 mb-4">LINE Chatbot</h2>
              <div className="space-y-3 text-left">
                <p>• ใช้งานผ่าน LINE ที่คุ้นเคย</p>
                <p>• ค้นหาและจับคู่งานอัตโนมัติ</p>
                <p>• แจ้งเตือนเมื่อมีงานใหม่</p>
              </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200">
              <div className="text-5xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">ระบบจับคู่อัจฉริยะ</h2>
              <div className="space-y-3 text-left">
                <p>• วิเคราะห์พื้นที่, ราคา, และเวลา</p>
                <p>• แนะนำงานที่เหมาะสมที่สุด</p>
                <p>• ช่วยลดเวลาในการค้นหา</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    background: '#f0f9ff',
    content: (
      <div className="h-screen flex items-center justify-center bg-blue-50">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">วิธีเริ่มต้นใช้งาน</h1>
          <h2 className="text-2xl text-blue-600 mb-12">เริ่มใช้งานได้ง่าย ๆ ในวันนี้!</h2>
          
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
              <div className="text-5xl mb-4">📱</div>
              <h2 className="text-2xl font-bold text-green-700 mb-6">LINE Chatbot</h2>
              <div className="flex justify-center mb-6">
                <QRCode value="https://lin.ee/9G2yLV0" size={150} className="rounded-lg" />
              </div>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <span>สแกน QR Code หรือค้นหา LINE ID</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <span>กดเมนู "ลงทะเบียน"</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <span>เลือกบทบาท: ผู้ให้บริการ หรือ ผู้รับบริการ</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <span>กรอกข้อมูล และเริ่มใช้งานได้เลย!</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-green-600 font-mono">https://lin.ee/9G2yLV0</p>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200">
              <div className="text-5xl mb-4">🌐</div>
              <h2 className="text-2xl font-bold text-blue-700 mb-6">เว็บแอปพลิเคชัน</h2>
              <div className="flex justify-center mb-6">
                <QRCode value="https://ratchaburi-community-jobs.vercel.app" size={150} className="rounded-lg" />
              </div>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <span>เข้าเว็บไซต์: <code className="bg-gray-200 px-2 py-1 rounded">ratchaburi-community-jobs.vercel.app</code></span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <span>กดปุ่ม "ลงทะเบียน"</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <span>กรอกข้อมูลส่วนตัว</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <span>เริ่มค้นหา หรือ ให้บริการได้ทันที!</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-blue-600 font-mono">https://ratchaburi-community-jobs.vercel.app</p>
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            🎉 ขอบคุณที่ร่วมสร้างชุมชนที่เข้มแข็ง! 🎉
          </div>
        </div>
      </div>
    )
  }
];

const PresentationPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape') {
      window.location.href = '/';
    }
  };

  return (
    <>
      <Head>
        <title>ราชบุรีงานชุมชน - งานนำเสนอ</title>
        <meta name="description" content="แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้รับบริการในชุมชน" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div 
        className="w-full h-screen overflow-hidden relative"
        onKeyDown={handleKeyPress}
        tabIndex={0}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Current Slide */}
        <div 
          className="w-full h-full transition-all duration-500 ease-in-out"
          style={{ 
            background: slides[currentSlide].background,
          }}
        >
          {slides[currentSlide].content}
        </div>

        {/* Navigation Controls */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
          <button
            onClick={prevSlide}
            className="text-white hover:text-blue-300 text-2xl"
            disabled={currentSlide === 0}
          >
            ←
          </button>
          
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-400' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="text-white hover:text-blue-300 text-2xl"
            disabled={currentSlide === slides.length - 1}
          >
            →
          </button>
        </div>

        {/* Slide Counter */}
        <div className="fixed top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
          {currentSlide + 1} / {slides.length}
        </div>

        {/* Back to Home Button */}
        <div className="fixed top-4 left-4">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            กลับหน้าหลัก
          </button>
        </div>

        {/* Instructions */}
        <div className="fixed bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-3 py-2 rounded">
          ใช้ลูกศร ← → หรือคลิกจุดด้านล่าง
        </div>
      </div>
    </>
  );
};

export default PresentationPage;