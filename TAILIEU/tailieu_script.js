// Configuration and Initialization
const SHEET_ID = '1Be_ESe7P7hC42dzqKC6sP2M-IWb_A2x0gMpuhJ5T7rA';
const SHEET_NAME = 'TAI_LIEU';
const API_KEY = 'ce0cef083062eefdbe4e95478d4f88f71a92cfa2'; // Replace with your actual API key
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}`;

// DOM Elements
const documentTable = document.getElementById('documentTableBody');
const documentModal = document.getElementById('documentModal');
const btnAddNew = document.getElementById('btnAddNew');
const closeModalBtn = document.querySelector('.close');
const documentForm = document.getElementById('documentForm');

// Event Listeners
document.addEventListener('DOMContentLoaded', loadDocuments);
btnAddNew.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
documentForm.addEventListener('submit', saveDocument);

// Load Documents from Google Sheets
async function loadDocuments() {
    try {
        const response = await fetch(`${BASE_URL}!A:G?key=${API_KEY}`);
        const data = await response.json();
        
        // Clear existing table rows
        documentTable.innerHTML = '';
        
        // Skip header row
        const documents = data.values.slice(1);
        
        documents.forEach((doc, index) => {
            const [id, tenTaiLieu, moTa, loaiTaiLieu, tieuChuan, phienBan, trangThai] = doc;
            
            const row = `
                <tr data-id="${id}">
                    <td>${id}</td>
                    <td>${tenTaiLieu}</td>
                    <td>${moTa}</td>
                    <td>${loaiTaiLieu}</td>
                    <td>${tieuChuan}</td>
                    <td>${phienBan}</td>
                    <td>${trangThai}</td>
                    <td>
                        <button onclick="editDocument('${id}')" class="btn-edit">Sửa</button>
                        <button onclick="deleteDocument('${id}')" class="btn-delete">Xóa</button>
                    </td>
                </tr>
            `;
            
            documentTable.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Lỗi tải tài liệu:', error);
        alert('Không thể tải danh sách tài liệu.');
    }
}

// Open Add/Edit Modal
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Thêm Tài Liệu Mới';
    documentForm.reset();
    documentModal.style.display = 'block';
}

// Edit Document
async function editDocument(id) {
    try {
        const response = await fetch(`${BASE_URL}!A:G?key=${API_KEY}`);
        const data = await response.json();
        
        const document = data.values.find(doc => doc[0] === id);
        
        if (document) {
            document.forEach((value, index) => {
                const fields = ['documentId', 'tenTaiLieu', 'moTa', 'loaiTaiLieu', 'tieuChuan', 'phienBan', 'trangThai'];
                document.getElementById(fields[index]).value = value;
            });
            
            document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Tài Liệu';
            documentModal.style.display = 'block';
        }
    } catch (error) {
        console.error('Lỗi tải chi tiết tài liệu:', error);
        alert('Không thể tải thông tin tài liệu.');
    }
}

// Save Document
async function saveDocument(event) {
    event.preventDefault();
    
    const id = document.getElementById('documentId').value || generateId();
    const tenTaiLieu = document.getElementById('tenTaiLieu').value;
    const moTa = document.getElementById('moTa').value;
    const loaiTaiLieu = document.getElementById('loaiTaiLieu').value;
    const tieuChuan = document.getElementById('tieuChuan').value;
    const phienBan = document.getElementById('phienBan').value;
    const trangThai = document.getElementById('trangThai').value;
    
    const documentData = [
        id, tenTaiLieu, moTa, loaiTaiLieu, 
        tieuChuan, phienBan, trangThai
    ];
    
    try {
        // Note: This is a simplified example. In a real-world scenario, 
        // you'd need to use Google Sheets API with proper authentication
        const response = await fetch(
            `https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL/exec`, 
            {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    action: id ? 'update' : 'add',
                    sheetName: SHEET_NAME,
                    data: documentData
                })
            }
        );
        
        loadDocuments();
        closeModal();
    } catch (error) {
        console.error('Lỗi lưu tài liệu:', error);
        alert('Không thể lưu tài liệu.');
    }
}

// Delete Document
async function deleteDocument(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    
    try {
        // Note: This is a simplified example. In a real-world scenario, 
        // you'd need to use Google Sheets API with proper authentication
        const response = await fetch(
            `https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL/exec`, 
            {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    action: 'delete',
                    sheetName: SHEET_NAME,
                    id: id
                })
            }
        );
        
        loadDocuments();
    } catch (error) {
        console.error('Lỗi xóa tài liệu:', error);
        alert('Không thể xóa tài liệu.');
    }
}

// Utility Functions
function closeModal() {
    documentModal.style.display = 'none';
}

function generateId() {
    return 'DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Expose functions to global scope for inline event handlers
window.editDocument = editDocument;
window.deleteDocument = deleteDocument;
window.closeModal = closeModal;
