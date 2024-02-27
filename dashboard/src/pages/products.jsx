import { Button, Carousel, IconButton, Input, Option, Select, Textarea } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaEdit, FaImages, FaListUl, FaMoneyBill, FaPlusCircle, FaSearch, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getReq, postForm, postReq } from "../helpers/request.helper";
import Wait from "../components/wait";
import NoData from "../components/noDtata";
import { runLoad, runRefresh, stopLoad } from "../contexts/config.context";
import toast from "react-hot-toast";
import { LINK } from "../cfg";

function Products() {
    const [state, setState] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const { refresh } = useSelector(e => e?.config);
    const dp = useDispatch();
    const [search, setSearch] = useState('')
    useEffect(() => {
        setIsLoad(false);
        getReq(`/admin/get-all-products`).then((res) => {
            const { ok, data, categories } = res.data;
            setIsLoad(true);
            if (ok) {
                setState(data);
                setCategories(categories);
            }
        })
    }, [refresh]);
    const [add, setAdd] = useState({ open: false, title: '', price: '', about: '', images: [], category: '' });
    function closeAdd() {
        setAdd({ open: false, title: '', price: '', about: '', images: [], category: '' });
    }
    function submitAdd() {
        dp(runLoad());
        postForm('/admin/create-product', add).then((res) => {
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
    const [edit, setEdit] = useState({ _id: '', title: '', price: '', about: '', category: '' });
    function closeEdit() {
        setEdit({ _id: '', title: '', price: '', about: '', category: '' });
    }
    function submitEdit() {
        dp(runLoad());
        postReq('/admin/edit-product', edit).then((res) => {
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
        postReq('/admin/delete-product', { _id: del?._id }).then((res) => {
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
                <Button disabled={!isLoad} onClick={() => setAdd({ title: '', open: true })} color="green" className="hidden md:inline">Qo'shish</Button>
                <IconButton disabled={!isLoad} onClick={() => setAdd({ title: '', open: true })} color="green" className="text-[20px] md:hidden"><FaPlusCircle /></IconButton>
                {/*  */}
            </div>
            {/* MAPPING */}
            {!isLoad && <Wait />}
            {isLoad && !state[0] && <NoData />}
            {isLoad && state[0] &&
                <div className="flex mt-[10px] items-start justify-center gap-[10px] flex-wrap">
                    {state?.filter(s => s?.title?.toLowerCase()?.includes(search?.toLowerCase()))?.map((s, i) => {
                        return (
                            <div key={i} className="w-[300px] gap-2 flex items-center justify-start flex-col p-[10px] rounded-[10px] bg-white shadow-sm border duration-300 hover:shadow-lg">
                                <Carousel>
                                    {s?.images?.map((img, ind) => {
                                        return <div key={ind} className="flex items-center justify-center w-full h-[280px] rounded border overflow-hidden">
                                            <img src={LINK + img} alt="i" />
                                        </div>
                                    })}
                                </Carousel>
                                <p className="text-[20px] font-bold w-full">{s?.title}</p>
                                <p className="text-[14px] w-full text-gray-700 h-[40px]">{s?.about?.slice(0, 50)}...</p>
                                <p className="w-full font-bold">{s?.price?.toLocaleString()} so'm</p>
                                <div className="flex items-center justify-between w-full py-[10px] px-[5px] bg-gray-100 rounded-[10px] gap-3">
                                    <Button onClick={() => setEdit({ _id: s?._id, title: s?.title, price: String(s?.price), about: s?.about, category: s?.category })} size="sm" color="green" variant="text">
                                        Taxrirlash
                                    </Button>
                                    <Button onClick={() => setDel({ _id: s?._id, title: s?.title })} size="sm" color="red" variant="text">
                                        O'chirish
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
            {/* ADD */}
            <div className={`duration-300 flex items-center justify-center w-full h-[100vh] fixed ${add?.open ? 'top-0' : 'top-[-100vh]'} bg-[#0009] backdrop-blur-sm left-0 z-[999]`}>
                <div className="flex items-start justify-start flex-col w-[90%] sm:w-[500px] p-[10px] bg-white rounded-[10px] gap-3">
                    <p className="text-gray-900 font-bold">Mahsulot qo'shish</p>
                    {/* TITLE */}
                    <Input label="Mahsulot nomi" onChange={e => setAdd({ ...add, title: e.target.value })} value={add?.title} icon={<FaListUl />} color="green" />
                    {/* PRICE */}
                    <Input label="Mahsulot narxi" type="number" onChange={e => setAdd({ ...add, price: e.target.value })} value={add?.price} icon={<FaMoneyBill />} color="green" />
                    {/* CATEGORY */}
                    {isLoad && <Select label="Mahsulot uchun kategoriya" onChange={e => setAdd({ ...add, category: e })} value={add?.category} color="green">
                        {categories?.map((c, i) => {
                            return (
                                <Option key={i} value={c?._id}>{c?.title}</Option>
                            )
                        })}
                    </Select>}
                    {/* IMAGES */}
                    <Input label="Mahsulot rasmlari" type="file" accept="image/*" multiple onChange={e => setAdd({ ...add, images: e.target.files })} icon={<FaImages />} color="green" />
                    {/* ABOUT */}
                    <Textarea label="Mahsulot haqida batafsil" onChange={e => setAdd({ ...add, about: e.target.value })} value={add?.about} color="green" />
                    {/*  */}
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Button color="orange" onClick={closeAdd} size="sm">Ortga</Button>
                        <Button color="green" onClick={submitAdd} size="sm">Saqlash</Button>
                    </div>
                </div>
            </div>
            {/* EDIT */}
            <div className={`duration-300 flex items-center justify-center w-full h-[100vh] fixed ${edit?._id !== '' ? 'top-0' : 'top-[-100vh]'} bg-[#0009] backdrop-blur-sm left-0 z-[999]`}>
                <div className="flex items-start justify-start flex-col w-[90%] sm:w-[500px] p-[10px] bg-white rounded-[10px] gap-3">
                    <p className="text-gray-900 font-bold">Mahsulotni taxrirlash</p>
                    {/* TITLE */}
                    <Input label="Mahsulot nomi" onChange={e => setEdit({ ...edit, title: e.target.value })} value={edit?.title} icon={<FaListUl />} color="green" />
                    {/* PRICE */}
                    <Input label="Mahsulot narxi" type="number" onChange={e => setEdit({ ...edit, price: e.target.value })} value={edit?.price} icon={<FaMoneyBill />} color="green" />
                    {/* CATEGORY */}
                    {isLoad && <Select label="Mahsulot uchun kategoriya" onChange={e => setEdit({ ...edit, category: e })} value={edit?.category} color="green">
                        {categories?.map((c, i) => {
                            return (
                                <Option key={i} value={c?._id}>{c?.title}</Option>
                            )
                        })}
                    </Select>}
                    {/* ABOUT */}
                    <Textarea label="Mahsulot haqida batafsil" onChange={e => setEdit({ ...edit, about: e.target.value })} value={edit?.about} color="green" />
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Button color="orange" onClick={closeEdit} size="sm">Ortga</Button>
                        <Button color="green" onClick={submitEdit} size="sm">Saqlash & taxrirlash</Button>
                    </div>
                </div>
            </div>
            {/* DEL */}
            <div className={`duration-300 flex items-center justify-center w-full h-[100vh] fixed ${del?._id !== '' ? 'top-0' : 'top-[-100vh]'} bg-[#0009] backdrop-blur-sm left-0 z-[999]`}>
                <div className="flex items-start justify-start flex-col w-[90%] sm:w-[500px] p-[10px] bg-white rounded-[10px] gap-3">
                    <p className="text-gray-900 font-bold">Mahsulotni o'chirish</p>
                    <p className="text-gray-700">Diqqat chindan {del?.title} mahsuloti o'chirmoqchimisiz( QAYTA TIKLAB BO'LMAYDI )?</p>
                    <div className="flex items-center justify-end gap-2 w-full">
                        <Button color="orange" onClick={closeDel} size="sm">Ortga</Button>
                        <Button color="red" onClick={submitDel} size="sm">Saqlash & O'chirish</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Products;