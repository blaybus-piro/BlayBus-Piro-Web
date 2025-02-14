import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import './ImageModal.styles.css';

interface ImageModalProps {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
    images,
    initialIndex,
    onClose
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)),
        onSwipedRight: () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="image-modal">
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-content">
                <div className="image-container" {...handlers}>
                    <img src={images[currentIndex]} alt={`Detail ${currentIndex}`} />
                </div>
                <div className="dots">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={currentIndex === index ? "dot active" : "dot"}
                            onClick={() => goToImage(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageModal;