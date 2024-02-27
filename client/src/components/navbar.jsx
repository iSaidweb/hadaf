import { useEffect, useState } from 'react';
import Logo from '../assets/logo.png';
function Navbar() {
    const [sc, setSc] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            try {
                if (y > 20) {
                    setSc(true);
                } else {
                    setSc(false)
                }
            } catch (error) {
                console.log(error);
            }
        });
    }, [])
    return (
        <div className={`flex items-center justify-between w-full h-[70px] z-[999] fixed top-0 left-0 ${sc ? 'bg-white border-b' : 'bg-[#ffffff00]'} duration-300 px-[2%] backdrop-blur-sm`}>
            <div className="flex items-center cursor-pointer justify-center w-[100px] sm:w-[150px] overflow-hidden">
                <img src={Logo} alt="logo" className='w-full' />
            </div>
        </div>
    );
}

export default Navbar;