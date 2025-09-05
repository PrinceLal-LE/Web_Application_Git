import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Button, Image, Badge, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom'; // Assuming you might use NavLink for chat list items

// Import new CSS file for messaging
import '../styles/MessagePanel.css'; 
import profilePic1 from '/home/Icons/connection_1.png'; // Example profile pics
import profilePic2 from '/home/Icons/connection_2.png';
import profilePic3 from '/home/Icons/connection_3.png';
import profilePic4 from '/home/Icons/connection_4.png';
import profilePic5 from '/home/Icons/connection_5.png';
import profilePic6 from '/home/Icons/connection_6.png';
import profilePic7 from '/home/Icons/connection_7.png';
import pdfIcon from '/home/Icons/connection_7.png'; // Example PDF icon

// Sample Data for Chat List
const chatList = [
    {
        id: 1,
        name: 'Yashika Mishra',
        profilePic: profilePic1,
        lastMessage: 'Yashika: if there is any vacancy then please let me...',
        time: 'Jul 7',
        unreadCount: 0,
        isFocused: true,
        isActive: true, // Currently selected chat
    },
    {
        id: 2,
        name: 'Subhasree Mondal',
        profilePic: profilePic4,
        lastMessage: 'You: Chain nhi mil raha h',
        time: 'Jul 7',
        unreadCount: 3,
        isFocused: true,
    },
    {
        id: 3,
        name: 'Narinder Ahluwalia',
        profilePic: profilePic3,
        lastMessage: 'Narinder: Hi Prince!... Received 4 days ago. Reply?',
        time: 'Jul 6',
        unreadCount: 1,
        isFocused: true,
    },
    {
        id: 4,
        name: 'Anant Pal Ravi',
        profilePic: profilePic2,
        lastMessage: 'Anant Pal: Happy belated birthday!',
        time: 'Jul 3',
        unreadCount: 0,
        isFocused: true,
    },
    {
        id: 5,
        name: 'Preet Lal',
        profilePic: profilePic5,
        lastMessage: 'Preet sent a post',
        time: 'Jun 30',
        unreadCount: 0,
        isFocused: false,
    },
    {
        id: 6,
        name: 'Kiran Suresh',
        profilePic: profilePic6,
        lastMessage: 'Sponsored Transition to Product Compani...',
        time: 'Jun 30',
        unreadCount: 1,
        isFocused: false,
    },
    {
        id: 7,
        name: 'Jobbers Crim Okiria',
        profilePic: profilePic7,
        lastMessage: 'Jobbers Crim: Wishing you a very happy birthday!',
        time: 'Jun 28',
        unreadCount: 1,
        isFocused: false,
    },
    {
        id: 8,
        name: 'Ganga Kumar',
        profilePic: profilePic1, // Reusing profile pic for example
        lastMessage: 'Ganga: Wishing you a very happy birthday!',
        time: 'Jun 28',
        unreadCount: 1,
        isFocused: false,
    },
];

// Sample Data for Active Chat Messages (for Yashika Mishra)
const messages = [
    {
        id: 1,
        sender: 'Yashika Mishra',
        profilePic: profilePic1,
        text: 'Fine',
        time: '9:02 PM',
        isMe: false,
    },
    {
        id: 2,
        sender: 'Yashika Mishra',
        profilePic: profilePic1,
        text: 'What about you?',
        time: '9:02 PM',
        isMe: false,
    },
    {
        id: 3,
        sender: 'Prince Lal', // Assuming Prince Lal is the current user
        profilePic: profilePic5, // Current user's avatar
        text: "I'm good",
        time: '9:02 PM',
        isMe: true,
    },
    {
        id: 4,
        sender: 'Yashika Mishra',
        profilePic: profilePic1,
        text: 'Actually I texted you because I want to know that is there any vacancy in your company',
        time: '9:03 PM',
        isMe: false,
    },
    {
        id: 5,
        sender: 'Prince Lal',
        profilePic: profilePic5,
        text: 'Can you share your resume?',
        time: '9:42 PM',
        isMe: true,
    },
    {
        id: 6,
        sender: 'Yashika Mishra',
        profilePic: profilePic1,
        text: 'Yashika Mishra Resume.pdf',
        file: true,
        fileName: 'Yashika Mishra Resume.pdf',
        fileSize: '320 KB',
        time: '2:54 PM',
        isMe: false,
    },
    {
        id: 7,
        sender: 'Yashika Mishra',
        profilePic: profilePic1,
        text: 'if there is any vacancy then please let me know',
        time: '2:54 PM',
        isMe: false,
    },
];


