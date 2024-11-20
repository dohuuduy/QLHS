import { sheetsService } from './services/sheetsService.js';
// Khai báo biến toàn cục
let documents = [];
let currentDocumentId = null;

// Khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    // Load dữ liệu ban đầu
    loadDocuments();

    // Thêm event listeners
    document.getElementById('btnAddNew').addEventListener('click', showAddModal);
    document.getElementById('documentForm').addEventListener('submit', handleFormSubmit);
    document.querySelector('.close').addEventListener('click', closeModal);

    // Đóng modal khi click ra ngoài
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('documentModal')) {
            closeModal();
        }
    });
});

// Hàm load dữ liệu từ Google Sheets
async function loadDocuments() {
    try {
        documents = await sheetsService.getAllDocuments();
        renderDocumentTable();
    } catch (error) {
        showNotification('Lỗi khi tải dữ liệu: ' + error.message, 'error');
    }
}

// Hàm render bảng tài liệu
function renderDocumentTable() {
    const tbody = document.getElementById('documentTableBody');
    tbody.innerHTML = '';

    documents.forEach(doc => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${doc.id}</td>
            <td>${doc.ten_tai_lieu}</td>
            <td>${doc.mo_ta}</td>
            <td>${formatLoaiTaiLieu(doc.loai_tai_lieu)}</td>
            <td>${formatTieuChuan(doc.tieu_chuan)}</td>
            <td>${doc.phien_ban_hien_tai}</td>
            <td>
                <span class="status-badge ${doc.trang_thai}">
                    ${formatTrangThai(doc.trang_thai)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="showEditModal('${doc.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="confirmDelete('${doc.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${doc.file_dinh_kem ? `
                        <button class="btn-download" onclick="downloadFile('${doc.id}')">
                            <i class="fas fa-download"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Hàm format các giá trị enum
function formatLoaiTaiLieu(loai) {
    const map = {
        'vanban': 'Văn bản',
        'huongdan': 'Hướng dẫn',
        'baocao': 'Báo cáo'
    };
    return map[loai] || loai;
}

function formatTieuChuan(tieuChuan) {
    const map = {
        'iso': 'ISO',
        'haccp': 'HACCP',
        'gmp': 'GMP'
    };
    return map[tieuChuan] || tieuChuan;
}

function formatTrangThai(trangThai) {
    const map = {
        'hieuluc': 'Hiệu lực',
        'hethieuluc': 'Hết hiệu lực'
    };
    return map[trangThai] || trangThai;
}

// Các hàm xử lý modal
function showModal() {
    document.getElementById('documentModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('documentModal').style.display = 'none';
    resetForm();
}

function showAddModal() {
    currentDocumentId = null;
    document.getElementById('modalTitle').textContent = 'Thêm Tài Liệu Mới';
    showModal();
}

function showEditModal(id) {
    currentDocumentId = id;
    document.getElementById('modalTitle').textContent = 'Sửa Tài Liệu';
    const doc = documents.find(d => d.id === id);
    if (doc) {
        document.getElementById('tenTaiLieu').value = doc.ten_tai_lieu;
        document.getElementById('moTa').value = doc.mo_ta;
        document.getElementById('loaiTaiLieu').value = doc.loai_tai_lieu;
        document.getElementById('tieuChuan').value = doc.tieu_chuan;
        document.getElementById('phienBan').value = doc.phien_ban_hien_tai;
        document.getElementById('trangThai').value = doc.trang_thai;
    }
    showModal();
}

// Reset form
function resetForm() {
    document.getElementById('documentForm').reset();
    currentDocumentId = null;
}

// Hàm tạo ID mới
function generateId() {
    return 'DOC' + Date.now().toString().slice(-6);
}

// Hàm xử lý form submit
async function handleFormSubmit(e) {
    e.preventDefault();

    try {
        const formData = {
            ten_tai_lieu: document.getElementById('tenTaiLieu').value,
            mo_ta: document.getElementById('moTa').value,
            loai_tai_lieu: document.getElementById('loaiTaiLieu').value,
            tieu_chuan: document.getElementById('tieuChuan').value,
            phien_ban_hien_tai: document.getElementById('phienBan').value,
            trang_thai: document.getElementById('trangThai').value,
            ngay_cap_nhat: new Date().toISOString(),
            nguoi_cap_nhat: 'user@example.com' // Sau này sẽ lấy từ thông tin đăng nhập
        };

        const fileInput = document.getElementById('fileDinhKem');
        if (fileInput.files.length > 0) {
            formData.file_dinh_kem = fileInput.files[0].name;
            // Xử lý upload file (sau này sẽ thêm)
        }

        if (currentDocumentId) {
            // Cập nhật tài liệu
            await updateDocument(currentDocumentId, formData);
            showNotification('Cập nhật tài liệu thành công!', 'success');
        } else {
            // Thêm tài liệu mới
            formData.id = generateId();
            formData.ngay_tao = new Date().toISOString();
            formData.nguoi_tao = 'user@example.com'; // Sau này sẽ lấy từ thông tin đăng nhập
            await addDocument(formData);
            showNotification('Thêm tài liệu thành công!', 'success');
        }

        closeModal();
        loadDocuments(); // Tải lại dữ liệu
    } catch (error) {
        showNotification('Có lỗi xảy ra: ' + error.message, 'error');
    }
}

// Hàm thêm tài liệu mới
async function addDocument(document) {
    try {
        await sheetsService.addDocument(document);
        showNotification('Thêm tài liệu thành công!', 'success');
    } catch (error) {
        showNotification('Lỗi khi thêm tài liệu: ' + error.message, 'error');
        throw error;
    }
}

// Hàm cập nhật tài liệu
async function updateDocument(id, document) {
    try {
        await sheetsService.updateDocument(id, document);
        showNotification('Cập nhật tài liệu thành công!', 'success');
    } catch (error) {
        showNotification('Lỗi khi cập nhật tài liệu: ' + error.message, 'error');
        throw error;
    }
}

// Hàm xóa tài liệu
async function deleteDocument(id) {
    try {
        await sheetsService.deleteDocument(id);
        showNotification('Xóa tài liệu thành công!', 'success');
        loadDocuments();
    } catch (error) {
        showNotification('Lỗi khi xóa tài liệu: ' + error.message, 'error');
        throw error;
    }
}

// Hàm xác nhận xóa
function confirmDelete(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
        deleteDocument(id);
    }
}

// Hàm download file
function downloadFile(id) {
    const doc = documents.find(d => d.id === id);
    if (doc && doc.file_dinh_kem) {
        // Giả lập download file
        alert('Tính năng download file sẽ được phát triển sau');
    }
}

// Hàm hiển thị thông báo
function showNotification(message, type = 'info') {
    // Tạo element thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Thêm vào body
    document.body.appendChild(notification);

    // Tự động xóa sau 3 giây
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Hàm validate form
function validateForm() {
    // Thêm logic validate form sau này
    return true;
}
