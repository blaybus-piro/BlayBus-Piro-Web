import React, { useState } from 'react';
import ImageModal from '../ImageModal/ImageModal';
import image from '../../assets/image.svg';
import './Portfolio.styles.css';

interface PortfolioProps {
    images: string[];
}

const Portfolio: React.FC<PortfolioProps> = ({ images }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openModal = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    return (
        <div className={`portfolio portfolio-${images.length}`}>
            {images.length === 1 && <img className="main-image" src={images[0]} alt="Main" onClick={() => openModal(0)} />}
            {images.length === 2 && (
                <div className="two-images">
                    <img className="image-left" src={images[0]} alt="Left" onClick={() => openModal(0)} />
                    <img className="image-right" src={images[1]} alt="Right" onClick={() => openModal(1)} />
                </div>
            )}
            {images.length === 3 && (
                <div className="three-images">
                    <img className="main-image" src={images[0]} alt="Main" onClick={() => openModal(0)} />
                    <div className="side-images">
                        <img className="side-image" src={images[1]} alt="Side 1" onClick={() => openModal(1)} />
                        <img className="side-image" src={images[2]} alt="Side 2" onClick={() => openModal(2)} />
                    </div>
                </div>
            )}
            {images.length >= 4 && (
                <div className="four-images">
                    <img className="main-image" src={images[0]} alt="Main" onClick={() => openModal(0)} />
                    <div className="side-images">
                        <img className="side-image" src={images[1]} alt="Side 1" onClick={() => openModal(1)} />
                        <div className="overlay-container" onClick={() => openModal(2)}>
                            <img className="side-image" src={images[2]} alt="Side 2" />
                            {images.length >= 4 && <div className="more-overlay"><img src={image} alt="image"></img></div>}
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && <ImageModal images={images} initialIndex={selectedIndex} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Portfolio;