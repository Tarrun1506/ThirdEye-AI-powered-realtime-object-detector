import os
import urllib.request
import sys
import time

def reporthook(count, block_size, total_size):
    global start_time
    if count == 0:
        start_time = time.time()
        return
    duration = time.time() - start_time
    progress_size = int(count * block_size)
    speed = int(progress_size / (1024 * duration)) if duration > 0 else 0
    percent = int(count * block_size * 100 / total_size)
    sys.stdout.write(f"\rDownloading: {percent}% - {progress_size / (1024*1024):.2f} MB / {total_size / (1024*1024):.2f} MB ({speed} KB/s)")
    sys.stdout.flush()

def download_models():
    print("Starting Model Download for YOLOv3 OpenImages (~280 MB)...")
    
    files = {
        "yolov3-openimages.cfg": "https://raw.githubusercontent.com/pjreddie/darknet/master/cfg/yolov3-openimages.cfg",
        "yolov3-openimages.weights": "https://pjreddie.com/media/files/yolov3-openimages.weights",
        "openimages.names": "https://raw.githubusercontent.com/pjreddie/darknet/master/data/openimages.names"
    }

    base_dir = os.path.dirname(__file__)

    for filename, url in files.items():
        path = os.path.join(base_dir, filename)
        if os.path.exists(path):
            print(f"\n{filename} already exists. Skipping.")
            continue
        
        print(f"\nDownloading {filename} from {url}...")
        try:
            urllib.request.urlretrieve(url, path, reporthook)
            print(f"\nSuccessfully downloaded {filename}.")
        except Exception as e:
            print(f"\nFailed to download {filename}: {e}")

    print("\n\nAll model files ready.")
    print("Run 'python app.py' start the server.")

if __name__ == "__main__":
    download_models()
