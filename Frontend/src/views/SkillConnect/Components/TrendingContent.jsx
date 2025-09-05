import React, { useState, useEffect } from 'react';
import { Container, Card, Image, Button, Row, Col } from 'react-bootstrap';
import "../Styles/TrendingContent.css"
// Helper function to extract YouTube video ID for thumbnail
const getYouTubeThumbnail = (url) => {
    if (!url) return '/images/Logo.png';
    const videoIdMatch = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://placehold.co/300x160/d3d3d3/ffffff?text=Invalid+YouTube+Link';
};

// Component for a single trending item card (video or image)
const TrendingItemCard = ({ thumbnail, contentUrl, type }) => {
    const handleCardClick = () => {
        if (contentUrl) {
            window.open(contentUrl, '_blank'); // Open the content URL in a new tab
        }
    };

    return (
        // Removed Col wrapper here to allow the card to take full width of its parent for single display
        // The parent will control the width.
        <Card className="h-100 rounded-3 " onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="position-relative">
                <Card.Img
                    variant="top"
                    src={thumbnail}
                    alt="Content Thumbnail"
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderTopLeftRadius: '0.3rem', borderTopRightRadius: '0.3rem' }} // Increased height for better visibility
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x220/cccccc/ffffff?text=Content+Error'; }}
                />
                {type === 'video' && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                        VIDEO
                    </span>
                )}
                {type === 'image' && (
                    <span className="badge bg-info position-absolute top-0 start-0 m-2">
                        IMAGE
                    </span>
                )}
            </div>
            <Card.Body className="p-3 d-flex flex-column ">
                <Button variant="outline-primary" className=" px-4 mt-auto mx-5">
                    Connect
                </Button>
            </Card.Body>
        </Card>
    );
};

const trendingItems = [
    {
        id: 1,
        type: 'video',
        title: 'Top 5 AI Innovations of the Decade',
        description: 'Dive into the most impactful artificial intelligence advancements shaping our future.',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=PHKwi_0szqU'),
        contentUrl: 'https://www.youtube.com/watch?v=PHKwi_0szqU'
    },
    {
        id: 2,
        type: 'image',
        title: 'Stunning Landscapes of the Alps',
        description: 'A collection of breathtaking panoramic photos from the Alpine region.',
        thumbnail: 'https://placehold.co/300x180/7FFFD4/000000?text=Alps+Image',
        contentUrl: 'https://images.unsplash.com/photo-1542281286-9e0a16fb7046' // Example image URL
    },
    {
        id: 3,
        type: 'video',
        title: 'Mastering React Hooks in 2024',
        description: 'Learn advanced techniques for building scalable React applications with hooks.',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=pI6NZ826qd0'),
        contentUrl: 'https://www.youtube.com/watch?v=pI6NZ826qd0'
    },
    {
        id: 4,
        type: 'image',
        title: 'Modern Office Interior Design',
        description: 'Inspirational designs for creating a productive and aesthetic workspace.',
        thumbnail: 'https://placehold.co/300x180/ADD8E6/000000?text=Office+Design',
        contentUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952' // Example image URL
    },
    {
        id: 5,
        type: 'video',
        title: 'Introduction to Blockchain Technology',
        description: 'Understand the fundamentals of blockchain and its real-world applications.',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=dkRgveC7Zgg'),
        contentUrl: 'https://www.youtube.com/watch?v=dkRgveC7Zgg'
    },
    {
        id: 6, // Additional item
        type: 'image',
        title: 'Sunrise over a Mountain Lake',
        description: 'Beautiful morning view of a serene lake surrounded by mountains.',
        thumbnail: 'https://placehold.co/300x180/F08080/000000?text=Lake+Sunrise',
        contentUrl: 'https://images.unsplash.com/photo-1506744038166-acdc449d6b2c'
    },
    {
        id: 7, // Additional item
        type: 'video',
        title: 'Beginner\'s Guide to Python',
        description: 'A comprehensive guide to learning Python programming from scratch.',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=YIhtkEjFOG8'),
        contentUrl: 'https://www.youtube.com/watch?v=YIhtkEjFOG8'
    }
];


export const TrendingContent = () => {
    const [currentIndex, setCurrentIndex] = useState(0); // State to manage the current single item displayed

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % trendingItems.length);
        }, 5000); // Change content every 5 seconds (5000 milliseconds)

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, [trendingItems.length]); // Re-run effect if trendingItems length changes

    const currentItem = trendingItems[currentIndex]; // Get the single item to display
    return (
        <>
            <Container className="my-4 pt-3 trendingContentSkillConnect">
            <h4 className="mb-4 ">Trending Content</h4>
            <Row className="justify-content-center"> {/* Use justify-content-center for single card */}
                {/* Display only one TrendingItemCard at a time */}
                <Col > {/* Adjust column sizing for a single, centered card */}
                    <TrendingItemCard
                        key={currentItem.id} // Key is important
                        thumbnail={currentItem.thumbnail}
                        contentUrl={currentItem.contentUrl}
                        type={currentItem.type}
                    />
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default TrendingContent;