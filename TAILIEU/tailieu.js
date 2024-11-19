const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzRKtc6Dm_K8tnM8FI_CHgvlsg163rq4mj_t_6AjRV8Munno1zMKQDTxbzfJU5Vi_vh/exec';

let isEditing = false; // Biến để xác định trạng thái Thêm hay Sửa
let editingId = null; // ID của tài liệu đang được sửa

document.addEventListener('DOMContentLoaded', function() {
    loadDocuments();

    document.getElementById('documentForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const tenTaiLieu = document.getElementById('ten_tai_lieu').value;
        const moTa = document.getElementById('mo_ta').value;

        const formData = new URLSearchParams();
        formData.append('ten_tai_lieu', tenTaiLieu);
        formData.append('mo_ta', moTa);

        if (isEditing && editingId) {
            formData.append('id', editingId); // Thêm ID nếu đang chỉnh sửa
        }

        fetch(WEB_APP_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadDocuments();
                $('#documentFormModal').modal('hide'); // Đóng form modal
                document.getElementById('documentForm').reset(); // Reset form
                isEditing = false; // Đặt lại trạng thái
                editingId = null; // Đặt lại ID chỉnh sửa
            } else {
                alert('Lỗi khi lưu dữ liệu: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi khi kết nối với server.');
        });
    });

    // Nút mở form Thêm tài liệu
    document.getElementById('addNewDocument').addEventListener('click', function() {
        isEditing = false;
        editingId = null;
        document.getElementById('modalTitle').textContent = 'Thêm Tài Liệu';
        document.getElementById('documentForm').reset();
        $('#documentFormModal').modal('show');
    });
});

function loadDocuments() {
    fetch(`${WEB_APP_URL}`)
        .then(response => response.json())
        .then(data => {
            // Kiểm tra dữ liệu có nhận được đúng không
            if (Array.isArray(data)) {
                console.log("Dữ liệu tải thành công:", data);
                // Tiếp tục xử lý để hiển thị dữ liệu
            } else {
                throw new Error("Dữ liệu không đúng định dạng");
            }
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu:", error);
            alert("Đã xảy ra lỗi khi tải dữ liệu.");
        });
}


function editDocument(id) {
  // Sử dụng URL Web App Google Apps Script
  fetch(`${WEB_APP_URL}?id=${id}`)
    .then(response => response.json())
    .then(data => {
      if (data) {
        // Điền dữ liệu vào form chỉnh sửa
        document.getElementById('tenTaiLieu').value = data.ten_tai_lieu || '';
        document.getElementById('moTa').value = data.mo_ta || '';
        document.getElementById('loaiTaiLieu').value = data.loai_tai_lieu || '';
        document.getElementById('ngayTao').value = data.ngay_tao || '';
        document.getElementById('ngayCapNhat').value = data.ngay_cap_nhat || '';

        // Hiển thị form chỉnh sửa
        document.getElementById('editForm').style.display = 'block';
      } else {
        alert("Không tìm thấy dữ liệu.");
      }
    })
    .catch(error => {
      console.error("Lỗi khi tải dữ liệu để sửa:", error);
      alert("Đã xảy ra lỗi khi tải dữ liệu để sửa.");
    });
}




function deleteDocument(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
        fetch(`${WEB_APP_URL}?deleteId=${id}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadDocuments();
            } else {
                alert('Lỗi khi xoá tài liệu: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Lỗi khi xoá dữ liệu:', error);
            alert('Đã xảy ra lỗi khi xoá dữ liệu.');
        });
    }
}
