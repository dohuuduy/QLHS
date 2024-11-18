document.addEventListener("DOMContentLoaded", function() {
    loadDocuments();
});

function loadDocuments() {
    // Hàm để tải dữ liệu từ Google Sheet và hiển thị trên bảng
    // (Phần này bạn cần tự xử lý với dữ liệu từ Google Sheets)
    // Ví dụ mẫu dữ liệu (bạn cần thay bằng dữ liệu thực tế):
    const sampleData = [
        { id: 1, ten_tai_lieu: 'Quy Trình A', mo_ta: 'Mô tả A', ngay_tao: '2024-11-18', loai_tai_lieu: 'Quy trình', tieu_chuan: 'ISO', phien_ban: '1.0', trang_thai: 'Hiệu lực', nguoi_tao: 'Nguyễn Văn A' },
        { id: 2, ten_tai_lieu: 'Hướng Dẫn B', mo_ta: 'Mô tả B', ngay_tao: '2024-11-19', loai_tai_lieu: 'Hướng dẫn', tieu_chuan: 'BRC', phien_ban: '2.0', trang_thai: 'Hiệu lực', nguoi_tao: 'Trần Thị B' }
    ];

    const tableBody = document.querySelector("#documentTable tbody");
    tableBody.innerHTML = ""; // Xóa dữ liệu cũ

    sampleData.forEach((doc) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${doc.ten_tai_lieu}</td>
            <td>${doc.mo_ta}</td>
            <td>${doc.ngay_tao}</td>
            <td>${doc.loai_tai_lieu}</td>
            <td>${doc.tieu_chuan}</td>
            <td>${doc.phien_ban}</td>
            <td>${doc.trang_thai}</td>
            <td>${doc.nguoi_tao}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openForm('edit', ${JSON.stringify(doc)})">Sửa</button>
                <button class="btn btn-danger btn-sm" onclick="deleteDocument(${doc.id})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
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

    $('#documentFormModal').modal('show');
}

document.getElementById('documentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Lưu dữ liệu vào Google Sheet (cần xử lý lưu vào Google Sheets)
    $('#documentFormModal').modal('hide');
});

function deleteDocument(id) {
    // Hàm để xóa tài liệu (cần xử lý xóa trong Google Sheets)
    alert(`Xóa tài liệu với ID: ${id}`);
}
