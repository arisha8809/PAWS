from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from pymongo import MongoClient
import os
import re
import firebase_admin
from firebase_admin import credentials, auth
from flask_cors import CORS  

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app) 

# Firebase setup
cred = credentials.Certificate('paws.json') 
firebase_admin.initialize_app(cred)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/") 
db = client["dog_app"]
dogs_collection = db["dogs"]
users_collection = db["users"]  

@app.route('/')
def index():
    return render_template('index.html')

# Email format validation
def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data['email']
    password = data['password']

    if not is_valid_email(email):
        return jsonify({'success': False, 'message': 'Invalid email format.'})

    try:
        user = auth.create_user(email=email, password=password)

        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if not existing_user:
            users_collection.insert_one({
                'firebase_uid': user.uid,
                'name': email.split('@')[0],  # Use part before @ as username
                'email': email,
                'auth_method': 'email_password'
            })
            print(f"New Email/Password user added to database: {email}")

        return jsonify({'success': True, 'message': 'Signup successful! Please verify your email.'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    if not is_valid_email(email):
        return jsonify({'success': False, 'message': 'Invalid email format.'})

    try:
        user = auth.get_user_by_email(email)
        if not user.email_verified:
            return jsonify({'success': False, 'message': 'Email not verified. Please check your inbox.'})

        session['username'] = email
        return jsonify({'success': True, 'message': 'Login successful!'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/auth/firebase-login', methods=['POST'])
def firebase_login():
    try:
        # Get data from request
        data = request.get_json()
        id_token = data.get('idToken')
        display_name = data.get('displayName')
        email = data.get('email')

        if not id_token:
            return jsonify({'success': False, 'message': 'No ID token provided'}), 400

        # Verify the ID token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', email)
        email_verified = decoded_token.get('email_verified', False)

        if not email_verified:
            return jsonify({'success': False, 'message': 'Email not verified by Google account.'})

        username = display_name if display_name else email

        # Store user info in session
        session['username'] = username
        session['email'] = email
        session['user_id'] = uid

        # Check if user already exists in MongoDB
        existing_user = users_collection.find_one({'email': email})
        if not existing_user:
            users_collection.insert_one({
                'firebase_uid': uid,
                'name': username,
                'email': email,
                'auth_method': 'google'
            })
            print(f"New Google user added to database: {email}")

        print(f"User authenticated: {username} ({email})")

        return jsonify({'success': True, 'message': 'Authentication successful!'})

    except auth.InvalidIdTokenError:
        return jsonify({'success': False, 'message': 'Invalid ID token. Please try again.'}), 401
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        return jsonify({'success': False, 'message': f'Authentication failed: {str(e)}'}), 500

# Keep the old route for backward compatibility
@app.route('/google-login', methods=['POST'])
def google_login():
    return firebase_login()  # Redirect to the new handler

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    if request.method == 'POST':
        return jsonify({'success': True, 'message': 'Logged out successfully'})
    return redirect(url_for('index'))

# Add this new route to check if the user is authenticated
@app.route('/check_auth_status', methods=['GET'])
def check_auth_status():
    if 'username' in session:
        return jsonify({
            'authenticated': True,
            'username': session['username']
        })
    else:
        return jsonify({
            'authenticated': False
        })

# Update the register_dog route to properly handle JSON data
@app.route('/register_dog', methods=['POST'])
def register_dog():
    # Check if user is logged in
    if 'username' not in session:
        return jsonify({'success': False, 'message': 'Please log in to register a dog.'})

    # Get JSON data from request
    data = request.json
    
    dog_data = {
        'name': data.get('name'),
        'breed': data.get('breed'),
        'age': data.get('age'),
        'characteristics': data.get('characteristics'),
        'owner': session['username']
    }

    if not dog_data['name'] or not dog_data['breed'] or not dog_data['age']:
        return jsonify({'success': False, 'message': 'Please fill all required fields'})

    result = dogs_collection.insert_one(dog_data)

    if result.inserted_id:
        return jsonify({
            'success': True,
            'message': f"{dog_data['name']}'s profile created successfully!",
            'dog_id': str(result.inserted_id)
        })
    else:
        return jsonify({'success': False, 'message': 'Failed to create dog profile'})
@app.route('/profile')
def profile():
    if 'username' not in session:
        return redirect(url_for('index'))
    username = session['username']
    dogs = list(dogs_collection.find({'owner': username}))
    return render_template('profile.html', username=username, dogs=dogs)

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

# Debugging endpoint
@app.route('/auth/test', methods=['POST'])
def auth_test():
    try:
        data = request.json
        return jsonify({
            'success': True,
            'received': data,
            'message': 'Test endpoint working correctly'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
