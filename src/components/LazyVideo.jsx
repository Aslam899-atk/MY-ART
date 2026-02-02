import React, { useState, useEffect, useRef } from 'react';

const LazyVideo = ({ src, className, style, ...props }) => {
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '100px',
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={videoRef}
            className={`${className} position-relative ${!isLoaded ? 'skeleton' : ''}`}
            style={{
                ...style,
                backgroundColor: 'rgba(255,255,255,0.05)',
                overflow: 'hidden',
                // Anti-flicker optimizations
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                willChange: 'transform'
            }}
        >
            {isInView ? (
                <video
                    src={src}
                    className="w-100 h-100"
                    onLoadedData={() => setIsLoaded(true)}
                    style={{
                        objectFit: 'cover',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.5s ease-out',
                        // Anti-flicker for videos
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'translate3d(0, 0, 0)',
                        WebkitTransform: 'translate3d(0, 0, 0)',
                        willChange: 'opacity',
                        ...style
                    }}
                    {...props}
                />
            ) : null}
        </div>
    );
};

export default LazyVideo;
