import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const PaymentSuccess = () => {
  const [message, setMessage] = useState('Processing your payment...');
  const navigate = useNavigate();

  useEffect(() => {
    const processPayment = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;

        if (user) {
          const { error: updateError } = await supabase.auth.updateUser({
            data: { is_premium: true, premium_since: new Date().toISOString() }
          });

          if (updateError) throw updateError;

          setMessage('Payment successful! You now have access to one book generation. This access will be used up after you generate and download a book.');
          setTimeout(() => navigate('/'), 5000); // Redirect to home page after 5 seconds
        } else {
          throw new Error('User not found');
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        setMessage('There was an error processing your payment. Please contact support.');
      }
    };

    processPayment();
  }, [navigate]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default PaymentSuccess;