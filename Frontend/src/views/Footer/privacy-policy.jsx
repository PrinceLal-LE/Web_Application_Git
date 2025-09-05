// Frontend/src/views/PrivacyPolicy.jsx
import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const PrivacyPolicy = () => {
    return (
        <>
        <Container className="my-5">
            <Card className="p-4 shadow-sm">
                <Card.Body>

            <h1>Privacy Policy</h1>
            <p>Last updated: [Date]</p>
            <p>
                This privacy notice for <strong>mouldconnect.com</strong> ("we," "us," or "our") describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you visit our website at <strong>mouldconnect.com</strong>.
            </p>

            <h2>Information We Collect</h2>
            <ul>
                <li>Personally identifiable information (e.g., name, email address, contact number)</li>
                <li>Usage data (e.g., IP address, browser type, pages visited)</li>
                <li>Information provided via forms or communications</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <ul>
                <li>To operate and maintain our website</li>
                <li>To communicate and respond to inquiries</li>
                <li>To meet legal obligations and ensure security</li>
            </ul>

            <h2>Sharing Your Information</h2>
            <ul>
                <li>We do not sell your personal information</li>
                <li>Information may be shared with trusted service providers under confidentiality agreements</li>
                <li>Disclosure if required by law or to protect our rights and safety</li>
            </ul>

            <h2>Security</h2>
            <p>
                We implement reasonable measures to protect your personal information. However, no method of transmission over the internet is completely secure.
            </p>

            <h2>Your Rights</h2>
            <p>
                You have the right to access, correct, or delete your personal data, and to object to processing or withdraw consent where applicable.
            </p>

            <h2>Cookies</h2>
            <p>
                Our site may use cookies for better user experience. Manage preferences through your browser settings.
            </p>

            <h2>Third-Party Links</h2>
            <p>
                We may link to other sites not controlled by us. Review their privacy policies for details.
            </p>

            <h2>Policy Updates</h2>
            <p>
                We may update this policy periodically. Changes will be posted on this page with a revised date.
            </p>

            <h2>Contact Us</h2>
            <p>
                For questions or requests about your personal information or this privacy policy, contact us at [your contact email].
            </p>
                </Card.Body>
            </Card>
        </Container>
        </>
    )
}

export default PrivacyPolicy;
