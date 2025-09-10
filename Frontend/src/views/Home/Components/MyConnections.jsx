import { Container, Card, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/MyConnection.css';

// Component for a single connection item in the list
const ConnectionItem = ({ name, title, profilePic, status }) => {
    // Determine the icon/button based on connection status (e.g., 'add', 'connected', 'pending')
    let actionButton;
    if (status === 'add') {
        actionButton = (
            <Button className="rounded-circle addIcon d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', padding: '0'}}>
                <FontAwesomeIcon fixedWidth icon='plus' size='lg'></FontAwesomeIcon>
            </Button>
        );
    } else if (status === 'connected') {
        // Example for a 'connected' state, could be a checkmark or different button
        actionButton = (
            <Button variant="" size="sm" className="rounded-pill acceptedIcon" style={{ width: '40px', height: '40px', padding: '0'}}>
                <FontAwesomeIcon fixedWidth icon='user-check' color='#d8e8fc' size='sm'></FontAwesomeIcon>
            </Button>
        );
    } else {
        // Default or other states
        actionButton = (
            <Button variant="outline-primary" size="sm" className="rounded-pill">Connect</Button>
        );
    }

    return (
        <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center">
                <Image src={profilePic} roundedCircle style={{ width: '48px', height: '48px', objectFit: 'cover' }} className="me-3"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/48x48/cccccc/ffffff?text=U'; }}
                />
                <div>
                    <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{name}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{title}</p>
                </div>
            </div>
            {actionButton}
        </div>
    );
};

// Connection Dynamic data
const connectionsData = [
    {
        id: 1,
        name: 'Judy Nguyen',
        title: 'News anchor',
        profilePic: '/home/Icons/connection_1.png', // Placeholder
        status: 'add'
    },
    {
        id: 2,
        name: 'Amanda Reed',
        title: 'Web Developer',
        profilePic: '/home/Icons/connection_2.png', // Placeholder
        status: 'add'
    },
    {
        id: 3,
        name: 'Billy Vasquez',
        title: 'News anchor',
        profilePic: '/home/Icons/connection_3.png', // Placeholder
        status: 'add'
    },
    {
        id: 4,
        name: 'Lori Ferguson',
        title: 'Web Developer at ...',
        profilePic: '/home/Icons/connection_4.png', // Placeholder
        status: 'connected'
    },
    {
        id: 5,
        name: 'Carolyn Ortiz',
        title: 'News anchor',
        profilePic: '/home/Icons/connection_5.png', // Placeholder
        status: 'add'
    },
];
export const Myconnections = () => {
    return (
        <>
            <Container className="my-0 p-0" style={{ maxWidth: '100%', border: '2px solid black',borderRadius: '15px'  }}>
                <Card className="  border-0 p-3 mb-0" style={{ borderRadius: '15px' }}>
                    <Card.Header className="bg-white px-0 pt-0 pb-0 border-bottom-0">
                        <h4 className="mb-2 mt-1 fw-bolder">My Connections/ Opportunities</h4>
                    </Card.Header>
                    <Card.Body className="px-2">
                        {connectionsData.map(connection => (
                            <ConnectionItem
                                key={connection.id}
                                name={connection.name}
                                title={connection.title}
                                profilePic={connection.profilePic}
                                status={connection.status}
                            />
                        ))}
                        <Button variant="link" className="w-100 text-decoration-none mt-2">
                            View more
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}

export default Myconnections;