import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReq } from "../helpers/request.helper";
import Wait from "../components/wait";
import { Badge, Button, Textarea } from "@material-tailwind/react";
import NoData from "../components/noDtata";
import { FaBoxes, FaMoneyBill, FaPhone, FaUser } from "react-icons/fa";

function Orders() {
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.config);
    const dp = useDispatch();
    const [carts, setCarts] = useState([]);
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        setIsLoad(false);
        getReq('/admin/get-new-orders').then(res => {
            const { ok, carts, orders } = res.data;
            setIsLoad(true);
            if (ok) {
                setCarts(carts || []);
                setOrders(orders || []);
            }
        })
    }, [refresh]);
    const [type, setType] = useState('web')//web, tg
    const [select, setSelect] = useState('');
    const [comment, setComment] = useState('');
    return (
        <div className="flex items-center justify-start flex-col w-full gap-2">
            {!isLoad && <Wait />}
            {isLoad &&
                <>
                    {/* TOP */}
                    <div className="flex items-center justify-between w-full h-[50px] border rounded-[10px] bg-gray-50 px-[10px]">
                        <div className="flex items-center justify-center gap-3">
                            <Badge content={String(orders?.length || 0)}>
                                <Button onClick={() => setType('tg')} variant={type === 'tg' ? 'filled' : 'outlined'} size="sm" color="indigo">Telegram bot</Button>
                            </Badge>
                            <Badge content={String(carts?.length || 0)}>
                                <Button onClick={() => setType('web')} variant={type === 'web' ? 'filled' : 'outlined'} size="sm" color="indigo">Sayt & Web bot</Button>
                            </Badge>
                        </div>
                    </div>
                    {/* WEB */}
                    {type === 'web' &&
                        <>
                            {!carts[0] && <NoData />}
                            {carts[0] &&
                                <div className="flex items-start flex-col justify-start w-full p-[10px] bg-white overflow-scroll">
                                    {/* STRUCT */}
                                    <div className="flex items-center justify-start min-w-max border border-gray-700">
                                        <p className="flex items-center justify-center w-[50px] h-[40px] text-[14px]">
                                            No
                                        </p>
                                        <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                            Ismi
                                        </p>
                                        <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                            Raqami
                                        </p>
                                        <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                            Buyurtma sanasi
                                        </p>
                                        <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                            Mahsulotlar( TURI )
                                        </p>
                                        <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                            SUMMA
                                        </p>
                                    </div>
                                    {carts?.map((c, i) => {
                                        return (
                                            <div key={i} className="flex items-center justify-start min-w-max border border-gray-700 border-t-0 hover:bg-gray-200 cursor-pointer" onClick={() => setSelect(c?._id)}>
                                                <p className="flex items-center justify-center w-[50px] h-[40px] text-[14px]">
                                                    {i + 1}
                                                </p>
                                                <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                                    {c?.name}
                                                </p>
                                                <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                                    {c?.phone}
                                                </p>
                                                <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                                    {c?.created}
                                                </p>
                                                <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                                    {c?.orders?.length}
                                                </p>
                                                <p className="flex items-center justify-center border-l border-gray-700 w-[150px] h-[40px] text-[14px]">
                                                    {c?.orders?.reduce((a, b) => a + (b?.count * b?.price), 0)?.toLocaleString()}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </>
                    }
                </>
            }
            <div className={`flex items-center justify-center w-full h-[100vh] bg-[#0009] backdrop-blur-sm fixed ${select ? 'top-0' : 'top-[-100vh]'} right-0 z-[1000] duration-300`}>
                <div className="flex items-start justify-start flex-col w-[90%] sm:w-[500px] p-[10px] bg-white rounded-[10px] gap-1">
                    {type === 'web' &&
                        <>
                            <p className="flex items-center justify-start gap-2 w-full border-b"><FaUser className="text-[20px] text-blue-gray-700" /> {carts?.find(c => c?._id === select)?.name}</p>
                            {/*  */}
                            <p className="flex items-center justify-start gap-2 w-full border-b cursor-pointer underline" onClick={() => window.open('tel:' + carts?.find(c => c?._id === select)?.phone)}><FaPhone className="text-[20px] text-orange-700" /> {carts?.find(c => c?._id === select)?.phone}</p>
                            {/*  */}
                            <p className="flex items-center justify-center gap-2"><FaBoxes className="text-[20px] text-blue-700" /> Mahsulotlar</p>
                            <div className="pl-[15px] border-b w-full">
                                <ul>
                                    {carts?.find(c => c?._id === select)?.orders?.map((o, i) => {
                                        return (
                                            <li key={i} className="text-[14px] text-gray-900">
                                                {i + 1} ) {o?.title} / {o?.count}ta = {Number(o?.count * o?.price)?.toLocaleString()} so'm
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            {/*  */}
                            <p className="flex items-center justify-center gap-2"><FaMoneyBill className="text-[20px] text-green-700" /> Jami: {carts?.find(c => c?._id === select)?.orders?.reduce((a, b) => a + (b?.price * b?.count), 0)?.toLocaleString()} so'm</p>
                            {/*  */}
                            <Textarea label="Izoh: Viloyati, Manzili, Qo'shimcha raqami..." color="indigo" />
                            <div className="flex items-center justify-end gap-2 w-full">
                                <Button color="orange" size="sm" onClick={() => { setSelect(''); setComment('') }}>Ortga</Button>
                                <Button size="sm" color="red">Rad Etildi</Button>
                                <Button size="sm" color="blue">Qabul qilindi</Button>
                            </div>
                        </>}
                </div>
            </div>
        </div>
    );
}

export default Orders;