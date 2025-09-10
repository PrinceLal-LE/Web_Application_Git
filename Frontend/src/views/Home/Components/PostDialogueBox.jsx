

// Frontend/src/views/Home/Components/PostDialogueBox.jsx
import React, { useState } from 'react';
import { Container, Image, Row, Col } from 'react-bootstrap';
import galleryIcon from '/home/Icons/gallery.png';
import videoIcon from '/home/Icons/video_camera.png';
import dataIcon from '/home/Icons/data.png';
import postIcon from '/home/Icons/post.png';
import tripleDotIcon from '/home/Icons/triple_dot.png';
import '../styles/PostDialogueBox.css';
import { PostCreationModal } from './PostCreationModal'; // Import the new modal component
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const defaultProfilePhoto = '/images/avtar.png';

export const PostDialogueBox = () => {
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const profilePhotoUrl = user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${user.profile_photo_filepath}` : defaultProfilePhoto;
    
    return (
        <>
            <Container fluid className='bg-white px-4 py-4 mb-2 postDialogueBox' style={{border: '2px solid black'}}>
                <Row>
                    <Col className='d-flex justify-content-center align-items-top gap-3' md={1}>
                        <div>
                            <img src={profilePhotoUrl} alt="" style={{ width: '50px', borderRadius: '10rem', paddingTop: '1.5rem' }} />
                        </div>
                    </Col>
                    <Col md={11} className=''>
                        <div className='postDialogueBox__input' onClick={handleShowModal}>
                            <textarea placeholder='Share Business / Project / Post' className='w-100 mt-3' style={{ resize: 'none' }} rows={5} readOnly />
                        </div>
                    </Col>
                </Row>
                
                <Row className='postDialogueBoxIconsRow'>
                    <Col md={2} className='postDialogueBoxIcons'>
                        <div onClick={handleShowModal}>
                            <img src={galleryIcon} alt="Image Upload" /> Photo
                        </div>
                    </Col>
                    <Col md={2} className='postDialogueBoxIcons'>
                        <div onClick={handleShowModal}>
                            <img src={videoIcon} alt=" Video Icon" /> Video
                        </div>
                    </Col>
                    <Col md={2} className='postDialogueBoxIcons'>
                        <div onClick={handleShowModal} style={{ cursor: 'pointer' }}>
                            <img src={dataIcon} alt=" Data choose" /> Data
                        </div>
                    </Col>
                    <Col md={2} className='postDialogueBoxIcons'>
                        <div onClick={handleShowModal}>
                            <img src={postIcon} alt="Post" /> Post
                        </div>
                    </Col>
                    <Col xs="auto" className='postDialogueBoxIconsRightSide ms-auto' >
                        <div onClick={handleShowModal}>
                            <img src={tripleDotIcon} alt="Post" />
                        </div>
                    </Col>
                </Row>
            </Container>
            
            <PostCreationModal show={showModal} onHide={handleCloseModal} />
        </>
    );
};

export default PostDialogueBox;