# PREVIEW
![image](https://github.com/user-attachments/assets/ad6eff13-780a-44bf-8d00-69d4b9708edd)
![image](https://github.com/user-attachments/assets/9b61004e-e158-49f3-96e9-577ab2168ca2)

# Extension AI Simple - Ekstensi Penerjemah & AI Text Processor 👋

Ekstensi ini dirancang untuk menyalin teks dari halaman web, kemudian mengirimkan teks yang disalin ke API AI untuk mendapatkan jawaban atas pertanyaan yang diberikan.

## Features

- Mengirimkan teks yang disalin ke API AI untuk diproses.
- Menampilkan hasil dari API AI di popup ekstensi.
- Menggunakan chrome.storage untuk menyimpan teks yang disalin, sehingga bisa diproses lebih lanjut

## Requirements

- Google Chrome versi terbaru.
- Akses internet untuk menghubungkan dengan API eksternal.

## Installation

Install project-management with npm

1. Clone this repository
```bash
  https://github.com/mgalihpp/extension_ujian_print_ai.git
```

2. Muat ekstensi di Chrome:
- Buka Chrome dan ketikkan chrome://extensions/ di address bar.
- Aktifkan Developer mode di pojok kanan atas.
- Klik Load unpacked dan pilih folder tempat Anda menyimpan ekstensi ini.
- Ekstensi akan muncul di toolbar Chrome.

3. Menggunakan ekstensi:
- Setelah ekstensi terpasang, klik ikon ekstensi di toolbar.
- Gunakan shortcut Alt + c untuk mengcopy text dari element .`card-body`.
- Klik Ambil Hasil untuk mengirimkan teks yang disalin ke API dan menampilkan hasilnya di popup.

## API Reference

#### Get all items

```http
  POST https://extension-ujian-print-ai.vercel.app/api/ai
```

{ payload: { message: "teks" } }

## License

[MIT](https://choosealicense.com/licenses/mit/)

