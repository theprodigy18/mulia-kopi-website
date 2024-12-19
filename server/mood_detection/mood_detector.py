import cv2
from deepface import DeepFace
import numpy as np

def detect_mood(image):
    # Validasi input untuk memastikan format OpenCV
    if not isinstance(image, np.ndarray):
        raise ValueError("Input harus dalam bentuk array gambar OpenCV.")
    
    # Inisialisasi cascade deteksi wajah
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    if len(faces) == 0:
        print("Tidak ada wajah terdeteksi.")
        return "Wajah tidak terdeteksi"

    # Potong gambar wajah pertama yang terdeteksi
    (x, y, w, h) = faces[0]
    face_img = image[y:y+h, x:x+w]

    # Debug: Pastikan ukuran wajah yang dipotong cukup besar
    print(f"Ukuran gambar wajah untuk analisis: {face_img.shape}")
    if face_img.shape[0] < 50 or face_img.shape[1] < 50:
        print("Wajah terlalu kecil untuk analisis yang akurat.")
        return "Wajah terlalu kecil"

    # Mapping emosi dari bahasa Inggris ke bahasa Indonesia
    mood_translation = {
        "happy": "Bahagia",
        "sad": "Sedih",
        "angry": "Marah",
        "fear": "Takut",
        "neutral": "Normal"
    }

    # Analisis ekspresi dengan DeepFace
    try:
        result = DeepFace.analyze(face_img, actions=['emotion'], enforce_detection=False)
        
        # Jika result adalah list, ambil elemen pertama
        if isinstance(result, list):
            result = result[0]
        
        emotions = result["emotion"]

        # Hilangkan emosi "jijik" dan "terkejut" dari hasil
        emotions.pop("disgust", None)
        emotions.pop("surprise", None)

        # Tentukan mood dominan dari emosi yang ada
        if emotions:
            dominant_mood = max(emotions, key=emotions.get)
            return mood_translation.get(dominant_mood, "Mood tidak teridentifikasi")
        else:
            return "Mood tidak teridentifikasi"
    except Exception as e:
        print(f"Error dalam analisis ekspresi: {e}")
        return "Analisis ekspresi gagal"
