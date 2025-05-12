import React from 'react';

export default function AdminFeedback({
  feedbackList,
  setActiveFeedback
}) {
  return (
    <>
      <h2>User Feedback</h2>
      <div className="user-list">
        {feedbackList.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          feedbackList.map(feedback => (
            <div className="user-card" key={feedback.feedback_id}>
              <div className="user-info">
                User ID: {feedback.user_id}<br />
                Feedback: {feedback.feedback_text}<br />
                Rating: {feedback.rating}<br />
                Response: {feedback.admin_response || "No response yet"}<br />
                <button
                  className="respond-button"
                  onClick={() => setActiveFeedback(feedback)}
                >
                  Respond
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
