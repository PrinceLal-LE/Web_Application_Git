import { Container, Row, Col } from "react-bootstrap"
import { LeftSideBar } from "./Home/LeftSide"
import { MyConnectPane } from "./MyConnect/Components/MyConnectPane"
import { SuggestedConnect } from "./MyConnect/Components/SuggestedConnect"
export const MyConnect = () => {
    return (
        <>
            <Container className="homeContainer">

                <Row>
                    {/* Left contnet area */}
                    <Col md={3} className="leftSideBar">
                        <LeftSideBar />
                    </Col>

                    {/* Main content area */}
                    <Col md={9}>
                        <MyConnectPane />
                        {/* Right content area */}

                        <SuggestedConnect />

                    </Col>


                </Row>
            </Container>
        </>
    )
}

export default MyConnect;