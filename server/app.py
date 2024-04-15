from flask import Flask, abort, request, jsonify, make_response
from flask_cors import CORS, cross_origin
from tempfile import NamedTemporaryFile

import whisper
import torch
from translate import TranslatePipeline


# Check if NVIDIA GPU is available
torch.cuda.is_available()
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Load the Whisper model:
model = whisper.load_model("base", device=DEVICE)

app = Flask(__name__)
CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


class ClientApp:
    def __init__(self):

        self.translator = TranslatePipeline()


@app.route("/")
def hello():
    return "Whisper Hello World!"


@app.route("/whisper", methods=["POST"])
def handler():

    if "file" not in request.files:
        abort(400, "No file part")
    language = request.form.get("language")
    if not language:
        return jsonify({"error": "Missing language code"}), 400
    # For each file, let's store the results in a list of dictionaries.
    result = []

    # Loop over every file that the user submitted.
    audio = request.files["file"]
    # print(audio)
    response = make_response()

    try:
        temp_file = NamedTemporaryFile()
        temp_file.write(audio.read())

        temp_file_path = "audio"
    except Exception as e:
        print(f"Error handling file: {e}")
        abort(401, "An error occurred during file processing")

    transcript = model.transcribe(temp_file.name, language="en")
    temp_file.close()

    result.append(
        {
            "filename": audio,
            "transcript": transcript["text"],
        }
    )
    print(transcript)
    translated_Text = clApp.translator.translate(lang=language, text=transcript["text"])

    """
    response = jsonify({"results": result})

    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    """
    # return {"results": transcript["text"]}
    return {"results": translated_Text}


if __name__ == "__main__":
    clApp = ClientApp()

    app.run(host="0.0.0.0", port=8080, debug=True)
    # app.run(host="0.0.0.0", port=8080)
