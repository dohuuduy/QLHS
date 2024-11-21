// Cấu hình kết nối Google Sheet
const SHEET_ID = '1Be_ESe7P7hC42dzqKC6sP2M-IWb_A2x0gMpuhJ5T7rA';
const SHEET_NAME = 'TAI_LIEU';

// Sử dụng Google Apps Script Web App để giao tiếp
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxamYXv5nQ4lXDpG0soPB7u8kgl5ZoWFFX8PE9pp1AXzCC33saQL9uyfJgmGdx361Jp/exec'; // Bạn sẽ thay thế URL thực

// Khởi tạo các phần tử DOM
const documentTable = document.getElementById('documentTableBody');
const documentModal = document.getElementById('documentModal');
const btnAddNew = document.getElementById('btnAddNew');
const closeModalBtn = document.querySelector('.close');
const documentForm = document.getElementById('documentForm');

// Sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', loadDocuments);

// Sự kiện nút Thêm mới
btnAddNew.addEventListener('click', openAddModal);

// Sự kiện đóng modal
closeModalBtn.addEventListener('click', closeModal);

// Sự kiện submit form
documentForm.addEventListener('submit', saveDocument);

// Hàm load danh sách tài liệu từ Google Sheet
async function loadDocuments() {
    try {
        const response = await fetch(`${WEB_APP_URL}?action=get&sheetName=${SHEET_NAME}`);
        const data = await response.json();

        // Xóa dữ liệu cũ
        documentTable.innerHTML = '';

        // Render dữ liệu mới
        data.forEach(doc => {
            const row = `
                <tr data-id="${doc.id}">
                    <td>${doc.id}</td>
                    <td>${doc.ten_tai_lieu}</td>
                    <td>${doc.mo_ta}</td>
                    <td>${doc.loai_tai_lieu}</td>
                    <td>${doc.tieu_chuan}</td>
                    <td>${doc.phien_ban_hien_tai}</td>
                    <td>${doc.trang_thai}</td>
                    <td>
                        <button onclick="editDocument('${doc.id}')" class="btn-edit">Sửa</button>
                        <button onclick="deleteDocument('${doc.id}')" class="btn-delete">Xóa</button>
                    </td>
                </tr>
            `;
            documentTable.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Lỗi tải danh sách tài liệu:', error);
        alert('Không thể tải danh sách tài liệu');
    }
}

// Mở modal thêm mới
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Thêm Tài Liệu Mới';
    documentForm.reset();
    documentModal.style.display = 'block';
}

// Hàm chỉnh sửa tài liệu
async function editDocument(id) {
    try {
        const response = await fetch(`${WEB_APP_URL}?action=getById&sheetName=${SHEET_NAME}&id=${id}`);
        const doc = await response.json();

        // Điền dữ liệu vào form
        document.getElementById('documentId').value = doc.id;
        document.getElementById('tenTaiLieu').value = doc.ten_tai_lieu;
        document.getElementById('moTa').value = doc.mo_ta;
        document.getElementById('loaiTaiLieu').value = doc.loai_tai_lieu;
        document.getElementById('tieuChuan').value = doc.tieu_chuan;
        document.getElementById('phienBan').value = doc.phien_ban_hien_tai;
        document.getElementById('trangThai').value = doc.trang_thai;

        document.getElementById('modalTitle').textContent = 'Chỉnh Sửa Tài Liệu';
        documentModal.style.display = 'block';
    } catch (error) {
        console.error('Lỗi tải chi tiết tài liệu:', error);
        alert('Không thể tải thông tin tài liệu');
    }
}

// Lưu tài liệu
async function saveDocument(event) {
    event.preventDefault();

    const documentData = {
        id: document.getElementById('documentId').value || generateId(),
        ten_tai_lieu: document.getElementById('tenTaiLieu').value,
        mo_ta: document.getElementById('moTa').value,
        loai_tai_lieu: document.getElementById('loaiTaiLieu').value,
        tieu_chuan: document.getElementById('tieuChuan').value,
        phien_ban_hien_tai: document.getElementById('phienBan').value,
        trang_thai: document.getElementById('trangThai').value,
        nguoi_tao: 'Người dùng hiện tại', // Bạn có thể thay đổi
        ngay_tao: new Date().toISOString(),
        nguoi_cap_nhat: 'Người dùng hiện tại', // Bạn có thể thay đổi
        ngay_cap_nhat: new Date().toISOString()
    };

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                action: documentData.id ? 'update' : 'add',
                sheetName: SHEET_NAME,
                data: documentData
            })
        });

        loadDocuments();
        closeModal();
    } catch (error) {
        console.error('Lỗi lưu tài liệu:', error);
        alert('Không thể lưu tài liệu');
    }
}

// Xóa tài liệu
async function deleteDocument(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;

    try {
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({
                action: 'delete',
                sheetName: SHEET_NAME,
                id: id
            })
        });

        loadDocuments();
    } catch (error) {
        console.error('Lỗi xóa tài liệu:', error);
        alert('Không thể xóa tài liệu');
    }
}

// Đóng modal
function closeModal() {
    documentModal.style.display = 'none';
}

// Sinh ID ngẫu nhiên
function generateId() {
    return 'DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Expose functions to global scope
window.editDocument = editDocument;
window.deleteDocument = deleteDocument;
window.closeModal = closeModal;
