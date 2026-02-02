import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, style, onClick, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px', // Start loading earlier than videos
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={imgRef}
            className={`${className} position-relative ${!isLoaded ? 'skeleton' : ''}`}
            style={{
                ...style,
                backgroundColor: 'rgba(255,255,255,0.05)',
                overflow: 'hidden',
                aspectRatio: props.aspectRatio || 'unset',
                // Anti-flicker optimizations
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                willChange: 'transform'
            }}
            onClick={onClick}
        >
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className="w-100 h-100"
                    style={{
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.5s ease-out',
                        // Anti-flicker for images
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'translate3d(0, 0, 0)',
                        WebkitTransform: 'translate3d(0, 0, 0)',
                        imageRendering: '-webkit-optimize-contrast',
                        willChange: 'opacity',
                        ...style
                    }}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                    {...props}
                />
            )}

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
