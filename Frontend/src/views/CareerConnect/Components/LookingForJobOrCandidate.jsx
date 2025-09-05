import { Container, Row, Col, Button } from 'react-bootstrap';
import "../Styles/LookingForJobOrCandidate.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
export const LookingForJobOrCandidate = () => {
    return (
        <>
            <Container>
                <Row>
                    <Col className='p-0'>
                        <div className='connectAsLearnerOrTutorContainer p-3' >
                            <h4>Career Connect As</h4>
                            <h6>Connect by Login as</h6>
                            <div className="d-flex justify-content-center flex-column ">
                                <Button className='mx-5'> Learner </Button>
                                <Button className='mx-5'> Tutor </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container className="">

                <Row className='my-2 pt-3 px-1 connectAsLearnerOrTutorContainer'>
                    <Col className="d-flex justify-content-center flex-column">
                        <Button className="mx-5 ">
                            <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className='me-2'/>
                            Post a Job
                        </Button>
                    </Col>
                </Row>

            </Container>
        </>
    )
}