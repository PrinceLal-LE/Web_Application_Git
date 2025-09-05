import React from 'react';
import { Row, Col } from 'react-bootstrap';
import '../styles/UserStatus.css'; 
export const UserStatus = () => {
    return (
        <Row className="userStatusRow my-4">
            {/* Post Column */}
            <Col className="userStatusCol">
                <div className="stats-number">256</div>
                <div className="stats-label">Post</div>
            </Col>

            {/* Followers Column */}
            <Col className="userStatusCol">
                <div className="stats-number">2.5K</div>
                <div className="stats-label">Followers</div>
            </Col>

            {/* Following Column */}
            <Col className="userStatusCol ">
                <div className="stats-number">365</div>
                <div className="stats-label">Following</div>
            </Col>
        </Row>
    );
}