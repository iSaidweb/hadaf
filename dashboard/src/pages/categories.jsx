import { Button, IconButton, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaEdit, FaListUl, FaPlusCircle, FaSearch, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getReq, postReq } from "../helpers/request.helper";
import Wait from "../components/wait";
import NoData from "../components/noDtata";
import { runLoad, runRefresh, stopLoad } from "../contexts/config.context";
import toast from "react-hot-toast";

function Categories() {
    const [state, setState] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.config);
    const dp = useDispatch();
    const [search, setSearch] = useState('')
    useEffect(() => {
        setIsLoad(false);
        getReq(`/admin/get-all-categories`).then((res) => {
            const { ok, data } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data)
            }
        })
    }, [refresh]);
    const [add, setAdd] = useState({ open: false, title: '' });
    function closeAdd() {
        setAdd({ open: false, title: '' });
    }
    function submitAdd() {
        dp(runLoad());
        postReq('/admin/create-category', { title: add?.title }).then((res) => {
            const { ok, msg } = res.data;
            dp(stopLoad());
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(runRefresh());
                closeAdd();
            }
        })
    }
    // 
    const [edit, setEdit] = useState({ _id: '', title: '' });
    function closeEdit() {
        setEdit({ _id: '', title: '' });
    }
    function submitEdit() {
        dp(runLoad());
        postReq('/admin/edit-category', edit).then((res) => {
            const { ok, msg } = res.data;
            dp(stopLoad());
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(runRefresh());
                closeEdit();
            }
        });
    }
    // 
    const [del, setDel] = useState({ _id: '', title: '' });
    function closeDel() {
        setDel({ _id: '', title: '' });
    }
    function submitDel() {
        dp(runLoad());
        postReq('/admin/delete-category', { _id: del?._id }).then((res) => {
            const { ok, msg } = res.data;
            dp(stopLoad());
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                dp(runRefresh());
                closeDel();
            }
        });
    }
    return (
        <div className="flex items-center justify-start flex-col w-full">
            {/* TOP */}
            <div className="flex items-center justify-between w-full h-[50px] border rounded-[10px] bg-gray-50 px-[10px]">
                <div className="flex items-center justify-center w-[80%]">
                    <Input onChange={e => setSearch(e.target.value)} value={search} type="search" label="Qidiruv: Nomi" color="green" icon={<FaSearch />} />
                </div>
                {/*  */}
                <Button onClick={() => setAdd({ title: '', open: true })} color="green" className="hidden md:inline">Qo'shish</Button>
                <IconButton onClick={() => setAdd({ title: '', open: true })} color="green" className="text-[20px] md:hidden"><FaPlusCircle /></IconButton>
                {/*  */}
            </div>
            {/* MAPPING */}
            {!isLoad && <Wait />}
            {isLoad && !state[0] && <NoData />}
            {isLoad && state[0] &&
                <div className="flex items-start justify-center gap-[10px] flex-wrap">
                    {state?.filter(s => s?.title?.toLowerCase()?.includes(search?.toLowerCase()))?.map((s, i) => {
                        return (
                            <div key={i} className="flex items-start justify-start w-[150px] h-[90px] bg-white rounded-[10px] border duration-300 p-[5px] hover:shadow-md flex-col relative">
                                <p className="text-[12px]">ID: <b>{s?.id}</b></p>
                                <p>{s?.title}</p>
                                <div className="absolute bottom-1 flex items-center justify-end w-full gap-2 right-1">
                                    <IconButton onClick={() => setEdit({ ...edit, _id: s?._id, title: s?.title })} className="text-[20px]" variant="text" size="sm">
                                        <FaEdit />
                                    </IconButton>
                                    <IconButton onClick={() => setDel({ ...del, _id: s?._id, title: s?.title })} className="text-[20px]" variant="text" size="sm" color="red">
                                        <FaTrash />
                                    </IconButton>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            {/* ADD */}
            <div className={`duration-300 flex items-center justify-center w-full h-[100vh] fixed ${add?.open ? 'top-0' : 'top-[-100vh]'} bg-[#0009] backdrop-blur-sm left-0 z-[999]`}>
                <div className="flex items-start justify-start flex-col w-[90%] sm:w-[500px] p-[10px] bg-white rounded-[10px] gap-3">
                    <p className="text-gray-900 font-bold">Kategoriya qo'shish</p>
                    <Input label="Kategoriya nomi" onChange={e => setAdd({ ...add, title: e.target.value })} value={add?.title} icon={<FaListUl />} color="green" />
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Button color="orange" onClick={closeAdd} size="sm">Ortga</Button>
                        <Button color="green" onClick={submitAdd} size="sm">Saqlash</Button>
                    </div>
                </div>
            </div>
            {/* EDIT */}
            <div className={`duration-300 flex items-center justify-center w-full h-[100vh] fixed ${edit?._id !== '' ? 'top-0' : 'top-[-100vh]'} bg-[#0009] backdrop-blur-sm left-0 z-[999]`}>
                <div className="flex items-start justify-start flex-col w-[90%] sm:w-[500px] p-[10px] bg-white rounded-[10px] gap-3">
                    <p className="text-gray-900 font-bold">Kategoriyani taxrirlash</p>
                    <Input label="Kategoriya nomi" onChange={e => setEdit({ ...edit, title: e.target.value })} value={edit?.title} icon={<FaListUl />} color="green" />
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Button color="orange" onClick={closeEdit} size="sm">Ortga</Button>
                        <Button color="green" onClick={submitEdit} size="sm">Saqlash & taxrirlash</Button>
                    </div>
                </div>
            </div>
            {/* DEL */}
            <div className={`duration-300 flex items-center justify-center w-full h-[100vh] fixed ${del?._id !== '' ? 'top-0' : 'top-[-100vh]'} bg-[#0009] backdrop-blur-sm left-0 z-[999]`}>
                <div className="flex items-start justify-start flex-col w-[90%] sm:w-[500px] p-[10px] bg-white rounded-[10px] gap-3">
                    <p className="text-gray-900 font-bold">Kategoriyani o'chirish</p>
                    <p className="text-gray-700">Diqqat chindan {del?.title} kategoriyasini o'chirmoqchimisiz( QAYTA TIKLAB BO'LMAYDI )?</p>
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Button color="orange" onClick={closeDel} size="sm">Ortga</Button>
                        <Button color="red" onClick={submitDel} size="sm">Saqlash & O'chirish</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categories;