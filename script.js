// ===== Configuration =====
// ให้เปลี่ยนเป็น Web App URL จาก Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6MABQtRYpMTLL1BhCad-U33uRxdGrw2mFiT1MMSUNx5Giap9NlU772Vuo0WkS0Au5/exec';

// ===== State Management =====
let allData = [];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
    updateLastSync();
});

// ===== Event Listeners =====
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    // Form submission
    document.getElementById('add-form').addEventListener('submit', handleAddForm);
    document.getElementById('edit-form').addEventListener('submit', handleEditForm);
    
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', loadData);

    // Edit modal close
    document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
}

// ===== Tab Switching =====
function switchTab(e) {
    const tabName = e.target.dataset.tab;
    
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-300', 'text-gray-700');
    });
    e.target.classList.remove('bg-gray-300', 'text-gray-700');
    e.target.classList.add('bg-blue-600', 'text-white');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`tab-content-${tabName}`).classList.remove('hidden');
}

// ===== Load Data =====
async function loadData() {
    showLoading(true);
    try {
        const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?action=getData`);
        
        if (!response.ok) {
            throw new Error('ไม่สามารถดึงข้อมูลได้');
        }

        const result = await response.json();
        allData = result.data || [];
        
        renderTable();
        showAlert('✅ อัปเดตข้อมูลสำเร็จ', 'success');
        updateLastSync();
    } catch (error) {
        console.error('Error loading data:', error);
        showAlert('❌ เกิดข้อผิดพลาด: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// ===== Render Table =====
function renderTable() {
    const tbody = document.getElementById('data-table');
    
    if (allData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-gray-500">ไม่มีข้อมูล</td></tr>';
        return;
    }

    tbody.innerHTML = allData.map((row, index) => `
        <tr class="border-b hover:bg-gray-100">
            <td class="border px-4 py-2 text-center">${index + 1}</td>
            <td class="border px-4 py-2">${row[0] || ''}</td>
            <td class="border px-4 py-2 text-center">${row[1] || ''}</td>
            <td class="border px-4 py-2">${row[2] || ''}</td>
            <td class="border px-4 py-2 text-center">${row[3] || ''}</td>
            <td class="border px-4 py-2 text-center text-sm text-gray-600">${row[4] || ''}</td>
            <td class="border px-4 py-2 text-center">
                <button onclick="openEditModal(${index})" class="text-blue-600 hover:underline">✏️ แก้ไข</button>
                <button onclick="deleteRow(${index})" class="text-red-600 hover:underline ml-2">🗑️ ลบ</button>
            </td>
        </tr>
    `).join('');
}

// ===== Add Form Handler =====
async function handleAddForm(e) {
    e.preventDefault();

    const formData = {
        action: 'addData',
        item: document.getElementById('risk-item').value,
        level: document.getElementById('risk-level').value,
        control: document.getElementById('control-measure').value,
        status: document.getElementById('status').value,
        date: new Date().toLocaleDateString('th-TH')
    };

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('ไม่สามารถบันทึกข้อมูล');
        }

        showAlert('✅ บันทึกข้อมูลสำเร็จ', 'success');
        document.getElementById('add-form').reset();
        
        // Switch to view tab and reload
        document.getElementById('tab-view').click();
        await loadData();
    } catch (error) {
        console.error('Error adding data:', error);
        showAlert('❌ เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
}

// ===== Edit Modal =====
function openEditModal(index) {
    const row = allData[index];
    document.getElementById('edit-row-index').value = index;
    document.getElementById('edit-risk-item').value = row[0] || '';
    document.getElementById('edit-risk-level').value = row[1] || '';
    document.getElementById('edit-control-measure').value = row[2] || '';
    document.getElementById('edit-status').value = row[3] || '';
    
    document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
    document.getElementById('edit-modal').classList.add('hidden');
}

async function handleEditForm(e) {
    e.preventDefault();

    const index = parseInt(document.getElementById('edit-row-index').value);
    const formData = {
        action: 'updateData',
        index: index,
        item: document.getElementById('edit-risk-item').value,
        level: document.getElementById('edit-risk-level').value,
        control: document.getElementById('edit-control-measure').value,
        status: document.getElementById('edit-status').value
    };

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('ไม่สามารถอัปเดตข้อมูล');
        }

        showAlert('✅ อัปเดตข้อมูลสำเร็จ', 'success');
        closeEditModal();
        await loadData();
    } catch (error) {
        console.error('Error updating data:', error);
        showAlert('❌ เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
}

// ===== Delete Row =====
async function deleteRow(index) {
    if (!confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
        return;
    }

    const formData = {
        action: 'deleteData',
        index: index
    };

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('ไม่สามารถลบข้อมูล');
        }

        showAlert('✅ ลบข้อมูลสำเร็จ', 'success');
        await loadData();
    } catch (error) {
        console.error('Error deleting data:', error);
        showAlert('❌ เกิดข้อผิดพลาด: ' + error.message, 'error');
    }
}

// ===== UI Helpers =====
function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

function showAlert(message, type = 'success') {
    const container = document.getElementById('alert-container');
    const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
    
    const alert = document.createElement('div');
    alert.className = `${bgColor} ${textColor} ${borderColor} border-l-4 p-4 mb-4 rounded`;
    alert.textContent = message;
    
    container.appendChild(alert);
    
    setTimeout(() => alert.remove(), 5000);
}

function updateLastSync() {
    const now = new Date();
    const time = now.toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('last-sync').textContent = `อัปเดตล่าสุด: ${time}`;
}

// ===== Helper for CORS requests =====
// ถ้าพบปัญหา CORS, ให้เพิ่มใน Google Apps Script:
// response.addHeader('Access-Control-Allow-Origin', '*');
// response.addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
// response.addHeader('Access-Control-Allow-Headers', 'Content-Type');
