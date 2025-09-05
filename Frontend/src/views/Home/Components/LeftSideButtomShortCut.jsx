import { Container, ListGroup, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '/src/styles/Home.css'
import { Link } from 'react-router-dom';
export const LeftSideButtonShortCut = () => {
    return (
        <>
            {/* Shortcut of header */}
            <ListGroup className='w-100 mx-25 listShortCutSettingMySkill' style={{borderRadius: '15px'}}>
                <ListGroup.Item as={Link} to="/home"><FontAwesomeIcon fixedWidth icon={['fas', 'home']} color="#74C0FC" /> Home</ListGroup.Item>
                <ListGroup.Item as={Link} to="/my-connect"><FontAwesomeIcon fixedWidth icon="user" color="#74C0FC" /> My Connect</ListGroup.Item>
                <ListGroup.Item as={Link} to="/skill-connect"><FontAwesomeIcon fixedWidth icon="globe" color="#74C0FC" /> Skill Connect</ListGroup.Item>
                <ListGroup.Item as={Link} to="/career-connect"><FontAwesomeIcon fixedWidth icon="calendar" color="#74C0FC" /> Career Connect</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="fa-solid fa-people-arrows" color="#74C0FC" /> Connect a friend</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="fa-solid fa-bell" style={{ color: "#74C0FC" }} /> Event</ListGroup.Item>
                <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="gears" color="#74C0FC" /> Solution</ListGroup.Item>
                <ListGroup.Item > Show More <FontAwesomeIcon fixedWidth icon="angle-down" color="#74C0FC" /> </ListGroup.Item>
            </ListGroup>
        </>
    )
}