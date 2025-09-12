// Frontend/src/views/Home/Components/ImageCarouselModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Carousel, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ImageCarouselModal = ({ show, onHide, images, startIndex, apiBaseUrl }) => {
    const [index, setIndex] = useState(startIndex);

    useEffect(() => {
        if (show) {
            setIndex(startIndex); // Reset index when modal opens
        }
    }, [show, startIndex]);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    // Filter out non-image attachments for the carousel
    const carouselImages = images.filter(att => att.mimetype?.startsWith('image/'));

    return (
        <Modal show={show} onHide={onHide} size="xl" centered dialogClassName="image-carousel-modal">
            <Modal.Header closeButton className="border-0 pb-0" />
            <Modal.Body className="p-0">
                {carouselImages.length > 0 ? (
                    <Carousel
                        activeIndex={index}
                        onSelect={handleSelect}
                        interval={null} // Disable auto-advance
                        wrap={true} // Allow wrapping from last to first
                        prevIcon={<FontAwesomeIcon icon={faChevronLeft} size="3x" className="carousel-control-icon" />}
                        nextIcon={<FontAwesomeIcon icon={faChevronRight} size="3x" className="carousel-control-icon" />}
                    >
                        {carouselImages.map((attachment, idx) => (
                            <Carousel.Item key={idx}>
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                                    <Image
                                        src={`${apiBaseUrl}/eRepo/${attachment.filepath}`}
                                        fluid
                                        className="carousel-image"
                                        alt={`Post Image ${idx + 1}`}
                                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                    />
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <div className="text-center p-5">No images to display.</div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ImageCarouselModal;