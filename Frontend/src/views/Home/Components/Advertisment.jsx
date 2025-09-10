import { Container } from "react-bootstrap"
import React, { useState, useEffect } from 'react';
import { Card, Image } from 'react-bootstrap';


// Sample advertisement data
const advertisements = [
    {
        id: 1,
        imageSrc: '/home/Add_(1).png',
        title: 'Women in this town',
        description: 'Discover new trends'
    },
    {
        id: 2,
        imageSrc: '/home/Add_(1).jpg',
        title: 'Explore the new collection',
        description: 'Shop now and get 20% off!'
    },
    {
        id: 3,
        imageSrc: '/home/Add_(2).png',
        title: 'Boost your career',
        description: 'Online courses available'
    },
    {
        id: 4,
        imageSrc: '/home/Add_(3).png',
        title: 'Boost your career',
        description: 'Online courses available'
    },
    {
        id: 5,
        imageSrc: '/home/Add_(4).png',
        title: 'Boost your career',
        description: 'Online courses available'
    },
    {
        id: 6,
        imageSrc: '/home/Add_(5).png',
        title: 'Boost your career',
        description: 'Online courses available'
    },
    {
        id: 7,
        imageSrc: '/home/Add_(6).png',
        title: 'Boost your career',
        description: 'Online courses available'
    }
];



export const Advertisment = () => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        // Set up an interval to change the ad every 5 seconds
        const intervalId = setInterval(() => {
            setCurrentAdIndex(prevIndex =>
                (prevIndex + 1) % advertisements.length
            );
        }, 5000); // Change ad every 5000 milliseconds (5 seconds)

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

    const currentAd = advertisements[currentAdIndex];
    return (
        <>
            <Card className="p-0 mb-4 advertismentCard" style={{ position: 'sticky', top: '20px', zIndex: '1020', maxWidth: '100%'}}>
                <div className="position-relative">
                    <Image style={{width : '100%', height : "250px"}}
                        src={currentAd.imageSrc}
                        fluid rounded
                        alt="Advertisement"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/cccccc/ffffff?text=Ad+Load+Error'; }}
                    />
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                        Social Ad
                    </span>
                </div>
                {/* <div className="p-2">
                    <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{currentAd.title}</p>
                    <small className="text-muted">{currentAd.description}</small>
                </div> */}
            </Card>
        </>
    )
}

export default Advertisment;