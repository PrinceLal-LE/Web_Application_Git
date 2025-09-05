import { Container, Row, Col } from "react-bootstrap"
import {LeftSideBar} from "./Home/LeftSide"
import {CenterBar} from "./Home/Center"
import {RightSideBar} from "./Home/RightSide"
import '../styles/Home.css'
export const Home = () => {
    return <>
        <Container  className="homeContainer">
            
        <Row>
            {/* Left contnet area */}
            <Col md={3} className="leftSideBar">
                <LeftSideBar/>
            </Col>

            {/* Main content area */}
            <Col md={6}>
                <CenterBar/>
            </Col>
            
            {/* Right content area */}
            <Col md={3}>
                <RightSideBar/>
            </Col>
        </Row>
        </Container>
    </>
}