// Cấu hình kết nối Google Sheet
const SHEET_ID = '1Be_ESe7P7hC42dzqKC6sP2M-IWb_A2x0gMpuhJ5T7rA';
const SHEET_NAME = 'TAI_LIEU';
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxjCqDIZ4R8FCi0enOB1LfLttnesqBNLeEAawOQpwsMDFyiNAdgDHvLdTwOE8_Xh4QJ/exec';

// Hàm gọi API với xử lý CORS
async function callAPI(method, action, data = null) {
    try {
        const url = new URL(WEB_APP_URL);
        
        const fetchOptions = {
            method: method,
            mode: 'cors', // Thay đổi từ no-cors sang cors
            headers: {
                'Content-Type': 'application/json',
            }
        };

        // Xử lý GET request
        if (method === 'GET') {
            url.searchParams.append('action', action);
            url.searchParams.append('sheetName', SHEET_NAME);
            if (data) {
                Object.keys(data).forEach(key => {
                    url.searchParams.append(key, data[key]);
                });
            }
        }

        // Xử lý POST request
        if (method === 'POST' && data) {
            fetchOptions.body = JSON.stringify({
                action: action,
                sheetName: SHEET_NAME,
                data: data
            });
        }

        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Hàm load documents
async function loadDocuments() {
    try {
        const response = await callAPI('GET', 'get');
        
        if (!response || response.status === 'error') {
            throw new Error(response?.message || 'Failed to load documents');
        }

        const documentTableBody = document.getElementById('documentTableBody');
        documentTableBody.innerHTML = '';

        const documents = response.data || [];
        
        documents.forEach(doc => {
            const row = `
                <tr data-id="${doc.id}">
                    <td>${doc.id}</td>
                    <td>${doc.ten_tai_lieu || ''}</td>
                    <td>${doc.mo_ta || ''}</td>
                    <td>${formatLoaiTaiLieu(doc.loai_tai_lieu)}</td>
                    <td>${formatTieuChuan(doc.tieu_chuan)}</td>
                    <td>${doc.phien_ban_hien_tai || ''}</td>
                    <td>${formatTrangThai(doc.trang_thai)}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button onclick="viewDocument('${doc.id}')" class="btn btn-sm btn-info btn-action">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button onclick="editDocument('${doc.id}')" class="btn btn-sm btn-warning btn-action">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteDocument('${doc.id}')" class="btn btn-sm btn-danger btn-action">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            documentTableBody.insertAdjacentHTML('beforeend', row);
        });

        // Khởi tạo DataTable
        if ($.fn.DataTable.isDataTable('#documentTable')) {
            $('#documentTable').DataTable().destroy();
        }
        
        $('#documentTable').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/vi.json'
            },
            responsive: true,
            order: [[0, 'desc']]
        });

    } catch (error) {
        console.error('Error loading documents:', error);
        showAlert('Lỗi', `Không thể tải danh sách tài liệu: ${error.message}`, 'danger');
    }
}

// Hàm lưu document
async function saveDocument(modal) {
    try {
        const documentData = {
            id: document.getElementById('documentId').value || generateId(),
            ten_tai_lieu: document.getElementById('tenTaiLieu').value,
            mo_ta: document.getElementById('moTa').value,
            loai_tai_lieu: document.getElementById('loaiTaiLieu').value,
            tieu_chuan: document.getElementById('tieuChuan').value,
            phien_ban_hien_tai: document.getElementById('phienBan').value,
            trang_thai: document.getElementById('trangThai').value,
            nguoi_tao: 'User',
            ngay_tao: new Date().toISOString(),
            nguoi_cap_nhat: 'User',
            ngay_cap_nhat: new Date().toISOString()
        };

        const action = documentData.id ? 'update' : 'add';
        const response = await callAPI('POST', action, documentData);
        
        if (response.status === 'error') {
            throw new Error(response.message);
        }

        showAlert('Thành Công', 'Tài liệu đã được lưu', 'success');
        modal.hide();
        await loadDocuments();
    } catch (error) {
        console.error('Save error:', error);
        showAlert('Lỗi', `Không thể lưu tài liệu: ${error.message}`, 'danger');
    }
}

// Hàm format dữ liệu
function formatLoaiTaiLieu(loai) {
    const map = {
        'vanban': 'Văn Bản',
        'huongdan': 'Hướng Dẫn',
        'baocao': 'Báo Cáo'
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
        'hieuluc': 'Hiệu Lực',
        'hethieuluc': 'Hết Hiệu Lực'
    };
    return map[trangThai] || trangThai;
}

// Hàm tạo ID mới
function generateId() {
    return 'TL_' + Date.now().toString().slice(-6);
}

// Hàm hiển thị thông báo
function showAlert(title, message, type) {
    // Implement your alert UI here
    alert(`${title}: ${message}`);
}

// Khai báo biến toàn cục
let documentModal;
let documentDataTable;

// Hàm khởi tạo khi trang được load
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo modal
    documentModal = new bootstrap.Modal(document.getElementById('documentModal'));
    
    // Khởi tạo sự kiện cho nút thêm mới
    document.getElementById('btnAddNew').addEventListener('click', function() {
        resetForm();
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-file-medical me-2"></i>Thêm Tài Liệu Mới';
        documentModal.show();
    });

    // Khởi tạo sự kiện submit form
    document.getElementById('documentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDocument(documentModal);
    });

    // Load dữ liệu ban đầu
    loadDocuments();
});

// Hàm reset form
function resetForm() {
    document.getElementById('documentId').value = '';
    document.getElementById('tenTaiLieu').value = '';
    document.getElementById('moTa').value = '';
    document.getElementById('loaiTaiLieu').value = '';
    document.getElementById('tieuChuan').value = '';
    document.getElementById('phienBan').value = '';
    document.getElementById('trangThai').value = 'hieuluc';
    document.getElementById('fileDinhKem').value = '';
}

// Hàm xem chi tiết tài liệu
async function viewDocument(id) {
    try {
        const response = await callAPI('GET', 'getById', { id: id });
        if (response.status === 'success' && response.data) {
            // Hiển thị dữ liệu vào form
            fillFormData(response.data);
            // Disable tất cả các trường
            Array.from(document.getElementById('documentForm').elements).forEach(element => {
                element.disabled = true;
            });
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-eye me-2"></i>Xem Chi Tiết Tài Liệu';
            documentModal.show();
        } else {
            showAlert('Lỗi', 'Không tìm thấy tài liệu', 'error');
        }
    } catch (error) {
        console.error('Error viewing document:', error);
        showAlert('Lỗi', `Không thể xem tài liệu: ${error.message}`, 'error');
    }
}
// Hàm sửa tài liệu
async function editDocument(id) {
    try {
        const response = await callAPI('GET', 'getById', { id: id });
        if (response.status === 'success' && response.data) {
            // Hiển thị dữ liệu vào form
            fillFormData(response.data);
            // Enable tất cả các trường
            Array.from(document.getElementById('documentForm').elements).forEach(element => {
                element.disabled = false;
            });
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Sửa Tài Liệu';
            documentModal.show();
        } else {
            showAlert('Lỗi', 'Không tìm thấy tài liệu', 'error');
        }
    } catch (error) {
        console.error('Error editing document:', error);
        showAlert('Lỗi', `Không thể sửa tài liệu: ${error.message}`, 'error');
    }
}

// Hàm xóa tài liệu
async function deleteDocument(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
        try {
            const response = await callAPI('POST', 'delete', { id: id });
            if (response.status === 'success') {
                showAlert('Thành công', 'Đã xóa tài liệu', 'success');
                await loadDocuments();
            } else {
                showAlert('Lỗi', response.message || 'Không thể xóa tài liệu', 'error');
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            showAlert('Lỗi', `Không thể xóa tài liệu: ${error.message}`, 'error');
        }
    }
}

// Hàm điền dữ liệu vào form
function fillFormData(data) {
    document.getElementById('documentId').value = data.id || '';
    document.getElementById('tenTaiLieu').value = data.ten_tai_lieu || '';
    document.getElementById('moTa').value = data.mo_ta || '';
    document.getElementById('loaiTaiLieu').value = data.loai_tai_lieu || '';
    document.getElementById('tieuChuan').value = data.tieu_chuan || '';
    document.getElementById('phienBan').value = data.phien_ban_hien_tai || '';
    document.getElementById('trangThai').value = data.trang_thai || 'hieuluc';
}

// Hàm hiển thị thông báo đẹp hơn
function showAlert(title, message, type) {
    // Tạo element alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        <strong>${title}</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Thêm vào đầu trang
    const container = document.querySelector('.container-fluid');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Hàm format ngày giờ
function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
}
