import { Container, Card, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const jobSeekerTopics = [
    "Expert advice for Job seeker",
    "Free Lancing Jobs",
    "Part Time Jobs",
    "Guidance for Resume Building",
    "Choosing the Right job",
    "Interview tips",
    "More"
];
const employer = [
    "Finding the Right Candidate",
    "Job posting support",
    "Screening Process",
    "Business Solutions",
    "More"
];
export const AdviceCornerCareerConnect = () => {
    return (
        <>
            <Container className="my-2 p-0 adviceCornerContainer" style={{ maxWidth: '100%' }}> {/* Adjust max-width as needed */}
                <Card >
                    <Card.Header className="text-white fw-bold text-center py-2 rounded-top-3" style={{ backgroundColor: '#17A2B8', borderBottom: 'none' }}> {/* Bootstrap info blue */}
                        Advice Corner
                    </Card.Header>
                    <h2 className="d-flex justify-content-center mt-3">
                        <Badge className="px-5 " bg="info">
                            Job Seeker
                        </Badge >
                    </h2>
                    <Card.Body className="px-4 py-2">
                        {/* Added d-flex and flex-wrap to make list items horizontal and wrap */}
                        <ul className="list-unstyled mb-0 d-flex flex-wrap gap-0 flex-column align-items-start">
                            {jobSeekerTopics.map((topic, index) => (
                                <li key={index} className="mb-2 me-4" style={{ flex: '0 0 auto' }}> {/* me-4 for horizontal spacing, flex:0 0 auto to prevent shrinking */}
                                    <span className="me-2" style={{ color: '#343A40' }}>&bull;</span> {/* Custom bullet point */}
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </Card.Body>
                </Card>

                <Card >
                    <h2 className="d-flex justify-content-center mt-3">
                        <Badge className="px-5" bg="info">
                            Employer
                        </Badge >
                    </h2>
                    <Card.Body className="px-4 py-2">
                        {/* Added d-flex and flex-wrap to make list items horizontal and wrap */}
                        <ul className="list-unstyled mb-0 d-flex flex-wrap gap-0 flex-column align-items-start">
                            {employer.map((topic, index) => (
                                <li key={index} className="mb-2 me-4" style={{ flex: '0 0 auto' }}> {/* me-4 for horizontal spacing, flex:0 0 auto to prevent shrinking */}
                                    <span className="me-2" style={{ color: '#343A40' }}>&bull;</span> {/* Custom bullet point */}
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </Card.Body>
                </Card>
            </Container>

        </>
    )
}
export default AdviceCornerCareerConnect;