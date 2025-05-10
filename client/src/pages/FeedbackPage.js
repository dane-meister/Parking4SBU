import React, { useState, useEffect } from "react";
import axios from "axios";
import '../stylesheets/index.css';
import "../stylesheets/Feedback.css";

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function FeedbackPage() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(5);
    const [existingFeedback, setExistingFeedback] = useState(null);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        const fetchExistingFeedback = async () => {
            try {
            const res = await axios.get(`${HOST}/api/admin/auth/feedback/my`, {
                withCredentials: true,
            });
            if (Array.isArray(res.data)) setExistingFeedback(res.data);
            } catch (error) {
            console.error("Could not fetch existing feedback", error);
            }
        };

        fetchExistingFeedback();
        setRefresh(false); // Reset refresh state after fetching
    }, [refresh]);


    const handleSubmit = async () => {
        try {
            console.log("Submitting feedback:", feedback, rating);
            const res = await axios.post(`${HOST}/api/auth/feedback/add`, {
                feedback_text: feedback,
                rating: rating,
            }, { withCredentials: true });

            alert("Feedback submitted successfully!"); // Keep as an alert?
            setFeedback("");
            setRating(5);
            setRefresh(!refresh); // Trigger a refresh to fetch new feedback
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
                maxLength="1000"
            />
            <div className="rating-stars" style={{ margin: "1em 0" }}>
                <span>Rating: </span>
                {[1, 2, 3, 4, 5].map((val) => (
                    <span
                        key={val}
                        style={{
                            cursor: "pointer",
                            color: val <= rating ? "#FFD700" : "#ccc",
                            fontSize: "2em",
                            transition: "color 0.2s"
                        }}
                        onClick={() => setRating(val)}
                        aria-label={`${val} Star${val > 1 ? "s" : ""}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setRating(val);
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
            <button type="submit" onClick={handleSubmit}>Submit</button>

             {existingFeedback?.length > 0 && (
                <div className="existing-feedback-block">
                    <h2>Your Submitted Feedback</h2>
                    {existingFeedback.map((entry, index) => (
                    <div key={index} className="feedback-entry">
                        <p><strong>Rating:</strong> {entry.rating} ★</p>
                        <p><strong>Feedback:</strong> {entry.feedback_text}</p>
                        {entry.admin_response && (
                        <p className="admin-response">
                            <strong>Admin Response:</strong> {entry.admin_response}
                        </p>
                        )}
                        <hr />
                    </div>
                    ))}
                </div>
            )}
        </main>
    );
}