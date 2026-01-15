from flask import Flask, request, jsonify, Response, g
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import cv2
import threading
import sqlite3
import os

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///thirdeye.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- Database Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    contact = db.relationship('EmergencyContact', backref='user', uselist=False)

class EmergencyContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    guardian_name = db.Column(db.String(100), nullable=False)
    guardian_phone = db.Column(db.String(20), nullable=False)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)

# --- Global Camera Object ---
# We will import Camera from camera.py, but for now let's set it up here or lazy load
# from camera import VideoCamera
# video_camera = VideoCamera() 

# --- Routes ---

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists'}), 400
    
    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully', 'user_id': new_user.id}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/add-contact', methods=['POST'])
def add_contact():
    data = request.json
    user_id = data.get('user_id')
    name = data.get('guardian_name')
    phone = data.get('guardian_phone')
    
    contact = EmergencyContact(user_id=user_id, guardian_name=name, guardian_phone=phone)
    db.session.add(contact)
    db.session.commit()
    
    return jsonify({'message': 'Contact added'}), 201

@app.route('/trigger-sos', methods=['POST'])
def trigger_sos():
    data = request.json
    user_id = data.get('user_id')
    user = User.query.get(user_id)
    if user and user.contact:
        # In a real app, this would trigger an SMS or Call
        return jsonify({
            'message': f'Calling Emergency Contact: {user.contact.guardian_name}',
            'name': user.contact.guardian_name,
            'phone': user.contact.guardian_phone
        }), 200
    return jsonify({'message': 'No contact found'}), 404

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    user_id = data.get('user_id')
    message = data.get('message')
    rating = data.get('rating')
    
    fb = Feedback(user_id=user_id, message=message, rating=rating)
    db.session.add(fb)
    db.session.commit()
    return jsonify({'message': 'Feedback received'}), 200

def gen(camera):
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    from camera import VideoCamera
    return Response(gen(VideoCamera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/current_object')
def current_object():
    # Endpoint to poll for the latest detected object (for TTS)
    from camera import current_detected_object
    return jsonify({'object': current_detected_object})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