export const MessagePanel = () => {
    const messagesEndRef = useRef(null); // Ref for scrolling to bottom of messages

    // Scroll to the latest message whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Container fluid className="message-panel-container px-0 py-3">
            <Row className="g-0 message-panel-row"> {/* g-0 removes gutter for full width sections */}
                {/* Left Sidebar: Chat List */}
                <Col md={4} className="message-list-sidebar pe-0"> {/* pe-0 to remove right padding */}
                    <div className="message-list-header px-3 py-3">
                        <h5 className="fw-bold mb-0">Messaging</h5>
                        {/* Search messages input */}
                        <InputGroup className="mt-3">
                            <FormControl
                                placeholder="Search messages"
                                className="search-messages-input"
                            />
                            <Button variant="outline-secondary" className="search-messages-button">
                                <FontAwesomeIcon icon="search" />
                            </Button>
                        </InputGroup>
                        {/* Filter Tabs */}
                        <Tabs defaultActiveKey="jobs" id="message-filters" className="mb-0 mt-3 message-filter-tabs">
                            <Tab eventKey="jobs" title="Jobs"></Tab>
                            <Tab eventKey="unread" title="Unread"></Tab>
                            <Tab eventKey="my-connections" title="My Connections"></Tab>
                            <Tab eventKey="inmail" title="InMail"></Tab>
                            <Tab eventKey="starred" title="Starred"></Tab>
                        </Tabs>
                    </div>

                    <div className="message-list-body">
                        {chatList.map(chat => (
                            <div key={chat.id} className={`message-list-item d-flex align-items-center p-3 ${chat.isActive ? 'active' : ''}`}>
                                <Image src={chat.profilePic} roundedCircle className="chat-avatar me-3" />
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0 fw-bold">{chat.name}</h6>
                                        <small className="text-muted">{chat.time}</small>
                                    </div>
                                    <p className="mb-0 text-muted last-message-text">{chat.lastMessage}</p>
                                    {chat.unreadCount > 0 && (
                                        <Badge bg="success" className="unread-badge">{chat.unreadCount}</Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Right Panel: Active Chat Window */}
                <Col md={8} className="active-chat-panel ps-0"> {/* ps-0 to remove left padding */}
                    {/* Active Chat Header */}
                    <div className="active-chat-header d-flex justify-content-between align-items-center p-3">
                        <div>
                            <h5 className="mb-0 fw-bold">Yashika Mishra</h5>
                            <small className="text-success">Available on mobile</small>
                        </div>
                        <div className="active-chat-actions">
                            <Button variant="link" className="text-muted"><FontAwesomeIcon icon="ellipsis-h" /></Button>
                            <Button variant="link" className="text-muted"><FontAwesomeIcon icon="plus-square" /></Button>
                            <Button variant="link" className="text-muted"><FontAwesomeIcon icon="star" /></Button>
                            <Button variant="link" className="text-muted"><FontAwesomeIcon icon="pen-to-square" /></Button>
                            <Button variant="link" className="text-muted"><FontAwesomeIcon icon="trash" /></Button>
                        </div>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="chat-messages-body p-3">
                        {messages.map(message => (
                            <div key={message.id} className={`message-bubble-container d-flex ${message.isMe ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                                {!message.isMe && <Image src={message.profilePic} roundedCircle className="message-avatar me-2" />}
                                <div className={`message-bubble p-2 rounded ${message.isMe ? 'my-message' : 'other-message'}`}>
                                    {message.file ? (
                                        <div className="file-message d-flex align-items-center">
                                            <Image src={pdfIcon} alt="PDF" width="24" className="me-2" />
                                            <div>
                                                <small className="d-block fw-bold">{message.fileName}</small>
                                                <small className="d-block text-muted">{message.fileSize}</small>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {!message.isMe && <small className="d-block fw-bold mb-1">{message.sender}</small>}
                                            <p className="mb-0">{message.text}</p>
                                        </>
                                    )}
                                    <small className="message-time d-block text-end mt-1">{message.time}</small>
                                </div>
                                {message.isMe && <Image src={message.profilePic} roundedCircle className="message-avatar ms-2" />}
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                    </div>

                    {/* Chat Input and Actions */}
                    <div className="chat-input-area p-3 border-top">
                        <p className="suggested-replies mb-2">
                            <Button variant="outline-primary" size="sm" className="rounded-pill me-2">Okay, sure</Button>
                            <Button variant="outline-primary" size="sm" className="rounded-pill me-2">Sure</Button>
                            <Button variant="outline-primary" size="sm" className="rounded-pill">Sure, I will</Button>
                        </p>
                        <InputGroup>
                            <FormControl
                                as="textarea"
                                placeholder="Write a message..."
                                className="message-input-textarea"
                                rows={2}
                            />
                            <Button variant="primary" className="send-button">Send</Button>
                        </InputGroup>
                        <div className="chat-input-actions d-flex justify-content-between align-items-center mt-2">
                            <div>
                                <Button variant="link" className="text-muted"><FontAwesomeIcon icon="paperclip" /></Button>
                                <Button variant="link" className="text-muted"><FontAwesomeIcon icon="image" /></Button>
                                <Button variant="link" className="text-muted"><FontAwesomeIcon icon="gift" /></Button>
                                <Button variant="link" className="text-muted"><FontAwesomeIcon icon="face-smile" /></Button>
                            </div>
                            <Button variant="link" className="text-muted">...</Button> {/* More options */}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default MessagePanel;