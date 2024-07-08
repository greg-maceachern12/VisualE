import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import "../styles/PaymentStep.scss";


const PaymentStep = ({ handlePayNow, isPremiumUser, fileError }) => {
  return (
    <div className="payment-step">
      <h2>Step 1: Unlock Visualization</h2>
      {isPremiumUser ? (
        <div className="premium-message">
          <p>You have already unlocked the visualization feature. Proceed to Step 2.</p>
        </div>
      ) : (
        <div>
          <p>Unlock the ability to visualize your ebook for just $5.</p>
          <button onClick={handlePayNow} className="pay-button">
            <FontAwesomeIcon icon={faCreditCard} /> $5 to Unlock
          </button>
        </div>
      )}
      {fileError && <p className="error-message">{fileError}</p>}
    </div>
  );
};

export default PaymentStep;