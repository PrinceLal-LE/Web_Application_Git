import { NavLink } from "react-router-dom";
import '../../styles/Navbar.css';
// Import Navbar specifically from react-bootstrap
import { Navbar as RBNavbar, Nav, Container, NavDropdown, FormControl, Form, Button } from "react-bootstrap";
import userAvatar from '/images/avtar.png'; // Adjust the path as necessary
import { useDispatch, useSelector } from 'react-redux';
import { setLogout  } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
const defaultProfilePhoto = '/images/avtar.png';
/**
 * A navigation bar component for the Mould Connect application.
 *
 * This component is the main navigation component for the application.
 * It includes the main navigation links, the user's profile photo and a
 * dropdown menu, a search input field, and a "More" dropdown menu with
 * additional links.
 *
 * @returns {JSX.Element} The navigation bar component.
 */
export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(setLogout());
        navigate('/login');
    };
    const profilePhotoUrl = user?.profile_photo_filepath ? `${API_BASE_URL}/eRepo/${user.profile_photo_filepath}` : defaultProfilePhoto;

    return (
        <>
            {/* // Use RBNavbar to avoid naming conflict with your exported Navbar component */}
            <RBNavbar expand="lg" className="custom-navbar">
                {/* Using Container fluid will make the content inside the navbar span full width */}
                {/* If you want the items inside the Navbar to be centered and have a max-width, use <Container> instead */}
                <Container className="homeContainer"> {/* Changed to Container fluid for full width content inside Navbar */}
                    <RBNavbar.Brand as={NavLink} to="/home" className="logoNavbar justify-content-space-around" >
                        <img src="/images/Logo_Navbar.png" alt="Mould Connect" title="Mould Connect" />
                    </RBNavbar.Brand>



                    {/* Navbar Toggler for mobile */}
                    <RBNavbar.Toggle aria-controls="basic-navbar-nav" />

                    <RBNavbar.Collapse id="basic-navbar-nav">
                        <Form className="d-flex ">
                            <FormControl
                                type="search"
                                placeholder="Start to Search / Connect..."
                                className="me-2 searchNavbar"
                                aria-label="Search"
                                style={{ minWidth: '300px', borderRadius: '10rem' }} // Adjusted to remove border and set min width
                            />
                        </Form>
                    </RBNavbar.Collapse>
                    {/* Right side: Main Nav Links and User/More icons */}
                    <RBNavbar.Collapse id="basic-navbar-nav">

                        <Nav className="mx-auto"> {/* This Nav will be centered */}
                            {/* "More" Button */}
                            {/* <Button variant="primary" className="me-3">More</Button>  */}

                            {/* Main Navigation Links */}
                            <Nav.Link as={NavLink} to="/home" className={({ isActive }) => (isActive ? "active" : "")}>Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/my-connect" className={({ isActive }) => (isActive ? "active" : "")}>My Connect</Nav.Link>
                            <Nav.Link as={NavLink} to="/skill-connect" className={({ isActive }) => (isActive ? "active" : "")}>Skill Connect</Nav.Link>
                            <Nav.Link as={NavLink} to="/career-connect" className={({ isActive }) => (isActive ? "active" : "")}>Career Connect</Nav.Link>
                            <Nav.Link as={NavLink} to="/messaging" className={({ isActive }) => (isActive ? "active" : "")}>Messaging</Nav.Link>

                            {/* Search/Connect Icon/Link (if it's separate from the input field) */}
                            {/* If you want the search input on the right for desktop, move the Form here */}
                            <Nav.Link as={NavLink} to="/search">
                                {/* If using Bootstrap Icons: <Search className="me-1" /> */}
                                <i className="bi bi-search me-1"></i> {/* Example: Bootstrap Icons (requires CSS/CDN) */}
                                {/* "Search / Connect" text if desired, or just the icon */}
                            </Nav.Link>

                            {/* Notifications Icon (Bell) */}
                            <Nav.Link as={NavLink} to="/notifications">
                                {/* If using Bootstrap Icons: <Bell /> */}
                                <i className="bi bi-bell"></i> {/* Example: Bootstrap Icons (requires CSS/CDN) */}
                            </Nav.Link>

                            {/* User Avatar with Dropdown */}
                            <NavDropdown
                                title={
                                    // <img
                                    //     src={userAvatar} // Use imported avatar image
                                    //     alt="Profile Picture"
                                    //     width="30"
                                    //     height="30"
                                    //     className="rounded-circle"
                                    // />
                                    <img src={profilePhotoUrl} alt="Profile" className='nav-profile-photo' width="30" height="30" />
                                }
                                id="user-profile-dropdown"
                                align="end" // Aligns the dropdown menu to the right
                            >
                                <NavDropdown.Item as={NavLink} to="/profile">View Profile</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/settings">Settings</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={NavLink} to="/logout">Logout</NavDropdown.Item>
                            </NavDropdown>

                            {/* The 'More' on the far right of the screenshot */}
                            {/* <Nav.Link as={NavLink} to="/more-options">More</Nav.Link> */}
                            <NavDropdown
                                title={
                                    "More"
                                }
                                id="headerMoreButton"
                                align="end" // Aligns the dropdown menu to the right
                            >
                                <NavDropdown.Item as={NavLink} to="/profile">View Profile</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/career">Career</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/solution">Solution</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/connect-a-friend">Connect A Friend</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/services">Services</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/advertise">Advertise</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/connect-with-us">Connect With Us</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/ask-an-expert">Ask an Expert</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/opportunities">Opportunities</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </RBNavbar.Collapse>
                </Container>
            </RBNavbar>
            <div>
                <br />
            </div>
        </>
    );
};