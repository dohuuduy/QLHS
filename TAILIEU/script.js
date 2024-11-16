function openAddDocumentForm() {
  // Hiển thị modal thêm mới tài liệu
  $('#documentModal').modal('show');
}

function saveDocument() {
  // Lấy thông tin từ form
  const tenTaiLieu = document.getElementById('tenTaiLieu').value;
  const loaiTaiLieu = document.getElementById('loaiTaiLieu').value;
  const ngayBanHanh = document.getElementById('ngayBanHanh').value;
  const nguoiPhuTrach = document.getElementById('nguoiPhuTrach').value;
  const fileDinhKem = document.getElementById('fileDinhKem').value;

  // Tạo hàng mới cho bảng
  const table = document.getElementById('documentTable').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();
  newRow.innerHTML = `
    <td>${Math.floor(Math.random() * 1000)}</td>
    <td>${tenTaiLieu}</td>
    <td>${loaiTaiLieu}</td>
    <td>${ngayBanHanh}</td>
    <td>${nguoiPhuTrach}</td>
    <td><a href="${fileDinhKem}" target="_blank">Xem File</a></td>
    <td>
      <button class="btn btn-warning btn-sm" onclick="editDocument(this)">Sửa</button>
      <button class="btn btn-danger btn-sm" onclick="deleteDocument(this)">Xóa</button>
    </td>
  `;

  // Ẩn modal sau khi lưu
  $('#documentModal').modal('hide');
  // Xóa dữ liệu trong form
  document.getElementById('documentForm').reset();
}

function editDocument(button) {
  // TODO: Thêm chức năng chỉnh sửa
  alert("Chức năng chỉnh sửa sẽ được triển khai sau!");
}

function deleteDocument(button) {
  // Xóa hàng hiện tại
  const row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
}
