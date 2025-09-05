// Frontend/src/views/Auth/ForgotPassword.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Spinner, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import './Styles/EmailVerificationStyles.css'; // Reuse OTP box styling if needed
import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
} from '../../component/commonValidation/frontendValidation.jsx';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const ForgotPassword = () => {
    const navigate = useNavigate();

    // State for the multi-step form
    const [step, setStep] = useState(1); // 1: Email Input, 2: OTP Verification, 3: New Password
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null); // Will store userId after email lookup
    const [otp, setOtp] = useState(['', '', '', '', '']); // For 5-digit OTP
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({ newPassword: '', confirmPassword: '' });

    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0); // For resend OTP cooldown
    const otpInputRefs = useRef([]); // Refs for OTP input boxes

    // Handle resend OTP cooldown
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Handle email submission (Step 1)
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        // if (!validateEmail(email)) {
        //     console.log(email);
        //     Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.s' });
        //     return;
        // }
        const error = validateEmail(email);
        if (error) {
            console.log(email);
            Swal.fire({ icon: 'error', title: 'Invalid Email', text: error });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setUserId(data.userId); // Store userId for subsequent steps
                setStep(2); // Move to OTP verification step
                Swal.fire({ icon: 'success', title: 'OTP Sent!', text: data.message });
                setResendCooldown(60); // Start cooldown for resend
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Failed to send OTP.' });
            }
        } catch (error) {
            console.error('Network error during forgot password request:', error);
            setLoading(false);
            Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not connect to the server. Please try again.' });
        }
    };

    // Handle OTP input changes (for 5-digit boxes)
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/^[a-zA-Z0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value !== '' && index < 4) {
                otpInputRefs.current[index + 1].focus();
            }
        }
    };
    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').trim();
        if (pasteData.length === 5 && /^[a-zA-Z0-9]{5}$/.test(pasteData)) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            otpInputRefs.current[4].focus();
        } else {
            Swal.fire({ icon: 'error', title: 'Invalid Paste', text: 'Please paste a valid 5-digit alphanumeric OTP.' });
        }
    };

    // Handle OTP verification (Step 2)
    const handleOtpVerification = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');

        if (fullOtp.length !== 5) {
            Swal.fire({ icon: 'warning', title: 'Invalid OTP', text: 'Please enter the full 5-digit OTP.' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password-verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, otp: fullOtp }),
            });
            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setStep(3); // Move to New Password step
                Swal.fire({ icon: 'success', title: 'OTP Verified!', text: data.message });
            } else {
                Swal.fire({ icon: 'error', title: 'Verification Failed', text: data.message || 'An error occurred during OTP verification.' });
            }
        } catch (error) {
            console.error('Network error during OTP verification:', error);
            setLoading(false);
            Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not connect to the server. Please try again.' });
        }
    };

    // Handle new password submission (Step 3)
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation for new password and confirm password (Requirement 6)
        let newPassError = validatePassword(newPassword);
        let confirmPassError = validateConfirmPassword(newPassword, confirmPassword);

        setPasswordErrors({ newPassword: newPassError, confirmPassword: confirmPassError });

        if (newPassError || confirmPassError) {
            Swal.fire({ icon: 'error', title: 'Validation Failed', text: 'Please correct password errors.' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, password: newPassword }),
            });
            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                Swal.fire({ icon: 'success', title: 'Password Reset!', text: data.message }).then(() => {
                    navigate('/login', { replace: true }); // Redirect to login page
                });
            } else {
                Swal.fire({ icon: 'error', title: 'Reset Failed', text: data.message || 'Failed to reset password.' });
            }
        } catch (error) {
            console.error('Network error during password reset:', error);
            setLoading(false);
            Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not connect to the server. Please try again.' });
        }
    };

    // Handle resend OTP (from Step 2)
    const handleResend = async () => {
        if (!userId) {
            Swal.fire({ icon: 'error', title: 'Missing User ID', text: 'Cannot resend OTP. Please restart process.' });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password-request`, { // Reuse this endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }), // Send email again for resend
            });
            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                Swal.fire({ icon: 'success', title: 'New OTP Sent!', text: data.message });
                setResendCooldown(60);
                setOtp(['', '', '', '', '']); // Clear OTP input fields
                otpInputRefs.current[0].focus(); // Focus first input
            } else {
                Swal.fire({ icon: 'error', title: 'Resend Failed', text: data.message || 'An error occurred while resending OTP.' });
            }
        } catch (error) {
            console.error('Network error during OTP resend:', error);
            setLoading(false);
            Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not connect to the server. Please try again.' });
        }
    };


    const renderFormContent = () => {
        switch (step) {
            case 1: // Email Input
                return (
                    <Form onSubmit={handleEmailSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Send OTP'}
                        </Button>
                    </Form>
                );
            case 2: // OTP Verification
                return (
                    <Form onSubmit={handleOtpVerification}>
                        <p className="text-center text-muted mb-4">
                            Please enter the 5-digit alphanumeric OTP sent to your email.
                        </p>
                        <div className="otp-input-container mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    onPaste={handleOtpPaste}
                                    ref={(el) => (otpInputRefs.current[index] = el)}
                                    className="otp-input-box text-center"
                                    disabled={loading}
                                />
                            ))}
                        </div>
                        <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading || otp.join('').length !== 5}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Verify OTP'}
                        </Button>
                        <div className="text-center">
                            <Button variant="link" onClick={handleResend} disabled={resendCooldown > 0 || loading}>
                                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                            </Button>
                        </div>
                    </Form>
                );
            case 3: // New Password
                return (
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setPasswordErrors(prev => ({ ...prev, newPassword: validatePassword(e.target.value) }));
                                }}
                                isInvalid={!!passwordErrors.newPassword}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{passwordErrors.newPassword}</Form.Control.Feedback>
                            {/* Requirement 8: Password combination requirement */}
                            <Form.Text className="text-muted">
                                Password must be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(newPassword, e.target.value) }));
                                }}
                                onBlur={(e) => setPasswordErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(newPassword, e.target.value) }))}
                                isInvalid={!!passwordErrors.confirmPassword}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{passwordErrors.confirmPassword}</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                        </Button>
                    </Form>
                );
            default:
                return null;
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card className="p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Forgot Password</h2>
                    {renderFormContent()}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword;