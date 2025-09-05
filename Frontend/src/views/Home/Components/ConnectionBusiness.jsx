import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import '../styles/ConnectionBusiness.css'; // Import your custom CSS for styling



const userImages = [
    '/home/Icons/connection_1.png',
    '/home/Icons/connection_2.png',
    '/home/Icons/connection_3.png',
    '/home/Icons/connection_4.png',
    '/home/Icons/connection_5.png',
    '/home/Icons/connection_6.png',
    // Add more image paths as needed
];

// Sample data (replace with actual data from an API in a real application)
const usersData = [
    {
        id: 1,
        name: 'Louis Crawford',
        mutualConnections: 45,
        image: userImages[0] // Use connection_1.png for Louis
    },
    {
        id: 2,
        name: 'Dennis Barrett',
        mutualConnections: 21,
        image: userImages[1] // Placeholder image for Dennis
    },
    {
        id: 3,
        name: 'Nidhi Patel',
        mutualConnections: 50,
        image: userImages[2] // Placeholder image for Amanda
    },
    {
        id: 4,
        name: 'Sarah Johnson',
        mutualConnections: 2,
        image: userImages[3] // Placeholder image for Amanda
    },
    {
        id: 5,
        name: 'Anastasia',
        mutualConnections: 169,
        image: userImages[4] // Placeholder image for Amanda
    },
    {
        id: 6,
        name: 'Angilela',
        mutualConnections: 125,
        image: userImages[5] // Placeholder image for Amanda
    },
    // Add more users as needed, or fetch from an API
];
// Reusable User Card Component
// const UserCard = ({ name, mutualConnections, image }) => {
//     return (
//         <Col xs={12} sm={6} md={4} lg={3} className="mb-4"> {/* Adjust column sizes as needed */}
//             <Card className="text-center h-100 p-3" style={{ borderRadius: '15px', border: '1px solid #e0e0e0' }}>
//                 <div className="d-flex justify-content-center mb-3">
//                     <Image src={image} roundedCircle style={{ width: '80px', height: '80px', objectFit: 'cover' }} alt={name} />
//                 </div>
//                 <Card.Body className="p-0">
//                     <Card.Title className="mb-1 fw-bold" style={{ fontSize: '1rem' }}>{name}</Card.Title>
//                     <Card.Text className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
//                         {mutualConnections} mutual connections
//                     </Card.Text>
//                     <Button variant="outline-primary" className="rounded-pill px-4 mt-auto">
//                         Connect
//                     </Button>
//                 </Card.Body>
//             </Card>
//         </Col>
//     );
// };

const UserCard = ({ name, mutualConnections, image }) => {
    return (
        // Added flex-shrink-0 to prevent cards from shrinking and ensure consistent width for scrolling
        // mx-2 provides spacing between cards
        <div className="flex-shrink-0 mx-2" style={{ width: '180px' }}> {/* Fixed width for each card */}
            <Card className="text-center h-100 p-3" style={{ borderRadius: '15px', border: '1px solid #e0e0e0' }}>
                <div className="d-flex justify-content-center mb-3">
                    {/* Image with fallback in case the path is broken */}
                    <Image
                        src={image}
                        roundedCircle
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        alt={name}
                        onError={(e) => {
                            e.target.onerror = null; // Prevents infinite loop if fallback also fails
                            e.target.src = 'https://placehold.co/150x150/cccccc/ffffff?text=N/A'; // Generic fallback image
                        }}
                    />
                </div>
                <Card.Body className="p-0 d-flex flex-column justify-content-between connectButtonColor">
                    <div> {/* Wrapper for title and text to push button to bottom */}
                        <Card.Title className="mb-1 fw-bold" style={{ fontSize: '1rem' }}>{name}</Card.Title>
                        <Card.Text className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                            {mutualConnections} mutual connections
                        </Card.Text>
                    </div>
                    {/* mt-auto pushes the button to the bottom of the flex container */}
                    <Button variant="" className="px-4 mt-auto ">
                        Connect
                    </Button>
                </Card.Body>
            </Card>
        </div>
    );
};
export const ConnectionBussinessBox = () => {
    return (
        // <Container className="mt-3 pt-3 postDialogueBox bg-white p-4 rounded shadow-sm">
        //     <div className="d-flex justify-content-between align-items-center mb-3">
        //         <h5 className="text-left fw-bold mb-0">Connect Business/Project</h5>
        //         <Button variant="link" className="p-0 text-decoration-none">See all</Button>
        //     </div>
        //     <div className="text-left">
        //         <Row className="justify-content-start">
        //             {usersData.map(user => (
        //                 <UserCard
        //                     key={user.id}
        //                     name={user.name}
        //                     mutualConnections={user.mutualConnections}
        //                     image={user.image}
        //                 />
        //             ))}
        //         </Row>
        //     </div>
        // </Container>
        <Container className="mt-3 pt-3 connectionBussinessBox bg-white p-4  shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3 ">
                <h5 className="text-left fw-bold mb-0">Connect Business/Project</h5>
                <Button variant="link" className="p-0 text-decoration-none">See all</Button>
            </div>
            {/* Added d-flex, flex-nowrap, and overflow-x-auto for horizontal scrolling */}
            <div className="d-flex flex-nowrap overflow-auto py-2 hide-scrollbar gap-0">
                {usersData.map(user => (
                    <UserCard
                        key={user.id} // Unique key for each card is important for React lists
                        name={user.name}
                        mutualConnections={user.mutualConnections}
                        image={user.image}
                    />
                ))}
            </div>
        </Container>
    );
}