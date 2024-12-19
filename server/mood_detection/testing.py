import cv2
import mood_detector

# Fungsi detect_mood yang sudah Anda buat sebelumnya

# Membaca gambar dari galeri
image_path = 'D:\ss.jpg'  # Ganti dengan path gambar Anda
image = cv2.imread(image_path)

# Periksa apakah gambar berhasil dimuat
if image is None:
    print("Gagal memuat gambar. Periksa kembali path gambar.")
else:
    # Panggil fungsi detect_mood dan cetak hasilnya
    mood = mood_detector.detect_mood(image)
    print("Mood yang terdeteksi:", mood)
