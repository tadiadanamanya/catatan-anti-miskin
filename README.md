# Receipt Scanning (OCR) Integration

Welcome to Stage 3 of the Neobrutalism personal finance app! This stage implements Receipt Scanning using the device camera or image gallery, and auto-fills the transaction amount.

## 🔧 Langkah Persiapan & Penjelasan (Tahap 3)

### 1. Install Tesseract.js
Sambil menunggu kode selesai, buka terminal di dalam folder project Anda dan jalankan perintah ini:

```bash
npm install tesseract.js
```

*(Note: We have provided the code that depends on `tesseract.js`. Running this install command ensures everything works locally!)*

### 2. Bagaimana Cara Kerjanya?

- **ScannerComponent**:
  - Saat Anda menekan tombol "Scan Struk" (yang akan Anda hubungkan ke method `triggerScan` dari `ScannerComponent`), aplikasi akan memanggil atribut `capture="environment"`. Di HP, ini akan langsung membuka aplikasi Kamera belakang. Di PC/Laptop, ini akan membuka jendela File Explorer untuk memilih gambar.
- **useOCR Composable**:
  - Setelah difoto, `Tesseract.js` akan membaca gambar tersebut. Karena berjalan di browser, ini mungkin memakan waktu 2-5 detik tergantung spesifikasi HP/Laptop. Selama proses ini, animasi Loading bergaya Neobrutalism yang cerah ("SCANNING RECEIPT... DO NOT CLOSE!") akan muncul.
  - Composable ini berisi AI yang akan mencari pola angka struk (Misal: `TOTAL 55.000`), mengambil angka `55000`, dan mengirimkan event (`scanComplete`) yang berisi nominal pengeluaran dan teks aslinya.
- **UX Handling**:
  - Saat event `scanComplete` di-emit, Anda dapat menangkapnya di komponen `Dashboard` atau komponen parent lainnya untuk membuka `TransactionModal.vue`.
  - Set tipe form ke 'expense' dan masukkan data yang diekstrak ke dalam form (misalnya: amount field dan notes field). User tetap bisa mengedit nominalnya sebelum menyimpan ke Firestore jika terjadi kesalahan OCR.

### 3. Catatan Akurasi
Tesseract.js adalah AI pembaca teks gratis yang berjalan di perangkat (client-side). Akurasinya sangat bergantung pada cahaya saat Anda memfoto struk (pastikan terang dan struk tidak lecek). Jika nanti untuk pemakaian jangka panjang Anda merasa kurang akurat, Anda bisa menggantinya dengan Google Cloud Vision API (berjalan di sisi server/Firebase). Tetapi untuk prototype dan penggunaan awal, Tesseract.js sudah sangat keren!
