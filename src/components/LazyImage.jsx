import React, { useState } from 'react';

const LazyImage = ({ src, alt, className, style, onClick, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div
            className={`${className} position-relative skeleton`}
            style={{
                ...style,
                backgroundColor: 'rgba(255,255,255,0.05)',
                overflow: 'hidden',
                aspectRatio: props.aspectRatio || 'unset'
            }}
            onClick={onClick}
        >
            <img
                src={src}
                alt={alt}
                className="w-100 h-100"
                style={{
                    objectFit: 'cover',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    ...style
                }}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                {...props}
            />

            {/* Error state */}
            {hasError && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark">
                    <span className="extra-small text-muted">Image Unavailable</span>
                </div>
            )}
        </div>
    );
};

export default LazyImage;
