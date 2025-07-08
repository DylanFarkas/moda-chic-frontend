import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Carousel.css';

const images = [
    'public/images/banner1.png',
    'public/images/banner2.png',
    'public/images/banner4.png',
];

const Carousel = () => {
    const [current, setCurrent] = useState(0);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Auto play
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000); 

        return () => clearInterval(interval); 
    }, [current]); 

    return (
        <div className="carousel">
            <div
                className="carousel-track"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {images.map((src, index) => (
                    <img key={index} src={src} className="carousel-image" />
                ))}
            </div>

            <button className="carousel-arrow left" onClick={prevSlide}>
                <FaChevronLeft />
            </button>
            <button className="carousel-arrow right" onClick={nextSlide}>
                <FaChevronRight />
            </button>

            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`indicator ${index === current ? 'active' : ''}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
