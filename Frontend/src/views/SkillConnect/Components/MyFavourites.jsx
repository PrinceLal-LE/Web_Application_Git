import React from 'react';
import { Container, Card, Image } from 'react-bootstrap';
import "../Styles/MyFavourites.css"
const CourseCard = ({ title, duration, author, thumbnail, popular }) => {
    return (
        <div className="flex-shrink-0 me-3" style={{ width: '200px' }}> {/* Fixed width for consistent scrolling */}
            <Card className="h-100 myFavouritesCardSkillConnect">
                <div className="position-relative">
                    <Card.Img
                        variant="top"
                        src={thumbnail}
                        alt="Course Thumbnail"
                        style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '0.6rem', borderTopRightRadius: '0.6rem' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x160/d3d3d3/ffffff?text=Video+Thumbnail'; }}
                    />
                    {popular && (
                        <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                            POPULAR
                        </span>
                    )}
                    <span className="badge bg-dark text-white position-absolute bottom-0 end-0 m-2">
                        {duration}
                    </span>
                </div>
                <Card.Body className="p-3">
                    <Card.Text className="text-uppercase text-muted mb-1" style={{ fontSize: '0.75rem' }}>COURSE</Card.Text>
                    <Card.Title className="mb-2 fw-bold" style={{ fontSize: '1rem', lineHeight: '1.4' }}>{title}</Card.Title>
                    <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>By: {author}</Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

const getYouTubeThumbnail = (url) => {
    if (!url) return 'https://placehold.co/300x160/d3d3d3/ffffff?text=No+Thumbnail';
    const videoIdMatch = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : 'https://placehold.co/300x160/d3d3d3/ffffff?text=Invalid+YouTube+Link';
};
const coursesData = [
    {
        id: 1,
        title: 'Learning SAP MM (Materials Management)',
        duration: '1h 22m',
        author: 'Justin Valley',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=PHKwi_0szqU&list=RD5o96CjLoO_Y&index=2&ab_channel=SICKVED'),
        popular: true
    },
    {
        id: 2,
        title: 'Building and Managing a High-Performing Sales Team',
        duration: '57m',
        author: 'Steve Benson',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=44W6rZGxO2E&list=RD44W6rZGxO2E&start_radio=1&pp=oAcB'),
        popular: false
    },
    {
        id: 3,
        title: 'Learning SAP Production Planning',
        duration: '1h 20m',
        author: 'Justin Valley',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=dkRgveC7Zgg&list=RDdkRgveC7Zgg&start_radio=1&pp=oAcB'),
        popular: true
    },
    {
        id: 4,
        title: 'Introduction to Project Management',
        duration: '45m',
        author: 'Alice Johnson',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=YIhtkEjFOG8&list=RDYIhtkEjFOG8&start_radio=1&pp=oAcB'),
        popular: false
    },
    {
        id: 5,
        title: 'Advanced Excel Techniques',
        duration: '2h 05m',
        author: 'Bob Williams',
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=buFBVmEjL9w&list=RDbuFBVmEjL9w&start_radio=1&pp=oAcB'),
        popular: false
    }
];
export const MyFavourites = () => {
    return (
        <>
            <Container className="my-4 myFavouritesContainerSkillConnect py-3" >
                <h4 className="mb-2 fw-bold">My Favourites</h4>
                <div className="d-flex flex-nowrap overflow-auto py-2 hide-scrollbar">
                    {coursesData.map(course => (
                        <CourseCard
                            key={course.id}
                            title={course.title}
                            duration={course.duration}
                            author={course.author}
                            thumbnail={course.thumbnail}
                            popular={course.popular}
                        />
                    ))}
                </div>

            </Container>
        </>
    )
}

export default MyFavourites;