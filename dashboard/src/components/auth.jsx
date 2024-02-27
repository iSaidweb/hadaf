import { useState } from "react";
import { postReq } from "../helpers/request.helper";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser } from "../contexts/user.context";
import { Button, Input } from "@material-tailwind/react";
import { FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa'
function Auth() {
    const [form, setForm] = useState({
        phone: '+998',
        password: ''
    });
    const dp = useDispatch();
    function Submit() {
        postReq(`/admin/sign-in`, form).then(res => {
            const { ok, msg, data, access } = res.data;
            if (!ok) {
                toast.error(msg);
            } else {
                toast.success(msg);
                localStorage.setItem('access', access);
                setTimeout(() => {
                    dp(updateUser(data));
                }, 200);
            }
        }).catch(() => {
            toast.error("Xatolik!");
        })
    }
    const [show, setShow] = useState(false);
    return (
        <div className="flex items-center justify-center w-full h-[100vh]">
            <div className="flex items-center justify-start flex-col w-[90%] p-[10px] border bg-white rounded-[10px] sm:w-[500px] gap-3">
                {/*  */}
                <p className="text-gra-800 text-[20px]">Tizimga kirish</p>
                {/*  */}
                <Input label="Raqamingiz" type="tel" required onChange={e => setForm({ ...form, phone: e?.target?.value })} value={form?.phone} color="green" icon={<FaPhone />} />
                {/*  */}
                <Input label="Parolingiz" type={!show ? "password" : "text"} onChange={e => setForm({ ...form, password: e?.target?.value })} value={form?.password} color="green" icon={!show ? <FaEye onClick={() => setShow(true)} className="cursor-pointer" /> : <FaEyeSlash onClick={() => setShow(false)} className="cursor-pointer" />} />
                {/*  */}
                <Button color="green" onClick={Submit} fullWidth>Tekshirish</Button>
            </div>
        </div>
    );
}

export default Auth;