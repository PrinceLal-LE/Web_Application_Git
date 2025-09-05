import { Container, Form, Row, Col, Button, Dropdown, InputGroup, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../Styles/SearchPane.css'

// Inline SVG for Search Icon
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.085.12l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.119-.085zm-5.442 1.408a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11" />
    </svg>
);

// Inline SVG for Chevron Down Icon (for dropdowns)
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
    </svg>
);



// Sample data for informational sections below the search bar
const infoSections = [
    {
        id: 1,
        icon: 'https://placehold.co/60x60/ADD8E6/000000?text=Icon1', // Placeholder icon
        title: 'How to choose an ideal tutor'
    },
    {
        id: 2,
        icon: 'https://placehold.co/60x60/B0E0E6/000000?text=Icon2', // Placeholder icon
        title: 'How you can pay for lessons'
    },
    {
        id: 3,
        icon: 'https://placehold.co/60x60/AFEEEE/000000?text=Icon3', // Placeholder icon
        title: 'Where lessons take place'
    },
    {
        id: 4,
        icon: 'https://placehold.co/60x60/FAEBD7/000000?text=Icon4', // Placeholder icon
        title: 'How we verify our tutors'
    },
];

export const SearchPaneSkillConnect = () => {
    return (
        <>
            <Container fluid className="px-0 pb-1 bg-white" style={{ borderRadius: '15px 15px ' }}>
                <h4 className='p-3'>Resource Connect</h4>
                <div className="searchPanelLabel  pt-2 pb-4" style={{ borderRadius: '15px 15px  0px  0px' }}> {/* Dark background for the search bar section */}
                    <Container>
                        <Row className="mb-4 d-flex align-items-center">
                            {/* I Want to Learn Input */}
                            <Col xs={12} md={3} className="mb-3 mb-md-0">
                                <Form.Label className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem' }}>I WANT TO LEARN</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Hindi"
                                        defaultValue="Hindi"
                                        className="rounded-pill bg-white border-0 py-2 px-3 shadow-sm"
                                        style={{ paddingRight: '2.5rem' }} // Space for the close icon
                                    />
                                    <Button variant="light" className="position-absolute end-0 top-50 translate-middle-y rounded-circle p-0 me-2" style={{ width: '24px', height: '24px', zIndex: 5 }}>
                                        <FontAwesomeIcon icon="circle-xmark" size='xl' />
                                    </Button>
                                </InputGroup>
                            </Col>

                            {/* Price Per Hour Dropdown */}
                            <Col xs={12} md={3} className="mb-3 mb-md-0">
                                <Form.Label className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem' }}>PRICE PER HOUR</Form.Label>
                                <Dropdown className="w-100">
                                    <Dropdown.Toggle variant="light" id="dropdown-price" className="w-100 rounded-pill text-start d-flex justify-content-between align-items-center py-2 px-3 shadow-sm">
                                        75 INR - 2950 INR <ChevronDownIcon />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100">
                                        <Dropdown.Item>Option 1</Dropdown.Item>
                                        <Dropdown.Item>Option 2</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>

                            {/* Country of Birth Dropdown */}
                            <Col xs={12} md={3} className="mb-3 mb-md-0">
                                <Form.Label className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem' }}>COUNTRY OF BIRTH</Form.Label>
                                <Dropdown className="w-100">
                                    <Dropdown.Toggle variant="light" id="dropdown-country" className="w-100 rounded-pill text-start d-flex justify-content-between align-items-center py-2 px-3 shadow-sm">
                                        Select a country <ChevronDownIcon />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100">
                                        <Dropdown.Item>Country 1</Dropdown.Item>
                                        <Dropdown.Item>Country 2</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>

                            {/* I'm Available Dropdown */}
                            <Col xs={12} md={3} className="mb-3 mb-md-0">
                                <Form.Label className="text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem' }}>I'M AVAILABLE</Form.Label>
                                <Dropdown className="w-100">
                                    <Dropdown.Toggle variant="light" id="dropdown-time" className="w-100 rounded-pill text-start d-flex justify-content-between align-items-center py-2 px-3 shadow-sm">
                                        Select a time <ChevronDownIcon />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100">
                                        <Dropdown.Item>Time 1</Dropdown.Item>
                                        <Dropdown.Item>Time 2</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>

                        {/* Filter and Search Bar Row */}
                        <Row className="align-items-center mt-4">
                            {/* Filter Buttons */}
                            <Col xs={12} lg={6} className="d-flex flex-wrap mb-3 mb-lg-0">
                                <Dropdown className="me-2 mb-2">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-specialties" className="rounded-pill text-dark">
                                        Specialties <ChevronDownIcon />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Specialty 1</Dropdown.Item>
                                        <Dropdown.Item>Specialty 2</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown className="me-2 mb-2">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-also-speaks" className="rounded-pill text-dark">
                                        Also speaks <ChevronDownIcon />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Language 1</Dropdown.Item>
                                        <Dropdown.Item>Language 2</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown className="me-2 mb-2">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-native-speaker" className="rounded-pill text-dark">
                                        Native speaker <ChevronDownIcon />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Yes</Dropdown.Item>
                                        <Dropdown.Item>No</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>

                            {/* Sort by and Search by Name */}
                            <Col xs={12} lg={6} className="d-flex flex-wrap justify-content-lg-end">
                                <Dropdown className="me-2 mb-2">
                                    <Dropdown.Toggle variant="secondary" id="dropdown-sort-by" className="rounded-pill text-dark">
                                        Sort by : Our top picks <ChevronDownIcon />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>Option A</Dropdown.Item>
                                        <Dropdown.Item>Option B</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <InputGroup className="flex-grow-1"> {/* flex-grow-1 to take available space */}
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by name or key ..."
                                        className="rounded-pill bg-white border-0 py-2 px-3 shadow-sm"
                                        style={{ maxWidth: '300px' }} // Limit max width for desktop
                                    />
                                    <Button variant="light" className="position-absolute end-0 top-50 translate-middle-y rounded-circle p-0 me-2" style={{ width: '24px', height: '24px', zIndex: 5 }}>
                                        <SearchIcon />
                                    </Button>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Container>
                </div>

                {/* Content below the search bar */}
                <Container className="my-5">
                    <Row className="text-center justify-content-center">
                        {infoSections.map(section => (
                            <Col key={section.id} xs={12} sm={6} md={3} className="mb-4">
                                <Image src={section.icon} fluid className="mb-2" />
                                <h6 className="fw-bold">{section.title}</h6>
                            </Col>
                        ))}
                    </Row>
                    <div className="text-center mt-4">
                        <p className="fw-bold">194 Hindi teachers available</p>
                        <Button variant="info" className="rounded-circle" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
                            ?
                        </Button>
                    </div>
                </Container>
            </Container>
        </>
    )
}

export default SearchPaneSkillConnect;