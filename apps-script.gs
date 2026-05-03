// ===== Google Apps Script Code =====
// วิธีใช้:
// 1. ไปที่ Google Sheet ของคุณ: https://docs.google.com/spreadsheets/d/1138zm1JbCyh03NHdtRvutlsYvz0RIvf56dAR3Ptk7jo/
// 2. ไปที่ Extensions → Apps Script
// 3. ลบ code เดิม และ paste code นี้ทั้งหมด
// 4. บันทึกแล้วกด Deploy > New Deployment > Web App
// 5. ตั้ง Execute as: (Google Account ของคุณ)
// 6. ตั้ง Who has access: Anyone
// 7. Copy Deployment URL และ paste ใน script.js ที่บรรทัด GOOGLE_APPS_SCRIPT_URL

const SHEET_NAME = 'Sheet1'; // เปลี่ยนชื่อ sheet ถ้าต้อง

// ===== Handle GET Request (Read Data) =====
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    if (e.parameter.action === 'getData') {
      return getSheetData(sheet);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'API Ready'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return sendError(error.toString());
  }
}

// ===== Handle POST Request (Write Data) =====
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    switch(data.action) {
      case 'addData':
        return addRow(sheet, data);
      case 'updateData':
        return updateRow(sheet, data);
      case 'deleteData':
        return deleteRow(sheet, data);
      default:
        return sendError('Unknown action: ' + data.action);
    }
  } catch (error) {
    return sendError(error.toString());
  }
}

// ===== Get Sheet Data =====
function getSheetData(sheet) {
  try {
    const data = sheet.getDataRange().getValues();
    
    // Remove header row
    const rows = data.slice(1);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: rows,
        count: rows.length
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader('Access-Control-Allow-Origin', '*')
      .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .addHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (error) {
    return sendError(error.toString());
  }
}

// ===== Add Row =====
function addRow(sheet, data) {
  try {
    sheet.appendRow([
      data.item || '',
      data.level || '',
      data.control || '',
      data.status || '',
      data.date || new Date().toLocaleDateString('th-TH')
    ]);
    
    return sendSuccess('บันทึกข้อมูลสำเร็จ');
  } catch (error) {
    return sendError(error.toString());
  }
}

// ===== Update Row =====
function updateRow(sheet, data) {
  try {
    const rowIndex = parseInt(data.index) + 2; // +2 because arrays are 0-indexed and row 1 is header
    
    sheet.getRange(rowIndex, 1).setValue(data.item || '');
    sheet.getRange(rowIndex, 2).setValue(data.level || '');
    sheet.getRange(rowIndex, 3).setValue(data.control || '');
    sheet.getRange(rowIndex, 4).setValue(data.status || '');
    
    return sendSuccess('อัปเดตข้อมูลสำเร็จ');
  } catch (error) {
    return sendError(error.toString());
  }
}

// ===== Delete Row =====
function deleteRow(sheet, data) {
  try {
    const rowIndex = parseInt(data.index) + 2; // +2 because arrays are 0-indexed and row 1 is header
    sheet.deleteRow(rowIndex);
    
    return sendSuccess('ลบข้อมูลสำเร็จ');
  } catch (error) {
    return sendError(error.toString());
  }
}

// ===== Helper Functions =====
function sendSuccess(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: message
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*');
}

function sendError(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: message
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*');
}
