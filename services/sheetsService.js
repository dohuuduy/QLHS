// services/sheetsService.js

import { google } from 'googleapis';
import { sheetsConfig } from '../config/sheets.config.js';
import fs from 'fs';

class SheetsService {
    constructor() {
        this.sheets = null;
        this.init();
    }

    async init() {
        try {
            // Đọc credentials
            const credentials = JSON.parse(
                fs.readFileSync(sheetsConfig.credentialsPath)
            );

            // Tạo auth client
            const auth = new google.auth.GoogleAuth({
                credentials,
                scopes: sheetsConfig.scopes
            });

            // Khởi tạo sheets client
            this.sheets = google.sheets({ version: 'v4', auth });
        } catch (error) {
            console.error('Error initializing sheets service:', error);
            throw error;
        }
    }

    // Đọc tất cả tài liệu
    async getAllDocuments() {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: sheetsConfig.spreadsheetId,
                range: `${sheetsConfig.sheetName}!A2:M`,
            });

            const rows = response.data.values || [];
            return rows.map(row => ({
                id: row[0],
                ten_tai_lieu: row[1],
                mo_ta: row[2],
                ngay_tao: row[3],
                ngay_cap_nhat: row[4],
                loai_tai_lieu: row[5],
                tieu_chuan: row[6],
                phien_ban_hien_tai: row[7],
                trang_thai: row[8],
                nguoi_tao: row[9],
                nguoi_cap_nhat: row[10],
                file_dinh_kem: row[11]
            }));
        } catch (error) {
            console.error('Error reading documents:', error);
            throw error;
        }
    }

    // Thêm tài liệu mới
    async addDocument(document) {
        try {
            const values = [
                [
                    document.id,
                    document.ten_tai_lieu,
                    document.mo_ta,
                    document.ngay_tao,
                    document.ngay_cap_nhat,
                    document.loai_tai_lieu,
                    document.tieu_chuan,
                    document.phien_ban_hien_tai,
                    document.trang_thai,
                    document.nguoi_tao,
                    document.nguoi_cap_nhat,
                    document.file_dinh_kem
                ]
            ];

            await this.sheets.spreadsheets.values.append({
                spreadsheetId: sheetsConfig.spreadsheetId,
                range: `${sheetsConfig.sheetName}!A2:M2`,
                valueInputOption: 'RAW',
                resource: { values }
            });

            return document;
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
    }

    // Cập nhật tài liệu
    async updateDocument(id, document) {
        try {
            // Tìm row của document cần update
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: sheetsConfig.spreadsheetId,
                range: `${sheetsConfig.sheetName}!A:A`,
            });

            const rows = response.data.values || [];
            const rowIndex = rows.findIndex(row => row[0] === id);

            if (rowIndex === -1) {
                throw new Error('Document not found');
            }

            const values = [
                [
                    id,
                    document.ten_tai_lieu,
                    document.mo_ta,
                    document.ngay_tao,
                    document.ngay_cap_nhat,
                    document.loai_tai_lieu,
                    document.tieu_chuan,
                    document.phien_ban_hien_tai,
                    document.trang_thai,
                    document.nguoi_tao,
                    document.nguoi_cap_nhat,
                    document.file_dinh_kem
                ]
            ];

            await this.sheets.spreadsheets.values.update({
                spreadsheetId: sheetsConfig.spreadsheetId,
                range: `${sheetsConfig.sheetName}!A${rowIndex + 1}:M${rowIndex + 1}`,
                valueInputOption: 'RAW',
                resource: { values }
            });

            return document;
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    // Xóa tài liệu
    async deleteDocument(id) {
        try {
            // Tìm row của document cần xóa
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: sheetsConfig.spreadsheetId,
                range: `${sheetsConfig.sheetName}!A:A`,
            });

            const rows = response.data.values || [];
            const rowIndex = rows.findIndex(row => row[0] === id);

            if (rowIndex === -1) {
                throw new Error('Document not found');
            }

            // Clear row
            await this.sheets.spreadsheets.values.clear({
                spreadsheetId: sheetsConfig.spreadsheetId,
                range: `${sheetsConfig.sheetName}!A${rowIndex + 1}:M${rowIndex + 1}`,
            });

            return true;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }
}

export const sheetsService = new SheetsService();
