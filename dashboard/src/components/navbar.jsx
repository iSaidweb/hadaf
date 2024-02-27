import { FaAlignRight, FaArrowCircleLeft, FaBoxes, FaListUl, FaShoppingCart, FaUsers } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import Logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { IconButton } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
function Navbar() {
    const links = [
        {
            path: '/categories',
            title: "Kategoriyalar",
            icon: <FaListUl className='text-blue-500 text-[20px]' />
        },
        {
            path: '/products',
            title: "Mahsulotlar",
            icon: <FaBoxes className='text-indigo-500 text-[20px]' />
        },
        {
            path: '/orders',
            title: "Buyurtmalar",
            icon: <FaShoppingCart className='text-green-500 text-[20px]' />
        },
        
    ];
    const p = useLocation().pathname;
    // 
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(false);
    }, [p])
    return (
        <>
            <div className="flex z-[999] items-center justify-center w-full h-[70px] relative">
                <div className="flex items-center justify-between w-full h-[60px] fixed left-0 top-0 bg-[#ffffffa1] backdrop-blur-sm border-b px-[2%]">
                    {/* LOGO */}
                    <div className="flex items-center justify-center cursor-pointer w-[150px] overflow-hidden bg-[#17310A] p-[5px_10px] rounded-[10px]">
                        <img src={Logo} alt="logo" className='w-full' />
                    </div>
                    {/* MENU */}
                    <div className="flex items-center justify-center gap-3">
                        <IconButton color='red' >
                            <FaArrowCircleLeft className='text-[20px]' />
                        </IconButton>
                        <IconButton onClick={() => setOpen(true)} color='green' variant='outlined'>
                            <FaAlignRight className='text-[20px]' />
                        </IconButton>
                    </div>
                </div>
            </div>
            {/* <div className="flex items-center justify-center w-full mb-[10px]">
                <div className="flex items-center justify-center p-[5px_10px] bg-white border rounded-[10px] border-t-0">
                    <p className='text-[20px] uppercase font-bold'>{links?.find((l) => l?.path === p).title}</p>
                </div>
            </div> */}
            {/* MENU */}
            <div className={`flex items-center justify-start flex-col w-[300px] bg-white fixed top-0 ${open ? 'right-0' : 'right-[-300px]'} duration-300 z-[1000] h-[100vh] p-[10px] gap-3`}>
                {/* TOP */}
                <div className="flex items-center justify-between w-full h-[50px] bg-gray-50 rounded-[10px] border px-[10px]">
                    <FaCircleXmark className='text-gray-700 text-[30px] cursor-pointer' onClick={() => setOpen(false)} />
                    <div className="flex items-center w-[80px] justify-center h-[40px] overflow-hidden">
                        <img src={Logo} alt="logo" />
                    </div>
                </div>
                {/* LINKS */}
                {links?.map((l, i) => {
                    return (
                        <Link className='flex items-center justify-start gap-3 w-full py-[10px] border-b duration-300 hover:pl-[10px]' key={i} to={l.path}>
                            {l.icon}
                            {l.title}
                        </Link>
                    )
                })}
            </div>
            {/* CLOSER */}
            <div className={`bg-[#0000007f] backdrop-blur-sm h-[100vh] fixed top-0 right-0 ${open ? 'w-full' : 'w-[0]'} z-[999] cursor-pointer duration-300`} onClick={() => setOpen(false)}></div>
        </>
    );
}

export default Navbar;