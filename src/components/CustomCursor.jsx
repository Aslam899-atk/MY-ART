import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
            setTimeout(() => {
                setFollowerPosition({ x: e.clientX, y: e.clientY });
            }, 50);
        };

        const onMouseEnter = () => setIsVisible(true);
        const onMouseLeave = () => setIsVisible(false);

        const onMouseOver = (e) => {
            const target = e.target;
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseenter', onMouseEnter);
        window.addEventListener('mouseleave', onMouseLeave);
        window.addEventListener('mouseover', onMouseOver);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseenter', onMouseEnter);
            window.removeEventListener('mouseleave', onMouseLeave);
            window.removeEventListener('mouseover', onMouseOver);
        };
    }, []);

    return (
        <>
            <div
                className="custom-cursor"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
                    opacity: isVisible ? 1 : 0
                }}
            />
            <div
                className="custom-cursor-follower"
                style={{
                    left: `${followerPosition.x}px`,
                    top: `${followerPosition.y}px`,
                    transform: `translate(-50%, -50%)`,
                    opacity: isVisible ? 1 : 0
                }}
            />
        </>
    );
};

export default CustomCursor;
