# from flask import Flask, request, jsonify  # type: ignore
# from flask_cors import CORS  # type: ignore

# app = Flask(__name__)
# CORS(app)  # Enable CORS for the entire app

# # Sample GET endpoint


# @app.route('/api/data', methods=['GET'])
# def get_data():
#     return jsonify({"message": "Hello from Flask!", "data": [1, 2, 3]})

# # Sample POST endpoint


# @app.route('/api/data', methods=['POST'])
# def post_data():
#     payload = request.json
#     name = payload.get("name", "Guest")
#     return jsonify({"message": f"Hello, {name}!", "status": "success"})


# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your frontend

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Get the input data from the request
    # Use your model to make predictions
    result = {"prediction": "Your Model Output Here"}
    return jsonify(result)

app.run(port=5000)  # Run the server on port 5000
