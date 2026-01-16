import React, { useState } from 'react';

const LazyImage = ({ src, alt, className, style, onClick, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div
            className={`${className} position-relative`}
            style={{ ...style, backgroundColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}
            onClick={onClick}
        >
            {/* Loading Placeholder */}
            {!isLoaded && !hasError && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-gray-900">
                    <div className="spinner-border text-secondary" role="status" style={{ width: '1.5rem', height: '1.5rem', opacity: 0.5, borderWidth: '0.15em' }}></div>
                </div>
            )}

            <img
                src={src}
                alt={alt}
                className="w-100 h-100"
                style={{
                    objectFit: 'cover',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    ...style
                }}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                {...props}
            />
        </div>
    );
};

export default LazyImage;
