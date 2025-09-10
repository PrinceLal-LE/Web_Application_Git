// Frontend/src/views/Home/Components/PostCreationModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Image, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload, faSync } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import '../styles/PostDialogueBox.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const defaultProfilePhoto = '/images/avtar.png';

export const PostCreationModal = ({ show, onHide }) => {
    // State to manage form inputs and data
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [contactDetails, setContactDetails] = useState({
        firstName: '',
        lastName: '',
        company: '',
        mobile: '',
        email: ''
    });
    const [canMouldConnect, setCanMouldConnect] = useState('No');
    const [captcha, setCaptcha] = useState('');
    const [generatedCaptcha, setGeneratedCaptcha] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [attachmentsError, setAttachmentsError] = useState('');

    // State for dynamic dropdowns
    const [selectedMainOptionId, setSelectedMainOptionId] = useState('');
    const [selectedSubOption, setSelectedSubOption] = useState('');
    const [subOptionOther, setSubOptionOther] = useState('');

    // State for fetching dropdown data
    const [fetchedMainOptions, setFetchedMainOptions] = useState([]);
    const [loadingMainOptions, setLoadingMainOptions] = useState(false);
    const [mainOptionError, setMainOptionError] = useState(null);
    const [fetchedSubOptions, setFetchedSubOptions] = useState([]);
    const [loadingSubOptions, setLoadingSubOptions] = useState(false);
    const [subOptionError, setSubOptionError] = useState(null);

    const user = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);
    const profilePhotoUrl = user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${user.profile_photo_filepath}` : defaultProfilePhoto;

    // Check if all mandatory fields are filled to enable the submit button
    const isFormValid = () => {
        const isMandatoryFieldsFilled = selectedMainOptionId && selectedSubOption && title.trim() && contactDetails.firstName.trim() && contactDetails.lastName.trim();
        const isOtherSubOptionFilled = selectedSubOption === 'Other' ? subOptionOther.trim() : true;
        const isCaptchaCorrect = captcha.toLowerCase() === generatedCaptcha.toLowerCase();

        return isMandatoryFieldsFilled && isOtherSubOptionFilled && isCaptchaCorrect;
    };

    useEffect(() => {
        if (show) {
            generateNewCaptcha();
            fetchMainDataOptions();
        }
    }, [show]);

    useEffect(() => {
        if (!show) {
            // Reset all states when the modal is closed
            setTitle('');
            setDescription('');
            setLocation('');
            setAttachments([]);
            setContactDetails({ firstName: '', lastName: '', company: '', mobile: '', email: '' });
            setCanMouldConnect('No');
            setCaptcha('');
            setAttachmentsError('');
            setSelectedMainOptionId('');
            setSelectedSubOption('');
            setSubOptionOther('');
            setFetchedMainOptions([]);
            setFetchedSubOptions([]);
        }
    }, [show]);

    // Fetch main dropdown options on modal open
    const fetchMainDataOptions = async () => {
        setLoadingMainOptions(true);
        setMainOptionError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/checkbox-options`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFetchedMainOptions(data);
        } catch (error) {
            console.error("Failed to fetch main options:", error);
            setMainOptionError("Failed to load main options. Please try again.");
            setFetchedMainOptions([]);
        } finally {
            setLoadingMainOptions(false);
        }
    };

    // Fetch sub-menu options when a main option is selected
    useEffect(() => {
        const fetchSubOptions = async () => {
            if (selectedMainOptionId) {
                setLoadingSubOptions(true);
                setSubOptionError(null);
                try {
                    const response = await fetch(`${API_BASE_URL}/api/sub-options/${selectedMainOptionId}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setFetchedSubOptions(data);
                } catch (error) {
                    console.error("Failed to fetch sub-options:", error);
                    setSubOptionError("Failed to load sub-options. Please try again.");
                    setFetchedSubOptions([]);
                } finally {
                    setLoadingSubOptions(false);
                }
            } else {
                setFetchedSubOptions([]);
            }
        };
        fetchSubOptions();
    }, [selectedMainOptionId]);

    const generateNewCaptcha = () => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGeneratedCaptcha(result);
    };

    const handleFileChange = (e) => {
        setAttachmentsError('');
        const files = Array.from(e.target.files);
        const maxTotalSize = 10 * 1024 * 1024;
        const maxFileSize = 2 * 1024 * 1024;
        const maxFileCount = 5;

        const currentFiles = [...attachments, ...files];
        const totalSize = currentFiles.reduce((sum, file) => sum + file.size, 0);

        if (currentFiles.length > maxFileCount) {
            setAttachmentsError(`You can only upload a maximum of ${maxFileCount} files.`);
            return;
        }
        if (totalSize > maxTotalSize) {
            setAttachmentsError(`Total file size cannot exceed ${maxTotalSize / (1024 * 1024)} MB.`);
            return;
        }

        for (const file of files) {
            if (file.size > maxFileSize) {
                setAttachmentsError(`Each file must not exceed ${maxFileSize / (1024 * 1024)} MB.`);
                return;
            }
            if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
                setAttachmentsError('Only JPG, JPEG, PNG images and PDF files are allowed.');
                return;
            }
        }
        setAttachments(currentFiles);
    };

    const handleRemoveFile = (indexToRemove) => {
        setAttachments(attachments.filter((_, index) => index !== indexToRemove));
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!isFormValid()) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Form',
                text: 'Please fill all mandatory fields and check the captcha.',
            });
            return;
        }

        setIsPosting(true);
        const formData = new FormData();
        formData.append('main_option', selectedMainOptionId);
        formData.append('sub_option', selectedSubOption === 'Other' ? subOptionOther : selectedSubOption);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('location', location);
        formData.append('contact_details_firstName', contactDetails.firstName);
        formData.append('contact_details_lastName', contactDetails.lastName);
        formData.append('contact_details_company', contactDetails.company);
        formData.append('contact_details_mobile', contactDetails.mobile);
        formData.append('contact_details_email', contactDetails.email);
        formData.append('can_mould_connect', canMouldConnect);

        attachments.forEach((file) => {
            formData.append('attachments', file);
        });

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            const data = await response.json();
            setIsPosting(false);

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Post Submitted!',
                    text: data.message,
                }).then(() => { onHide(); });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Post Failed',
                    text: data.message || 'An error occurred while creating the post.',
                });
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setIsPosting(false);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Could not connect to the server.',
            });
        }
    };

    const isMainAndSubOptionsSelected = selectedMainOptionId && selectedSubOption;

    return (
        <Modal show={show} onHide={onHide} centered size="lg" backdrop="static" keyboard={false} style={{borderColor: 'black !important', border: '1px solid black !important' }}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="info" className="text-center">
                    When you submit the post, it will be sent to the admin for approval. If any issue arises, the team will contact you.
                </Alert>

                <Form onSubmit={handlePostSubmit}>
                    <Row className="mb-3">
                        <Col md={isMainAndSubOptionsSelected ? 6 : 12}>
                            <Form.Group>
                                <Form.Label>Select</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedMainOptionId}
                                    onChange={(e) => {
                                        setSelectedMainOptionId(e.target.value);
                                        setSelectedSubOption('');
                                    }}
                                    // Make read-only when a value is selected
                                    readOnly={!!selectedMainOptionId}
                                    className={!!selectedMainOptionId ? 'bg-light' : ''}
                                >
                                    <option value="">Drop down from data</option>
                                    {loadingMainOptions ? (
                                        <option disabled>Loading...</option>
                                    ) : mainOptionError ? (
                                        <option disabled>{mainOptionError}</option>
                                    ) : (
                                        fetchedMainOptions.map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        {/* Show sub-option dropdown only if a main option is selected */}
                        {selectedMainOptionId && (
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedSubOption}
                                        onChange={(e) => setSelectedSubOption(e.target.value)}
                                        // Make read-only when a value is selected
                                        readOnly={!!selectedSubOption}
                                        className={!!selectedSubOption ? 'bg-light' : ''}
                                        disabled={loadingSubOptions}
                                    >
                                        <option value="">Drop down from submenu or suboption</option>
                                        {loadingSubOptions ? (
                                            <option disabled>Loading...</option>
                                        ) : subOptionError ? (
                                            <option disabled>{subOptionError}</option>
                                        ) : (
                                            fetchedSubOptions.map((sub, index) => (
                                                <option key={index} value={sub}>{sub}</option>
                                            ))
                                        )}
                                        <option value="Other">Other</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        )}
                    </Row>

                    {/* Show the rest of the form only if both options are selected */}
                    {isMainAndSubOptionsSelected && (
                        <>
                            {selectedSubOption === 'Other' && (
                                <Form.Group className="mb-3">
                                    <Form.Label>If Other</Form.Label>
                                    <Form.Control type="text" placeholder="Specify" value={subOptionOther} onChange={(e) => setSubOptionOther(e.target.value)} maxLength={25} required />
                                </Form.Group>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label>Title *</Form.Label>
                                <Form.Control type="text" placeholder="Mandatory Field" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Control type="text" placeholder="---- Select Country ----" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Upload Attachment</Form.Label>
                                <div className="border rounded p-4 text-center cursor-pointer" onClick={() => document.getElementById('attachment-upload').click()}>
                                    <FontAwesomeIcon icon={faUpload} size="2x" className="mb-2 text-muted" />
                                    <p className="mb-0 text-muted">Drop presentation and document here or click to upload.</p>
                                </div>
                                <Form.Control id="attachment-upload" type="file" multiple className="d-none" accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} />
                                {attachmentsError && <Alert variant="danger" className="mt-2">{attachmentsError}</Alert>}
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {attachments.map((file, index) => (
                                        <div key={index} className="d-flex align-items-center border rounded p-2">
                                            <span>{file.name}</span>
                                            <Button variant="link" size="sm" onClick={() => handleRemoveFile(index)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Contact Details</Form.Label>
                                <Row>
                                    <Col md={6}>
                                        <Form.Control type="text" placeholder="First Name *" className="mb-2" value={contactDetails.firstName} onChange={(e) => setContactDetails({...contactDetails, firstName: e.target.value})} required />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="text" placeholder="Last Name *" className="mb-2" value={contactDetails.lastName} onChange={(e) => setContactDetails({...contactDetails, lastName: e.target.value})} required />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="text" placeholder="Your Company" className="mb-2" value={contactDetails.company} onChange={(e) => setContactDetails({...contactDetails, company: e.target.value})} />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Control type="text" placeholder="Mobile No" className="mb-2" value={contactDetails.mobile} onChange={(e) => setContactDetails({...contactDetails, mobile: e.target.value})} />
                                    </Col>
                                    <Col md={12}>
                                        <Form.Control type="email" placeholder="email ID" value={contactDetails.email} onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})} />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Can Mould Connect contact us?</Form.Label>
                                <Form.Control as="select" value={canMouldConnect} onChange={(e) => setCanMouldConnect(e.target.value)}>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </Form.Control>
                            </Form.Group>
                                </Col>
                                <Col md={6}>
                                    
                            <div class="mould-connect-contact-box">
                                <p>Customer Support</p>
                                <p><strong>Mould Connect</strong>, Hyderabad</p>
                                <p>Telangana, India - 000000</p>
                                <p>M - +91 6239123356</p>
                                <p>E - info@mouldconnect.com</p>
                            </div>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Captcha</Form.Label>
                                <Row className="align-items-center">
                                    <Col xs={4}>
                                        <div className="captcha-text text-center border rounded p-2 bg-light">
                                            {generatedCaptcha}
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Control type="text" placeholder="Enter captcha" value={captcha} onChange={(e) => setCaptcha(e.target.value)} required />
                                    </Col>
                                    <Col xs={2}>
                                        <Button variant="secondary" onClick={generateNewCaptcha}>
                                            <FontAwesomeIcon icon={faSync} />
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </>
                    )}

                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit" disabled={!isFormValid() || isPosting}>
                            {isPosting ? <Spinner animation="border" size="sm" className="me-2" /> : 'Submit'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PostCreationModal;