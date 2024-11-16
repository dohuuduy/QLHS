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
// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Giả sử bạn có một mảng dữ liệu tạm thời
    const data = [
        { id: 1, ten_tai_lieu: 'Tài liệu A', mo_ta: 'Mô tả A' },
        { id: 2, ten_tai_lieu: 'Tài liệu B', mo_ta: 'Mô tả B' }
    ];

    // Lấy phần tử bảng
    const table = document.getElementById('documentTable');

    // Tạo header của bảng
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>ID</th>
        <th>Tên Tài Liệu</th>
        <th>Mô Tả</th>
    `;
    table.appendChild(headerRow);

    // Duyệt qua dữ liệu và tạo hàng cho từng tài liệu
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.ten_tai_lieu}</td>
            <td>${item.mo_ta}</td>
        `;
        table.appendChild(row);
    });
});
