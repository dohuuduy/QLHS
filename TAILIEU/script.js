function openAddDocumentForm() {
  // Reset form và hiển thị modal thêm mới
  document.getElementById("documentForm").reset();
  $('#documentModal').modal('show');
}

function saveDocument() {
  // Lấy dữ liệu từ form
  const tenTaiLieu = document.getElementById('tenTaiLieu').value;
  const moTa = document.getElementById('moTa').value;
  const ngayTao = document.getElementById('ngayTao').value;
  const loaiTaiLieu = document.getElementById('loaiTaiLieu').value;
  const tieuChuan = document.getElementById('tieuChuan').value;
  const phienBan = document.getElementById('phienBan').value;
  const trangThai = document.getElementById('trangThai').value;
  const nguoiTao = document.getElementById('nguoiTao').value;

  // Thêm dữ liệu vào bảng (cần bổ sung logic lưu dữ liệu vào Google Sheets)
  const table = document.getElementById('documentTable').getElementsByTagName('tbody')[0];
  const newRow = table.insertRow();
  newRow.innerHTML = `
    <td>${Math.floor(Math.random() * 1000)}</td>
    <td>${tenTaiLieu}</td>
    <td>${moTa}</td>
    <td>${ngayTao}</td>
    <td>${loaiTaiLieu}</td>
    <td>${tieuChuan}</td>
    <td>${phienBan}</td>
    <td>${trangThai}</td>
    <td>${nguoiTao}</td>
    <td>
      <button class="btn btn-warning btn-sm" onclick="editDocument(this)">Sửa</button>
      <button class="btn btn-danger btn-sm" onclick="deleteDocument(this)">Xóa</button>
    </td>
  `;

  // Ẩn modal sau khi lưu
  $('#documentModal').modal('hide');
}

function editDocument(button) {
  // Logic chỉnh sửa tài liệu (cần bổ sung)
}

function deleteDocument(button) {
  // Xóa hàng hiện tại
  const row = button.parentNode.parentNode;
  row.parentNode.removeChild(row);
}
