export default async function handler(req, res) {
  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;
  const SHEET_NAME = 'Jadwal';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${'17YbDUtuIvcQMJWQVgDNTJe9M5NXPt94dMKSm_ur4NSs'}/values/${'jadwal'}?key=${AIzaSyA4w5C-S9lgnrv92di1JdyNEj_17sxtFKw}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length < 2) {
      return res.status(404).json({ error: 'Data jadwal tidak ditemukan' });
    }

    // Baris pertama = header
    const headers = rows[0];

    // Baris berikutnya = data, ubah jadi array of object
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