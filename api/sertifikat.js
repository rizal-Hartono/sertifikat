export default async function handler(req, res) {
  // Ambil parameter nama dari query string
  // Contoh: /api/sertifikat?nama=Budi
  const { nama } = req.query;

  if (!nama) {
    return res.status(400).json({ error: 'Parameter nama wajib diisi' });
  }

  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.GOOGLE_API_KEY;
  const SHEET_NAME = 'Data'; // ganti sesuai nama sheet kamu

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const rows = data.values;

    // Baris pertama = header
    const headers = rows[0];
    
    // Cari baris yang namanya cocok (kolom A, index 0)
    // Ganti angka 0 sesuai kolom nama di sheet kamu
    const peserta = rows.slice(1).find(row => 
      row[0].toLowerCase() === nama.toLowerCase()
    );

    if (!peserta) {
      return res.status(404).json({ error: 'Nama tidak ditemukan' });
    }

    // Ubah jadi object { NamaKolom: nilai }
    const result = {};
    headers.forEach((header, i) => {
      result[header] = peserta[i] || '';
    });

    return res.status(200).json(result);

  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data' });
  }
}