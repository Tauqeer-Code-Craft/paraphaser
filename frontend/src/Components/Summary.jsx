import React, { useState } from 'react';
import axios from 'axios';

const Summary = () => {
  const [videoLink, setVideoLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [summary, setSummary] = useState('');
  const [transcript, setTranscript] = useState(''); // New state for transcript

  const handleInputChange = (e) => {
    setVideoLink(e.target.value);
  };

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSummarizeClick = async () => {
    const videoId = extractVideoId(videoLink);
    if (videoId) {
      setVideoId(videoId);
      setLoading(true);
      setSummary('');
      setTranscript(''); // Reset the transcript

      try {
        const response = await axios.post('http://localhost:5000/summarize', {
          videoId,
        });

        // Assuming backend returns { summary: "...", transcript: "..." }
        setSummary(response.data.summary);
        setTranscript(response.data.transcript); // Set the transcript from the response
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Invalid YouTube link');
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">
        YouTube Video Summarizer
      </h2>

      {/* Container for input and button, clubbed together */}
      <div className="flex mb-4">
        <input
          type="text"
          value={videoLink}
          onChange={handleInputChange}
          placeholder="Paste YouTube video link"
          className="w-full p-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSummarizeClick}
          className="px-5 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 transition-colors"
        >
          Summarize
        </button>
      </div>

      {loading ? (
        <div className="flex gap-5 mt-5">
          <div className="w-[120px] h-[90px] rounded-md skeleton" />
          <div className="flex-grow h-[100px] rounded-md skeleton" />
        </div>
      ) : (
        summary && (
          <>
            {/* Thumbnail (displayed at the top, clickable) */}
            <div className="mb-5">
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt="YouTube Thumbnail"
                  className="w-[240px] h-[180px] rounded-md cursor-pointer"
                />
              </a>
            </div>

            {/* Summary Section */}
            {summary && (
              <div className="mt-5 bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[300px] overflow-auto">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Summary</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{summary}</p>
              </div>
            )}

            {/* Transcript Section */}
            {transcript && (
              <div className="mt-5 bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[150px] overflow-auto">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Transcript</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{transcript}</p>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default Summary;
