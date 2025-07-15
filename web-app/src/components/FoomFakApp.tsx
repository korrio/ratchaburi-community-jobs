import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, QrCode, User, Store, Gift, Star, Check, X, Menu, Home, History, Settings, Baby, BookOpen, Mic, Timer, Users, ShoppingCart, Camera, UserCheck } from 'lucide-react';

const FoomFakApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showStoryReader, setShowStoryReader] = useState(false);
  const [showChildcareTimer, setShowChildcareTimer] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [notification, setNotification] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [childcareSession, setChildcareSession] = useState(null);
  const [childcareTime, setChildcareTime] = useState(0);
  const [selectedParent, setSelectedParent] = useState(null);

  // Mock API responses
  const mockAPI = {
    // User registration
    register: (userData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            id: Date.now(),
            ...userData,
            quota: 1500,
            usedQuota: 0,
            earnings: 0,
            jobHistory: [],
            createdAt: new Date().toISOString()
          };
          resolve({ success: true, user: newUser });
        }, 1000);
      });
    },

    // Login
    login: (email, password) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock users for testing
          const mockUsers = [
            {
              id: 1,
              email: 'parent@example.com',
              password: 'password',
              name: 'นางสาวสมใจ ใจดี',
              role: 'parent',
              phone: '081-234-5678',
              quota: 1500,
              usedQuota: 200,
              earnings: 350,
              jobHistory: [],
              childName: 'น้องมินิ',
              childAge: 3
            },
            {
              id: 2,
              email: 'caregiver@example.com',
              password: 'password',
              name: 'นางสมศรี ใจบุญ',
              role: 'caregiver',
              phone: '081-987-6543',
              quota: 1500,
              usedQuota: 150,
              earnings: 800,
              jobHistory: [],
              experience: '5 ปี',
              rating: 4.8
            }
          ];
          
          const user = mockUsers.find(u => u.email === email && u.password === password);
          if (user) {
            resolve({ success: true, user });
          } else {
            resolve({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
          }
        }, 1000);
      });
    },

    // Record story reading
    recordStoryReading: (userId, duration, category) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (duration >= 900) { // 15 minutes = 900 seconds
            resolve({
              success: true,
              earnings: 50,
              message: 'บันทึกการอ่านนิทานสำเร็จ! ได้รับค่าตอบแทน 50 บาท'
            });
          } else {
            resolve({
              success: false,
              message: 'กรุณาอ่านนิทานให้ครบ 15 นาที'
            });
          }
        }, 1000);
      });
    },

    // Start childcare session
    startChildcare: (caregiverId, parentId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const session = {
            id: Date.now(),
            caregiverId,
            parentId,
            startTime: new Date().toISOString(),
            status: 'active'
          };
          resolve({ success: true, session });
        }, 1000);
      });
    },

    // End childcare session
    endChildcare: (sessionId, duration) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const earnings = Math.min(duration * 100, 3000); // Max 30 hours = 3000 baht
          resolve({
            success: true,
            earnings,
            duration,
            message: `ดูแลเด็กเสร็จสิ้น ${duration} ชั่วโมง ได้รับค่าตอบแทน ${earnings} บาท`
          });
        }, 1000);
      });
    },

    // Rate caregiver
    rateCaregiver: (sessionId, rating, comment) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'ขอบคุณสำหรับการประเมิน'
          });
        }, 1000);
      });
    },

    // Use quota at store
    useQuota: (userId, amount, storeId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            remainingQuota: 1500 - amount,
            message: `ใช้โควต้าสำเร็จ ${amount} บาท`
          });
        }, 1000);
      });
    }
  };

  // Stories for reading
  const stories = [
    {
      id: 1,
      title: 'นิทานกบน้อยผจญภัย',
      category: 'นิทาน',
      icon: '🐸',
      content: 'กาลครั้งหนึ่งนานมาแล้ว มีกบน้อยตัวหนึ่งชื่อว่า กบเขียว...'
    },
    {
      id: 2,
      title: 'อาหารมีประโยชน์',
      category: 'อาหาร',
      icon: '🥗',
      content: 'วันนี้เราจะมาเรียนรู้เกี่ยวกับอาหารที่มีประโยชน์ต่อร่างกาย...'
    },
    {
      id: 3,
      title: 'ร่างกายของเรา',
      category: 'ร่างกาย',
      icon: '👶',
      content: 'ร่างกายของเราประกอบด้วยส่วนต่างๆ ที่สำคัญมากมาย...'
    },
    {
      id: 4,
      title: 'การใช้ชีวิตประจำวัน',
      category: 'ชีวิตประจำวัน',
      icon: '🏠',
      content: 'ในแต่ละวันเราจะต้องทำกิจกรรมต่างๆ เพื่อดูแลตัวเอง...'
    }
  ];

  // Partner stores
  const partnerStores = [
    {
      id: 1,
      name: 'ร้านอาหารเด็กแสนดี',
      category: 'อาหารเด็ก',
      icon: '🍼',
      location: 'สยามสแควร์',
      qrCode: 'STORE-001'
    },
    {
      id: 2,
      name: 'ร้านของเล่นเด็ก',
      category: 'ของเล่นเด็ก',
      icon: '🧸',
      location: 'อารีย์',
      qrCode: 'STORE-002'
    },
    {
      id: 3,
      name: 'ร้านเสื้อผ้าเด็ก',
      category: 'เสื้อผ้าเด็ก',
      icon: '👶',
      location: 'เอกมัย',
      qrCode: 'STORE-003'
    }
  ];

  // Available parents for childcare
  const availableParents = [
    {
      id: 1,
      name: 'นางสาวสมใจ ใจดี',
      childName: 'น้องมินิ',
      childAge: 3,
      location: 'บางนา',
      phone: '081-234-5678'
    },
    {
      id: 2,
      name: 'นายสมชาย ดีใจ',
      childName: 'น้องปุ๊ก',
      childAge: 4,
      location: 'ลาดพร้าว',
      phone: '081-987-6543'
    }
  ];

  // Timer effects
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    let interval;
    if (childcareSession) {
      interval = setInterval(() => {
        setChildcareTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [childcareSession]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Login Modal
  const LoginModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
      setLoading(true);
      const result = await mockAPI.login(email, password);
      setLoading(false);
      
      if (result.success) {
        setCurrentUser(result.user);
        setShowLogin(false);
        showNotification('เข้าสู่ระบบสำเร็จ!');
      } else {
        showNotification(result.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h2>
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              ยกเลิก
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>ทดลองใช้ (พ่อแม่): parent@example.com / password</p>
            <p>ทดลองใช้ (ผู้ดูแล): caregiver@example.com / password</p>
          </div>
        </div>
      </div>
    );
  };

  // Register Modal
  const RegisterModal = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: '',
      phone: '',
      role: 'parent',
      childName: '',
      childAge: '',
      experience: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
      setLoading(true);
      const result = await mockAPI.register(formData);
      setLoading(false);
      
      if (result.success) {
        setCurrentUser(result.user);
        setShowRegister(false);
        showNotification('ลงทะเบียนสำเร็จ! ได้รับโควต้า 1,500 บาท');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">สมัครสมาชิก</h2>
          
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">ประเภทผู้ใช้</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="parent">ผู้ปกครอง (พ่อแม่วัยรุ่น)</option>
              <option value="caregiver">ผู้ดูแลเด็ก (ยายข้างบ้าน)</option>
            </select>
          </div>
          
          <input
            type="email"
            placeholder="อีเมล"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            placeholder="ชื่อ-นามสกุล"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="tel"
            placeholder="เบอร์โทรศัพท์"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full p-2 border rounded mb-3"
          />
          
          {formData.role === 'parent' && (
            <>
              <input
                type="text"
                placeholder="ชื่อลูก"
                value={formData.childName}
                onChange={(e) => setFormData({...formData, childName: e.target.value})}
                className="w-full p-2 border rounded mb-3"
              />
              <input
                type="number"
                placeholder="อายุลูก"
                value={formData.childAge}
                onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                className="w-full p-2 border rounded mb-3"
              />
            </>
          )}
          
          {formData.role === 'caregiver' && (
            <input
              type="text"
              placeholder="ประสบการณ์การดูแลเด็ก"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              className="w-full p-2 border rounded mb-3"
            />
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
            </button>
            <button
              onClick={() => setShowRegister(false)}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Story Reader Modal
  const StoryReaderModal = () => {
    const [selectedStory, setSelectedStory] = useState(null);

    const startReading = (story) => {
      setSelectedStory(story);
      setIsRecording(true);
      setRecordingTime(0);
      showNotification('เริ่มการอ่านนิทาน กรุณาอ่านให้ครบ 15 นาที');
    };

    const stopReading = async () => {
      setIsRecording(false);
      
      if (recordingTime >= 900) { // 15 minutes
        const result = await mockAPI.recordStoryReading(
          currentUser.id,
          recordingTime,
          selectedStory.category
        );
        
        if (result.success) {
          setCurrentUser(prev => ({
            ...prev,
            earnings: prev.earnings + result.earnings,
            jobHistory: [...prev.jobHistory, {
              id: Date.now(),
              type: 'story_reading',
              story: selectedStory.title,
              duration: recordingTime,
              earnings: result.earnings,
              date: new Date().toISOString()
            }]
          }));
          showNotification(result.message);
        }
      } else {
        showNotification('กรุณาอ่านนิทานให้ครบ 15 นาที');
      }
      
      setSelectedStory(null);
      setRecordingTime(0);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">อ่านนิทานให้ลูกฟัง</h2>
          
          {!selectedStory ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                เลือกเรื่องที่จะอ่าน (ได้ 50 บาท/15 นาที)
              </p>
              {stories.map(story => (
                <button
                  key={story.id}
                  onClick={() => startReading(story)}
                  className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{story.icon}</span>
                    <div>
                      <h3 className="font-semibold">{story.title}</h3>
                      <p className="text-sm text-gray-600">{story.category}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedStory.icon}</div>
              <h3 className="text-lg font-bold mb-2">{selectedStory.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{selectedStory.content}</p>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-center mb-2">
                  <Mic className={`w-6 h-6 mr-2 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
                  <span className="text-2xl font-mono">{formatTime(recordingTime)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((recordingTime / 900) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-sm mt-2">เป้าหมาย: 15 นาที</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={stopReading}
                  className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <Square className="w-4 h-4 mr-2 inline" />
                  หยุดอ่าน
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setShowStoryReader(false)}
            className="w-full mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            ปิด
          </button>
        </div>
      </div>
    );
  };

  // Childcare Timer Modal
  const ChildcareTimerModal = () => {
    const startChildcare = async (parent) => {
      const result = await mockAPI.startChildcare(currentUser.id, parent.id);
      if (result.success) {
        setChildcareSession(result.session);
        setSelectedParent(parent);
        setChildcareTime(0);
        showNotification(`เริ่มดูแล ${parent.childName} แล้ว`);
      }
    };

    const endChildcare = async () => {
      const hours = Math.floor(childcareTime / 3600);
      const result = await mockAPI.endChildcare(childcareSession.id, hours);
      
      if (result.success) {
        setCurrentUser(prev => ({
          ...prev,
          earnings: prev.earnings + result.earnings,
          jobHistory: [...prev.jobHistory, {
            id: Date.now(),
            type: 'childcare',
            parent: selectedParent.name,
            child: selectedParent.childName,
            duration: hours,
            earnings: result.earnings,
            date: new Date().toISOString()
          }]
        }));
        
        setChildcareSession(null);
        setSelectedParent(null);
        setChildcareTime(0);
        setShowRatingModal(true);
        showNotification(result.message);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">ดูแลเด็กปฐมวัย</h2>
          
          {!childcareSession ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                เลือกครอบครัวที่จะดูแล (ได้ 100 บาท/ชั่วโมง)
              </p>
              {availableParents.map(parent => (
                <button
                  key={parent.id}
                  onClick={() => startChildcare(parent)}
                  className="w-full p-3 border rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <Baby className="w-6 h-6 mr-3 text-pink-500" />
                    <div>
                      <h3 className="font-semibold">{parent.name}</h3>
                      <p className="text-sm text-gray-600">
                        {parent.childName} (อายุ {parent.childAge} ขวบ)
                      </p>
                      <p className="text-sm text-gray-500">{parent.location}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">👶</div>
              <h3 className="text-lg font-bold mb-2">กำลังดูแล {selectedParent.childName}</h3>
              <p className="text-sm text-gray-600 mb-4">ผู้ปกครอง: {selectedParent.name}</p>
              
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-center mb-2">
                  <Timer className="w-6 h-6 mr-2 text-blue-500" />
                  <span className="text-2xl font-mono">{formatHours(childcareTime)}</span>
                </div>
                <p className="text-sm">ค่าตอบแทนปัจจุบัน: {Math.floor(childcareTime / 3600) * 100} บาท</p>
              </div>
              
              <button
                onClick={endChildcare}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                <Square className="w-4 h-4 mr-2 inline" />
                สิ้นสุดการดูแล
              </button>
            </div>
          )}
          
          <button
            onClick={() => setShowChildcareTimer(false)}
            className="w-full mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            ปิด
          </button>
        </div>
      </div>
    );
  };

  // Rating Modal
  const RatingModal = () => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const submitRating = async () => {
      await mockAPI.rateCaregiver(childcareSession?.id, rating, comment);
      setShowRatingModal(false);
      showNotification('ขอบคุณสำหรับการประเมิน');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">ประเมินผู้ดูแล</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">ความพึงพอใจ</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">ความคิดเห็น</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="แสดงความคิดเห็น..."
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={submitRating}
              className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              ส่งการประเมิน
            </button>
            <button
              onClick={() => setShowRatingModal(false)}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              ข้าม
            </button>
          </div>
        </div>
      </div>
    );
  };

  // QR Scanner Modal
  const QRScannerModal = () => {
    const [scannedCode, setScannedCode] = useState('');
    const [amount, setAmount] = useState('');

    const useQuota = async () => {
      if (!scannedCode || !amount) {
        showNotification('กรุณาสแกน QR Code และระบุจำนวนเงิน');
        return;
      }

      const result = await mockAPI.useQuota(currentUser.id, parseInt(amount), scannedCode);
      if (result.success) {
        setCurrentUser(prev => ({
          ...prev,
          usedQuota: prev.usedQuota + parseInt(amount)
        }));
        showNotification(result.message);
        setShowQRScanner(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-xl font-bold mb-4">ใช้โควต้าที่ร้านค้า</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">สแกน QR Code ร้านค้า</label>
            <div className="bg-gray-100 p-4 rounded-lg text-center mb-2">
              <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">สแกน QR Code ที่ร้านค้า</p>
            </div>
            <input
              type="text"
              placeholder="หรือใส่รหัสร้านค้า"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">จำนวนเงิน</label>
            <input
              type="number"
              placeholder="ระบุจำนวนเงิน"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-600 mt-1">
              โควต้าคงเหลือ: {currentUser.quota - currentUser.usedQuota} บาท
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={useQuota}
              className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              ใช้โควต้า
            </button>
            <button
              onClick={() => setShowQRScanner(false)}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Home Tab
  const HomeTab = () => (
    <div className="p-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">ยินดีต้อนรับสู่ ฟูมฟัก!</h1>
        <p className="text-sm mb-2">ดูแลลูกวัยปฐมวัยของพ่อแม่วัยรุ่นที่เป็นเยาวชนนอกระบบการศึกษา</p>
        
        {currentUser ? (
          <div className="mt-4 p-3 bg-white bg-opacity-20 rounded">
            <p>สวัสดี {currentUser.name}</p>
            <p>โควต้าคงเหลือ: {currentUser.quota - currentUser.usedQuota}/1,500 บาท</p>
            <p>รายได้: {currentUser.earnings} บาท</p>
            {currentUser.role === 'parent' && currentUser.childName && (
              <p>ลูก: {currentUser.childName} ({currentUser.childAge} ขวบ)</p>
            )}
          </div>
        ) : (
          <p>กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        )}
      </div>

      {currentUser && (
        <div className="space-y-4">
          {currentUser.role === 'parent' && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                งานสำหรับผู้ปกครอง
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                อ่านหนังสือให้ลูกฟัง 15 นาที/วัน รับ 50 บาท/วัน
              </p>
              <button
                onClick={() => setShowStoryReader(true)}
                className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
              >
                <Mic className="w-4 h-4 mr-2 inline" />
                เริ่มอ่านนิทาน
              </button>
            </div>
          )}

          {currentUser.role === 'caregiver' && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Baby className="w-5 h-5 mr-2" />
                งานสำหรับผู้ดูแล
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                ดูแลเด็กปฐมวัย รับ 100 บาท/ชั่วโมง (สูงสุด 30 ชั่วโมง/เดือน)
              </p>
              <button
                onClick={() => setShowChildcareTimer(true)}
                className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
              >
                <Timer className="w-4 h-4 mr-2 inline" />
                เริ่มดูแลเด็ก
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              ใช้โควต้าที่ร้านค้า
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              ใช้โควต้า {currentUser.quota - currentUser.usedQuota} บาท ที่ร้านค้าพันธมิตร
            </p>
            <button
              onClick={() => setShowQRScanner(true)}
              className="w-full bg-purple-500 text-white p-3 rounded hover:bg-purple-600"
            >
              <QrCode className="w-4 h-4 mr-2 inline" />
              สแกน QR Code ร้านค้า
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-3">ร้านค้าพันธมิตร</h3>
            <div className="space-y-2">
              {partnerStores.map(store => (
                <div key={store.id} className="flex items-center p-2 bg-gray-50 rounded">
                  <span className="text-2xl mr-3">{store.icon}</span>
                  <div>
                    <p className="font-medium">{store.name}</p>
                    <p className="text-sm text-gray-600">{store.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // History Tab
  const HistoryTab = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ประวัติการทำงาน</h2>
      {currentUser && currentUser.jobHistory.length > 0 ? (
        <div className="space-y-4">
          {currentUser.jobHistory.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">
                    {job.type === 'story_reading' ? 'อ่านนิทาน' : 'ดูแลเด็ก'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {job.story || `${job.parent} - ${job.child}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(job.date).toLocaleDateString('th-TH')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{job.earnings} บาท</p>
                  <p className="text-sm text-gray-500">
                    {job.type === 'story_reading' 
                      ? `${Math.floor(job.duration / 60)} นาที`
                      : `${job.duration} ชั่วโมง`
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Gift className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">ยังไม่มีประวัติการทำงาน</p>
        </div>
      )}
    </div>
  );

  // Profile Tab
  const ProfileTab = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">โปรไฟล์</h2>
      {currentUser ? (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold mb-3">ข้อมูลส่วนตัว</h3>
            <div className="space-y-2">
              <p><strong>ชื่อ:</strong> {currentUser.name}</p>
              <p><strong>อีเมล:</strong> {currentUser.email}</p>
              <p><strong>เบอร์โทร:</strong> {currentUser.phone}</p>
              <p><strong>ประเภท:</strong> {currentUser.role === 'parent' ? 'ผู้ปกครอง' : 'ผู้ดูแลเด็ก'}</p>
              {currentUser.childName && (
                <p><strong>ลูก:</strong> {currentUser.childName} ({currentUser.childAge} ขวบ)</p>
              )}
              {currentUser.experience && (
                <p><strong>ประสบการณ์:</strong> {currentUser.experience}</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold mb-3">สถิติการใช้งาน</h3>
            <div className="space-y-2">
              <p><strong>โควต้าคงเหลือ:</strong> {currentUser.quota - currentUser.usedQuota}/1,500 บาท</p>
              <p><strong>รายได้รวม:</strong> {currentUser.earnings} บาท</p>
              <p><strong>งานที่ทำ:</strong> {currentUser.jobHistory.length} งาน</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setCurrentUser(null);
              setActiveTab('home');
              showNotification('ออกจากระบบแล้ว');
            }}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            ออกจากระบบ
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">กรุณาเข้าสู่ระบบ</p>
          <div className="space-y-2">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              สมัครสมาชิก
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">ฟูมฟัก</h1>
          {/*<p className="text-xs text-gray-500">ดูแลลูกวัยปฐมวัยของพ่อแม่วัยรุ่นที่เป็นเยาวชนนอกระบบการศึกษา</p>*/}
        </div>
        <div className="flex items-center space-x-2">
          {!currentUser ? (
            <>
              <button
                onClick={async () => {
                  const result = await mockAPI.login('parent@example.com', 'password');
                  if (result.success) {
                    setCurrentUser(result.user);
                    showNotification('เข้าสู่ระบบแบบผู้ปกครองสำเร็จ!');
                  }
                }}
                className="bg-pink-500 text-white px-2 py-1 rounded text-xs"
              >
                ผู้ปกครอง
              </button>
              <button
                onClick={async () => {
                  const result = await mockAPI.login('caregiver@example.com', 'password');
                  if (result.success) {
                    setCurrentUser(result.user);
                    showNotification('เข้าสู่ระบบแบบผู้ดูแลสำเร็จ!');
                  }
                }}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs"
              >
                ผู้ดูแล
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="text-blue-500 text-sm"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                สมัครสมาชิก
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm">สวัสดี {currentUser.name}</span>
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                {currentUser.quota - currentUser.usedQuota}฿
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="bg-green-100 text-green-700 p-3 text-center text-sm">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <div className="pb-16">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t">
        <div className="flex">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 p-3 text-center ${
              activeTab === 'home' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <Home className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">หน้าหลัก</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 p-3 text-center ${
              activeTab === 'history' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <History className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">ประวัติ</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 p-3 text-center ${
              activeTab === 'profile' ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <User className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">โปรไฟล์</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showLogin && <LoginModal />}
      {showRegister && <RegisterModal />}
      {showStoryReader && <StoryReaderModal />}
      {showChildcareTimer && <ChildcareTimerModal />}
      {showQRScanner && <QRScannerModal />}
      {showRatingModal && <RatingModal />}
    </div>
  );
};

export default FoomFakApp;