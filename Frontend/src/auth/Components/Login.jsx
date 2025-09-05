import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../store/authSlice';
import Swal from 'sweetalert2';
import '../Styles/CommonAuth.css';
import {
    validateUsername,
    validateFullName,
    validateEmail,
    validateMobile,
    validatePassword,
} from '../../component/commonValidation/frontendValidation';
export const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
    // SetFormData and use of useState
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        mobile: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        username: '',
        name: '',
        email: '',
        mobile: '',
        password: '',
    });

    // To handle Signup CLick button
    const handleSignUpClick = () => {
        setIsActive(true);
    };

    // To handle Signup form submit
    const handleLoginClick = () => {
        setIsActive(false);
    };

    // To check the input change and trigger the validation. 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' }); // Clear error on input change
        }
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                error = validateUsername(value);
                break;
            case 'name':
                error = validateFullName(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'mobile':
                error = validateMobile(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: error }));

        return error === '';
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleSubmit = async (e, isLogin) => {
        e.preventDefault();
        let isValid = true;
        let endpoint = '';
        let body = {};

        if (isLogin) {
            // Validate login form
            isValid = validateField('email', formData.email) &&
                validateField('password', formData.password);
            endpoint = '/api/auth/login';
            body = { email: formData.email, password: formData.password };
        } else {
            // Validate signup form
            const mobileNumber = Number(formData.mobile);

            if (isNaN(mobileNumber)) {
                alert("Mobile number must be numeric.");
                return;
            }
            isValid = validateField('username', formData.username) &&
                validateField('name', formData.name) &&
                validateField('email', formData.email) &&
                validateField('mobile', mobileNumber) &&
                validateField('password', formData.password);
            console.log("isvalid", isValid);
            if (!isValid) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Failed',
                    text: 'Please correct the errors in the form.',
                    confirmButtonText: 'OK'
                });
                return;
            }
            endpoint = '/api/auth/register';
            body = {
                ...formData,
                mobile: Number(mobileNumber),
            };
        }

        if (isValid) {
            // Form is valid, proceed with submission
            try {
                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                const data = await response.json();
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: isLogin ? 'Login Successful!' : 'Registration Successful!',
                        text: data.message,
                        confirmButtonText: 'OK'
                    }).then(() => {
                        if (isLogin) {
                            // On successful login, dispatch login action
                            dispatch(setLogin({ token: data.token, user: data.user }));
                            navigate('/home', { replace: true }); // Redirect to home
                        } else {
                            // On successful registration, redirect to email verification
                            navigate('/email-verification', { state: { userId: data.userId } }); // Pass userId from backend
                        }
                    });
                } else {
                    if (isLogin && response.status === 403 && data.userId) {
                        Swal.fire({
                            icon: 'info', // Use info icon as it's not a hard error, but requires action
                            title: 'Email Not Verified',
                            text: data.message,
                            confirmButtonText: 'Verify Now'
                        }).then(() => {
                            // Redirect to email verification page with the userId
                            navigate('/email-verification', { state: { userId: data.userId } });
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: isLogin ? 'Login Failed' : 'Registration Failed',
                            text: data.message || 'An error occurred. Please try again.',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            } catch (error) {
                console.error('Network Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'An error occurred. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    return (
        <>
            <Container className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                {/* Mobile Version - Hidden on desktop */}
                <div className={`content-mobile shadow-lg d-md-none ${isActive ? 'active' : ''}`}
                    style={{ backgroundColor: 'aliceblue', borderRadius: '40px', overflow: 'hidden', width: '90vw', padding: '20px', margin: '20px 0', minHeight: '480px' }}>

                    {/* Login Section */}
                    <div className={`login-section ${isActive ? 'd-none' : 'd-block'}`}>
                        <div className="header-text mb-4 text-center">
                            <h1>Hello, Again</h1>
                            <p>We are happy to see you back here.</p>
                        </div>
                        <form onSubmit={(e) => handleSubmit(e, true)}>
                            <div className="input-group mb-3">
                                <input type="email" placeholder='Email *' className='form-control form-control-lg bg-light fs-6' value={formData.email}
                                    onChange={handleInputChange} onBlur={handleBlur} name='email' />
                                {errors.email && <small className="text-danger w-100">{errors.email}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" placeholder='Password *' name="password" className='form-control form-control-lg bg-light fs-6' value={formData.password}
                                    onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.password && <small className="text-danger w-100">{errors.password}</small>}
                            </div>
                            <div className="input-group mb-3 d-flex justify-content-between">
                                <div className="form-check">
                                    <input type="checkbox" className='form-check-input' />
                                    <label htmlFor="formCheck" className='form-check-label text-secondary'>
                                        <small>Remember Me</small>
                                    </label>
                                </div>
                                <div className="forget">
                                    <small><Link to="/forgot-password">Forget Password?</Link></small>
                                </div>
                            </div>
                            <div className="input-group mb-3 justify-content-center">
                                <button type="submit" className='btn w-100 fs-6'>Login Now</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <p>Don't have an account? <button className="btn py-1 px-4 color-white" onClick={handleSignUpClick}>Sign Up</button></p>
                        </div>
                    </div>

                    {/* Signup Section */}
                    <div className={`signup-section ${isActive ? 'd-block' : 'd-none'}`}>
                        <div className="header-text mb-4 text-center">
                            <h1>Welcome</h1>
                            <p>Join our Mould's Unique Platform. Explore a new Experience.</p>
                        </div>
                        <form onSubmit={(e) => handleSubmit(e, false)}>
                            <div className="input-group mb-3">
                                <input type="text" placeholder='UserName *' name="username" className='form-control form-control-lg bg-light fs-6' value={formData.username} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.username && <small className="text-danger w-100">{errors.username}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" placeholder='Name *' name="name" className='form-control form-control-lg bg-light fs-6' value={formData.name} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.name && <small className="text-danger w-100">{errors.name}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="email" placeholder='Email *' name='email' className='form-control form-control-lg bg-light fs-6' value={formData.email} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.email && <small className="text-danger w-100">{errors.email}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" placeholder='Mobile Number *' className='form-control form-control-lg bg-light fs-6' name='mobile' value={formData.mobile} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.mobile && <small className="text-danger w-100">{errors.mobile}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" placeholder='Password *' className='form-control form-control-lg bg-light fs-6' value={formData.password} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.password && <small className="text-danger w-100">{errors.password}</small>}
                            </div>
                            <div className="input-group mb-3 justify-content-center">
                                <button type='submit' className='btn w-100 fs-6'>Submit</button>
                            </div>
                        </form>
                        <div className="text-center mt-3">
                            <p>Already have an account? <button className="btn py-1 px-4 color-white" onClick={handleLoginClick}>Login</button></p>
                        </div>
                    </div>
                </div>

                {/* Desktop Version - Hidden on mobile */}
                <div  className={`content d-none d-md-flex shadow-lg  ${isActive ? 'active' : ''}`}
                    style={{ backgroundColor: 'aliceblue', borderRadius: '40px',border: '2px solid #565555', position: 'relative', overflow: 'hidden', width: '50vw', minHeight: '480px', maxWidth: '900px', maxHeight: '90vh' }}>

                    {/* Register Form */}
                    <div className="col-md-6 left-box">
                        <form onSubmit={(e) => handleSubmit(e, false)}>
                            <div className="header-text mb-4">
                                <h1>Create Account</h1>
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" placeholder='UserName *' name="username" className='form-control form-control-lg bg-light fs-6' value={formData.username} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.username && <small className="text-danger w-100">{errors.username}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" placeholder='Name *' name="name" className='form-control form-control-lg bg-light fs-6' value={formData.name} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.name && <small className="text-danger w-100">{errors.name}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="email" placeholder='Email *' name='email' className='form-control form-control-lg bg-light fs-6' value={formData.email} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.email && <small className="text-danger w-100">{errors.email}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" placeholder='Mobile Number *' name='mobile' className='form-control form-control-lg bg-light fs-6' value={formData.mobile} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.mobile && <small className="text-danger w-100">{errors.mobile}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" placeholder='Password *' name="password" className='form-control form-control-lg bg-light fs-6' value={formData.password} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.password && <small className="text-danger w-100">{errors.password}</small>}
                            </div>
                            <div className="input-group mb-3 justify-content-center">
                                <button type="submit" className='btn w-50 fs-6'>Submit</button>
                            </div>
                        </form>
                    </div>

                    {/* Login Form */}
                    <div className="col-md-6 right-box">
                        <form onSubmit={(e) => handleSubmit(e, true)}>
                            <div className="header-text mb-4">
                                <h1>Sign In</h1>
                            </div>
                            <div className="input-group mb-3">
                                <input type="email" placeholder='Email *' name="email" className='form-control form-control-lg bg-light fs-6' value={formData.email} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.email && <small className="text-danger w-100">{errors.email}</small>}
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" placeholder='Password *' name="password" className='form-control form-control-lg bg-light fs-6' value={formData.password} onChange={handleInputChange} onBlur={handleBlur} />
                                {errors.password && <small className="text-danger w-100">{errors.password}</small>}
                            </div>
                            <div className="input-group mb-5 d-flex justify-content-between">
                                <div className="form-check">
                                    <input type="checkbox" className='form-check-input' />
                                    <label htmlFor="formCheck" className='form-check-label text-secondary'>
                                        <small>Remember Me</small>
                                    </label>
                                </div>
                                <div className="forget">
                                    <small><Link to="/forgot-password">Forget Password</Link></small>
                                </div>
                            </div>
                            <div className="input-group mb-3 justify-content-center">
                                <button type="submit" className='btn w-50 fs-6'>Login Now</button>
                            </div>
                        </form>
                    </div>

                    {/* Switch panel */}
                    <div className="switch-content">
                        <div className="switch">
                            <div className="switch-panel switch-left">
                                <h1>Hello, Again</h1>
                                <p>We are happy to see you back here.</p>
                                <button className='btn w-50 fs-6' id='login' onClick={handleLoginClick}>Login</button>
                            </div>
                            <div className="switch-panel switch-right">
                                <h1>Welcome</h1>
                                <p>Join our Mould's Unique Platform. Explore a new Experience.</p>
                                <button className='btn w-50 fs-6' id='signup' onClick={handleSignUpClick}>SignUp</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Login;