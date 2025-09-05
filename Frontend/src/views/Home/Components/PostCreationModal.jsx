// Frontend/src/views/Home/Components/PostCreationModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Image, Spinner, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage, faVideo, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import DataOptionsDialog from './DataOptionsDialog';
import avatar from '/home/avtar.png';
import '../styles/PostDialogueBox.css';
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
import galleryIcon from '/home/Icons/gallery.png';
import videoIcon from '/home/Icons/video_camera.png';
import dataIcon from '/home/Icons/data.png';
import postIcon from '/home/Icons/post.png';
import tripleDotIcon from '/home/Icons/triple_dot.png';
import { useNavigate } from 'react-router-dom';
const defaultProfilePhoto = '/images/avtar.png';
export const PostCreationModal = ({ show, onHide }) => {
    const [postContent, setPostContent] = useState('');
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [selectedData, setSelectedData] = useState([]); // State for selected data options
    const [isPosting, setIsPosting] = useState(false);

    // States for DataOptionsDialog
    const [showDataDialog, setShowDataDialog] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [dataError, setDataError] = useState(null);

    const user = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);
    const profilePhotoUrl = user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${user.profile_photo_filepath}` : defaultProfilePhoto;

    // Reset all states when the modal is closed
    useEffect(() => {
        if (!show) {
            setPostContent('');
            setImages([]);
            setVideo(null);
            setSelectedData([]);
        }
    }, [show]);

    // Handle fetching data for DataOptionsDialog
    const handleDataIconClick = async () => {
        setShowDataDialog(true);
        setLoadingData(true);
        setDataError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/checkbox-options`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFetchedData(data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setDataError("Failed to load data. Please try again.");
            setFetchedData([]);
        } finally {
            setLoadingData(false);
        }
    };

    const handleCloseDataDialog = () => {
        setShowDataDialog(false);
        setFetchedData([]);
        setDataError(null);
    };

    const handleSaveDataOptions = (options) => {
        setSelectedData(options);
        handleCloseDataDialog();
    };

    const handlePostSubmit = async () => {
        if (!postContent.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Empty Post',
                text: 'Post content cannot be empty.',
            });
            return;
        }

        setIsPosting(true);
        const formData = new FormData();
        formData.append('content', postContent);
        // Append the selected data as a JSON string
        if (selectedData.length > 0) {
            formData.append('data', JSON.stringify(selectedData));
        }

        images.forEach((image, index) => {
            formData.append(`images`, image);
        });
        if (video) {
            formData.append('video', video);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();
            setIsPosting(false);

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Posted!',
                    text: data.message,
                }).then(() => {
                    onHide(); // Close modal on success
                });
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

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="lg" backdrop="static" keyboard={false}>
                <Modal.Header className='justify-content-between'>
                    <Modal.Title>Create New Post</Modal.Title>
                    <Button variant="light" className="close-button" onClick={onHide}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex gap-3'>
                        <div className="d-flex align-items-top mt-3">
                            <Image src={profilePhotoUrl} roundedCircle style={{ width: '50px', height: '50px' }} />
                            {/* <div className="ms-3">
                                <h5 className="mb-0">{user?.name || user?.username || 'User'}</h5>
                            </div> */}
                        </div>
                        <Form.Group className="mb-3 w-100">
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Share Business / Project / Post"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                style={{ resize: 'none' }}
                            />
                        </Form.Group>
                    </div>

                    {images.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {images.map((image, index) => (
                                <div key={index} className="position-relative">
                                    <Image src={URL.createObjectURL(image)} fluid style={{ maxHeight: '100px', maxWidth: '100px', objectFit: 'cover' }} />
                                    <Button variant="danger" size="sm" className="position-absolute top-0 end-0" onClick={() => handleRemoveImage(index)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {video && (
                        <div className="position-relative mb-3">
                            <video src={URL.createObjectURL(video)} controls style={{ maxHeight: '200px', width: '100%' }} />
                            <Button variant="danger" size="sm" className="position-absolute top-0 end-0" onClick={() => setVideo(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </Button>
                        </div>
                    )}

                    {selectedData.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {selectedData.map((dataItem, index) => (
                                <span key={index} className="badge bg-primary">
                                    {dataItem.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex ">
                            <Form.Label htmlFor="image-upload" className="mb-0 cursor-pointer">
                                <div className='postDialogueBoxIcons'>
                                    <div >
                                        <img src={galleryIcon} style={{ width: '24px', height: '24px' }} alt="Image Upload" /> Photo
                                    </div>
                                </div>
                            </Form.Label>
                            <Form.Control type="file" id="image-upload" multiple className="d-none" accept="image/*" onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} />
                            <Form.Label htmlFor="video-upload" className="mb-0 cursor-pointer">
                                <div className='postDialogueBoxIcons'>
                                    <div >
                                        <img src={videoIcon} style={{ width: '24px', height: '24px' }} alt=" Video Icon" /> Video
                                    </div>
                                </div>
                            </Form.Label>
                            <Form.Control type="file" id="video-upload" className="d-none" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
                            {/* New Data icon button */}
                            <Form.Label className="mb-0 cursor-pointer" onClick={handleDataIconClick}>
                                {/* <FontAwesomeIcon icon={faChartBar} size="lg" className="text-primary" /> */}
                                <div className='postDialogueBoxIcons'>
                                    <div >
                                        <img src={dataIcon} style={{ width: '24px', height: '24px' }} alt=" Data Icon" /> Data
                                    </div>
                                </div>
                            </Form.Label>
                        </div>
                        <Button variant="primary" onClick={handlePostSubmit} disabled={isPosting || !postContent.trim()}>
                            {isPosting ? <Spinner animation="border" size="sm" className="me-2" /> : 'Post'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {showDataDialog && (
                <DataOptionsDialog
                    show={showDataDialog}
                    onHide={handleCloseDataDialog}
                    data={fetchedData}
                    loading={loadingData}
                    error={dataError}
                    selectedOptions={selectedData}
                    onSave={handleSaveDataOptions}
                />
            )}
        </>
    );
};

export default PostCreationModal;