from datetime import datetime
import os
import uuid
import re
from typing import List, Dict
from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/mpsem6"
mongo = PyMongo(app)

# Load summarization model
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")


def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript
    except YouTubeTranscriptApi.CouldNotRetrieveTranscript:
        return f"Error: Could not retrieve transcript for video {video_id}."
    except Exception as e:
        return f"Error: {str(e)}"


def chunk_text(text, chunk_size=1024):
    chunks = []
    while len(text) > chunk_size:
        split_idx = text.rfind(" ", 0, chunk_size)
        if split_idx == -1:
            split_idx = chunk_size
        chunks.append(text[:split_idx])
        text = text[split_idx:].strip()
    chunks.append(text)
    return chunks


def summarize_chunks(chunks):
    summaries = []
    for chunk in chunks:
        summary = summarizer(chunk, max_length=150,
                             min_length=50, do_sample=False)
        summaries.append(summary[0]['summary_text'])
    return summaries


def generate_nodes_and_edges(summaries):
    nodes = []
    edges = []

    central_node = {"id": str(uuid.uuid4()), "label": "Main Topic"}
    nodes.append(central_node)

    for summary in summaries[:6]:
        words = summary.split()
        trimmed = " ".join(words[:9]) + ("..." if len(words) > 9 else "")
        node_id = str(uuid.uuid4())

        node = {"id": node_id, "label": trimmed}
        nodes.append(node)

        edge = {
            "source": central_node["id"],
            "target": node_id,
            "label": "",
            "arrows": "to"
        }
        edges.append(edge)

    return nodes, edges


@app.route('/summarize', methods=['POST'])
def summarize_video():
    data = request.json
    video_id = data.get('videoId')

    if not video_id:
        return jsonify({"error": "No video ID provided"}), 400

    transcript = get_transcript(video_id)

    if isinstance(transcript, str) and "Error" in transcript:
        return jsonify({"error": transcript}), 400

    full_text = " ".join([entry['text'] for entry in transcript])
    chunks = chunk_text(full_text)
    summaries = summarize_chunks(chunks)
    final_summary = " ".join(summaries)

    mongo.db.get_collection("history").insert_one(
        {"video_id": video_id, "summary": final_summary, "timestamp": datetime.now()})

    return jsonify({
        "summary": final_summary,
        "transcript": full_text
    })


@app.route('/generate_mindmap', methods=['POST'])
def generate_mindmap():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    chunks = chunk_text(text)
    summaries = summarize_chunks(chunks)
    nodes, edges = generate_nodes_and_edges(summaries)

    return jsonify({
        "nodes": nodes,
        "edges": edges
    })


def serialize_history(doc):
    return {
        "videoId": doc.get("video_id"),
        "summary": doc.get("summary", ""),
        "timestamp": doc.get("timestamp").isoformat() if isinstance(doc.get("timestamp"), datetime) else doc.get("timestamp"),
    }


@app.route("/history", methods=["GET"])
def get_history():
    history_collection = mongo.db.history
    history_docs = list(history_collection.find().sort(
        "timestamp", -1))
    serialized = [serialize_history(doc) for doc in history_docs]
    return jsonify(serialized), 200


@app.route("/username", methods=["GET"])
def get_username():
    user = mongo.db.get_collection("users").find()
    name = user[0].get("name")
    return name, 200


@app.route("/username", methods=["PUT"])
def set_username():
    data = request.json
    old = data.get("old_username")
    new = data.get("new_username")
    user = mongo.db.get_collection("users").update_one(
        {"name": old}, {"$set": {"name": new}})
    return "Done", 200


if __name__ == '__main__':
    app.run(debug=True)
