document.addEventListener('DOMContentLoaded', function() {
    loadDocuments();

    document.getElementById('documentForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const id = document.getElementById('documentId').value;
        const tenTaiLieu = document.getElementById('ten_tai_lieu').value;
        const moTa = document.getElementById('mo_ta').value;
        const formData = new URLSearchParams();
        formData.append('id', id);
        formData.append('ten_tai_lieu', tenTaiLieu);
        formData.append('mo_ta', moTa);

        // Gửi yêu cầu POST để lưu dữ liệu (thêm mới hoặc chỉnh sửa)
        fetch('https://script.google.com/macros/s/AKfycbyY7FYAE1KGgc6AOlYsfhyd-ZLm_FTmBgIAP7XyWBwp4jivD4B_W66Do3Sbkgw7rvBJ/exec?', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            loadDocuments();
            document.getElementById('documentForm').reset();
            const modal = new bootstrap.Modal(document.getElementById('documentFormModal'));
            modal.hide();
        })
        .catch(error => console.error('Error:', error));
    });
});

function loadDocuments() {
    fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#documentTable tbody');
            tableBody.innerHTML = '';
            data.forEach(doc => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${doc.ten_tai_lieu}</td>
                    <td>${doc.mo_ta}</td>
                    <td>${doc.loai_tai_lieu}</td>
                    <td>${doc.ngay_tao}</td>
                    <td>${doc.ngay_cap_nhat}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="editDocument(${doc.id})">Sửa</button>
                        <button class="btn btn-danger btn-sm">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading documents:', error));
}

function editDocument(id) {
    // Lấy dữ liệu tài liệu cần chỉnh sửa
    fetch(`https://script.google.com/macros/s/AKfycbyY7FYAE1KGgc6AOlYsfhyd-ZLm_FTmBgIAP7XyWBwp4jivD4B_W66Do3Sbkgw7rvBJ/exec?id=${id}`)
        .then(response => response.json())
        .then(doc => {
            document.getElementById('documentId').value = doc.id;
            document.getElementById('ten_tai_lieu').value = doc.ten_tai_lieu;
            document.getElementById('mo_ta').value = doc.mo_ta;

            // Hiển thị modal form
            const modal = new bootstrap.Modal(document.getElementById('documentFormModal'));
            modal.show();
        })
        .catch(error => console.error('Error editing document:', error));
}
