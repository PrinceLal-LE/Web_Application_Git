import { Container, ListGroup, Row, Col, Spinner  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserStatus } from './Components/UserStatus';
import { LeftSideButtonShortCut } from './Components/LeftSideButtomShortCut';
import { LeftSideFooter } from './Components/LeftSideFooter';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../../store/authSlice';

// Define default profile and banner images from your public folder
const defaultProfilePhoto = '/home/profile_icon.png';
const defaultCoverPhoto = '/home/Left_side_icon.png';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const LeftSideBar = () => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.id || !token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch User details (name)
                const userDetailsResponse = await fetch(`${API_BASE_URL}/api/auth/getUserDetails/${user.id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const userDetailsResult = await userDetailsResponse.json();
                const fetchedUserDetails = userDetailsResult.user;

                // Fetch Profile details (profile photo path)
                const profileResponse = await fetch(`${API_BASE_URL}/api/profile/${user.id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const profileResult = await profileResponse.json();
                const fetchedProfile = profileResult.profile;

                // Combine and update the Redux store with all necessary info
                dispatch(updateUserProfile({
                    name: fetchedUserDetails.name,
                    profession: fetchedProfile?.profession || 'Profession Not Set',
                    profile_photo_filepath: fetchedProfile?.profile_photo_filepath || null,
                    cover_photo_filepath: fetchedProfile?.cover_photo_filepath || null,
                    about_me: fetchedProfile?.about_me || ''
                }));

            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user?.id, token, dispatch]);
    const profileName = user?.name || 'Guest';
    const profileProfession = user?.profession || 'Profession Not Set';
    const profilePhotoUrl = user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${user.profile_photo_filepath}` : defaultProfilePhoto;
    const coverPhotoUrl = user?.cover_photo_filepath ? `${API_BASE_URL}/eRepo/${user.cover_photo_filepath}` : defaultCoverPhoto;

    return <>
        <Container fluid className="leftSideBar ms-auto bg-white px-0" style={{ border: '2px solid black' }}>
            {/* <img src="/home/Left_side_icon.png" className="leftSideBarBanner" alt="Left Side Icon" /> */}
            <img src={coverPhotoUrl} className="leftSideBarBanner" alt="Cover Photo" />
            {loading ? (
                <div className="avatar-loading">
                    <Spinner animation="border" size="sm" />
                </div>
            ) : (
                <img src={profilePhotoUrl} className='avtarLeftSideBar' alt={`${profileName}'s profile`} />
            )}
            {/* <img src={profilePicSrc} className='avtarLeftSideBar' alt="Profile Picture" /> */}
            <h2 className='text userName mb-0'>{profileName}</h2>
            <h6 className='text-muted designationText mt-1'>{profileProfession}</h6>
            <p className='text'>{user?.about_me}</p>
            {/* Code for the list below profile details. */}
            <ListGroup className='w-75 listSpacingSetting'>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon={['fas', 'bell']} color="#74C0FC" /> Notification</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="network-wired" color="#74C0FC" /> Connection</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="star" color="#74C0FC" /> Revenue</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="gear" color="#74C0FC" /> Setting</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="signs-post" color="#74C0FC" /> My Post</ListGroup.Item>
                <ListGroup.Item as={Link} to="/profile" className='text-center'>View Profile</ListGroup.Item>
            </ListGroup>
            {/* Status of the user */}
            <UserStatus />

            {/* Shortcut of header */}
            <LeftSideButtonShortCut />

        </Container>

        <Container fluid className="leftSideBarFooter">
            <LeftSideFooter />
        </Container>

    </>
}