import { Container, Card, Image, Button, Row, Col } from "react-bootstrap";
import '../Styles/MyConnectPane.css'
import React, { useState } from 'react';

// Component for a single connection request item
const ConnectionRequestItem = ({ profilePic, name, title, sharedConnections, otherSharedConnectionsCount }) => {
    return (
        // Each connection request item is now a row within the overall list
        <div className="mb-3 pb-3 border-bottom"> {/* Removed d-flex here as Row will manage layout */}
            <Row className="align-items-center">
                {/* Column for Profile Image and Text Content */}
                {/* On small screens (xs), takes full width. On medium (md) and larger, takes 9 columns. */}
                <Col xs={12} md={9} className="d-flex align-items-center mb-2 mb-md-0"> {/* mb-2 for spacing on small screens, mb-md-0 to remove it on medium+ */}
                    <Image src={profilePic} roundedCircle style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="me-3"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/50x50/cccccc/ffffff?text=U'; }}
                    />
                    <div className="flex-grow-1"> {/* This div will take remaining space for text */}
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '0.95rem' }}>{name}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{title}</p>
                        {/* Section for displaying mutual connection pictures and text */}
                        {(sharedConnections && sharedConnections.length > 0) || otherSharedConnectionsCount > 0 ? (
                            <div className="d-flex align-items-center mt-1">
                                {sharedConnections && sharedConnections.map((conn, index) => (
                                    <Image
                                        key={conn.id}
                                        src={conn.pic}
                                        roundedCircle
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            objectFit: 'cover',
                                            border: '1px solid white', // Add a white border for separation
                                            marginLeft: index > 0 ? '-8px' : '0', // Negative margin for overlapping effect
                                            position: 'relative', // Needed for z-index
                                            zIndex: sharedConnections.length - index // Layering from back to front
                                        }}
                                        className="me-0" // Ensure no extra margin
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/24x24/cccccc/ffffff?text=U'; }}
                                        alt={`Mutual connection ${conn.id}`}
                                    />
                                ))}
                                {otherSharedConnectionsCount > 0 && (
                                    <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>
                                        {sharedConnections && sharedConnections.length > 0 ? 'and ' : ''}{otherSharedConnectionsCount} other shared connections
                                    </span>
                                )}
                            </div>
                        ) : null}
                    </div>
                </Col>
                {/* Column for Action Buttons */}
                {/* On small screens (xs), takes full width and centers buttons. On medium (md) and larger, takes 3 columns and justifies buttons to the end. */}
                <Col xs={12} md={3} className="d-flex justify-content-center justify-content-md-end">
                    <Button  size="sm" className="me-2 ignoreButtonMyConnectPane"> {/* me-2 for spacing between buttons */}
                        Ignore
                    </Button>
                    <Button  size="sm" className="acceptButtonMyConnectPane">
                        Accept
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

const requestsData = [
    {
        id: 1,
        profilePic: '/home/Icons/connection_6.png',
        name: 'Lori Ferguson',
        title: 'Full Stack Web Developer',
        sharedConnections: [
            { id: 101, pic: '/home/Icons/connection_1.png' }, // Carolyn Ortiz
            { id: 102, pic: '/home/Icons/connection_2.png' }, // Frances Guerrero
        ],
        otherSharedConnectionsCount: 20
    },
    {
        id: 2,
        profilePic: '/home/Icons/connection_2.png',
        name: 'Carolyn Ortiz',
        title: 'Web Developer | Freelancer',
        sharedConnections: [
            { id: 201, pic: '/home/Icons/connection_4.png' }, // Amanda Reed
            { id: 202, pic: '/home/Icons/connection_1.png' }, // Lal Stevens
        ],
        otherSharedConnectionsCount: 10
    },
    {
        id: 3,
        profilePic: '/home/Icons/connection_7.png',
        name: 'Lori Ferguson',
        title: 'Full Stack Web Developer',
        // For requests with no specific shared connections shown as pics
        sharedConnections: [],
        otherSharedConnectionsCount: 0 // Or could be a number if only count is present
    },
    {
        id: 4,
        profilePic: '/home/Icons/connection_3.png',
        name: 'Lori Ferguson',
        title: 'Full Stack Web Developer',
        sharedConnections: [],
        otherSharedConnectionsCount: 115
    },
    {
        id: 5,
        profilePic: '/home/Icons/connection_4.png',
        name: 'Prince Lal',
        title: 'Full Stack Web Developer',
        sharedConnections: [],
        otherSharedConnectionsCount: 115
    },
    {
        id: 6,
        profilePic: '/home/Icons/connection_6.png',
        name: 'John Doe',
        title: 'Software Engineer',
        sharedConnections: [],
        otherSharedConnectionsCount: 5
    },
    {
        id: 7,
        profilePic: '/home/Icons/connection_5.png',
        name: 'Karen Miller',
        title: 'Project Manager',
        sharedConnections: [],
        otherSharedConnectionsCount: 80
    },
];


export const MyConnectPane = () => {
    const initialDisplayCount = 3;
    const itemsToLoad = 2; // Number of items to load each time

    const [displayCount, setDisplayCount] = useState(initialDisplayCount);

    const handleLoadMore = () => {
        setDisplayCount(prevCount => Math.min(prevCount + itemsToLoad, requestsData.length));
    };

    const hasMoreConnections = displayCount < requestsData.length;
    return (
        <>
            <Container className="my-0 p-0" style={{ maxWidth: '100%' }}> {/* Adjusted max-width based on the image */}
                <Card className="border-0 py-3 px-4">
                    <Card.Header className="bg-white px-0 pt-0 pb-3 border-bottom-0">
                        <h5 className="mb-0 fw-bold">Connection Requests</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {requestsData.slice(0, displayCount).map(request => ( // Corrected: Added .slice(0, displayCount)
                            <ConnectionRequestItem
                                key={request.id}
                                profilePic={request.profilePic}
                                name={request.name}
                                title={request.title}
                                sharedConnections={request.sharedConnections} // Pass the array of shared connection images
                                otherSharedConnectionsCount={request.otherSharedConnectionsCount} // Pass the count
                            />
                        ))}
                        {hasMoreConnections && ( // Conditionally render the Load more button
                            <Button variant="link" className="w-100 text-decoration-none mt-3 loadMoreConnectionMyConnectPane" onClick={handleLoadMore}>
                                Load more connections
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}

export default MyConnectPane;