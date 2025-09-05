// Frontend/src/views/Home/Components/UserPostBox.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Image, Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare, faLink, faEllipsis, faTrash, faPencilAlt, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import Swal from 'sweetalert2';

import '../styles/UserPostBox.css';
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const defaultProfilePic = '/home/avtar.png';

// Component to render a single comment
const CommentItem = ({ comment, postId, onEdit, onDelete, currentUserId }) => {
    const isCommentOwner = comment.user._id === currentUserId;
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    const [commentEditError, setCommentEditError] = useState('');

    const handleEditSave = () => {
        if (editedText.trim() === '' || editedText.length > 250) {
            setCommentEditError('Comment must be between 1 and 250 characters.');
            return;
        }
        onEdit(postId, comment._id, editedText);
        setIsEditing(false);
        setCommentEditError('');
    };

    return (
        <div className="d-flex align-items-start mb-2">
            <Image
                src={comment.user.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${comment.user.profile_photo_filepath}` : defaultProfilePic}
                roundedCircle
                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                className="me-3"
            />
            <div className="flex-grow-1 bg-light rounded-3 p-3">
                <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{comment.user.name}</h6>
                {isEditing ? (
                    <>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            isInvalid={!!commentEditError}
                            maxLength={250}
                        />
                        <Form.Control.Feedback type="invalid">{commentEditError}</Form.Control.Feedback>
                        <div className="d-flex mt-2" style={{ fontSize: '0.75rem' }}>
                            <Button variant="primary" size="sm" onClick={handleEditSave}>Save</Button>
                            <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} className="ms-2">Cancel</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="mb-2" style={{ fontSize: '0.85rem' }}>{comment.text}</p>
                        <div className="d-flex" style={{ fontSize: '0.75rem' }}>
                            {/* <Button variant="link" className="text-muted p-0 me-3 text-decoration-none">
                                Like ({comment.likes?.length || 0})
                            </Button>
                            <Button variant="link" className="text-muted p-0 me-3 text-decoration-none">
                                Reply
                            </Button> */}
                            {isCommentOwner && (
                                <>
                                    <Button variant="link" className="text-muted p-0 me-3 text-decoration-none" onClick={() => setIsEditing(true)}>
                                        <FontAwesomeIcon icon={faPencilAlt} /> Edit
                                    </Button>
                                    <Button variant="link" className="text-muted p-0 text-decoration-none" onClick={() => onDelete(postId, comment._id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const UserPostBox = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentInput, setCommentInput] = useState('');
    const [showCommentSection, setShowCommentSection] = useState(null);
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);

    const fetchPosts = async () => {
        if (!isAuthenticated || !token) {
            setLoading(false);
            setError('Authentication required to view posts.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/feed`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch posts.');
            }

            const data = await response.json();
            setPosts(data.posts);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message || 'An error occurred while fetching posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [isAuthenticated, token]);

    // Function to handle like/unlike
    const handleToggleLike = async (postId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                // Update the local state to show the change immediately
                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post._id === postId) {
                            const hasLiked = post.likes.includes(user.id);
                            return {
                                ...post,
                                likes: hasLiked
                                    ? post.likes.filter(id => id !== user.id)
                                    : [...post.likes, user.id]
                            };
                        }
                        return post;
                    })
                );
            } else {
                const errorData = await response.json();
                Swal.fire('Error!', errorData.message || 'Failed to toggle like.', 'error');
            }
        } catch (err) {
            Swal.fire('Error!', 'An error occurred.', 'error');
        }
    };

    // Function to handle comment submission
    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: commentInput })
            });

            if (response.ok) {
                const data = await response.json();
                // Add the new comment to the local state
                setPosts(prevPosts =>
                    prevPosts.map(post => {
                        if (post._id === postId) {
                            return { ...post, comments: [...post.comments, data.comment] };
                        }
                        return post;
                    })
                );
                setCommentInput(''); // Clear comment input
            } else {
                const errorData = await response.json();
                Swal.fire('Error!', errorData.message || 'Failed to add comment.', 'error');
            }
        } catch (err) {
            Swal.fire('Error!', 'An error occurred.', 'error');
        }
    };

    // Function to handle post deletion (soft delete) (Requirement 2)
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
                        fetchPosts(); // Re-fetch posts to update the feed
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

    // Function to handle comment editing (Requirement 1)
    const handleEditComment = async (postId, commentId, newText) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment/${commentId}/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newText })
            });

            if (response.ok) {
                fetchPosts(); // Re-fetch posts to update the feed with the new comment
                Swal.fire('Updated!', 'Your comment has been updated.', 'success');
            } else {
                const errorData = await response.json();
                Swal.fire('Error!', errorData.message || 'Failed to update comment.', 'error');
            }
        } catch (err) {
            Swal.fire('Error!', 'An error occurred.', 'error');
        }
    };

    // Function to handle comment deletion (soft delete) (Requirement 1)
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
                        fetchPosts(); // Re-fetch posts to update the feed
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

    return (
        <Container className="my-4 p-0" style={{ maxWidth: '100%', borderRadius: '15px' }}>
            {posts.map(postData => (
                <Card key={postData._id} className="userPostBox">
                    {/* Post Header */}
                    <Card.Header className="bg-white p-4 d-flex align-items-center border-bottom-0">
                        <Image
                            src={postData.user.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${postData.user.profile_photo_filepath}` : defaultProfilePic}
                            roundedCircle
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            className="me-3"
                        />
                        <div className="flex-grow-1">
                            <h6 className="mb-0 fw-bold">{postData.user.name}</h6>
                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                {postData.user.title || 'User'} • {formatTimestamp(postData.createdAt)}
                            </p>
                        </div>
                        {user && user.id === postData.user._id && (
                            <Button variant="link" className="p-0 text-muted" onClick={() => handleDeletePost(postData._id)}>
                                <FontAwesomeIcon fixedWidth icon={faTrash} size='md' />
                            </Button>
                        )}
                    </Card.Header>

                    {/* Post Body - Text Content */}
                    <Card.Body className="pt-0 px-4 pb-2">
                        <Card.Text className="mb-3">
                            {postData.content}
                        </Card.Text>
                        {postData.images && postData.images.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {postData.images.map((img, index) => (
                                    <Image
                                        key={index}
                                        src={`${API_BASE_URL}/eRepo/${img.filepath}`}
                                        fluid rounded
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    />
                                ))}
                            </div>
                        )}
                        {postData.video && (
                            <video controls src={`${API_BASE_URL}/eRepo/${postData.video.filepath}`} className="w-100 rounded" />
                        )}
                    </Card.Body>

                    {/* Interaction Buttons */}
                    <div className="d-flex justify-content-around align-items-center border-top py-2 px-4">
                        <Row className="w-100 gx-0">
                            <Col xs={3} className="text-center d-flex justify-content-center">
                                <Button
                                    variant="link"
                                    className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center text-decoration-none py-2"
                                    onClick={() => handleToggleLike(postData._id)}
                                >
                                    <FontAwesomeIcon fixedWidth icon={faHeart} size='md' style={{ color: postData.likes.includes(user.id) ? 'red' : 'inherit' }} />
                                    <span className="mt-1 d-none d-md-inline ms-md-2 label-text">Like ({postData.likes.length})</span>
                                </Button>
                            </Col>
                            <Col xs={3} className="text-center d-flex justify-content-center">
                                <Button
                                    variant="link"
                                    className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center text-decoration-none py-2"
                                    onClick={() => setShowCommentSection(postData._id === showCommentSection ? null : postData._id)}
                                >
                                    <FontAwesomeIcon fixedWidth icon={faComment} size='md' />
                                    <span className="mt-1 d-none d-md-inline ms-md-2 label-text">Comment ({postData.comments.length})</span>
                                </Button>
                            </Col>
                            <Col xs={3} className="text-center d-flex justify-content-center">
                                <Button variant="link" className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center text-decoration-none py-2">
                                    <FontAwesomeIcon fixedWidth icon={faShare} size='md' />
                                    <span className="mt-1 d-none d-md-inline ms-md-2 label-text">Share</span>
                                </Button>
                            </Col>
                            <Col xs={3} className="text-center d-flex justify-content-center">
                                <Button variant="link" className="text-muted d-flex flex-column flex-md-row align-items-center justify-content-center text-decoration-none py-2">
                                    <FontAwesomeIcon fixedWidth icon={faLink} size='md' />
                                    <span className="mt-1 d-none d-md-inline ms-md-2 label-text">Connect</span>
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Comment Form and Comments Section */}
                    {showCommentSection === postData._id && (
                        <>
                            <div className="p-3 bg-light d-flex align-items-center border-top">
                                <Image src={user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${user.profile_photo_filepath}` : defaultProfilePic} roundedCircle style={{ width: '30px', height: '30px', objectFit: 'cover' }} className="me-2" />
                                <Form className="w-100" onSubmit={(e) => handleCommentSubmit(e, postData._id)}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="rounded-pill bg-white border-0 py-2 px-3"
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                    />
                                </Form>
                            </div>
                            <div className="p-3">
                                {postData.comments.map(comment => (
                                    // Pass handler functions and current user ID
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
                        </>
                    )}
                </Card>
            ))}
        </Container>
    );
};