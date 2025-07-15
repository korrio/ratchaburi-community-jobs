# ราชบุรีงานชุมชน - Community Job Matching Platform

## เกี่ยวกับโปรเจ็คนี้

"ราชบุรีงานชุมชน" เป็นแพลตฟอร์มที่ออกแบบมาเพื่อเชื่อมต่อผู้ให้บริการท้องถิ่นกับผู้ที่ต้องการจ้างงานในชุมชนจังหวัดราชบุรี โดยมีเป้าหมายในการสร้างโอกาสการจ้างงานในชุมชน และช่วยให้ประชาชนสามารถเข้าถึงบริการต่างๆ ได้สะดวกยิ่งขึ้น

## คุณสมบัติหลัก

- **การจับคู่งานแบบ 2 ช่องทาง**: ใช้งานได้ทั้งผ่าน Web Application และ LINE Chatbot
- **ระบบค้นหาผู้ให้บริการ**: ค้นหาตามประเภทงาน พื้นที่ หรือชื่อ
- **ระบบค้นหางาน**: ค้นหางานที่มีคนต้องการจ้างในชุมชน
- **การจับคู่งานอัตโนมัติ**: ระบบอัจฉริยะที่จับคู่ผู้ให้บริการกับงานที่เข้ากันได้
- **ระบบลงทะเบียน**: สำหรับผู้ให้บริการและผู้ต้องการจ้างงาน
- **ระบบแจ้งเตือน**: แจ้งเตือนเมื่อมีการจับคู่งานหรือมีข้อความใหม่

## สถาปัตยกรรมระบบ

โปรเจ็คนี้ประกอบด้วยส่วนประกอบหลัก 4 ส่วน:

1. **Web Application** (Frontend)
   - สร้างด้วย NextJS และ Tailwind CSS
   - รองรับการแสดงผลบนอุปกรณ์ทุกขนาด (Responsive Design)
   - ให้ประสบการณ์ผู้ใช้งานที่เรียบง่ายและใช้งานง่าย

2. **LINE Chatbot**
   - สร้างด้วย Node.js และ LINE Messaging API
   - มี Rich Menu และ Quick Reply สำหรับการนำทางที่สะดวก
   - รองรับการโต้ตอบอัตโนมัติและขั้นตอนการลงทะเบียนแบบ Step-by-Step

3. **Backend API**
   - พัฒนาด้วย Express.js (Node.js)
   - ให้บริการ RESTful API สำหรับทั้ง Web Application และ LINE Chatbot
   - มีระบบความปลอดภัยด้วย JWT Authentication

4. **ฐานข้อมูล**
   - ใช้ SQLite เป็นฐานข้อมูลหลัก
   - มีโครงสร้างข้อมูลที่มีประสิทธิภาพและใช้งานง่าย

## ขั้นตอนการติดตั้ง

### ข้อกำหนดเบื้องต้น

- Node.js (v14 หรือสูงกว่า)
- SQLite (v3 หรือสูงกว่า)
- LINE Developer Account (สำหรับการพัฒนา LINE Chatbot)

### ติดตั้ง Backend API

```bash
# โคลนโปรเจ็ค
git clone https://github.com/your-username/ratchaburi-community-jobs.git
cd ratchaburi-community-jobs/backend

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env
cp .env.example .env

# แก้ไขไฟล์ .env และกำหนดค่าตามที่ต้องการ
# เช่น SQLITE_PATH, JWT_SECRET, LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET

# เริ่มต้นการทำงานของ server
npm start
```

### ติดตั้ง Web Application

```bash
# ไปยังโฟลเดอร์ web-app
cd ../web-app

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env.local
cp .env.example .env.local

# แก้ไขไฟล์ .env.local และกำหนดค่า API_URL

# เริ่มต้นการทำงานในโหมดพัฒนา
npm run dev

# หรือสร้าง production build
npm run build
```

### ติดตั้ง LINE Chatbot

