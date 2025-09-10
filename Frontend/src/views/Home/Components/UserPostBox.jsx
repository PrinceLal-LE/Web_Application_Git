// Frontend/src/views/Home/Components/UserPostBox.jsx
import React, { useEffect, useState } from 'react';
import { Container, Card, Image, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare, faTrash, faFilePdf, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import '../styles/UserPostBox.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const defaultProfilePic = '/images/avtar.png';

// Component to render a single comment
const CommentItem = ({ comment, postId, onEdit, onDelete, currentUserId }) => {
    const isCommentOwner = comment.user?._id === currentUserId;
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
                src={comment.user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${comment.user.profile_photo_filepath}` : defaultProfilePic}
                roundedCircle
                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                className="me-3"
            />
            <div className="flex-grow-1 bg-light rounded-3 p-3">
                <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{comment.user?.name || 'Unknown User'}</h6>
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
    const [commentInputs, setCommentInputs] = useState({});
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

            if (response.ok) {
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
            } else {
                const errorData = await response.json();
                Swal.fire('Error!', errorData.message || 'Failed to toggle like.', 'error');
            }
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
                body: JSON.stringify({ text: commentText })
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

    const handleEditComment = async (postId, commentId, newContent) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment/${commentId}/edit`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newContent })
            });

            if (response.ok) {
                Swal.fire('Updated!', 'Your comment has been updated.', 'success');
                fetchPosts();
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
                            src={postData.user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${postData.user.profile_photo_filepath}` : defaultProfilePic}
                            roundedCircle
                            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                            className="me-3"
                        />
                        <div className="flex-grow-1">
                            <h6 className="mb-0 fw-bold">{postData.user?.name || 'Unknown User'}</h6>
                            {/* FIX: Use a div instead of a p tag to avoid nesting */}
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
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {postData.attachments.map((attachment, index) => (
                                    <div key={index} className="attachment-container">
                                        {/* Display image if it's an image file */}
                                        {attachment.mimetype?.startsWith('image/') && (
                                            <Image
                                                src={`${API_BASE_URL}/eRepo/${attachment.filepath}`}
                                                fluid rounded
                                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
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
                        <Card.Footer className="bg-white" style={{ borderRadius: '15px' }}>
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
        </Container>
    );
};

export default UserPostBox;