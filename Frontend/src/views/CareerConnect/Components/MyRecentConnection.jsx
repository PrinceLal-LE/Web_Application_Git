import { Container, Card, Button } from "react-bootstrap"

// Component for a single job search item
const JobSearchItem = ({ searchTerm, newResultsCount, location }) => {
    return (
        <div className="mb-3">
            <h6 className="mb-0 fw-bold d-flex align-items-center">
                {searchTerm}
                {newResultsCount > 0 && (
                    <span className="text-success ms-2" style={{ fontSize: '0.8rem' }}>{newResultsCount} new</span>
                )}
            </h6>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{location}</p>
        </div>
    );
};

const recentSearchesData = [
    {
        id: 1,
        searchTerm: 'project manager',
        newResultsCount: 211,
        location: '10920, Congers, New York, United States'
    },
    {
        id: 2,
        searchTerm: 'web developer',
        newResultsCount: 50,
        location: 'Remote'
    },
    {
        id: 3,
        searchTerm: 'data analyst',
        newResultsCount: 15,
        location: 'San Francisco, California, United States'
    }
    // Add more recent searches as needed
];

const handleClearSearches = () => {
    // In a real application, this would clear the state or make an API call
    console.log('Clear all recent searches clicked');
    // You would typically update a state or context here to clear the list
    // For this example, we'll just log
};


export const MyRecentConnection = () => {
    return (
        <>
            <Container className="my-4 p-0 myRecentConnectionContainer" style={{ maxWidth: '100%' }}> {/* Adjusted max-width for component size */}
                <Card className="border-0 p-3">
                    <Card.Header className="bg-white px-0 pt-0 pb-3 border-bottom-0 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold">Recent job searches</h5>
                        <Button variant="link" className="p-0 text-decoration-none" onClick={handleClearSearches}>
                            Clear
                        </Button>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {recentSearchesData.map(search => (
                            <JobSearchItem
                                key={search.id}
                                searchTerm={search.searchTerm}
                                newResultsCount={search.newResultsCount}
                                location={search.location}
                            />
                        ))}
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}

export default MyRecentConnection;