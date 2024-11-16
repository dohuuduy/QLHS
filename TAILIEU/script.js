// Đường dẫn Google Sheets API
const sheetUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Lấy các phần tử DOM
const addDocumentBtn = document.getElementById('addDocumentBtn');
const documentModal = document.getElementById('documentModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const documentForm = document.getElementById('documentForm');
const documentTable = document.getElementById('documentTable').getElementsByTagName('tbody')[0];

// Hiển thị các tài liệu trong bảng
function loadDocuments() {
    fetch(`${sheetUrl}?action=getDocuments`)
        .then(response => response.json())
        .then(data => {
            // Làm sạch bảng trước khi thêm dữ liệu mới
            documentTable.innerHTML = '';
            data.forEach(doc => {
                const row = documentTable.insertRow();
                row.insertCell(0).innerText = doc.id;
                row.insertCell(1).innerText = doc.ten_tai_lieu;
                row.insertCell(2).innerText = doc.mo_ta;
                row.insertCell(3).innerText = doc.ngay_tao;
                row.insertCell(4).innerText = doc.ngay_cap_nhat;

                // Thêm nút sửa và xóa
                const actionCell = row.insertCell(5);
                const editBtn = document.createElement('button');
                editBtn.innerText = 'Sửa';
                editBtn.onclick = () => openModal(doc);
                actionCell.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Xóa';
                deleteBtn.onclick = () => deleteDocument(doc.id);
                actionCell.appendChild(deleteBtn);
            });
        });
}

// Mở modal thêm hoặc sửa tài liệu
function openModal(doc = null) {
    if (doc) {
        // Sửa tài liệu
        document.getElementById('ten_tai_lieu').value = doc.ten_tai_lieu;
        document.getElementById('mo_ta').value = doc.mo_ta;
        document.getElementById('loai_tai_lieu').value = doc.loai_tai_lieu;
        document.getElementById('ngay_tao').value = doc.ngay_tao;
        document.getElementById('ngay_cap_nhat').value = doc.ngay_cap_nhat;
    } else {
        // Thêm mới tài liệu
        documentForm.reset();
    }
    documentModal.style.display = 'flex';
}

// Đóng modal
closeModalBtn.onclick = () => {
    documentModal.style.display = 'none';
};

// Lưu tài liệu vào Google Sheets
documentForm.onsubmit = (e) => {
    e.preventDefault();

    const newDoc = {
        ten_tai_lieu: document.getElementById('ten_tai_lieu').value,
        mo_ta: document.getElementById('mo_ta').value,
        loai_tai_lieu: document.getElementById('loai_tai_lieu').value,
        ngay_tao: document.getElementById('ngay_tao').value,
        ngay_cap_nhat: document.getElementById('ngay_cap_nhat').value
    };

    fetch(`${sheetUrl}?action=addDocument`, {
        method: 'POST',
        body: JSON.stringify(newDoc)
    })
    .then(response => response.json())
    .then(() => {
        documentModal.style.display = 'none';
        loadDocuments();
    });
};

// Xóa tài liệu
function deleteDocument(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
        fetch(`${sheetUrl}?action=deleteDocument&id=${id}`, {
            method: 'DELETE'
        })
        .then(() => loadDocuments());
    }
}

// Tải dữ liệu khi trang được tải
window.onload = loadDocuments;

// Thêm sự kiện cho nút thêm tài liệu
addDocumentBtn.onclick = () => openModal();
