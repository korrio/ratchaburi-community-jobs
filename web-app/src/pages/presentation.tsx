import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, FileImage, FileText, Home, Menu, Users, Zap, Target, TrendingUp, Award, Phone, Package } from 'lucide-react';
import { Mermaid } from '@/components/Mermaid';
import { QRCode } from '@/components/QRCode';

interface SlideProps {
  children: React.ReactNode;
  className?: string;
}

const Slide: React.FC<SlideProps> = ({ children, className = "" }) => (
  <div className={`w-full h-screen flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-white ${className}`}>
    {children}
  </div>
);

const PresentationPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  // Auto-focus for keyboard navigation
  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.focus();
    }
  }, []);

  const slides = [
    // Slide 1: Cover
    <Slide key={0} className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="text-center space-y-8">
        <div className="mb-8">
          <img 
            src="/job-commu-logo.png" 
            alt="ราชบุรีงานชุมชน" 
            className="h-32 w-auto mx-auto mb-4"
          />
        </div>
        <h2 className="text-2xl mb-8">แพลตฟอร์มเชื่อมต่อผู้ให้บริการกับผู้รับบริการในชุมชน</h2>
        
        <div className="grid grid-cols-2 gap-8 text-lg">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl">📱</span>
            <span>ใช้งานง่าย ผ่าน Web และ LINE</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl">🤝</span>
            <span>เชื่อมต่อคนในชุมชนเดียวกัน</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl">⚡</span>
            <span>รวดเร็ว ปลอดภัย เชื่อถือได้</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl">🌟</span>
            <span>สร้างโอกาสรายได้ให้ชุมชน</span>
          </div>
        </div>

        <div className="mt-12 text-lg">
          <p className="font-semibold">ศูนย์จัดการแรงงานระดับพื้นที่ตำบลแพงพวย</p>
          <p>อำเภอดำเนินสะดวก จังหวัดราชบุรี</p>
        </div>
      </div>
    </Slide>,

    // Slide 2: Problem Statement
    <Slide key={1}>
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-12">ปัญหาในชุมชนปัจจุบัน</h1>
        
        <div className="grid grid-cols-2 gap-12">
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

        <div className="text-3xl font-bold text-primary-600 mt-8">
          → เราสร้างแพลตฟอร์มเพื่อแก้ปัญหานี้!
        </div>
      </div>
    </Slide>,

    // Slide 3: Our Solution
    <Slide key={2}>
      <div className="max-w-5xl text-center space-y-8">
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
    </Slide>,

    // Slide 4: Customer Journey
    <Slide key={3}>
      <div className="max-w-6xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">การเดินทางของผู้รับบริการ</h1>
        <h2 className="text-lg text-gray-600 mb-6">ขั้นตอนการใช้งานสำหรับผู้ที่ต้องการจ้างงาน</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 bg-blue-50 p-4 rounded-xl">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">1</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-blue-700">ค้นหาและเลือก</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">เข้าเว็บ/LINE</span>
                <span className="text-sm">→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">เลือกประเภทงาน</span>
                <span className="text-sm">→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">ดูรายชื่อผู้ให้บริการ</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-green-50 p-4 rounded-xl">
            <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">2</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-green-700">ดูรายละเอียด</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">ดูโปรไฟล์</span>
                <span className="text-sm">→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">เช็คราคา/เวลา</span>
                <span className="text-sm">→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">อ่านรีวิว</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-yellow-50 p-4 rounded-xl">
            <div className="bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">3</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-yellow-700">ติดต่อและจอง</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">กดติดต่อ</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">กรอกรายละเอียดงาน</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">นัดหมายวันเวลา</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-purple-50 p-4 rounded-xl">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">4</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-purple-700">รับบริการ</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">ผู้ให้บริการมาทำงาน</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">ตรวจสอบผลงาน</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">ชำระเงิน</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-pink-50 p-4 rounded-xl">
            <div className="bg-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">5</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-pink-700">ให้คะแนน</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">ให้คะแนนและรีวิว</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">ช่วยชุมชนมีข้อมูลที่ดี</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 5: Provider Journey
    <Slide key={4}>
      <div className="max-w-6xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">การเดินทางของผู้ให้บริการ</h1>
        <h2 className="text-lg text-gray-600 mb-6">ขั้นตอนการใช้งานสำหรับผู้ที่ต้องการหางาน</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 bg-indigo-50 p-4 rounded-xl">
            <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">1</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-indigo-700">ลงทะเบียน</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">เข้าเว็บ/LINE</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">กดลงทะเบียน</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">กรอกข้อมูลส่วนตัว</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-teal-50 p-4 rounded-xl">
            <div className="bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">2</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-teal-700">สร้างโปรไฟล์</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">เพิ่มรูปภาพ</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">เขียนแนะนำตัว</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">กำหนดราคา/เวลาว่าง</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-orange-50 p-4 rounded-xl">
            <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">3</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-orange-700">รับการจับคู่</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">ระบบแจ้งเตือนงานใหม่</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">เลือกรับ/ปฏิเสธงาน</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-red-50 p-4 rounded-xl">
            <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">4</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-red-700">ทำงาน</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">นัดหมายลูกค้า</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">ไปทำงานตามเวลา</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">ทำงานให้เสร็จสมบูรณ์</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 bg-emerald-50 p-4 rounded-xl">
            <div className="bg-emerald-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">5</div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-bold text-emerald-700">รับชำระและรีวิว</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-white px-2 py-1 rounded-full text-xs">รับเงิน</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">รับรีวิวจากลูกค้า</span>
                <span>→</span>
                <span className="bg-white px-2 py-1 rounded-full text-xs">สร้างชื่อเสียงในชุมชน</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 6: LINE Chatbot Flow
    <Slide key={5}>
      <div className="max-w-6xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">โฟลว์ชาร์ท LINE Chatbot</h1>
        <h2 className="text-xl text-gray-600 mb-8">ขั้นตอนการใช้งาน LINE Chatbot</h2>
        
        <div className="grid grid-cols-3 gap-8 items-start">
          {/* QR Code Section */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-green-700 mb-4">เพิ่มเพื่อน LINE</h3>
            <div className="flex justify-center mb-4">
              <QRCode value="https://lin.ee/9G2yLV0" size={150} className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">สแกน QR Code</p>
              <p className="text-xs text-green-600 font-mono">https://lin.ee/9G2yLV0</p>
              <p className="text-sm font-semibold text-green-700">ราชบุรีงานชุมชน</p>
            </div>
          </div>

          {/* Flowchart Section */}
          <div className="col-span-2 bg-white p-4 rounded-xl border shadow-lg">
            <Mermaid 
              chart={`graph TD
    A[เริ่มต้น<br/>Add Friend LINE Bot] --> B{เลือกบทบาท}
    
    B -->|ผู้รับบริการ| C[ค้นหาผู้ให้บริการ]
    B -->|ผู้ให้บริการ| D[ลงทะเบียนผู้ให้บริการ]
    
    C --> E[เลือกประเภทบริการ]
    E --> F[ดูรายชื่อผู้ให้บริการ]
    F --> G[เลือกผู้ให้บริการ]
    G --> H[ส่งข้อความติดต่อ]
    
    D --> I[กรอกข้อมูลส่วนตัว]
    I --> J[กำหนดบริการและราคา]
    J --> K[ตั้งเวลาว่าง]
    K --> L[รอรับงานจากระบบ]
    L --> M{มีงานใหม่?}
    M -->|ใช่| N[แจ้งเตือนงานใหม่]
    M -->|ไม่| L
    
    N --> O{รับงาน?}
    O -->|รับ| P[เริ่มทำงาน]
    O -->|ปฏิเสธ| L
    
    H --> Q[สร้างการจับคู่งาน]
    P --> Q
    Q --> R[ติดตามสถานะงาน]
    R --> S[งานเสร็จสิ้น]
    S --> T[ให้คะแนนและรีวิว]
    
    classDef startEnd fill:#e1f5fe
    classDef process fill:#f3e5f5
    classDef decision fill:#fff3e0
    classDef action fill:#e8f5e8
    
    class A,T startEnd
    class C,D,E,F,G,H,I,J,K,L,N,P,Q,R,S process
    class B,M,O decision`}
            />
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 7: Job Stages Flow
    <Slide key={6}>
      <div className="max-w-6xl text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">โฟลว์ชาร์ทขั้นตอนงาน</h1>
        <h2 className="text-xl text-gray-600 mb-12">5 ขั้นตอนการทำงาน</h2>
        
        <div className="bg-white p-8 rounded-2xl border shadow-lg mb-8">
          <Mermaid 
            chart={`graph LR
    A[รอการตอบกลับ<br/>PENDING] --> B[ตอบรับแล้ว<br/>ACCEPTED]
    B --> C[มาถึงแล้ว<br/>ARRIVED]
    C --> D[เริ่มทำงาน<br/>STARTED]
    D --> E[งานเสร็จ<br/>COMPLETED]
    E --> F[ปิดงาน<br/>CLOSED]
    
    A -.->|ปฏิเสธ| G[ยกเลิก<br/>CANCELLED]
    B -.->|ยกเลิก| G
    C -.->|ยกเลิก| G
    D -.->|ยกเลิก| G
    
    classDef pending fill:#fff3cd
    classDef accepted fill:#d4edda
    classDef arrived fill:#cce5f0
    classDef started fill:#e2e3ff
    classDef completed fill:#d1ecf1
    classDef closed fill:#f8f9fa
    classDef cancelled fill:#f8d7da
    
    class A pending
    class B accepted
    class C arrived
    class D started
    class E completed
    class F closed
    class G cancelled`}
          />
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-300 rounded"></div>
              <span className="font-semibold">รอการตอบกลับ:</span>
            </div>
            <p className="text-left ml-7">ผู้ให้บริการพิจารณางาน</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span className="font-semibold">ตอบรับแล้ว:</span>
            </div>
            <p className="text-left ml-7">ยืนยันรับงาน, กำหนดวันเวลา</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-300 rounded"></div>
              <span className="font-semibold">มาถึงแล้ว:</span>
            </div>
            <p className="text-left ml-7">ผู้ให้บริการมาถึงสถานที่แล้ว</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-purple-300 rounded"></div>
              <span className="font-semibold">เริ่มทำงาน:</span>
            </div>
            <p className="text-left ml-7">กำลังดำเนินการทำงาน</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-cyan-300 rounded"></div>
              <span className="font-semibold">งานเสร็จ:</span>
            </div>
            <p className="text-left ml-7">ทำงานเสร็จเรียบร้อย</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="font-semibold">ปิดงาน:</span>
            </div>
            <p className="text-left ml-7">ชำระเงิน, ให้คะแนนเสร็จสิ้น</p>
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 8: Key Features
    <Slide key={7}>
      <div className="max-w-5xl text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-12">คุณสมบัติเด่น</h1>
        <h2 className="text-xl text-gray-600 mb-8">สิ่งที่ทำให้เราพิเศษ</h2>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">การจับคู่อัจฉริยะ</h2>
            <div className="space-y-3 text-left">
              <p>• วิเคราะห์พื้นที่ (อำเภอ/ตำบล)</p>
              <p>• เปรียบเทียบราคาและงบประมาณ</p>
              <p>• จับคู่เวลาว่างกับความต้องการ</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
            <div className="text-5xl mb-4">📱</div>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">ใช้งานง่าย 2 ช่องทาง</h2>
            <div className="space-y-3 text-left">
              <p>• เว็บแอป: ดูข้อมูลรายละเอียดครบถ้วน</p>
              <p>• LINE Bot: สะดวก รวดเร็ว คุ้นเคย</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">ปลอดภัยและเชื่อถือได้</h2>
            <div className="space-y-3 text-left">
              <p>• ระบบรีวิวและให้คะแนน</p>
              <p>• เก็บประวัติการทำงาน</p>
              <p>• แจ้งเตือนการทำงานผ่าน LINE</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-orange-700 mb-4">ระบบจัดการสำหรับแอดมิน</h2>
            <div className="space-y-3 text-left">
              <p>• ติดตามสถิติการใช้งาน</p>
              <p>• จัดการหมวดหมู่บริการ</p>
              <p>• รายงานผลการดำเนินงาน</p>
            </div>
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 9: Benefits
    <Slide key={8}>
      <div className="max-w-5xl text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">ประโยชน์ที่ได้รับ</h1>
        <h2 className="text-xl text-gray-600 mb-12">เราช่วยให้ชุมชนเข้มแข็ง</h2>
        
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-2xl border border-primary-200">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-primary-600 mr-4" />
              <h2 className="text-2xl font-bold text-primary-700">สำหรับชุมชน</h2>
            </div>
            <div className="grid grid-cols-2 gap-6 text-left">
              <p>• ลดการว่างงานในชุมชน</p>
              <p>• เพิ่มโอกาสรายได้ให้คนในพื้นที่</p>
              <p>• สร้างเครือข่ายความช่วยเหลือ</p>
              <p>• ข้อมูลโปร่งใส เชื่อถือได้</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-10 w-10 text-green-600 mr-3" />
                <h2 className="text-lg font-bold text-green-700">สำหรับผู้ให้บริการ</h2>
              </div>
              <div className="space-y-3 text-left">
                <p>• หารายได้เพิ่ม จากฝีมือที่มี</p>
                <p>• เข้าถึงลูกค้าใหม่ๆ ได้ง่าย</p>
                <p>• สร้างชื่อเสียงจากรีวิวที่ดี</p>
                <p>• จัดการเวลาทำงานได้อิสระ</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-center mb-4">
                <Target className="h-10 w-10 text-blue-600 mr-3" />
                <h2 className="text-lg font-bold text-blue-700">สำหรับผู้รับบริการ</h2>
              </div>
              <div className="space-y-3 text-left">
                <p>• ประหยัดเวลาในการหาคนทำงาน</p>
                <p>• มั่นใจในคุณภาพจากรีวิว</p>
                <p>• ราคายุติธรรม โปร่งใส</p>
                <p>• ติดต่อสะดวก ปลอดภัย</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 10: How to Get Started
    <Slide key={9}>
      <div className="max-w-5xl text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">วิธีเริ่มต้นใช้งาน</h1>
        <h2 className="text-2xl text-primary-600 mb-12">เริ่มใช้งานได้ง่าย ๆ ในวันนี้!</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
            <div className="text-5xl mb-4">📱</div>
            <h2 className="text-2xl font-bold text-green-700 mb-6">LINE Chatbot</h2>
            <div className="flex justify-center mb-4">
              <QRCode value="https://lin.ee/9G2yLV0" size={120} className="rounded-lg" />
            </div>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-sm">สแกน QR Code หรือค้นหา LINE ID</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-sm">กดเมนู "ลงทะเบียน"</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <span className="text-sm">เลือกบทบาท: ผู้ให้บริการ หรือ ผู้รับบริการ</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <span className="text-sm">กรอกข้อมูล และเริ่มใช้งานได้เลย!</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-green-600 font-mono">https://lin.ee/9G2yLV0</p>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200">
            <div className="text-5xl mb-4">🌐</div>
            <h2 className="text-2xl font-bold text-blue-700 mb-6">เว็บแอปพลิเคชัน</h2>
            <div className="flex justify-center mb-4">
              <QRCode value="https://ratchaburi-community-jobs.vercel.app" size={120} className="rounded-lg" />
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
            <div className="mt-4 text-center">
              <p className="text-xs text-blue-600 font-mono">https://ratchaburi-community-jobs.vercel.app</p>
            </div>
          </div>
        </div>

        <div className="text-3xl font-bold text-primary-600 mt-8">
          🎉 ขอบคุณที่ร่วมสร้างชุมชนที่เข้มแข็ง! 🎉
        </div>
      </div>
    </Slide>
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const exportToPDF = async () => {
    if (typeof window !== 'undefined') {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = slideRef.current;
      const opt = {
        margin: 0,
        filename: `ราชบุรีงานชุมชน-สไลด์-${currentSlide + 1}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  const exportToPNG = async () => {
    if (typeof window !== 'undefined') {
      const html2canvas = (await import('html2canvas')).default;
      const element = slideRef.current;
      if (element) {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const link = document.createElement('a');
        link.download = `ราชบุรีงานชุมชน-สไลด์-${currentSlide + 1}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const exportAllToPDF = async () => {
    if (typeof window !== 'undefined') {
      setIsExporting(true);
      setExportProgress(0);
      
      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = slideRef.current;
        
        if (!element) return;

        const opt = {
          margin: 0,
          filename: 'ราชบุรีงานชุมชน-งานนำเสนอทั้งหมด.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };

        // Create a container for all slides
        const allSlidesContainer = document.createElement('div');
        allSlidesContainer.style.position = 'absolute';
        allSlidesContainer.style.top = '-9999px';
        allSlidesContainer.style.left = '-9999px';
        document.body.appendChild(allSlidesContainer);

        // Render all slides
        for (let i = 0; i < slides.length; i++) {
          setCurrentSlide(i);
          setExportProgress((i + 1) / slides.length * 50); // 50% for rendering
          
          // Wait for slide to render
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const slideClone = element.cloneNode(true) as HTMLElement;
          slideClone.style.pageBreakAfter = i < slides.length - 1 ? 'always' : 'auto';
          allSlidesContainer.appendChild(slideClone);
        }

        setExportProgress(75); // 75% for PDF generation
        
        // Generate PDF from all slides
        await html2pdf().set(opt).from(allSlidesContainer).save();
        
        // Cleanup
        document.body.removeChild(allSlidesContainer);
        setExportProgress(100);
        
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 1000);
      } catch (error) {
        console.error('Error exporting all slides to PDF:', error);
        setIsExporting(false);
        setExportProgress(0);
      }
    }
  };

  const exportAllToPNG = async () => {
    if (typeof window !== 'undefined') {
      setIsExporting(true);
      setExportProgress(0);
      
      try {
        const html2canvas = (await import('html2canvas')).default;
        const element = slideRef.current;
        
        if (!element) return;

        // Export each slide individually
        for (let i = 0; i < slides.length; i++) {
          setCurrentSlide(i);
          setExportProgress((i + 1) / slides.length * 90); // 90% for rendering
          
          // Wait for slide to render
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const canvas = await html2canvas(element, { scale: 2, useCORS: true });
          const link = document.createElement('a');
          link.download = `ราชบุรีงานชุมชน-สไลด์-${String(i + 1).padStart(2, '0')}.png`;
          link.href = canvas.toDataURL();
          link.click();
          
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        setExportProgress(100);
        
        setTimeout(() => {
          setIsExporting(false);
          setExportProgress(0);
        }, 1000);
      } catch (error) {
        console.error('Error exporting all slides to PNG:', error);
        setIsExporting(false);
        setExportProgress(0);
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Slide Content */}
      <div ref={slideRef} className="w-full h-full">
        {slides[currentSlide]}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3 z-40">
        <button 
          onClick={prevSlide}
          className="text-white hover:text-blue-300 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-blue-400' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="text-white hover:text-blue-300 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full text-sm z-40">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Export Controls */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-40">
        <div className="flex space-x-2">
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>PDF สไลด์นี้</span>
          </button>
          
          <button
            onClick={exportToPNG}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FileImage className="h-4 w-4" />
            <span>PNG สไลด์นี้</span>
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={exportAllToPDF}
            disabled={isExporting}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Package className="h-4 w-4" />
            <span>PDF ทั้งหมด</span>
          </button>
          
          <button
            onClick={exportAllToPNG}
            disabled={isExporting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>PNG ทั้งหมด</span>
          </button>
        </div>
        
        <a
          href="/"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>หน้าหลัก</span>
        </a>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 text-white p-4 rounded-xl z-50">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-lg font-semibold">กำลังส่งออก...</p>
            <div className="w-64 bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <p className="text-sm">{Math.round(exportProgress)}%</p>
          </div>
        </div>
      )}

      {/* Keyboard Navigation - Invisible element for keyboard focus */}
      <div 
        ref={keyboardRef}
        className="absolute bottom-2 right-2 w-1 h-1 opacity-0 focus:outline-none z-0"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') prevSlide();
          if (e.key === 'ArrowRight') nextSlide();
          if (e.key === 'Escape') window.location.href = '/';
        }}
      />
    </div>
  );
};

export default PresentationPage;