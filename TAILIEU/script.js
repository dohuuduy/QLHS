// URL của Web App mà bạn đã triển khai từ Google Apps Script
const sheetUrl = 'https://script.google.com/macros/s/AKfycbyY7FYAE1KGgc6AOlYsfhyd-ZLm_FTmBgIAP7XyWBwp4jivD4B_W66Do3Sbkgw7rvBJ/exec'; // Thay YOUR_SCRIPT_ID bằng ID bạn nhận được

// Lấy dữ liệu từ Google Apps Script (Web App)
function loadDocuments() {
    fetch(sheetUrl)
        .then(response => response.json())
        .then(data => {
            const rows = data;
            if (rows.length) {
                const documentTable = document.getElementById('documentTable');
                documentTable.innerHTML = ''; // Làm sạch bảng

                rows.forEach(row => {
                    const rowElement = documentTable.insertRow();
                    rowElement.insertCell(0).innerText = row.id;
                    rowElement.insertCell(1).innerText = row.ten_tai_lieu;
                    rowElement.insertCell(2).innerText = row.mo_ta;
                    rowElement.insertCell(3).innerText = row.loai_tai_lieu;
                    rowElement.insertCell(4).innerText = row.ngay_tao;
                    rowElement.insertCell(5).innerText = row.ngay_cap_nhat;
                });
            }
        })
        .catch(error => console.error('Error loading documents:', error));
}

// Gọi loadDocuments khi trang được tải
window.onload = loadDocuments;
