# ThirdEye - AI Vision Assistant

ThirdEye is an advanced accessibility application designed to empower visually impaired users. It leverages real-time AI object detection (YOLOv3) and intelligent voice feedback to help users navigate their environment safely and independently.

## 🌟 Key Features

- **Real-Time Object Detection**: Identifies 600+ objects instantly using a camera feed.
- **Voice Feedback (TTS)**: audible announcements of detected objects and navigation cues.
- **SOS Emergency Alert**: One-touch mechanism to notify a guardian, displaying their contact info onscreen.
- **Voice Commands**: Hands-free control for key features.
- **Dynamic Split-Screen UI**: Interactive home screen that adapts to show camera feed or feedback forms side-by-side with controls.
- **Cyberpunk / Glassmorphism UI**: High-contrast, accessible, and visually stunning interface.

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (Glassmorphism design)
- **Backend**: Python, Flask, OpenCV (Computer Vision)
- **AI Model**: YOLOv3 (OpenImages) for object detection
- **Database**: SQLite (User & Contact management)

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Backend Setup

```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download AI Models (Crucial Step)
# This script downloads the YOLOv3 weights and config required for object detection.
python download_models.py

# Run the server
python app.py
```
The backend runs on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend runs on `http://localhost:5173`.

## 📸 Usage

1. **Sign Up / Login**: Create an account to personalized settings.
2. **Emergency Contact**: Set up a guardian contact for SOS alerts.
3. **Start Vision**: Click the "Eye" button to enable the camera and AI detection.
4. **TTS Toggle**: Use the speaker icon to enable/disable voice feedback.