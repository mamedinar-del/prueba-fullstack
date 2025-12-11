import { useState, useEffect } from 'react';

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const BASE_URL = import.meta.env.BASE_URL;

    const slides = [
        {
            id: 1,
            image: `${BASE_URL}assets/img/slide1.jpg`, 
        },
        {
            id: 2,
            image: `${BASE_URL}assets/img/slide2.jpg`,
        },
        {
            id: 3,
            image: `${BASE_URL}assets/img/slide3.jpg`,
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-carousel">
            <div 
                className="carousel-track" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div className="carousel-slide" key={slide.id}>
                        <img 
                            src={slide.image} 
                            alt={`Slide ${slide.id}`}
                        />

                    </div>
                ))}
            </div>
            <button className="carousel-btn btn-prev" onClick={prevSlide}>&#10094;</button>
            <button className="carousel-btn btn-next" onClick={nextSlide}>&#10095;</button>
        </section>
    );
};

export default HeroCarousel;