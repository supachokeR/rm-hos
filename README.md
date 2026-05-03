# 🏥 โปรแกรมบริหารความเสี่ยงในรพ.

ระบบจัดการความเสี่ยงในโรงพยาบาล (Risk Management System) ที่เชื่อมต่อกับ Google Sheet สำหรับจัดเก็บและติดตามข้อมูลความเสี่ยง

## ✨ ฟีเจอร์

- 📊 ดูรายการความเสี่ยงทั้งหมด
- ➕ เพิ่มรายการความเสี่ยงใหม่
- ✏️ แก้ไขรายการ
- 🗑️ ลบรายการ
- 📱 Responsive Design (ใช้ได้บน Desktop และ Mobile)
- 🎨 UI สวยงาม (Tailwind CSS)
- ☁️ Data Sync ผ่าน Google Sheet

## 🚀 Quick Start

### 1. ตั้ง Google Apps Script

1. ไปที่ [Google Sheet ของคุณ](https://docs.google.com/spreadsheets/d/1138zm1JbCyh03NHdtRvutlsYvz0RIvf56dAR3Ptk7jo/)
2. ไปที่ **Extensions** → **Apps Script**
3. ลบ code เดิมทั้งหมด
4. Copy code จาก `apps-script.gs` file นี้ แล้ว paste เข้าไป
5. บันทึก (Ctrl+S)
6. กด **Deploy** → **New Deployment**
   - **Deployment type**: Web App
   - **Execute as**: (Google Account ของคุณ)
   - **Who has access**: Anyone
7. Copy **Deployment URL** ที่ได้

### 2. อัปเดต Script Configuration

เปิด `script.js` และค้นหาบรรทัด:
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercache/v1';
```

เปลี่ยน `YOUR_SCRIPT_ID` เป็น **Deployment URL** ที่ได้จากขั้นตอนที่ 1

### 3. ตั้ง Google Sheet

ในแถวแรก (Header) ของ Sheet ให้เพิ่ม:
| ลำดับที่ | รายการความเสี่ยง | ระดับความเสี่ยง | การควบคุม | สถานะ | วันที่ |
|---------|-----------------|-----------------|----------|--------|--------|

หรือทำได้โดยปล่อยให้ว่างไว้ ระบบจะเพิ่มข้อมูลลงไปโดยอัตโนมัติ

### 4. Deploy บน GitHub Pages

1. Clone repository:
```bash
git clone https://github.com/supachokeR/rm-hos.git
cd rm-hos
```

2. เพิ่มไฟล์ทั้งหมด:
```bash
git add index.html script.js
git commit -m "Add risk management webapp"
git push origin main
```

3. ไปที่ **Settings** → **Pages**
   - Source: main branch / root
   - Save

4. ลิงค์ของเว็บจะอยู่ที่ `https://supachokeR.github.io/rm-hos`

## 📝 การใช้งาน

### ดูข้อมูล
- กด **📊 ดูข้อมูล** tab
- คลิก **🔄 รีโหลด** เพื่ออัปเดตข้อมูลล่าสุด

### เพิ่มรายการใหม่
1. กด **➕ เพิ่มรายการใหม่** tab
2. กรอกข้อมูล:
   - **รายการความเสี่ยง**: อธิบายความเสี่ยง
   - **ระดับความเสี่ยง**: เลือก สูง/กลาง/ต่ำ
   - **การควบคุม**: วิธีการควบคุม
   - **สถานะ**: ดำเนินการแล้ว/กำลังดำเนินการ/ยังไม่ดำเนินการ
3. กด **💾 บันทึก**

### แก้ไขรายการ
1. ที่ tab **📊 ดูข้อมูล**
2. คลิก **✏️ แก้ไข** ที่แถวที่ต้องการ
3. แก้ไขข้อมูล แล้วกด **บันทึก**

### ลบรายการ
1. ที่ tab **📊 ดูข้อมูล**
2. คลิก **🗑️ ลบ** ที่แถวที่ต้องการ
3. ยืนยันการลบ

## 🛠️ Troubleshooting

### ❌ "ไม่สามารถดึงข้อมูลได้"
- ตรวจสอบ **Deployment URL** ใน `script.js`
- ตรวจสอบว่า Google Apps Script ได้ Deploy แล้ว
- ดู **Apps Script** Logs เพื่อหาข้อผิดพลาด

### ❌ "CORS Error"
- ตรวจสอบว่า Google Apps Script มี Access headers
- Deploy ใหม่ด้วย **Anyone** access

### ❌ "ข้อมูลไม่อัปเดต"
- คลิก **🔄 รีโหลด** button
- รีเฟรช (F5) browser
- ตรวจสอบ Google Sheet ว่ามีข้อมูลเข้า

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Browsers

## 📄 File Structure

```
rm-hos/
├── index.html        # หน้าเว็บหลัก
├── script.js         # JavaScript logic
├── apps-script.gs    # Google Apps Script code
└── README.md         # Documentation นี้
```

## 🔐 Security Notes

- ⚠️ URL ของ Google Sheet เป็นข้อมูล private - ไม่ต้องเปิดเผย
- ✅ Google Apps Script สามารถเพิ่ม authentication ได้ (ถ้าจำเป็น)

## 📞 Support

หากมีปัญหา:
1. ตรวจสอบ [GitHub Issues](https://github.com/supachokeR/rm-hos/issues)
2. ดู Google Apps Script Logs
3. ตรวจสอบ Browser Console (F12)

---

**สร้างเมื่อ**: 2026-05-04  
**Version**: 1.0.0
