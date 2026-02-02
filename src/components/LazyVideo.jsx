import React, { useState, useEffect, useRef } from 'react';

const LazyVideo = ({ src, className, style, ...props }) => {
    const [isInView, setIsInView] = useState(false);
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
                rootMargin: '100px', // Start loading 100px before it enters viewport
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
            className={`${className} position-relative skeleton`}
            style={{
                ...style,
                backgroundColor: 'rgba(255,255,255,0.05)',
                overflow: 'hidden'
            }}
        >
            {isInView ? (
                <video
                    src={src}
                    className="w-100 h-100"
                    style={{
                        objectFit: 'cover',
                        ...style
                    }}
                    {...props}
                />
            ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    {/* Optional: Add a play icon or placeholder */}
                </div>
            )}
        </div>
    );
};

export default LazyVideo;
