from pymongo import MongoClient
from bson.objectid import ObjectId

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client.paws_db

class Dog:
    """Dog model for database operations"""
    
    @staticmethod
    def create(dog_data):
        """Create a new dog profile"""
        result = db.dogs.insert_one(dog_data)
        return str(result.inserted_id) if result.inserted_id else None
    
    @staticmethod
    def get_by_id(dog_id):
        """Get a dog profile by ID"""
        try:
            dog = db.dogs.find_one({'_id': ObjectId(dog_id)})
            return dog
        except:
            return None
    
    @staticmethod
    def update(dog_id, update_data):
        """Update a dog profile"""
        try:
            result = db.dogs.update_one(
                {'_id': ObjectId(dog_id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except:
            return False
    
    @staticmethod
    def delete(dog_id):
        """Delete a dog profile"""
        try:
            result = db.dogs.delete_one({'_id': ObjectId(dog_id)})
            return result.deleted_count > 0
        except:
            return False
    
    @staticmethod
    def get_all():
        """Get all dog profiles"""
        return list(db.dogs.find())


class User:
    """User model for database operations"""
    
    @staticmethod
    def create(user_data):
        """Create a new user"""
        result = db.users.insert_one(user_data)
        return str(result.inserted_id) if result.inserted_id else None
    
    @staticmethod
    def get_by_id(user_id):
        """Get a user by ID"""
        try:
            user = db.users.find_one({'_id': ObjectId(user_id)})
            return user
        except:
            return None
    
    @staticmethod
    def get_by_email(email):
        """Get a user by email"""
        return db.users.find_one({'email': email})
    
    @staticmethod
    def update(user_id, update_data):
        """Update a user"""
        try:
            result = db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except:
            return False
    
    @staticmethod
    def delete(user_id):
        """Delete a user"""
        try:
            result = db.users.delete_one({'_id': ObjectId(user_id)})
            return result.deleted_count > 0
        except:
            return False

