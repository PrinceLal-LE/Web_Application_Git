// Frontend/src/views/Home/Components/UserPostBox.jsx
import React, { useEffect, useState } from 'react';
import { Container, Card, Image, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare, faTrash, faSpinner, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import '../styles/UserPostBox.css'; // Make sure this CSS file is imported
import ImageCarouselModal from './ImageCarouselModal'; // Import the new modal component

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const defaultProfilePic = '/images/avtar.png';

export const UserPostBox = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [showCommentSection, setShowCommentSection] = useState(null);
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);

    // State for the Image Carousel Modal
    const [showCarousel, setShowCarousel] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [startingIndex, setStartingIndex] = useState(0);

    const fetchPosts = async () => {
        if (!isAuthenticated || !token) {
            setLoading(false);
            setError('Authentication required to view posts.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/feed`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data.posts);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPosts();
        }
    }, [token, isAuthenticated]);

    const handleToggleLike = async (postId) => {
        if (!user || !token) {
            Swal.fire('Error!', 'You must be logged in to like posts.', 'error');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to toggle like.');
            }
            const updatedPost = await response.json();
            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post._id === postId) {
                        const postLikes = post.likes || [];
                        const userHasLiked = postLikes.includes(user.id);
                        return {
                            ...post,
                            likes: userHasLiked
                                ? postLikes.filter(id => id !== user.id)
                                : [...postLikes, user.id]
                        };
                    }
                    return post;
                })
            );
        } catch (err) {
            Swal.fire('Error!', 'An unexpected network error occurred.', 'error');
            console.error('Error toggling like:', err);
        }
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        const commentText = commentInputs[postId] || '';
        if (!commentText.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: commentText })
            });

            if (response.ok) {
                const data = await response.json();
                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post._id === postId) {
                            return { ...post, comments: [...post.comments, data.comment] };
                        }
                        return post;
                    })
                );
                setCommentInputs(prevInputs => ({ ...prevInputs, [postId]: '' }));
            } else {
                const errorData = await response.json();
                Swal.fire('Error!', errorData.message || 'Failed to add comment.', 'error');
            }
        } catch (err) {
            Swal.fire('Error!', 'An error occurred.', 'error');
        }
    };
    
    const handleDeletePost = async (postId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this post.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/delete`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.ok) {
                        Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
                        fetchPosts();
                    } else {
                        const errorData = await response.json();
                        Swal.fire('Error!', errorData.message || 'Failed to delete post.', 'error');
                    }
                } catch (err) {
                    Swal.fire('Error!', 'An error occurred.', 'error');
                }
            }
        });
    };

    const handleEditComment = async (postId, commentId, newText) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment/${commentId}/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newText })
            });

            if (response.ok) {
                fetchPosts();
                Swal.fire('Updated!', 'Your comment has been updated.', 'success');
            } else {
                const errorData = await response.json();
                Swal.fire('Error!', errorData.message || 'Failed to update comment.', 'error');
            }
        } catch (err) {
            Swal.fire('Error!', 'An error occurred.', 'error');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this comment.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment/${commentId}/delete`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.ok) {
                        Swal.fire('Deleted!', 'Your comment has been deleted.', 'success');
                        fetchPosts();
                    } else {
                        const errorData = await response.json();
                        Swal.fire('Error!', errorData.message || 'Failed to delete comment.', 'error');
                    }
                } catch (err) {
                    Swal.fire('Error!', 'An error occurred.', 'error');
                }
            }
        });
    };

    const formatTimestamp = (timestamp) => {
        return moment(timestamp).fromNow();
    };

    const toggleCommentSection = (postId) => {
        setShowCommentSection(showCommentSection === postId ? null : postId);
    };

    // New functions for carousel
    const openCarousel = (images, index) => {
        setCurrentImages(images);
        setStartingIndex(index);
        setShowCarousel(true);
    };

    const closeCarousel = () => {
        setShowCarousel(false);
        setCurrentImages([]);
        setStartingIndex(0);
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
                <p>Loading posts...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    if (posts.length === 0) {
        return (
            <Container className="my-5 text-center text-muted">
                <p>No posts to display.</p>
            </Container>
        );
    }
    
    const MAX_VISIBLE_IMAGES = 4;

    return (
        <Container className="my-4 p-0" style={{ maxWidth: '100%', borderRadius: '15px' }}>
            {posts.map(postData => (
                <Card key={postData._id} className="userPostBox">
                    {/* Post Header */}
                    <Card.Header className="bg-white p-4 d-flex align-items-center border-bottom-0">
                        <Image
                            src={postData.user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${postData.user.profile_photo_filepath}` : defaultProfilePic}
                            roundedCircle
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            className="me-3"
                        />
                        <div className="flex-grow-1">
                            <h6 className="mb-0 fw-bold">{postData.user?.name || 'Unknown User'}</h6>
                            <div className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                {postData.user?.userId || 'User'} • {formatTimestamp(postData.createdAt)}
                            </div>
                        </div>
                        {user && user.id === postData.user?._id && (
                            <Button variant="link" className="p-0 text-muted" onClick={() => handleDeletePost(postData._id)}>
                                <FontAwesomeIcon fixedWidth icon={faTrash} size='md' />
                            </Button>
                        )}
                    </Card.Header>

                    {/* Post Body - Text Content and Attachments */}
                    <Card.Body className="pt-0 px-4 pb-2">
                        <div className="mb-3"> 
                            {postData.title && <h6>{postData.title}</h6>}
                            {postData.description && <p>{postData.description}</p>}
                        </div>

                        {/* Renders uploaded attachments (images or PDFs) */}
                        {postData.attachments && postData.attachments.length > 0 && (
                            <div className="attachment-gallery mb-3">
                                {postData.attachments.slice(0, MAX_VISIBLE_IMAGES).map((attachment, index) => (
                                    <div key={index} className="gallery-item" onClick={() => openCarousel(postData.attachments, index)}>
                                        {/* Display image if it's an image file */}
                                        {attachment.mimetype?.startsWith('image/') && (
                                            <Image
                                                src={`${API_BASE_URL}/eRepo/${attachment.filepath}`}
                                                fluid rounded
                                                className="gallery-image"
                                            />
                                        )}
                                        {/* Display a link for PDF files */}
                                        {attachment.mimetype && attachment.mimetype === 'application/pdf' && (
                                            <div className="pdf-attachment">
                                                <a href={`${API_BASE_URL}/eRepo/${attachment.filepath}`} target="_blank" rel="noopener noreferrer">
                                                    <FontAwesomeIcon icon={faFilePdf} /> {attachment.filename}
                                                </a>
                                            </div>
                                        )}

                                        {/* Conditional +N overlay */}
                                        {index === MAX_VISIBLE_IMAGES - 1 && postData.attachments.length > MAX_VISIBLE_IMAGES && (
                                            <div className="image-overlay d-flex justify-content-center align-items-center">
                                                <span>+{postData.attachments.length - MAX_VISIBLE_IMAGES}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Body>

                    {/* Interaction Buttons (Likes, Comments, etc.) */}
                    <div className="d-flex justify-content-around align-items-center border-top py-2 px-4">
                        <Button variant="link" className="text-muted" onClick={() => handleToggleLike(postData._id)}>
                            <FontAwesomeIcon icon={faThumbsUp} className={postData.likes?.includes(user.id) ? 'text-primary' : ''} />
                            <span className="ms-2">{postData.likes?.length || 0} Likes</span>
                        </Button>
                        <Button variant="link" className="text-muted" onClick={() => toggleCommentSection(postData._id)}>
                            <FontAwesomeIcon icon={faComment} />
                            <span className="ms-2">{postData.comments?.length || 0} Comments</span>
                        </Button>
                        <Button variant="link" className="text-muted">
                            <FontAwesomeIcon icon={faShare} />
                            <span className="ms-2">Share</span>
                        </Button>
                    </div>

                    {/* Comments Section */}
                    {showCommentSection === postData._id && (
                        <Card.Footer className="bg-white">
                            <div className="comment-box mb-3 d-flex">
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Write a comment..."
                                    value={commentInputs[postData._id] || ''}
                                    onChange={(e) => setCommentInputs({ ...commentInputs, [postData._id]: e.target.value })}
                                    style={{ resize: 'none' }}
                                />
                                <Button className="ms-2" onClick={(e) => handleCommentSubmit(e, postData._id)}>
                                    Post
                                </Button>
                            </div>
                            <div className="comments-list">
                                {postData.comments?.map(comment => (
                                    <CommentItem
                                        key={comment._id}
                                        comment={comment}
                                        postId={postData._id}
                                        onEdit={handleEditComment}
                                        onDelete={handleDeleteComment}
                                        currentUserId={user.id}
                                    />
                                ))}
                            </div>
                        </Card.Footer>
                    )}
                </Card>
            ))}
            {/* Image Carousel Modal */}
            <ImageCarouselModal
                show={showCarousel}
                onHide={closeCarousel}
                images={currentImages}
                startIndex={startingIndex}
                apiBaseUrl={API_BASE_URL}
            />
        </Container>
    );
};

export default UserPostBox;