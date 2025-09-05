import { Container, Card, Image, Button } from 'react-bootstrap';
import Myconnections from './Components/MyConnections';
import Events from './Components/Events';
import Advertisment from './Components/Advertisment';
export const RightSideBar = () => {
    return <>

        {/* My Connection / Opportunities */}
        <Myconnections />

        {/* Events */}
        <Events />

        {/* Advertisment */}
        <Advertisment />
    </>
}