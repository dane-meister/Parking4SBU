import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import '../stylesheets/FeedbackFormModal.css';
import axios from 'axios';

Modal.setAppElement('#root');

const HOST = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function FeedbackFormModal({ isOpen, onRequestClose, feedback, refreshFeedbackList }) {
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    if (feedback) {
      setResponseText(feedback.admin_response || '');
    }
  }, [feedback, isOpen]);

  const handleFeedbackResponse = async () => {
    try {
      await axios.put(`${HOST}/api/admin/feedback/${feedback.feedback_id}/respond`, {
        response_text: responseText
      }, { withCredentials: true });

      refreshFeedbackList?.(); // if passed
      onRequestClose();
    } catch (err) {
      console.error('Failed to respond to feedback', err);
      alert('Failed to save response');
    }
  };

  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      id="feedback-form-modal"
      style={styles}
    >
      <h2 className="feedback-edit-h2">Respond to Feedback</h2>
      <section className="padding-wrapper" style={{ padding: '25px', paddingTop: '0px' }}>
        <div className="feedback-details">
          <p><strong>User ID:</strong> {feedback?.user_id}</p>
          <p><strong>Lot ID:</strong> {feedback?.parking_lot_id}</p>
          <p><strong>Feedback:</strong> {feedback?.feedback_text}</p>
          <p><strong>Rating:</strong> {feedback?.rating}</p>
          <p><strong>Current Response:</strong> {feedback?.admin_response || "No response yet"}</p>
        </div>

        <label htmlFor="response-text" className="feedback-lbl">Write your Response:</label>
        <textarea
          id="response-text"
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          rows="6"
          style={{ width: '100%' }}
        />

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn-cancel" onClick={onRequestClose}>Cancel</button>
          <button className="btn-submit" onClick={handleFeedbackResponse}>Save Response</button>
        </div>
      </section>
    </Modal>
  );
}

const styles = {
  content: {
    marginTop: 'calc(60px + 30px)',
    width: '500px',
    maxHeight: 'min(60vh, 800px)',
    minHeight: '400px',
    justifySelf: 'center',
    alignSelf: 'center',
    padding: '0',
    zIndex: 3000,
    border: 'none'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
};
