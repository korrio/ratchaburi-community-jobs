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

### Quick Start (แนะนำ)

```bash
# โคลนโปรเจ็ค
git clone https://github.com/korrio/ratchaburi-community-jobs.git
cd ratchaburi-community-jobs

# รันสคริปต์เริ่มต้น
./start.sh
```

หรือใช้คำสั่ง npm:

```bash
# ติดตั้ง dependencies ทั้งหมด
npm run setup

# เริ่มต้นทุกบริการในโหมดพัฒนา
npm run dev
```

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
├── line-bot/                # LINE Chatbot
│   ├── handlers/            # Message handlers
│   ├── templates/           # LINE message templates
│   ├── utils/               # Utility functions
│   ├── .env.example         # ตัวอย่างไฟล์ .env
│   ├── package.json         # Dependencies
│   └── app.js               # Entry point
│
├── CLAUDE.md                # Project documentation
└── README.md                # This file
```

## การพัฒนาและการทดสอบ

### การเริ่มต้น Development Environment

```bash
# Terminal 1: Start Backend API
cd backend
npm run dev

# Terminal 2: Start Web Application
cd web-app
npm run dev

# Terminal 3: Start LINE Bot
cd line-bot
npm run dev
```

### การทดสอบ

```bash
# ทดสอบ Backend API
cd backend
npm test

# ทดสอบ Web Application
cd web-app
npm test

# ทดสอบ LINE Bot
cd line-bot
npm test
```

## การ Deploy

### Backend API

```bash
cd backend
npm run build
npm start
```

### Web Application

```bash
cd web-app
npm run build
npm start
```

### LINE Bot

```bash
cd line-bot
npm start
```

## ตัวแปร Environment

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
SQLITE_PATH=./data/database.db
JWT_SECRET=your-secret-key
LINE_CHANNEL_ACCESS_TOKEN=your-token
LINE_CHANNEL_SECRET=your-secret
```

### Web App (.env.local)

```env
API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=ราชบุรีงานชุมชน
```

### LINE Bot (.env)

```env
PORT=4000
LINE_CHANNEL_ACCESS_TOKEN=your-token
LINE_CHANNEL_SECRET=your-secret
API_URL=http://localhost:5000
```

## การแก้ไขปัญหาเบื้องต้น

### ปัญหาที่พบบ่อย

1. **ไม่สามารถเชื่อมต่อฐานข้อมูลได้**
   - ตรวจสอบว่าโฟลเดอร์ `data` ได้ถูกสร้างขึ้นแล้ว
   - ตรวจสอบสิทธิ์การเขียนไฟล์

2. **API ไม่ตอบสนอง**
   - ตรวจสอบว่า Backend server ทำงานอยู่ที่ port 5000
   - ตรวจสอบ firewall และการตั้งค่าเครือข่าย

3. **LINE Bot ไม่ตอบสนอง**
   - ตรวจสอบ LINE Channel Access Token และ Channel Secret
   - ตรวจสอบ Webhook URL ในการตั้งค่า LINE Developer Console

### Logs และ Debugging

```bash
# ดู logs ของ Backend API
cd backend
npm run dev

# ดู logs ของ LINE Bot
cd line-bot
npm run dev
```

## การมีส่วนร่วมในโปรเจ็ค

เรายินดีรับการมีส่วนร่วมจากทุกท่าน! หากคุณต้องการมีส่วนร่วม:

1. Fork โปรเจ็คนี้
2. สร้าง branch ใหม่ (`git checkout -b feature/your-feature-name`)
3. Commit การเปลี่ยนแปลงของคุณ (`git commit -m 'Add some feature'`)
4. Push ไปยัง branch (`git push origin feature/your-feature-name`)
5. สร้าง Pull Request ใหม่

## ลิขสิทธิ์

โปรเจ็คนี้เผยแพร่ภายใต้ลิขสิทธิ์ MIT License

## ข้อมูลติดต่อ

หากมีข้อสงสัยหรือต้องการความช่วยเหลือเพิ่มเติม สามารถติดต่อได้ที่:

- **อีเมล**: support@ratchaburicommunity.co.th
- **โทรศัพท์**: 0X-XXX-XXXX
- **LINE Official Account**: @ratchaburi_community
- **ที่อยู่**: ศูนย์จัดการแรงงานระดับพื้นที่ตำบลแพงพวย อำเภอดำเนินสะดวก จังหวัดราชบุรี

---

**ราชบุรีงานชุมชน** - เชื่อมต่อคนในชุมชน สร้างโอกาสการจ้างงานที่ดีขึ้น