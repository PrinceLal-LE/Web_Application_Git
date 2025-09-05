import { Container, ListGroup, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
export const LeftSideFooter = () => {
    return (
        <>
            <Container fluid className="leftSideBarFooter">

                {/* First Row of Links */}
                <Row className='justify-content-center gx-4 leftSideBarFooterLink text-muted mt-3'> {/* gx-4 for horizontal spacing */}
                    <Col xs="auto"><span>About Us</span></Col> {/* Use xs="auto" */}
                    <Col xs="auto"><span>Setting</span></Col>
                    <Col xs="auto"><span>Contact Us</span></Col>
                </Row>

                {/* Second Row of Links */}
                <Row className='justify-content-center gx-4 leftSideBarFooterLink text-muted'>
                    <Col xs="auto"><span>Career</span></Col>
                    <Col xs="auto"><span>Advertise with Us</span></Col>
                </Row>

                {/* Third Row of Links */}
                <Row className='justify-content-center gx-4 leftSideBarFooterLink text-muted'>
                    <Col xs="auto"><Link to="/terms-and-conditions"><span>Terms & Conditions</span></Link></Col>
                    <Col xs="auto"><Link to="/privacy-policy"><span>Privacy & Policy</span></Link></Col>
                    <Col xs="auto"><span>Help</span></Col>
                    <Col xs="auto"><span>Questions</span></Col>
                </Row>

                {/* RSS Feed Section */}
                <div className='leftSideBarFooterRssLink my-3'> {/* my-3 for vertical margin */}
                    {/* Use FontAwesomeIcon for better control if you have it set up */}
                    <p className='mb-0'>
                        <FontAwesomeIcon icon={['fas', 'rss-square']} color="red" className="me-2" />
                        RSS Feed with Icon
                    </p>
                </div>

                {/* Follow Us Section */}
                <div className='leftSideBarFooterFollowSection mb-3'> {/* mb-3 for vertical margin */}
                    <p className='mb-0'>Follow Us with</p>
                    <Row className='d-flex flex-column'>
                        <Col>
                        
                        <FontAwesomeIcon icon="fa-brands fa-facebook" size='xl' className='p-2'/>
                        <FontAwesomeIcon icon="fa-brands fa-x-twitter" size='xl' className='p-2'/>
                        <FontAwesomeIcon icon="fa-brands fa-linkedin" size='xl' className='p-2'/>
                        <FontAwesomeIcon icon="fa-brands fa-instagram" size='xl' className='p-2'/>
                        <FontAwesomeIcon icon="fa-brands fa-pinterest" size='xl' className='p-2'/>
                        </Col>
                    </Row>
                    {/* Add social media icons here if needed, e.g., FontAwesomeIcon icon={['fab', 'facebook']} */}
                </div>

                {/* Copyright Section */}
                <div className='leftSideBarFooterCopyRightSection py-3'> {/* py-3 for vertical padding */}
                    <p className='mb-0'>&copy;2025 Mould Connect</p>
                </div>
            </Container>
        </>
    )
}