import cv2
import numpy as np
import os
import urllib.request
import threading
import time

# Global variable to store the last detected object for TTS
current_detected_object = ""
lock = threading.Lock()

class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        
        # YOLOv3 trained on OpenImages (~600 classes)
        # Note: This model is significantly larger (~280MB) and slower than tiny versions
        self.config_path = os.path.join(os.path.dirname(__file__), "yolov3-openimages.cfg")
        self.weights_path = os.path.join(os.path.dirname(__file__), "yolov3-openimages.weights")
        self.names_path = os.path.join(os.path.dirname(__file__), "openimages.names")
        
        self.net = None
        self.classes = []

        # Check and download models if needed
        self.check_and_download_models()
        
        # Load Classes
        if os.path.exists(self.names_path):
            with open(self.names_path, "r") as f:
                self.classes = [line.strip() for line in f.readlines()]
        else:
            print("Class names file not found.")

        # Load Model
        if os.path.exists(self.config_path) and os.path.exists(self.weights_path):
            try:
                print("Loading YOLOv3-OpenImages model... This might take a moment.")
                self.net = cv2.dnn.readNet(self.weights_path, self.config_path)
                self.net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
                self.net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
                print("Model Loaded successfully.")
            except Exception as e:
                print(f"Error loading YOLO model: {e}")
        else:
            print("YOLO model files not found.")

    def __del__(self):
        self.video.release()

    def check_and_download_models(self):
        urls = {
            self.config_path: "https://raw.githubusercontent.com/pjreddie/darknet/master/cfg/yolov3-openimages.cfg",
            self.weights_path: "https://pjreddie.com/media/files/yolov3-openimages.weights",
            self.names_path: "https://raw.githubusercontent.com/pjreddie/darknet/master/data/openimages.names"
        }

        for path, url in urls.items():
            if not os.path.exists(path):
                print(f"Downloading {os.path.basename(path)}...")
                try:
                    urllib.request.urlretrieve(url, path)
                    print(f"Downloaded {os.path.basename(path)}.")
                except Exception as e:
                    print(f"Failed to download {os.path.basename(path)}: {e}")

    def get_frame(self):
        global current_detected_object
        success, image = self.video.read()
        if not success:
            return b""

        if self.net:
            (H, W) = image.shape[:2]
            
            # Use 608x608 for standard YOLOv3, or 416x416 for speed. 
            # OpenImages config usually expects 608 but 416 works for speed/lower accuracy
            blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)
            self.net.setInput(blob)
            
            try:
                layer_names = self.net.getLayerNames()
                output_layers = [layer_names[i - 1] for i in self.net.getUnconnectedOutLayers()]
                outputs = self.net.forward(output_layers)

                boxes = []
                confidences = []
                classIDs = []

                # Process outputs
                for output in outputs:
                    for detection in output:
                        scores = detection[5:]
                        classID = np.argmax(scores)
                        confidence = scores[classID]

                        if confidence > 0.3: # Threshold
                            box = detection[0:4] * np.array([W, H, W, H])
                            (centerX, centerY, width, height) = box.astype("int")
                            x = int(centerX - (width / 2))
                            y = int(centerY - (height / 2))

                            boxes.append([x, y, int(width), int(height)])
                            confidences.append(float(confidence))
                            classIDs.append(classID)

                # Non-Max Suppression
                idxs = cv2.dnn.NMSBoxes(boxes, confidences, 0.3, 0.4)

                detected_label = ""
                max_conf = 0.0

                if len(idxs) > 0:
                    for i in idxs.flatten():
                        (x, y) = (boxes[i][0], boxes[i][1])
                        (w, h) = (boxes[i][2], boxes[i][3])
                        
                        # Safety check for class ID
                        if classIDs[i] < len(self.classes):
                            label = self.classes[classIDs[i]]
                            conf = confidences[i]

                            # Draw
                            color = (0, 255, 255) # Yellow for OpenImages
                            cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)
                            text_y = y - 5 if y - 5 > 10 else y + 20
                            cv2.putText(image, f"{label}: {conf:.2f}", (x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                            if conf > max_conf:
                                max_conf = conf
                                detected_label = label

                # Update global
                with lock:
                    current_detected_object = detected_label
            except Exception as e:
                # Sometimes network forward fails if sizes don't match
                pass

        ret, jpeg = cv2.imencode('.jpg', image)
        return jpeg.tobytes()
