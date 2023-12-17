import {useState, useEffect} from 'react';

function getScreenSize() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
          setIsMobile(window.innerWidth < 768);
        }

            handleResize();

            window.addEventListener('resize', handleResize);

            return () => {
          window.removeEventListener('resize', handleResize);
        }
    }, []);

    return isMobile;
} 

export default getScreenSize;