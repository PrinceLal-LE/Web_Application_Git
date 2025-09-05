import { Container, Row, Col, ListGroup } from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../Styles/LeftSideCareerConnect.css"

export const LeftSideCareerConnect = () => {
    return (
        <>
            <Container className='bg-white pt-3' style={{ borderRadius: '15px' }}>
                <h4 >Career Connect</h4>
                <ListGroup className='w-100  listCareerConnect'>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="user-group" color="#74C0FC" /> My Career Connections</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="bell" color="#74C0FC" /> Skill Notification</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="user-graduate" color="#74C0FC" /> Post your CV/Resume</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="fa-solid fa-people-arrows" color="#74C0FC" /> Refer a frend</ListGroup.Item>
                </ListGroup>
            </Container>
        </>
    )
}

export default LeftSideCareerConnect;
