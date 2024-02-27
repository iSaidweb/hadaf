import { useDispatch } from "react-redux";
import { updateLang } from "../contexts/user.context";
import Logo from '../assets/logo.png';
import { Badge, IconButton, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { FaCartShopping, FaLanguage } from "react-icons/fa6";
function Navbar({ cart, setOpenCart }) {
    const dp = useDispatch()
    function uLang(l) {
        dp(updateLang(l));
    }
    return (
        <div className="h-[70px]">
            <div className="px-[4%] flex items-center justify-between w-full h-[70px] bg-white border-b z-[999] fixed top-0 left-0">
                <div className="flex items-center justify-center w-[100px] overflow-hidden">
                    <img src={Logo} alt="logo" />
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Menu>
                        <MenuHandler>
                            <div>
                                <FaLanguage className="text-[35px] text-blue-gray-700" />
                            </div>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem className="border-b" onClick={() => uLang('uz')}>
                                O'zbekcha( Lotin )
                            </MenuItem>
                            <MenuItem className="border-b" onClick={() => uLang('ru')}>
                                Русский
                            </MenuItem>
                            <MenuItem className="border-b" onClick={() => uLang('en')}>
                                English
                            </MenuItem>
                            <MenuItem onClick={() => uLang('cy')}>
                                Ўзбекча ( Крил )
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Badge content={String(cart?.length)}>
                        <IconButton onClick={() => setOpenCart(true)} color="indigo" size="sm">
                            <FaCartShopping className="text-[20px]" />
                        </IconButton>
                    </Badge>
                </div>
            </div>
        </div>
    );
}

export default Navbar;