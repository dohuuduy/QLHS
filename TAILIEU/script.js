document.addEventListener("DOMContentLoaded", function() {
    loadDocuments();
});

function loadDocuments() {
    // Hàm để tải dữ liệu từ Google Sheet và hiển thị trên bảng
    // (Phần này bạn cần tự xử lý với dữ liệu từ Google Sheets)
}

function openForm(mode, data = null) {
    const modal = document.getElementById('documentFormModal');
    document.getElementById('formTitle').innerText = mode === 'add' ? 'Thêm Tài Liệu' : 'Sửa Tài Liệu';
    
    if (mode === 'edit' && data) {
        // Gán dữ liệu vào form nếu chỉnh sửa
        document.getElementById('ten_tai_lieu').value = data.ten_tai_lieu;
        document.getElementById('mo_ta').value = data.mo_ta;
        // Gán các giá trị khác tương ứng
    } else {
        // Reset form nếu thêm mới
        document.getElementById('documentForm').reset();
    }

    $(modal).modal('show');
}

document.getElementById('documentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Lưu dữ liệu vào Google Sheet (cần xử lý lưu vào Google Sheets)
    $('#documentFormModal').modal('hide');
});
