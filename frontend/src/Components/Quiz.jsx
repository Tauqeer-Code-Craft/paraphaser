import React, { useState } from "react";
import axios from "axios";

const Quiz = () => {
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const handleGenerateQuiz = async () => {
    if (!summary.trim()) {
      alert("Please enter a valid summary.");
      return;
    }

    setLoading(true);
    setQuiz([]);
    setUserAnswers({});

    try {
      const response = await axios.post("http://localhost:5000/generate_quiz", {
        summary,
      });
      setQuiz(response.data.quiz);
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("Failed to generate quiz. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIndex, selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: selectedOption,
    }));
  };

  const isCorrect = (qIndex, option) => {
    return quiz[qIndex].answer === option;
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4 text-center">
        Quiz Generator
      </h2>

      <textarea
        value={summary}
        onChange={handleSummaryChange}
        placeholder="Paste the summary here..."
        rows="6"
        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-center my-4">
        <button
          onClick={handleGenerateQuiz}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 font-semibold"
        >
          Generate Quiz
        </button>
      </div>

      {loading && <p className="text-center text-gray-600">Loading quiz...</p>}

      {quiz.length > 0 && (
        <div className="space-y-6 mt-6">
          {quiz.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <h3 className="font-semibold text-gray-800 mb-3">
                Q{qIndex + 1}: {q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => {
                  const selected = userAnswers[qIndex] === option;
                  const isCorrectAnswer = isCorrect(qIndex, option);
                  const isUserAnswered = userAnswers[qIndex] !== undefined;

                  let optionStyle = "border px-3 py-2 rounded-md cursor-pointer";
                  if (isUserAnswered) {
                    if (selected && isCorrectAnswer) {
                      optionStyle += " bg-green-100 border-green-400 text-green-700";
                    } else if (selected && !isCorrectAnswer) {
                      optionStyle += " bg-red-100 border-red-400 text-red-700";
                    } else if (isCorrectAnswer) {
                      optionStyle += " bg-green-50 border-green-300";
                    } else {
                      optionStyle += " bg-gray-100 border-gray-300 text-gray-500";
                    }
                  } else {
                    optionStyle += " hover:bg-blue-100";
                  }

                  return (
                    <div
                      key={oIndex}
                      className={optionStyle}
                      onClick={() => handleOptionSelect(qIndex, option)}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>

              {userAnswers[qIndex] !== undefined && (
                <p className="mt-3 font-medium">
                  {userAnswers[qIndex] === q.answer ? (
                    <span className="text-green-600">✅ Correct!</span>
                  ) : (
                    <span className="text-red-600">❌ Incorrect. Correct answer: {q.answer}</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Quiz;
