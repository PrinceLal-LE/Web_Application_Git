import React from 'react';
import { Container, Card, Image } from 'react-bootstrap';
import "../Styles/UpgradeSkill.css"

const CourseCard = ({ title, duration, author, thumbnail, videoUrl, popular }) => {
    // Function to handle opening the YouTube link (from previous component)
    const handleCardClick = () => {
        if (videoUrl) {
            window.open(videoUrl, '_blank'); // Opens the URL in a new tab
        }
    };

    return (
        <div className="flex-shrink-0 me-3" style={{ width: '200px' }}> {/* Fixed width for consistent scrolling */}
            {/* Added onClick for the whole card to be clickable */}
            <Card className="h-100 upgradeSkillCardSkillConnect " onClick={handleCardClick} style={{ cursor: 'pointer' }}>
                <div className="position-relative">
                    <Card.Img
                        variant="top"
                        src={thumbnail}
                        alt="Course Thumbnail"
                        style={{ height: '160px', objectFit: 'cover', borderTopLeftRadius: '0.6rem', borderTopRightRadius: '0.6rem' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/Logo.png'; }}
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

// Define a mapping for course types to human-readable names
const courseTypeNames = {
    1: 'SAP Courses',
    2: 'Sales & Management',
    3: 'Project Management',
    4: 'Software Skills',
};



const getYouTubeThumbnail = (url) => {
    if (!url) return '/images/Logo.png';
    const videoIdMatch = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/images/Logo.png';
};
const allCoursesData = [
    {
        id: 1,
        courseType: 1,
        title: 'Learning SAP MM (Materials Management)',
        duration: '1h 22m',
        author: 'Justin Valley',
        videoUrl: 'https://www.youtube.com/watch?v=PHKwi_0szqU', // Add videoUrl
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=PHKwi_0szqU'),
        popular: true
    },
    {
        id: 2,
        courseType: 2,
        title: 'Building and Managing a High-Performing Sales Team',
        duration: '57m',
        author: 'Steve Benson',
        videoUrl: 'https://www.youtube.com/watch?v=44W6rZGxO2E', // Add videoUrl
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=44W6rZGxO2E'),
        popular: false
    },
    {
        id: 3,
        courseType: 1,
        title: 'Learning SAP Production Planning',
        duration: '1h 20m',
        author: 'Justin Valley',
        videoUrl: 'https://www.youtube.com/watch?v=dkRgveC7Zgg', // Add videoUrl
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=dkRgveC7Zgg'),
        popular: true
    },
    {
        id: 4,
        courseType: 3,
        title: 'Introduction to Project Management',
        duration: '45m',
        author: 'Alice Johnson',
        videoUrl: 'https://www.youtube.com/watch?v=YIhtkEjFOG8', // Add videoUrl
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=YIhtkEjFOG8'),
        popular: false
    },
    {
        id: 5,
        courseType: 4,
        title: 'Advanced Excel Techniques',
        duration: '2h 05m',
        author: 'Bob Williams',
        videoUrl: 'https://www.youtube.com/watch?v=buFBVmEjL9w', // Add videoUrl
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=buFBVmEjL9w'),
        popular: false
    },
    {
        id: 6,
        courseType: 1, // Another SAP course
        title: 'SAP FICO Fundamentals',
        duration: '1h 50m',
        author: 'Maria Garcia',
        videoUrl: 'https://www.youtube.com/watch?v=samplevideofico', // Sample URL
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=samplevideofico'),
        popular: false
    },
    {
        id: 7,
        courseType: 2, // Another Sales course
        title: 'Sales Negotiation Strategies',
        duration: '1h 10m',
        author: 'David Lee',
        videoUrl: 'https://www.youtube.com/watch?v=samplevideosales', // Sample URL
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=samplevideosales'),
        popular: true
    },
    {
        id: 8,
        courseType: 3, // Another Project Management course
        title: 'Agile Project Management',
        duration: '2h 30m',
        author: 'Sarah Chen',
        videoUrl: 'https://www.youtube.com/watch?v=samplevideoagile', // Sample URL
        thumbnail: getYouTubeThumbnail('https://www.youtube.com/watch?v=samplevideoagile'),
        popular: false
    },
];
// Group course by course type
const groupedCourses = allCoursesData.reduce((acc, course) => {
    const type = course.courseType;
    if (!acc[type]) {
        acc[type] = [];
    }
    acc[type].push(course);
    return acc;
}, {});
export const UpgradeSkill = () => {
    return (
        <>
            <Container className="my-4 upgradeSkillContainerSkillConnect py-3">
                <h4 className="mb-2 fw-bold">Upgrade Skill</h4>

                {/* Iterate over grouped courses to create separate rows */}
                {Object.keys(groupedCourses).map(courseType => (
                    <div key={courseType} className="mb-4">

                        <h5 className="mb-3 fw-bold">{courseTypeNames[courseType] || `Category ${courseType}`}</h5>
                        <hr />

                        <div className="d-flex flex-nowrap overflow-auto py-2 hide-scrollbar">
                            {groupedCourses[courseType].map(course => (
                                <CourseCard
                                    key={course.id}
                                    title={course.title}
                                    duration={course.duration}
                                    author={course.author}
                                    thumbnail={course.thumbnail}
                                    videoUrl={course.videoUrl}
                                    popular={course.popular}
                                />
                            ))}
                        </div>
                    </div>
                ))}

            </Container>
        </>
    )
}

export default UpgradeSkill;