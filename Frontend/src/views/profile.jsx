import { Container, Row, Col } from "react-bootstrap"
import React from "react";
import { MyProfile } from "./Profile/MyProfile";
import Advertisment from './Home/Components/Advertisment'
import TrendingContent from './SkillConnect/Components/TrendingContent'
export const Profile = () => {
    return (
        <>
            <Container className="homeContainer">
                <Row>

                    {/* Main content area */}
                    <Col md={9}>
                        <MyProfile />
                    </Col>

                    {/* Right content area */}
                    <Col md={3}>
                        {/* Right content goes here */}
                        <Advertisment />
                        <div className="mb-2"></div>
                        <TrendingContent />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile;