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
