import { Container, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../Styles/MySkill.css'
export const MySkillSkillConnectPage = () => {
    return (
        <>
            <Container className='bg-white pt-3' style={{ borderRadius: '15px' }}>
                <h4 >Skill Connect</h4>
                <ListGroup className='w-100  listMySkillSkillConnect'>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="user-group" color="#74C0FC" /> My Skill Connection</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="bell" color="#74C0FC" /> Skill Notification</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="user-graduate" color="#74C0FC" /> Acquire Skill</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="person-chalkboard" color="#74C0FC" /> Become a tutor</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="fa-solid fa-people-arrows" color="#74C0FC" /> Refer a tutor</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="handshake" style={{ color: "#74C0FC" }} /> Partner With Us</ListGroup.Item>
                    <ListGroup.Item ><FontAwesomeIcon fixedWidth icon="hand-holding-dollar" color="#74C0FC" />Revenue</ListGroup.Item>
                    <ListGroup.Item > Show Less <FontAwesomeIcon fixedWidth icon="angle-up" color="#74C0FC" /> </ListGroup.Item>
                </ListGroup>
            </Container>
        </>
    )
}

export default MySkillSkillConnectPage;