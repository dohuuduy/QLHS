// Cấu hình kết nối Google Sheet
const SHEET_ID = '1Be_ESe7P7hC42dzqKC6sP2M-IWb_A2x0gMpuhJ5T7rA';
const SHEET_NAME = 'TAI_LIEU';

// Sử dụng Google Apps Script Web App để giao tiếp
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxeh8RcGlVSVQXai3QutU1a-6s5tV2ll-XCAyKSGY_xU5eGx5NZJsyr2DdaaPH9chIO/exec'; // Bạn sẽ thay thế URL thực

// Khởi tạo DataTable
let documentDataTable;

// Sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo modal Bootstrap
    const documentModal = new bootstrap.Modal(document.getElementById('documentModal'));

    // Nút thêm mới
    document.getElementById('btnAddNew').addEventListener('click', function() {
        openAddModal(documentModal);
    });

    // Submit form
    document.getElementById('documentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        saveDocument(documentModal);
    });

    // Load danh sách tài liệu
    loadDocuments();
});

// Hàm load danh sách tài liệu từ Google Sheet
async function loadDocuments() {
    try {
        console.log('Full URL:', `${WEB_APP_URL}?action=get&sheetName=${SHEET_NAME}`);
        
        const response = await fetch(`${WEB_APP_URL}?action=get&sheetName=${SHEET_NAME}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response Status:', response.status);
        
        // In ra toàn bộ nội dung phản hồi
        const responseText = await response.text();
        console.log('Raw Response:', responseText);

        // Thử parse JSON
        const data = JSON.parse(responseText);
        console.log('Parsed Data:', data);

        // Phần code còn lại giữ nguyên
        if (documentDataTable) {
            documentDataTable.destroy();
        }

        const documentTableBody = document.getElementById('documentTableBody');
        documentTableBody.innerHTML = '';

        data.forEach(doc => {
            const row = `
                <tr data-id="${doc.id}">
                    <td>${doc.id}</td>
                    <td>${doc.ten_tai_lieu}</td>
                    <td>${doc.mo_ta || ''}</td>
                    <td>${formatLoaiTaiLieu(doc.loai_tai_lieu)}</td>
                    <td>${formatTieuChuan(doc.tieu_chuan)}</td>
                    <td>${doc.phien_ban_hien_tai}</td>
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

        documentDataTable = $('#documentTable').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/vi.json'
            },
            responsive: true,
            order: [[0, 'desc']]
        });

    } catch (error) {
        console.error('Chi tiết lỗi:', error);
        showAlert('Lỗi', 'Không thể tải danh sách tài liệu. Chi tiết lỗi đã được ghi trong console.', 'danger');
    }
}

// Mở modal thêm mới
function openAddModal(modal) {
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-file-medical me-2"></i>Thêm Tài Liệu Mới';
    document.getElementById('documentForm').reset();
    document.getElementById('documentId').value = '';
    modal.show();
}

