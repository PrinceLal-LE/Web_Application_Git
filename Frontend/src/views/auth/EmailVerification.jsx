// Frontend/src/views/Auth/EmailVerification.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../store/authSlice'; // To log in after successful verification
import { Container, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2'; // For alerts
import "./Styles/EmailVerificationStyles.css"
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const EmailVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '']); // 5-digit alphanumeric
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0); // Cooldown timer for resend OTP
    const inputRefs = useRef([]);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get userId from location state (passed from registration)
    const userId = location.state?.userId;

    useEffect(() => {
        if (!userId) {
            Swal.fire({
                icon: 'error',
                title: 'Missing User ID',
                text: 'User ID not provided. Please register or log in again.',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/register', { replace: true }); // Redirect to registration if no userId
            });
        }
    }, [userId, navigate]);

    // Handle resend OTP cooldown
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);


    const handleChange = (e, index) => {
        const value = e.target.value;

        // Allow only single alphanumeric character
        if (/^[a-zA-Z0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move focus to next input if a character is entered and not last input
            if (value !== '' && index < 4) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        // Move focus to previous input on backspace if current is empty
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').trim();
        if (pasteData.length === 5 && /^[a-zA-Z0-9]{5}$/.test(pasteData)) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            // Focus the last input after pasting
            inputRefs.current[4].focus();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Paste',
                text: 'Please paste a valid 5-digit alphanumeric OTP.',
                confirmButtonText: 'OK'
            });
        }
    };


    const handleVerify = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');

        if (fullOtp.length !== 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid OTP',
                text: 'Please enter the full 5-digit OTP.',
                confirmButtonText: 'OK'
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, otp: fullOtp }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Verification Successful!',
                    text: data.message,
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Log in the user after successful verification and redirect to home
                    dispatch(setLogin({ token: data.token, user: data.user }));
                    navigate('/home', { replace: true });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Verification Failed',
                    text: data.message || 'An error occurred during verification.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Network error during OTP verification:', error);
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Could not connect to the server. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleResend = async () => {
        if (!userId) {
            Swal.fire({
                icon: 'error',
                title: 'Missing User ID',
                text: 'Cannot resend OTP without user ID. Please register again.',
                confirmButtonText: 'OK'
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Resent!',
                    text: data.message,
                    confirmButtonText: 'OK'
                });
                setResendCooldown(60); // Start 60-second cooldown
                setOtp(['', '', '', '', '']); // Clear OTP input fields
                inputRefs.current[0].focus(); // Focus first input
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Resend Failed',
                    text: data.message || 'An error occurred while resending OTP.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Network error during OTP resend:', error);
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Could not connect to the server. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    if (!userId && !loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Loading user data or redirecting...</p>
            </div>
        );
    }

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card className="p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Email Verification</h2>
                    <p className="text-center text-muted mb-4">
                        Please enter the 5-digit alphanumeric OTP sent to your registered email address.
                    </p>
                    <Form onSubmit={handleVerify}>
                        <div className="otp-input-container mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    className="otp-input-box text-center"
                                    disabled={loading}
                                />
                            ))}
                        </div>
                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3"
                            disabled={loading || otp.join('').length !== 5}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify Email'
                            )}
                        </Button>
                        <div className="text-center">
                            <Button
                                variant="link"
                                onClick={handleResend}
                                disabled={resendCooldown > 0 || loading}
                            >
                                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EmailVerification;