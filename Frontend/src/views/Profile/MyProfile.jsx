
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile, setLogout } from '../../store/authSlice';
import { Container, Row, Col, Card, Form, Button, Image, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2'; // Import SweetAlert2

const defaultProfilePhoto = '/home/profile_icon.png'; // Using your provided local image
const defaultCoverPhoto = '/home/Left_side_icon.png'; // Using your provided local image

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const MyProfile = () => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated, isLoading: authLoading } = useSelector((state) => state.auth);

    const [profileData, setProfileData] = useState({
        name: '',
        // email: user?.email || '',
        email: '',
        mobile: '',
        address: '',
        profession: '',
        about_me: '',
        skills: '',
        linkedin_profile_url: '',
        twitter_profile_url: '',
    });

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(defaultProfilePhoto);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(defaultCoverPhoto);
    const [isDeleting, setIsDeleting] = useState(false); // Track deletion state
    const [deletingType, setDeletingType] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null); // Keep for general component error display
    const [successMessage, setSuccessMessage] = useState(null); // Keep for general component success display

    // Function to handle unauthorized access: log out user
    const handleUnauthorized = (message = "Your session has expired or user not found. Please log in again.") => {
        dispatch(setLogout()); // Dispatch logout action to clear Redux state and localStorage
        Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: message,
            confirmButtonText: 'OK'
        }).then(() => {
            // No need to navigate here, PrivateRoute will handle redirection after dispatch(setLogout())
        });
    };

    // Effect to fetch ALL profile data (User details + Profile details) from the backend
    useEffect(() => {
        const fetchAllProfileData = async () => {
            if (!user?.id || !token) {
                handleUnauthorized();
                setLoadingProfile(false);
                return;
            }

            try {
                // Fetch User details (name, mobile)
                const userDetailsResponse = await fetch(`${API_BASE_URL}/api/auth/getUserDetails/${user.id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!userDetailsResponse.ok) {
                    // If 401 or 403 (e.g., user not found in DB)
                    if (userDetailsResponse.status === 401 || userDetailsResponse.status === 403) {
                        const errorData = await userDetailsResponse.json();
                        handleUnauthorized(errorData.message || "Failed to fetch user details. Session expired.");
                        return; // Stop further execution
                    }
                    const errorData = await userDetailsResponse.json();
                    throw new Error(errorData.message || `Failed to fetch user details (status: ${userDetailsResponse.status})`);
                }
                const userDetailsResult = await userDetailsResponse.json();
                const fetchedUserDetails = userDetailsResult.user;

                // Update Redux user object with fetched details (fullName, mobile) for volatile use
                dispatch(updateUserProfile({ fullName: fetchedUserDetails.fullName, mobile: fetchedUserDetails.mobile }));

                // Fetch Profile details (address, profession, etc.)
                const profileResponse = await fetch(`${API_BASE_URL}/api/profile/${user.id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!profileResponse.ok) {
                    // If 401 or 403 (e.g., user not found in DB)
                    if (profileResponse.status === 401 || profileResponse.status === 403) {
                        const errorData = await profileResponse.json();
                        handleUnauthorized(errorData.message || "Failed to fetch profile details. Session expired.");
                        return; // Stop further execution
                    }
                    const errorData = await profileResponse.json();
                    if (profileResponse.status === 200 && errorData.profile === null) {
                        console.log(errorData.message || 'Profile not found, ready for creation.');
                    } else {
                        throw new Error(errorData.message || `Failed to fetch profile details (status: ${profileResponse.status})`);
                    }
                }
                const profileResult = await profileResponse.json();
                const fetchedProfile = profileResult.profile;

                // Set local state for all form fields
                setProfileData((prev) => ({
                    ...prev,
                    name: fetchedUserDetails.name || '',
                    email: fetchedUserDetails.email || '',
                    mobile: fetchedUserDetails.mobile || '',
                    address: fetchedProfile?.address || '',
                    profession: fetchedProfile?.profession || '',
                    about_me: fetchedProfile?.about_me || '',
                    skills: fetchedProfile?.skills || '',
                    linkedin_profile_url: fetchedProfile?.linkedin_profile_url || '',
                    twitter_profile_url: fetchedProfile?.twitter_profile_url || '',
                }));

                // Set image previews
                if (fetchedProfile?.profile_photo_filepath) {
                    setProfilePhotoPreview(`${API_BASE_URL}/eRepo/${fetchedProfile.profile_photo_filepath}`);
                }
                if (fetchedProfile?.cover_photo_filepath) {
                    setCoverPhotoPreview(`${API_BASE_URL}/eRepo/${fetchedProfile.cover_photo_filepath}`);
                }

            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError("Failed to load profile data. " + err.message);
            } finally {
                setLoadingProfile(false);
            }
        };

        if (isAuthenticated && user?.id) {
            fetchAllProfileData();
        } else {
            setLoadingProfile(false);
        }
    }, [user?.id, token, isAuthenticated, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxCoverSize = 2 * 1024 * 1024; // 2 MB
        const maxProfileSize = 1 * 1024 * 1024; // 1 MB

        if (!acceptedTypes.includes(file.type)) {
            Swal.fire({ // Use SweetAlert2 for error
                icon: 'error',
                title: 'Invalid File Type',
                text: `Only JPG, JPEG, and PNG image files are allowed for ${type} photo.`,
            });
            e.target.value = null; // Clear the input
            return;
        }

        if (type === 'cover' && file.size > maxCoverSize) {
            Swal.fire({ // Use SweetAlert2 for error
                icon: 'error',
                title: 'File Too Large',
                text: `Cover photo cannot be larger than 2 MB.`,
            });
            e.target.value = null;
            return;
        }

        if (type === 'profile' && file.size > maxProfileSize) {
            Swal.fire({ // Use SweetAlert2 for error
                icon: 'error',
                title: 'File Too Large',
                text: `Profile photo cannot be larger than 1 MB.`,
            });
            e.target.value = null;
            return;
        }

        setError(null); // Clear previous general error

        if (type === 'profile') {
            setProfilePhoto(file);
            setProfilePhotoPreview(URL.createObjectURL(file));
        } else if (type === 'cover') {
            setCoverPhoto(file);
            setCoverPhotoPreview(URL.createObjectURL(file));
        }
    };

    // const handleRemovePhoto = (type) => {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: `You are about to remove your ${type} photo. This cannot be undone!`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, remove it!'
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             if (!user?.id || !token) {
    //                 Swal.fire('Error!', 'Authentication details are missing. Please log in again.', 'error');
    //                 return;
    //             }
    //             setIsDeleting(true); // Start loading spinner for deletion
    //             try {
    //                 // CRITICAL: Make a POST request to the new endpoint
    //                 const response = await fetch(`${API_BASE_URL}/api/profile/delete-photo`, {
    //                     method: 'POST', // Use POST method
    //                     headers: {
    //                         'Content-Type': 'application/json', // Set Content-Type for POST request body
    //                         'Authorization': `Bearer ${token}`
    //                     },
    //                     // CRITICAL: Send userId and photoType in the request body
    //                     body: JSON.stringify({
    //                         userId: user.id,
    //                         photoType: type,
    //                     })
    //                 });

    //                 const data = await response.json();
    //                 setIsDeleting(false); // Stop loading

    //                 if (response.ok) {
    //                     Swal.fire('Deleted!', data.message, 'success');
    //                     // Update local state to reflect the deletion
    //                     if (type === 'profile') {
    //                         setProfilePhoto(null);
    //                         setProfilePhotoPreview(defaultProfilePhoto);
    //                     } else if (type === 'cover') {
    //                         setCoverPhoto(null);
    //                         setCoverPhotoPreview(defaultCoverPhoto);
    //                     }
    //                 } else {
    //                     Swal.fire('Failed!', data.message || 'An error occurred during deletion.', 'error');
    //                 }
    //             } catch (error) {
    //                 console.error('Network error during photo deletion:', error);
    //                 setIsDeleting(false);
    //                 Swal.fire('Failed!', 'Could not connect to the server.', 'error');
    //             }
    //         }
    //     });
    // };

    const handleRemovePhoto = (type) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to remove your ${type} photo. This cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!user?.id || !token) {
                    Swal.fire('Error!', 'Authentication details are missing. Please log in again.', 'error');
                    return;
                }
                setIsDeleting(true); // Start loading spinner for deletion
                setDeletingType(type); // Set the type of photo being deleted
                try {
                    const response = await fetch(`${API_BASE_URL}/api/profile/delete-photo`, {
                        method: 'POST', // Use POST method
                        headers: {
                            'Content-Type': 'application/json', // Set Content-Type for POST request body
                            'Authorization': `Bearer ${token}`
                        },
                        // CRITICAL: Send userId and photoType in the request body
                        body: JSON.stringify({
                            userId: user.id,
                            photoType: type,
                        })
                    });

                    const data = await response.json();
                    setIsDeleting(false); // Stop loading
                    setDeletingType(null); // Reset the type

                    if (response.ok) {
                        Swal.fire('Deleted!', data.message, 'success');
                        // Update local state to reflect the deletion
                        if (type === 'profile') {
                            setProfilePhoto(null);
                            setProfilePhotoPreview(defaultProfilePhoto);
                        } else if (type === 'cover') {
                            setCoverPhoto(null);
                            setCoverPhotoPreview(defaultCoverPhoto);
                        }
                    } else {
                        Swal.fire('Failed!', data.message || 'An error occurred during deletion.', 'error');
                    }
                } catch (error) {
                    console.error('Network error during photo deletion:', error);
                    setIsDeleting(false);
                    setDeletingType(null);
                    Swal.fire('Failed!', 'Could not connect to the server.', 'error');
                }
            }
        });
    };

    const validateForm = () => {
        setError(null);
        setSuccessMessage(null);

        const mobileRegex = /^(\+?\d{1,3}[- ]?)?\d{7,15}$/;
        if (profileData.mobile && !mobileRegex.test(profileData.mobile)) {
            Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid mobile number format. Please enter 7-15 digits, optionally with country code.' }); //
            return false;
        }

        if (profileData.about_me.length > 255) {
            Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'About Me cannot exceed 255 characters.' }); //
            return false;
        }
        if (profileData.skills.length > 1000) {
            Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Skills cannot exceed 1000 characters.' }); //
            return false;
        }

        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        if (profileData.linkedin_profile_url && !urlRegex.test(profileData.linkedin_profile_url)) {
            Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid LinkedIn URL. Must start with http:// or https://' }); //
            return false;
        }
        if (profileData.twitter_profile_url && !urlRegex.test(profileData.twitter_profile_url)) {
            Swal.fire({ icon: 'error', title: 'Invalid Input', text: 'Invalid Twitter URL. Must start with http:// or https://' }); //
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!user?.id || !token) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Error',
                text: 'Authentication details missing. Please log in again.'
            });
            return;
        }

        setSaving(true);
        setError(null);
        setSuccessMessage(null); // Clear previous messages

        try {
            // --- 1. Update User Schema (name, mobile) ---
            const userUpdatePayload = {
                name: profileData.name,
                mobile: profileData.mobile,
            };

            const userUpdateResponse = await fetch(`${API_BASE_URL}/api/auth/updateUser/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userUpdatePayload),
            });

            const userUpdateResult = await userUpdateResponse.json();
            if (!userUpdateResponse.ok) {
                if (userUpdateResponse.status === 401 || userUpdateResponse.status === 403) {
                    handleUnauthorized(userUpdateResult.message || "Failed to update user data. Session expired.");
                    return;
                }
                throw new Error(userUpdateResult.message || 'Failed to update user data.');
            }
            dispatch(updateUserProfile({ fullName: userUpdateResult.user.fullName, mobile: userUpdateResult.user.mobile }));


            // --- 2. Update/Create Profile Schema (other fields + photos) ---
            const profileFormData = new FormData();
            profileFormData.append('address', profileData.address);
            profileFormData.append('profession', profileData.profession);
            profileFormData.append('about_me', profileData.about_me);
            profileFormData.append('skills', profileData.skills);
            profileFormData.append('linkedin_profile_url', profileData.linkedin_profile_url);
            profileFormData.append('twitter_profile_url', profileData.twitter_profile_url);

            if (profilePhoto) profileFormData.append('profile_photo', profilePhoto);
            if (coverPhoto) profileFormData.append('cover_photo', coverPhoto);
            // if (profilePhotoRemoved) profileFormData.append('profile_photo_removed', 'true');
            // if (coverPhotoRemoved) profileFormData.append('cover_photo_removed', 'true');

            const profileUpdateResponse = await fetch(`${API_BASE_URL}/api/profile/${user.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: profileFormData,
            });

            const profileUpdateResult = await profileUpdateResponse.json();
            if (!profileUpdateResponse.ok) {
                if (profileUpdateResponse.status === 401 || profileUpdateResponse.status === 403) {
                    handleUnauthorized(profileUpdateResult.message || "Failed to update profile data. Session expired.");
                    return;
                }
                throw new Error(profileUpdateResult.message || 'Failed to update profile data.');
            }

            // Show combined success message with SweetAlert2
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: (userUpdateResult.message || 'User data updated.') + ' ' + (profileUpdateResult.message || 'Profile data updated.'),
            });

            // Update photo previews based on backend response
            if (profileUpdateResult.profile && profileUpdateResult.profile.profile_photo_filepath) {
                setProfilePhotoPreview(`${API_BASE_URL}/eRepo/${profileUpdateResult.profile.profile_photo_filepath}`);
            } 


            if (profileUpdateResult.profile && profileUpdateResult.profile.cover_photo_filepath) {
                setCoverPhotoPreview(`${API_BASE_URL}/eRepo/${profileUpdateResult.profile.cover_photo_filepath}`);
            } 


        } catch (err) {
            console.error("Error saving profile:", err);
            Swal.fire({ // Use SweetAlert2 for error
                icon: 'error',
                title: 'Update Failed',
                text: err.message || "An unexpected error occurred while saving.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loadingProfile) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading Profile...</span>
                </Spinner>
                <p className="ms-3 text-secondary">Loading profile...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <p className="text-danger">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center py-0" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', borderRadius: '15px' }}>
            <Container className="bg-white p-4 p-md-4 position-relative" style={{ maxWidth: '100%', borderRadius: '15px' }}>
                {/* Error/Success Messages from general component error/success state */}
                {/* These are less critical as SweetAlert2 handles most explicit feedback */}
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                {/* Cover Photo Section */}
                {/* <div className="position-relative w-100 bg-light rounded overflow-hidden border border-secondary d-flex align-items-center justify-content-center mb-4" style={{ height: '180px' }}>
                    <Image src={coverPhotoPreview} alt="Cover Photo" className="h-100 w-100" style={{ objectFit: 'cover' }} />
                    <div className="position-absolute" style={{ top: '10px', right: '10px' }}>
                        <Form.Label htmlFor="coverPhotoUpload" className="btn btn-sm btn-light rounded-2 shadow-sm me-2" style={{ padding: '0.5rem' }}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Change Cover
                        </Form.Label>
                        <Form.Control
                            type="file"
                            id="coverPhotoUpload"
                            name="cover_photo"
                            onChange={(e) => handleFileChange(e, 'cover')}
                            className="d-none"
                            accept="image/jpeg,image/jpg,image/png"
                        />
                        {coverPhotoPreview !== defaultCoverPhoto && (
                            <Button variant="danger" size="sm" className="rounded-2 shadow-sm" onClick={() => handleRemovePhoto('cover')}>
                                <FontAwesomeIcon icon={faTimes} /> Remove
                            </Button>
                        )}
                    </div>
                </div> */}

                {/* Cover Photo Section */}<div className="position-relative w-100 bg-light rounded overflow-hidden border border-secondary d-flex align-items-center justify-content-center mb-4" style={{ height: '180px' }}>
                    <Image src={coverPhotoPreview} alt="Cover Photo" className="h-100 w-100" style={{ objectFit: 'cover' }} crossOrigin="anonymous" />
                    {/* Spinner inside the image while deleting */}
                    {isDeleting && deletingType === 'cover' && (
                         <div className="position-absolute d-flex justify-content-center align-items-center h-100 w-100" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                             <Spinner animation="border" size="lg" />
                         </div>
                    )}
                    <div className="position-absolute" style={{ top: '10px', right: '10px' }}>
                        <Form.Label htmlFor="coverPhotoUpload" className="btn btn-sm btn-light rounded-2 shadow-sm me-2" style={{ padding: '0.5rem' }}>
                            <FontAwesomeIcon icon={faPencilAlt} /> Change Cover
                        </Form.Label>
                        <Form.Control type="file" id="coverPhotoUpload" name="cover_photo" onChange={(e) => handleFileChange(e, 'cover')} className="d-none" accept="image/jpeg,image/jpg,image/png" />
                        {coverPhotoPreview !== defaultCoverPhoto && (
                            <Button variant="danger" size="sm" className="rounded-2 shadow-sm" onClick={() => handleRemovePhoto('cover')} disabled={isDeleting}>
                                {isDeleting ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faTimes} />} Remove
                            </Button>
                        )}
                    </div>
                </div>

                {/* Profile Picture Section */}
                {/* <div className="position-absolute start-50 translate-middle  border bg-light d-flex align-items-center justify-content-center " style={{ width: '120px', height: '120px', top: '230px', zIndex: 10 }}>
                    <Image src={profilePhotoPreview} alt="Profile Photo" className="h-100 w-100 " style={{ objectFit: 'cover' }} />
                    <div className="position-absolute" style={{ bottom: '0', right: '0' }}>
                        <Form.Label htmlFor="profilePhotoUpload" className="btn btn-sm btn-light rounded-circle p-2 shadow-sm">
                            <FontAwesomeIcon icon={faCamera} />
                        </Form.Label>
                        <Form.Control
                            type="file"
                            id="profilePhotoUpload"
                            name="profile_photo"
                            onChange={(e) => handleFileChange(e, 'profile')}
                            className="d-none"
                            accept="image/jpeg,image/jpg,image/png"
                        />
                    </div>
                    {profilePhotoPreview !== defaultProfilePhoto && (
                        <Button variant="danger" size="sm" className="position-absolute rounded-circle shadow-sm" style={{ bottom: '0', left: '100%', transform: 'translateX(-50%)' }} onClick={() => handleRemovePhoto('profile')}>
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                    )}
                </div> */}

                {/* Profile Picture Section */}
                <div className="position-absolute start-50 translate-middle rounded-circle border bg-light d-flex align-items-center justify-content-center shadow" style={{ width: '120px', height: '120px', top: '230px', zIndex: 10 }}>
                    <Image src={profilePhotoPreview} alt="Profile Photo" className="h-100 w-100 rounded-circle" style={{ objectFit: 'cover' }} crossOrigin="anonymous" />
                    {/* Spinner inside the image while deleting */}
                    {isDeleting && deletingType === 'profile' && (
                         <div className="position-absolute d-flex justify-content-center align-items-center h-100 w-100 rounded-circle" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                             <Spinner animation="border" size="lg" />
                         </div>
                    )}
                    <div className="position-absolute" style={{ bottom: '0', right: '0' }}>
                        <Form.Label htmlFor="profilePhotoUpload" className="btn btn-sm btn-light rounded-circle p-2 shadow-sm">
                            <FontAwesomeIcon icon={faCamera} />
                        </Form.Label>
                        <Form.Control type="file" id="profilePhotoUpload" name="profile_photo" onChange={(e) => handleFileChange(e, 'profile')} className="d-none" accept="image/jpeg,image/jpg,image/png" />
                    </div>
                    {profilePhotoPreview !== defaultProfilePhoto && (
                        <Button variant="danger" size="sm" className="position-absolute rounded-circle shadow-sm" style={{ bottom: '0', left: '100%', transform: 'translateX(-50%)' }} onClick={() => handleRemovePhoto('profile')} disabled={isDeleting}>
                            {isDeleting ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faTimes} />}
                        </Button>
                    )}
                </div>

                <Form onSubmit={handleSubmit} className="mt-5 pt-5">
                    {/* Name and Email */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formName" className="mb-3">
                                <Form.Label className="text-muted">Name :</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleChange}
                                    className="rounded shadow-sm"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label className="text-muted">Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleChange}
                                    className="rounded shadow-sm bg-light"
                                    readOnly
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Mobile and Address */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formMobile" className="mb-3">
                                <Form.Label className="text-muted">Mobile:</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="mobile"
                                    value={profileData.mobile}
                                    onChange={handleChange}
                                    className="rounded shadow-sm"
                                    placeholder="e.g., +1 123-456-7890"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formAddress" className="mb-3">
                                <Form.Label className="text-muted">Address:</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleChange}
                                    className="rounded shadow-sm"
                                    placeholder="e.g., 123 Main St, City, State"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Profession and About Me */}
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formProfession" className="mb-3">
                                <Form.Label className="text-muted">Profession</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="profession"
                                    value={profileData.profession}
                                    onChange={handleChange}
                                    className="rounded shadow-sm"
                                    placeholder="e.g., Software Engineer, Marketing Specialist"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formAboutMe" className="mb-3">
                                <Form.Label className="text-muted">About Me</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="about_me"
                                    value={profileData.about_me}
                                    onChange={handleChange}
                                    className="rounded shadow-sm"
                                    placeholder="Tell us a little about yourself..."
                                    maxLength={255}
                                />
                                <Form.Text className="text-muted">
                                    {profileData.about_me.length} / 255 characters
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Skills */}
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formSkills" className="mb-3">
                                <Form.Label className="text-muted">Skills (comma-separated)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="skills"
                                    value={profileData.skills}
                                    onChange={handleChange}
                                    className="rounded shadow-sm"
                                    placeholder="e.g., React, Node.js, Marketing, Design"
                                    maxLength={1000}
                                />
                                <Form.Text className="text-muted">
                                    {profileData.skills.length} / 1000 characters
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Social Media Links */}
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group controlId="formLinkedIn" className="mb-3">
                                <Form.Label className="text-muted">LinkedIn Profile URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="linkedin_profile_url"
                                    value={profileData.linkedin_profile_url}
                                    onChange={handleChange}
                                    className="rounded shadow-sm"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formTwitter" className="mb-3">
                                <Form.Label className="text-muted">Twitter Profile URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    name="twitter_profile_url"
                                    value={profileData.twitter_profile_url}
                                    onChange={handleChange}
                                    className="rounded shadow-sm"
                                    placeholder="https://twitter.com/yourhandle"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-end">
                        <Button
                            type="submit"
                            variant="primary"
                            className="shadow-sm"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    <span className="ms-2">Saving...</span>
                                </>
                            ) : (
                                'Save Profile'
                            )}
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
};

export default MyProfile;