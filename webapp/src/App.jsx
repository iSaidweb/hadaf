import { useEffect, useState } from "react";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import { getReq, postReq } from "./helpers/request.helper";
import { Button, Carousel, IconButton, Spinner } from "@material-tailwind/react";
import { LINK } from "./cfg";
import { FaCartPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const tg = window?.Telegram?.WebApp;
function App() {
  const [cart, setCart] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const { lang } = useSelector(e => e?.user);
  const [search, setSearch] = useState('')
  useEffect(() => {
    setIsLoad(false);
    tg?.ready();
    getReq('/user/get-home').then((res) => {
      setIsLoad(true);
      const { products, categories } = res.data;
      setProducts(products || []);
      setCategories(categories || []);
    })
  }, []);
  // FUNCTIONS
  function onAdd(prod, count = 1) {
    const product = cart?.find(c => c?._id === prod?._id);
    if (product && (count === 1)) {
      setCart(cart?.map(c => {
        return c?._id === prod?._id ? { ...product, count: product?.count + 1 } : c
      }));
    } else if (product && (count > 1)) {
      setCart(cart?.map(c => {
        return c?._id === prod?._id ? { ...product, count } : c
      }));
    } else {
      setCart([...cart, { ...prod, count }]);
    }
  }
  // 
  function onRemove(prod) {
    const product = cart?.find(c => c?._id === prod?._id);
    if (product) {
      setCart(cart?.filter(c => c?._id !== prod?._id))
    };
  }
  // 
  const [selectCategory, setSelectCategory] = useState('');
  const [addModal, setAddModal] = useState({ prod: {}, count: 0, open: false });
  // 
  function createOrder(name = '', phone = '') {
    const id = tg?.initDataUnsafe?.user?.id || 5991285234;
    postReq('/user/create-order', {
      products: cart,
      name: name,
      phone: phone,
      id
    }).then((res) => {
      const { ok, msg } = res.data;
      if (!ok) {
        toast.error(msg);
      } else {
        tg?.close()
      }
    });
  }
  return (
    <>
      <Navbar cart={cart} setOpenCart={setOpenCart} />
      <Cart createOrder={createOrder} setCart={setCart} open={openCart} setOpen={setOpenCart} cart={cart} onAdd={onAdd} onRemove={onRemove} />
      {!isLoad &&
        <div className="flex items-center justify-center flex-col w-full h-[50vh]">
          <Spinner color="indigo" className="w-[40px]  h-[40px]" />
        </div>
      }{isLoad &&
        <div className="flex items-center justify-start flex-col gap-2 p-[10px_2%]">
          {/* SEARCH */}
          <div className="flex items-center justify-center w-full h-[40px] rounded-[10px] bg-gray-100 relative">
            <input type="search" className="w-full rounded-[10px] p-[0_30px_0_10px] h-[35px] bg-gray-100" placeholder={lang?.search} onChange={e => setSearch(e.target.value)} value={search} />
            <FaSearch className="absolute right-[10px] text-gray-700" />
          </div>
          {/* CATEGPRUES */}
          <div className="flex items-center px-[10px] justify-start w-full overflow-x-scroll h-[50px] bg-gray-100 rounded-[10px] gap-2 snap-x">
            {categories?.map((c, i) => {
              return (
                <Button key={i} onClick={() => setSelectCategory(c?._id)} size="sm" color="indigo" variant={selectCategory === c?._id ? 'filled' : 'outlined'} className="min-w-max snap-start">
                  {c?.title}
                </Button>
              )
            })}
          </div>
          {/* PRODUCTS */}
          <div className="flex items-start w-full flex-wrap justify-center gap-2">
            {products?.filter(p => (search ? p?.title?.toLowerCase()?.includes(search?.toLowerCase()) : p?.category?.includes(selectCategory)))?.map((p, i) => {
              return (
                <div className="flex items-start justify-start flex-col bg-gray-50 border p-[10px] rounded-[10px] w-[45%]" key={i}>
                  {/* IMAGES */}
                  <Carousel nextArrow={() => { }} prevArrow={() => { }}>
                    {p?.images?.map((im, ind) => {
                      return (
                        <div key={ind} className="flex items-center justify-center w-full h-[150px] bg-white rounded-[10px] overflow-hidden">
                          <img src={LINK + im} alt="img" />
                        </div>
                      )
                    })}
                  </Carousel>
                  {/* TITLE */}
                  <p className="font-bold text-[14px]">{p?.title?.[15] ? p?.title?.slice(0, 12) + '...' : p?.title}</p>
                  {/* PRICE */}
                  <p className="font-bold text-[14px]">{p?.price?.toLocaleString()} UZS</p>
                  {/* ADD */}
                  <div className="flex items-center justify-end gap-2 w-full">
                    <IconButton color="indigo" onClick={() => !cart?.find(c => c?._id === p?._id) ? setAddModal({ prod: p, count: 1, open: true }) : onAdd(p, 1)} size="sm" className="text-[20px]">
                      <FaCartPlus />
                    </IconButton>
                  </div>
                </div>
              )
            })}
          </div>
          {/* ADD TO CART */}
          <div className={`flex-col flex items-center justify-end w-full h-[100vh] bg-[#00000052] backdrop-blur-sm fixed ${addModal?.open ? 'bottom-0' : 'bottom-[-100vh]'} duration-300 z-[9999] left-0`}>
            {/* closer */}
            <div className="h-full w-full" onClick={() => { setAddModal({ prod: {}, open: false, count: 1 }) }}></div>
            {/* modal */}
            <div className="flex items-center bg-white p-[10px] justify-start flex-col w-full  gap-2">
              <div className="flex items-start justify-start w-full gap-2">
                <div className="flex items-center justify-center min-w-[100px] max-w-[100px] h-[100px] overflow-hidden rounded-[10px]">
                  <img src={LINK + addModal?.prod?.images?.[0]} alt="img" />
                </div>
                <div className="flex items-start justify-start flex-col">
                  <p className="text-[20px] font-bold">{addModal?.prod?.title}</p>
                  <p className="text-[16px]">{addModal?.prod?.price?.toLocaleString()} UZS</p>
                  <p className="text-[14px] text-gray-700">{addModal?.prod?.about}</p>
                </div>
              </div>
              <input className="w-[90%] text-center rounded-[15px] px-[10px] h-[50px] bg-gray-100" type="number" onChange={e => setAddModal({ ...addModal, count: e.target.value })} value={addModal?.count} />
              <Button disabled={addModal?.count < 1} onClick={() => { onAdd(addModal?.prod, +addModal?.count); setAddModal({ prod: {}, count: 1, open: false }); toast.success(); }} className="w-[90%]" color="indigo">
                {lang?.cart?.add}
              </Button>
            </div>
          </div>
        </div>
      }
      <Toaster />
    </>
  );
}

export default App;