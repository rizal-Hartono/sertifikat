export default async function handler(req, res) {
  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;
  const SHEET_NAME = 'Jadwal';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length < 2) {
      return res.status(404).json({ error: 'Data jadwal tidak ditemukan' });
    }

    const headers = rows[0];

    const jadwal = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || '-';
      });
      return obj;
    });

    return res.status(200).json(jadwal);

  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data jadwal' });
  }
}