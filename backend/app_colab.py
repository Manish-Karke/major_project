from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
import json
import os

# Set your Hugging Face API token
os.environ["HF_TOKEN"] = "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"  # Replace with your actual token

# Initialize the Hugging Face Inference Client
repo_id = "mistralai/Mistral-7B-Instruct-v0.3"
llm_client = InferenceClient(
    model=repo_id,
    token=os.environ["HF_TOKEN"],
    timeout=120,
)

# Define the function to call the model
def call_llm(inference_client: InferenceClient, prompt: str):
    response = inference_client.post(
        json={
            "inputs": prompt,
            "parameters": {"max_new_tokens": 250},
            "task": "text-generation",
        },
    )
    return json.loads(response.decode())[0]["generated_text"]

# Set up Flask app
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return jsonify({"message": "Welcome to the prediction API!"})
    
    data = request.json  # Get the JSON data sent in the request
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    try:
        # Call the LLM with the given prompt
        prediction = call_llm(llm_client, prompt)
        return jsonify({"prediction": prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the Flask app
if __name__ == '__main__':
    app.run(port=5000, debug=True)
