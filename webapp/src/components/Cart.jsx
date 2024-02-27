import Logo from '../assets/logo.png';
import { FaBoxOpen, FaCircleXmark, FaPencil, FaPhone, FaTrash, FaUser } from 'react-icons/fa6'
import { Button, Input } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { LINK } from '../cfg';
import { useState } from 'react';
function Cart({ cart, createOrder, onAdd, setCart, onRemove, open, setOpen }) {
    const totalPrice = cart?.reduce((a, c) => a + c?.price * c?.count, 0);
    const { lang } = useSelector(e => e?.user);
    const [edit, setEdit] = useState({ p: {}, count: 0, open: false });
    function closeEdit() {
        setEdit({ p: {}, count: 0, open: false });
    }
    function submitEdit() {
        onAdd(edit?.p, edit?.count);
        closeEdit()
    }
    function remove(p) {
        onRemove(p)
    }
    const [form, setForm] = useState({ name: '', phone: '+998', open: false });
    function closeForm() {
        setForm({ name: '', phone: '+998', open: false })
    }
    return (
        <div className={`fixed top-0 ${open ? 'right-0' : 'right-[-100%]'} duration-300 bg-white z-[999] h-[100vh] p-[10px] w-full flex items-center justify-start flex-col`}>
            {/* TOP */}
            <div className="flex items-center justify-between w-full h-[50px] rounded-[10px] p-[0_2%] bg-gray-100">
                <div className="flex items-center justify-center w-[130px]">
                    <img src={Logo} alt="logo" />
                </div>
                <FaCircleXmark className='text-[30px] text-gray-600 cursor-pointer' onClick={() => setOpen(false)} />
            </div>
            {/* NO DATA */}
            {!cart?.[0] &&
                <div className="flex items-center justify-center w-full h-[60vh] flex-col">
                    <FaBoxOpen className='text-gray-600 text-[150px]' />
                    <p className='text-[20px] text-gray-600'>{lang?.cart?.nodata}</p>
                    <Button onClick={() => setOpen(false)} color='indigo'>{lang?.cart?.market}</Button>
                </div>
            }
            {cart?.[0] &&
                <>
                    <div className="flex items-center justify-start flex-col w-full overflow-y-scroll pb-[70px]">
                        <p className='text-[20px] font-bold w-full text-blue-gray-700'>{lang?.cart?.products}: {cart?.length}</p>
                        {/*  */}
                        {cart?.map((c, i) => {
                            return (
                                <div className="flex items-start justify-start w-full gap-3 p-[10px] border-b min-h-max relative" key={i}>
                                    {/* IMG */}
                                    <div className="flex items-center justify-center w-[100px] h-[100px] rounded-[10px] bg-white border overflow-hidden">
                                        <img src={LINK + c?.images?.[0]} alt="img" />
                                    </div>
                                    {/* KEY */}
                                    <div className="flex items-start justify-start flex-col gap-1 text-blue-gray-900">
                                        <p className='text-[20px] font-bold'>{c?.title}</p>
                                        <p className='text-[13px] text-gray-700 font-bold'>{c?.price?.toLocaleString()} UZS</p>
                                        <p className='text-[13px] text-gray-700 font-bold'>
                                            {c?.count} = {Number(c?.price * c?.count)?.toLocaleString()} UZS
                                        </p>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <FaPencil onClick={() => setEdit({ p: c, count: c?.count, open: true })} className='text-[20px] text-blue-gray-600' />
                                    </div>
                                    <div className="absolute top-10 right-2">
                                        <FaTrash onClick={() => remove(c)} className='text-[20px] text-red-600' />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {/*  */}
                    <div className="fixed bottom-0 h-[70px] bg-white shadow-[#00000035] shadow-[0_-10px_10px] w-full p-[10px] flex items-start justify-start flex-col">
                        <p className='text-[16px]'>{lang?.cart?.totalPrice}: <b>{totalPrice?.toLocaleString()}</b> UZS</p>
                        <div className="flex items-center justify-center gap-2 w-full">
                            <Button onClick={() => setCart([])} className='w-[45%]' color='red' size='sm'>{lang?.cart?.clear}</Button>
                            {/*  */}
                            <Button onClick={() => setForm({ ...form, open: true })} className='w-[45%]' color='green' size='sm'>{lang?.cart?.shop}</Button>
                        </div>
                    </div>
                </>
            }
            <div className={`flex items-center justify-center w-full duration-300 h-[100vh] bg-[#0009] backdrop-blur-sm fixed ${edit?.open ? 'top-0' : 'top-[-100vh]'} right-0 z-[1000]`}>
                <div className="flex items-start flex-col justify-start w-[90%] p-[10px] bg-white rounded-[10px] relative gap-1">
                    <p className='text-[20px]'>{edit?.p?.title || '...'}</p>
                    <div onClick={closeEdit} className="absolute top-[-10px] right-[-10px] bg-white rounded-full">
                        <FaCircleXmark className='text-[35px] text-blue-gray-700' />
                    </div>
                    <input className="w-full text-center rounded-[15px] px-[10px] h-[50px] bg-gray-100" type="number" onChange={e => setEdit({ ...edit, count: e.target.value })} value={edit?.count} />
                    <Button onClick={submitEdit} disabled={edit?.count < 1} className="w-full" color="indigo">
                        {lang?.cart?.add}
                    </Button>
                </div>
            </div>
            {/* FORM */}
            <div className={`flex items-center justify-center w-full duration-300 h-[100vh] bg-[#0009] backdrop-blur-sm fixed ${form?.open ? 'top-0' : 'top-[-100vh]'} right-0 z-[1000]`}>
                <div className="flex items-start flex-col justify-start w-[90%] p-[10px] bg-white rounded-[10px] relative gap-2">
                    <p>{lang?.form?.title}</p>
                    <div onClick={closeForm} className="absolute top-[-10px] right-[-10px] bg-white rounded-full">
                        <FaCircleXmark className='text-[35px] text-blue-gray-700' />
                    </div>
                    <Input label={lang?.form?.name} onChange={e => setForm({ ...form, name: e.target.value })} value={form?.name} icon={<FaUser />} color='indigo' />
                    <Input type='tel' label={lang?.form?.phone} onChange={e => setForm({ ...form, phone: e.target.value })} value={form?.phone} icon={<FaPhone />} color='indigo' />
                    <Button onClick={() => createOrder(form?.name, form?.phone)} color='indigo' className='w-full'>{lang?.form?.btn}</Button>
                </div>
            </div>
        </div>
    );
}

export default Cart;