// Hàm xem chi tiết tài liệu
async function viewDocument(id) {
    try {
        const response = await fetch(`${WEB_APP_URL}?action=getById&sheetName=${SHEET_NAME}&id=${id}`);
        const doc = await response.json();

        const modalContent = `
            <div class="modal fade" id="chiTietModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Chi Tiết Tài Liệu</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <table class="table table-bordered">
                                <tr>
                                    <th>Mã Tài Liệu</th>
                                    <td>${doc.id}</td>
                                </tr>
                                <tr>
                                    <th>Tên Tài Liệu</th>
                                    <td>${doc.ten_tai_lieu}</td>
                                </tr>
                                <tr>
                                    <th>Mô Tả</th>
                                    <td>${doc.mo_ta || 'Không có mô tả'}</td>
                                </tr>
                                <tr>
                                    <th>Loại Tài Liệu</th>
                                    <td>${formatLoaiTaiLieu(doc.loai_tai_lieu)}</td>
                                </tr>
                                <tr>
                                    <th>Tiêu Chuẩn</th>
                                    <td>${formatTieuChuan(doc.tieu_chuan)}</td>
                                </tr>
                                <tr>
                                    <th>Phiên Bản</th>
                                    <td>${doc.phien_ban_hien_tai}</td>
                                </tr>
                                <tr>
                                    <th>Trạng Thái</th>
                                    <td>${formatTrangThai(doc.trang_thai)}</td>
                                </tr>
                                <tr>
                                    <th>Người Tạo</th>
                                    <td>${doc.nguoi_tao}</td>
                                </tr>
                                <tr>
                                    <th>Ngày Tạo</th>
                                    <td>${formatNgay(doc.ngay_tao)}</td>
                                </tr>
                                <tr>
                                    <th>Người Cập Nhật</th>
                                    <td>${doc.nguoi_cap_nhat}</td>
                                </tr>
                                <tr>
                                    <th>Ngày Cập Nhật</th>
                                    <td>${formatNgay(doc.ngay_cap_nhat)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Thêm modal vào body và hiển thị
        document.body.insertAdjacentHTML('beforeend', modalContent);
        const chiTietModal = new bootstrap.Modal(document.getElementById('chiTietModal'));
        chiTietModal.show();

    } catch (error) {
        showAlert('Lỗi', 'Không thể tải chi tiết tài liệu', 'danger');
        console.error('Lỗi tải chi tiết tài liệu:', error);
    }
}

// Hàm chỉnh sửa tài liệu
async function editDocument(id) {
    try {
        const response = await fetch(`${WEB_APP_URL}?action=getById&sheetName=${SHEET_NAME}&id=${id}`);
        const doc = await response.json();

        // Điền dữ liệu vào form
        document.getElementById('documentId').value = doc.id;
        document.getElementById('tenTaiLieu').value = doc.ten_tai_lieu;
        document.getElementById('moTa').value = doc.mo_ta || '';
        document.getElementById('loaiTaiLieu').value = doc.loai_tai_lieu;
        document.getElementById('tieuChuan').value = doc.tieu_chuan;
        document.getElementById('phienBan').value = doc.phien_ban_hien_tai;
        document.getElementById('trangThai').value = doc.trang_thai;

        // Thay đổi tiêu đề modal
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Chỉnh Sửa Tài Liệu';

        // Hiển thị modal
        const modal = new bootstrap.Modal(document.getElementById('documentModal'));
        modal.show();
    } catch (error) {
        showAlert('Lỗi', 'Không thể tải thông tin tài liệu', 'danger');
        console.error('Lỗi tải chi tiết tài liệu:', error);
    }
}

// Lưu tài liệu
async function saveDocument(modal) {
    const documentData = {
        id: document.getElementById('documentId').value || generateId(),
        ten_tai_lieu: document.getElementById('tenTaiLieu').value,
        mo_ta: document.getElementById('moTa').value,
        loai_tai_lieu: document.getElementById('loaiTaiLieu').value,
        tieu_chuan: document.getElementById('tieuChuan').value,
        phien_ban_hien_tai: document.getElementById('phienBan').value,
        trang_thai: document.getElementById('trangThai').value,
        nguoi_tao: 'Người dùng hiện tại', 
        ngay_tao: new Date().toISOString(),
        nguoi_cap_nhat: 'Người dùng hiện tại', 
        ngay_cap_nhat: new Date().toISOString()
    };

    try {
        console.log('Save Document Data:', documentData);
        
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: documentData.id ? 'update' : 'add',
                sheetName: SHEET_NAME,
                data: documentData
            })
        });

        console.log('Save Response Status:', response.status);
        
        // Đọc nội dung phản hồi
        const responseText = await response.text();
        console.log('Save Response Text:', responseText);

        // Thử parse JSON
        const result = JSON.parse(responseText);
        console.log('Save Result:', result);

        if (result.status === 'success') {
            showAlert('Thành Công', 'Tài liệu đã được lưu', 'success');
            modal.hide();
            loadDocuments();
        } else {
            showAlert('Lỗi', result.message || 'Không thể lưu tài liệu', 'danger');
        }
    } catch (error) {
        console.error('Chi tiết lỗi lưu:', error);
        showAlert('Lỗi', 'Không thể lưu tài liệu. Chi tiết lỗi đã được ghi trong console.', 'danger');
    }
}

// Xóa tài liệu
async function deleteDocument(id) {
    if (!confirm('Bạn chắc chắn muốn xóa tài liệu này?')) return;

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

        showAlert('Thành Công', 'Tài liệu đã được xóa', 'success');
        loadDocuments();
    } catch (error) {
        showAlert('Lỗi', 'Không thể xóa tài liệu', 'danger');
        console.error('Lỗi xóa tài liệu:', error);
    }
}

// Hàm sinh ID ngẫu nhiên
function generateId() {
    return 'TL_' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Hàm hiển thị thông báo
function showAlert(title, message, type) {
    const alertContainer = document.createElement('div');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <strong>${title}:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.querySelector('.container-fluid').prepend(alertContainer);
}

// Các hàm format
function formatLoaiTaiLieu(loai) {
    const loaiMap = {
        'vanban': 'Văn Bản',
        'huongdan': 'Hướng Dẫn',
        'baocao': 'Báo Cáo'
    };
    return loaiMap[loai] || loai;
}

function formatTieuChuan(tieu_chuan) {
    const tieuChuanMap = {
        'iso': 'ISO',
        'haccp': 'HACCP', 
        'gmp': 'GMP'
    };
    return tieuChuanMap[tieu_chuan] || tieu_chuan;
}

function formatTrangThai(trang_thai) {
    const trangThaiMap = {
        'hieuluc': 'Hiệu Lực',
        'hethieuluc': 'Hết Hiệu Lực'
    };
    return trangThaiMap[trang_thai] || trang_thai;
}

function formatNgay(ngay) {
    if (!ngay) return 'Chưa xác định';
    return new Date(ngay).toLocaleString('vi-VN');
}