```bash
# ไปยังโฟลเดอร์ line-bot
cd ../line-bot

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env
cp .env.example .env

# แก้ไขไฟล์ .env และกำหนดค่า LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET, API_URL

# เริ่มต้นการทำงานของ bot
npm start
```

## การนำเข้าข้อมูลเริ่มต้น

หลังจากติดตั้ง Backend API แล้ว คุณสามารถนำเข้าข้อมูลเริ่มต้นได้ดังนี้:

```bash
# เรียกใช้ API เพื่อนำเข้าข้อมูลเริ่มต้น
curl -X POST http://localhost:5000/api/seed
```

หรือเปิด URL ต่อไปนี้ในเบราว์เซอร์:

```
http://localhost:5000/api/seed
```

## การใช้งาน

### Web Application

1. เปิดเบราว์เซอร์และไปที่ `http://localhost:3000`
2. ผู้ใช้สามารถเลือกดูรายชื่อผู้ให้บริการ, ผู้รับบริการ, หรือการจับคู่งานอัตโนมัติได้
3. สามารถค้นหาและกรองข้อมูลตามความต้องการ
4. ลงทะเบียนเป็นผู้ให้บริการหรือผู้รับบริการได้

### LINE Chatbot

1. เพิ่มเพื่อนกับ LINE Bot ผ่าน QR Code หรือ LINE ID
2. ใช้คำสั่งพื้นฐาน เช่น "ค้นหาผู้ให้บริการ", "ค้นหางาน", "จับคู่งาน"
3. ลงทะเบียนผ่าน LINE โดยพิมพ์ "ลงทะเบียนผู้ให้บริการ" หรือ "ลงทะเบียนงาน"
4. ใช้งานผ่าน Rich Menu ที่ปรากฏด้านล่างของหน้าแชท

## API Documentation

รายละเอียด API ทั้งหมดสามารถดูได้ที่:

```
http://localhost:5000/api-docs
```

หรือดูรายการ endpoints ที่สำคัญได้ด้านล่าง:

### Service Providers

- `GET /api/providers` - ดึงรายชื่อผู้ให้บริการทั้งหมด
- `GET /api/providers/:id` - ดึงข้อมูลผู้ให้บริการตาม ID
- `POST /api/providers` - เพิ่มผู้ให้บริการใหม่
- `PUT /api/providers/:id` - อัปเดตข้อมูลผู้ให้บริการ
- `DELETE /api/providers/:id` - ลบผู้ให้บริการ

### Customers

- `GET /api/customers` - ดึงรายชื่อผู้รับบริการทั้งหมด
- `GET /api/customers/:id` - ดึงข้อมูลผู้รับบริการตาม ID
- `POST /api/customers` - เพิ่มผู้รับบริการใหม่
- `PUT /api/customers/:id` - อัปเดตข้อมูลผู้รับบริการ
- `DELETE /api/customers/:id` - ลบผู้รับบริการ

### Job Matching

- `GET /api/matches` - ดึงรายการการจับคู่งานทั้งหมด
- `GET /api/auto-matches` - ดึงการจับคู่งานอัตโนมัติ
- `POST /api/matches` - สร้างการจับคู่งานใหม่
- `PUT /api/matches/:id/status` - อัปเดตสถานะการจับคู่งาน

## การขยายในอนาคต

- **ระบบการชำระเงิน**: เพิ่มการชำระเงินผ่านแพลตฟอร์ม
- **ระบบการให้คะแนนและรีวิว**: ให้ผู้ใช้สามารถให้คะแนนและรีวิวหลังใช้บริการ
- **ระบบติดตามสถานะงาน**: ติดตามความคืบหน้าของงานแบบ Real-time
- **ขยายพื้นที่การให้บริการ**: ขยายไปยังจังหวัดอื่นๆ
- **แอปพลิเคชันมือถือ**: พัฒนาแอปพลิเคชันสำหรับ iOS และ Android

## การมีส่วนร่วมในโปรเจ็ค

เรายินดีรับการมีส่วนร่วมจากทุกท่าน! หากคุณต้องการมีส่วนร่วม:

