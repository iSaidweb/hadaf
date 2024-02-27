import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getReq } from "./helpers/request.helper";
import { updateUser } from "./contexts/user.context";
import Auth from "./components/auth";
import Loading from "./components/loading";
import Navbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import Categories from "./pages/categories";
import Products from "./pages/products";
import Orders from "./pages/orders";

function App() {
  const { user, config } = useSelector(e => e);
  const dp = useDispatch();
  useEffect(() => {
    getReq('/admin//verify-auth').then((res) => {
      const { ok, data } = res.data;
      if (ok) {
        dp(updateUser(data));
      }
    })
  }, []);
  return (
    <>
      {config?.loading &&
        <Loading />
      }
      {!user?._id ?
        <Auth />
        :
        <>
          <Navbar />
          <Routes>
            <Route path="*" element={<Orders />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </>
      }
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;