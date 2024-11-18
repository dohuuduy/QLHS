document.addEventListener("DOMContentLoaded", function() {
    loadDocuments();
});

function loadDocuments() {
    const sheetUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Thay YOUR_SCRIPT_ID bằng ID của Google Apps Script

    fetch(sheetUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#documentTable tbody");
            tableBody.innerHTML = ""; // Xóa dữ liệu cũ

            data.forEach(doc => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${doc.ten_tai_lieu}</td>
                    <td>${doc.mo_ta}</td>
                    <td>${doc.loai_tai_lieu}</td>
                    <td>${doc.ngay_tao}</td>
                    <td>${doc.ngay_cap_nhat}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="openForm('edit', ${JSON.stringify(doc)})">Sửa</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteDocument(${doc.id})">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
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