1. Fork โปรเจ็คนี้
2. สร้าง branch ใหม่ (`git checkout -b feature/your-feature-name`)
3. Commit การเปลี่ยนแปลงของคุณ (`git commit -m 'Add some feature'`)
4. Push ไปยัง branch (`git push origin feature/your-feature-name`)
5. สร้าง Pull Request ใหม่

## โครงสร้างไฟล์โปรเจ็ค

```
ratchaburi-community-jobs/
├── backend/                 # Backend API (Express.js)
│   ├── data/                # โฟลเดอร์เก็บฐานข้อมูล SQLite
│   ├── routes/              # API Routes
│   ├── models/              # โมเดลข้อมูล
│   ├── controllers/         # ตัวควบคุม API
│   ├── middleware/          # Middleware
│   ├── utils/               # Utility functions
│   ├── .env.example         # ตัวอย่างไฟล์ .env
│   ├── package.json         # Dependencies
│   └── server.js            # Entry point
│
├── web-app/                 # Web Application (NextJS)
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── pages/           # NextJS pages
│   │   ├── styles/          # CSS/Tailwind styles
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   └── utils/           # Utility functions
│   ├── .env.example         # ตัวอย่างไฟล์ .env.local
│   └── package.json         # Dependencies
│
└── line-bot/                # LINE Chatbot
    ├── handlers/            # Message handlers
    ├── templates/           # LINE message templates
    ├── utils/               # Utility functions
    ├── .env.example         # ตัวอย่างไฟล์ .env
    ├── package.json         # Dependencies
    └── app.js               # Entry point
```

## ทีมงาน

โปรเจ็คนี้พัฒนาโดยทีมงานศูนย์จัดการแรงงานระดับพื้นที่ตำบลแพงพวย อำเภอดำเนินสะดวก จังหวัดราชบุรี

## ลิขสิทธิ์

โปรเจ็คนี้เผยแพร่ภายใต้ลิขสิทธิ์ MIT License - ดูรายละเอียดเพิ่มเติมในไฟล์ [LICENSE](LICENSE)

## ข้อมูลติดต่อ

หากมีข้อสงสัยหรือต้องการความช่วยเหลือเพิ่มเติม สามารถติดต่อได้ที่:

- **อีเมล**: support@ratchaburicommunity.co.th
- **โทรศัพท์**: 0X-XXX-XXXX
- **LINE Official Account**: @ratchaburi_community
- **ที่อยู่**: ศูนย์จัดการแรงงานระดับพื้นที่ตำบลแพงพวย อำเภอดำเนินสะดวก จังหวัดราชบุรี

## คำถามที่พบบ่อย

**Q: ฐานข้อมูล SQLite สามารถเก็บข้อมูลได้มากแค่ไหน?**  
A: SQLite สามารถรองรับขนาดฐานข้อมูลได้ถึง 281 TB ทางทฤษฎี แต่ในทางปฏิบัติแนะนำให้ใช้กับข้อมูลขนาดไม่เกินหลายร้อย MB เพื่อประสิทธิภาพที่ดี

**Q: ระบบรองรับการใช้งานพร้อมกันได้กี่คน?**  
A: ระบบสามารถรองรับการใช้งานพร้อมกันได้หลายร้อยคน ขึ้นอยู่กับความสามารถของเซิร์ฟเวอร์ที่ใช้

**Q: มีค่าใช้จ่ายในการใช้งาน LINE Messaging API หรือไม่?**  
A: LINE Messaging API มีโควต้าการใช้งานฟรี 1,000 ข้อความต่อเดือน หากต้องการส่งข้อความมากกว่านี้ต้องสมัครแพ็กเกจเพิ่มเติม

**Q: ระบบรองรับภาษาอื่นนอกจากภาษาไทยหรือไม่?**  
A: ปัจจุบันระบบรองรับเฉพาะภาษาไทย แต่สามารถพัฒนาเพิ่มเติมเพื่อรองรับภาษาอื่นได้