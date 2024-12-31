from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/profile', methods=['GET'])
def get_profile():
    return jsonify({
        'name': 'Your Name',
        'title': 'Your Title',
        'personalInfo': {
            'location': 'Your Location',
            'email': 'your.email@example.com',
            'specialty': 'Your Specialty',
            'experience': 'X Years',
            'languages': 'Language 1, Language 2'
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)