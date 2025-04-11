from flask import Flask, render_template, request, redirect, url_for, jsonify
from pymongo import MongoClient
import os
from bson.objectid import ObjectId
import json

app = Flask(__name__)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client.paws_db
dogs_collection = db.dogs

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register_dog', methods=['POST'])
def register_dog():
    if request.method == 'POST':
        dog_data = {~
            'name': request.form.get('name'),
            'breed': request.form.get('breed'),
            'age': request.form.get('age'),
            'characteristics': request.form.get('characteristics')
        }
        
        # Validate data
        if not dog_data['name'] or not dog_data['breed'] or not dog_data['age']:
            return jsonify({'success': False, 'message': 'Please fill all required fields'})
        
        # Insert into database
        result = dogs_collection.insert_one(dog_data)
        
        if result.inserted_id:
            return jsonify({
                'success': True, 
                'message': 'Dog profile created successfully!',
                'dog_id': str(result.inserted_id)
            })
        else:
            return jsonify({'success': False, 'message': 'Failed to create dog profile'})

@app.route('/training')
def training():
    return render_template('training.html')

@app.route('/nutrition')
def nutrition():
    return render_template('nutrition.html')

@app.route('/community')
def community():
    return render_template('community.html')

@app.route('/walking')
def walking():
    return render_template('walking.html')

@app.route('/enrichment')
def enrichment():
    return render_template('enrichment.html')

if __name__ == '__main__':
    app.run(debug=True)

