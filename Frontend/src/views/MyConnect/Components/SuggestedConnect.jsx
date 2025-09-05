import { Container, Card, Image, Button, Row, Col } from "react-bootstrap";
import React, { useState } from 'react'; // Import useState 
import '../Styles/SuggestedConnect.css'



// Component for a single connection request item
const PersonCard = ({ id, name, title, profilePic, bannerPic, mutualConnections, openToWork }) => {
    return (
        <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="h-100 position-relative profileCardSuggestedConnect">
                {/* Close Button */}
                <Button variant="light" className="position-absolute top-0 end-0 m-2 rounded-circle p-1" style={{ zIndex: 10 }}>
                    <CloseIcon />
                </Button>

                {/* Card Banner */}
                <div className="position-relative">
                    <Card.Img
                        variant="top"
                        src={bannerPic}
                        alt="Card Banner"
                        style={{ height: '80px', objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x80/d3d3d3/ffffff?text=Banner'; }}
                    />
                    {/* Profile Picture and Open To Work Badge Container */}
                    {/* Position relative to the banner, then profile pic is absolute within it */}
                    <div className="position-absolute top-0 start-50 translate-middle-x" style={{ paddingTop: '35px' }}>
                        <div className="position-relative"> {/* Wrapper for profile pic and badge to control their relative positions */}
                            <Image
                                src={profilePic}
                                roundedCircle
                                style={{ width: '90px', height: '90px', objectFit: 'cover', border: '3px solid white' }}
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/90x90/cccccc/ffffff?text=U'; }}
                            />
                            {openToWork && (
                                <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-center"
                                    style={{
                                        position: 'absolute',
                                        // Position the center of the badge over the center of the profile picture
                                        // The badge's center will align with the profile picture's center.
                                        // Then adjust slightly as needed to sit ON the profile pic.
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)', // Center the badge precisely
                                        width: '80px',   // Adjusted size of the circular badge
                                        height: '80px',  // Adjusted size of the circular badge
                                        border: '3px solid white', // White border around the badge
                                        zIndex: 11, // Ensure it's above the profile pic
                                        boxShadow: '0 0 0 1px rgba(255,255,255,0.7)', // Subtle white outer ring
                                    }}
                                >
                                    <span className="text-white fw-bold text-uppercase"
                                          style={{
                                              fontSize: '0.65rem', // Smaller font to fit
                                              lineHeight: '1.2',
                                              whiteSpace: 'normal', // Allow text to wrap
                                              display: 'block', // Make span a block to allow text-align and line-height
                                              padding: '2px', // Add some internal padding
                                              wordBreak: 'break-word', // Break long words
                                              transform: 'rotate(-45deg)' // Rotate the text itself
                                          }}
                                    >
                                        #OPENTOWORK
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Card.Body className="text-center pt-5 px-3 pb-3 d-flex flex-column justify-content-between"> {/* Added pt-5 to make space for overlapping image */}
                    <Card.Title className="mb-1 fw-bold" style={{ fontSize: '1rem' }}>{name}</Card.Title>
                    <Card.Text className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>{title}</Card.Text>
                    <Card.Text className="text-muted mb-3 d-flex align-items-center justify-content-center" style={{ fontSize: '0.8rem' }}>
                        <img src="/myConnect/icons/mutualConnect.png" alt="" style={{ width:'20px', marginRight:'5px'}}  />{mutualConnections} mutual connection{mutualConnections !== 1 ? 's' : ''}
                    </Card.Text>
                    <Button  className="px-4 mt-auto connectButtonSuggestedConnect">
                        Connect
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
};

const peopleData = [
    {
        id: 1,
        name: 'Gyary Xavier',
        title: 'Maintenance technician',
        profilePic: 'https://placehold.co/90x90/FF69B4/000000?text=GX',
        bannerPic: 'https://placehold.co/300x80/F0F8FF/000000?text=Banner',
        mutualConnections: 6,
        openToWork: false
    },
    {
        id: 2,
        name: 'Dinesh Gupta',
        title: 'Manager Injection molding - Innovative ...',
        profilePic: 'https://placehold.co/90x90/7FFFD4/000000?text=DG',
        bannerPic: 'https://placehold.co/300x80/F0F8FF/000000?text=Banner',
        mutualConnections: 7,
        openToWork: false // Has #OPENTOWORK badge
    },
    {
        id: 3,
        name: 'Amit Mishra',
        title: 'Production Engineer',
        profilePic: 'https://placehold.co/90x90/ADD8E6/000000?text=AM',
        bannerPic: 'https://placehold.co/300x80/F0F8FF/000000?text=Banner',
        mutualConnections: 1,
        openToWork: false
    },
    {
        id: 4,
        name: 'anil johny',
        title: 'Project Manager at Sridevi Tool Engineers ...',
        profilePic: 'https://placehold.co/90x90/DDA0DD/000000?text=AJ',
        bannerPic: 'https://placehold.co/300x80/F0F8FF/000000?text=Banner',
        mutualConnections: 4,
        openToWork: false
    },
    {
        id: 5,
        name: 'S Saravanan',
        title: 'Managing Director at Cuts & Curves Tooling ...',
        profilePic: 'https://placehold.co/90x90/FAEBD7/000000?text=SS',
        bannerPic: 'https://placehold.co/300x80/F0F8FF/000000?text=Banner',
        mutualConnections: 5,
        openToWork: false
    },
    {
        id: 6,
        name: 'Raman Aneja',
        title: 'VP - Operations , New Business Development ...',
        profilePic: 'https://placehold.co/90x90/B0E0E6/000000?text=RA',
        bannerPic: 'https://placehold.co/300x80/F0F8FF/000000?text=Banner',
        mutualConnections: 8,
        openToWork: false
    },
    {
        id: 7,
        name: 'Rakesh Jadhav',
        title: 'Sr.CAD CAM Engineer at SGL Carbon India ...',
        profilePic: 'https://placehold.co/90x90/AFEEEE/000000?text=RJ',
        bannerPic: 'https://placehold.co/300x80/F0F8FF/000000?text=Banner',
        mutualConnections: 1,
        openToWork: false // Has #OPENTOWORK badge
    },
    {
        id: 8,
        name: 'Prakash mane',
        title: 'Toolroom engineer at magna tooling ...',
        profilePic: 'https://placehold.co/90x90/98FB98/000000?text=PM',
        bannerPic: 'https://placehold.co/300x80/F0F8FF/000000?text=Banner',
        mutualConnections: 2,
        openToWork: false
    },
];

// Inline SVG for the close (X) icon
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
);

// Inline SVG for the mutual connections icon (infinity symbol)



export const SuggestedConnect = () => {
    return (
        <>
            <Container className="my-4 p-4  suggestionContainer">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 fw-bold">People you may know from Plastics Injection Molding</h5>
                    <Button variant="link" className="p-0 text-decoration-none">See all</Button>
                </div>
                <Row>
                    {peopleData.map(person => (
                        <PersonCard
                            key={person.id}
                            id={person.id}
                            name={person.name}
                            title={person.title}
                            profilePic={person.profilePic}
                            bannerPic={person.bannerPic}
                            mutualConnections={person.mutualConnections}
                            openToWork={person.openToWork}
                        />
                    ))}
                </Row>
            </Container>
        </>
    )
}

export default SuggestedConnect;