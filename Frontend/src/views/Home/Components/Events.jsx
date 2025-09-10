import { Container, Card, Button } from "react-bootstrap"

// Component for a single event item
const EventItem = ({ date, title }) => {
    return (
        <div className="mb-3">
            <h6 className="mb-1 text-muted" style={{ fontSize: '0.85rem' }}>{date}</h6>
            <p className="mb-0 fw-bold">{title}</p>
        </div>
    );
};

const eventsData = [
    {
        id: 1,
        date: '9 September, 2022',
        title: 'Ten questions you should answer truthfully'
    },
    {
        id: 2,
        date: '12 September, 2022',
        title: 'Five unbelievable facts about money'
    },
    {
        id: 3,
        date: '14 September, 2022',
        title: 'Best Pinterest Boards for learning about business'
    },
    {
        id: 4,
        date: '17 September, 2022',
        title: 'Skills that you can learn from business'
    },
    // Add more event data as needed
];

export const Events = () => {
    return (
        <>
            <Container className="mt-3 mb-3 pt-3 connectionBussinessBox bg-white p-4" style={{ maxWidth: '100%', border: '2px solid black',borderRadius: '15px' }}>
                {/* <div className="d-flex justify-content-between align-items-center mb-3 ">
                    <h5 className="text-left fw-bold mb-0">Events</h5>
                </div> */}
                <Card className="rounded-3  border-0 p-0">
                    <Card.Header className="bg-white px-0 pt-0 pb-3 border-bottom-0">
                        <h5 className="mb-0 fw-bold">Events</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {eventsData.map(event => (
                            <EventItem
                                key={event.id}
                                date={event.date}
                                title={event.title}
                            />
                        ))}
                        <Button variant="link" className="w-100 text-decoration-none mt-2 d-flex align-items-center justify-content-center">
                            Show More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down ms-2" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}

export default Events;