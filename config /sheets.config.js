// config/sheets.config.js

// Thông tin từ Google Cloud Console
const SPREADSHEET_ID = 'your-spreadsheet-id';
const SHEET_NAME = 'TAI_LIEU';
const CREDENTIALS_PATH = './config/credentials.json';

// Phạm vi quyền cần thiết
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export const sheetsConfig = {
    spreadsheetId: SPREADSHEET_ID,
    sheetName: SHEET_NAME,
    credentialsPath: CREDENTIALS_PATH,
    scopes: SCOPES
};
