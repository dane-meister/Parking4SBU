import React, { useState, useEffect } from "react";
import axios from "axios";
import '../stylesheets/index.css';
import "../stylesheets/Feedback.css";
const HOST = "http://localhost:8000";

export default function FeedbackPage() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`${HOST}/api/auth/feedback/add`, {
                feedback_text: feedback,
                rating: rating,
            }, { withCredentials: true });

            alert("Feedback submitted successfully!"); // Keep as an alert?
            setFeedback("");
            setRating(5);
        } catch (error) {
            console.error("Error submitting feedback:", error.response?.data || error.message);
            alert("Failed to submit feedback."); // Keep as an alert?
        }
    };

    return (
        <main className="feedback-page">
            <h1>Leave Feedback</h1>
            <textarea
                placeholder="Your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="3"
            />
            <label>
                Rating:
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>
                            {val}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit" onClick={handleSubmit}>Submit</button>

        </main>
    );
}