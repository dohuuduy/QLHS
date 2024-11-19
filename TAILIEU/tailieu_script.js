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
});

// Hàm load dữ liệu từ Google Sheets
function loadDocuments() {
    // Giả lập dữ liệu (sau này sẽ thay bằng Google Sheets API)
    documents = [
        {
            id: '001',
            ten_tai_lieu: 'Tài liệu mẫu',
            mo_ta: 'Mô tả tài liệu mẫu',
            loai_tai_lieu: 'vanban',
            tieu_chuan: 'iso',
            phien_ban_hien_tai: '1.0',
            trang_thai: 'hieuluc',
            ngay_tao: new Date().toISOString(),
            nguoi_tao: 'user@example.com'
        }
    ];
    renderDocumentTable();
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
            <td>${formatTrangThai(doc.trang_thai)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="showEditModal('${doc.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteDocument('${doc.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
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

// Hàm xử lý form submit
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        ten_tai_lieu: document.getElementById('tenTaiLieu').value,
        mo_ta: document.getElementById('moTa').value,
        loai_tai_lieu: document.getElementById('loaiTaiLieu').value,
        tieu_chuan: document.getElementById('ti
