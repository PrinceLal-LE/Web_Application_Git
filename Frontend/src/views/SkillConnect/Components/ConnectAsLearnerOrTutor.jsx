import { Container, Row, Col, Button } from 'react-bootstrap';
import "../Styles/ConnectAsLearnerOrTutor.css";
export const ConnectAsLearnerOrTutor = () => {
    return (
        <>
            <Container>
                <Row>
                    <Col className='p-0'>
                        <div className='connectAsLearnerOrTutorContainer p-3' >
                            <h4>Skill Connect As</h4>
                            <h6>Connect by Login as</h6>
                            <div className="d-flex justify-content-center flex-column ">
                            <Button className='mx-5'> Learner </Button>
                            <Button className='mx-5'> Tutor </Button>

                            </div>
                        </div>
                    </Col>
                </Row>

            </Container>
        </>
    )
};
export default ConnectAsLearnerOrTutor;