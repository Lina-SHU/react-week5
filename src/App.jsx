import axios from "axios";
import Swal from "sweetalert2";
import { useRef, useEffect, useState } from "react";
import { Modal } from "bootstrap";
import ProductModal from "./components/ProductModal";
const {VITE_BASE_URL, VITE_API_PATH} = import.meta.env;

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [cartsInfo, setCartsInfo] = useState({});

  const productModalRef = useRef(null);
  const productModal = useRef(null);
  useEffect(() => {
    productModal.current = new Modal(productModalRef.current, { backdrop: 'static' });
  }, []);
  const openProductModal = async (prd) => {
    productModal.current.show();
    await getProduct(prd.id);
  };
  const closeProductModal = () => {
    productModal.current.hide();
  };
  
  // 取得商品列表
  const getProducts = async() => {
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PATH}/products/all`);
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };
  // 取得購物車列表
  const getCarts = async() => {
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PATH}/cart`);
      setCartsInfo(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProducts();
    getCarts();
  }, []);

  // 取得單一商品詳細資訊
  const getProduct = async(productId) => {
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PATH}/product/${productId}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  // 加入購物車
  const addCart = async(prd) => {
    try {
      const data = {
        product_id: prd.id,
        qty: 1
      };
      const res = await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PATH}/cart`, { data });
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      getCarts();
    } catch (error) {
      console.log(error);
    }
  };

  // 移除購物車單一商品
  const deleteCartItem = (cartId) => {
    Swal.fire({
      title: "確認將此商品移除購物車？",
      showCancelButton: true,
      confirmButtonText: "移除",
      cancelButtonText: `取消`
    }).then(async () => {
      try {
        const res = await axios.delete(`${VITE_BASE_URL}/api/${VITE_API_PATH}/cart/${cartId}`);
        
        Swal.fire({
          position: "center",
          icon: "success",
          title: res.data.message,
          showConfirmButton: false,
          timer: 1500
        });
        getCarts();
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 清空購物車
  const deleteCarts = () => {
    Swal.fire({
      title: "確認清空購物車？",
      showCancelButton: true,
      confirmButtonText: "清空",
      cancelButtonText: `取消`
    }).then(async () => {
      try {
        const res = await axios.delete(`${VITE_BASE_URL}/api/${VITE_API_PATH}/carts`);
        
        Swal.fire({
          position: "center",
          icon: "success",
          title: res.data.message,
          showConfirmButton: false,
          timer: 1500
        });
        getCarts();
      } catch (error) {
        console.log(error);
      }
    });
  };

  // 修改購物車商品數量
  const editCartItem = async(prd) => {
    try {
      const data = {
        product_id: prd.id,
        qty: 1
      };
      const res = await axios.put(`${VITE_BASE_URL}/api/${VITE_API_PATH}/cart`, { data });
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      getCarts();
    } catch (error) {
      console.log(error);
    }
  };

  // 建立訂單
  const createOrder = async(data) => {
    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PATH}/order`, { data });
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      getCarts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-10">
            {/* 商品列表 */}
            <table className="table mb-5">
              <thead>
                <tr>
                  <th scope="col">商品圖片</th>
                  <th scope="col" width="25%">商品名稱</th>
                  <th scope="col">商品種類</th>
                  <th scope="col">售價</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((prd) => {
                    return (
                      <tr key={prd.id}>
                        <td>
                          <img src={prd.imageUrl} alt={prd.title} className="prd-img" />
                        </td>
                        <td>{prd.title}</td>
                        <td>{prd.category}</td>
                        <td>{prd.price}</td>
                        <td>
                          <button type="button" className="btn btn-sm btn-primary me-1" onClick={() => openProductModal(prd)}>詳細資訊</button>
                          <button type="button" className="btn btn-sm btn-success" onClick={() => addCart(prd)}>加入購物車</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>

            {/* 商品詳細資訊 */}
            <ProductModal productModalRef={productModalRef} closeProductModal={closeProductModal} product={product} />
            
            <hr />
            {/* 購物車列表 */}
            <table className="table caption-top">
              <caption>
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={deleteCarts}>清空購物車</button>
              </caption>
              <thead>
                <tr>
                  <th scope="col">商品圖片</th>
                  <th scope="col" width="25%">商品名稱</th>
                  <th scope="col">售價</th>
                  <th scope="col">總價</th>
                  <th scope="col" width="15%"></th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  cartsInfo.carts ? cartsInfo.carts.map((cart) => {
                    return (
                      <tr key={cart.id}>
                        <td>
                          <img src={cart.product?.imageUrl} alt={cart.product?.title} className="prd-img" />
                        </td>
                        <td>{cart.product?.title}</td>
                        <td>{cart.product?.price}</td>
                        <td>{cart.final_total}</td>
                        <td>
                          <div className="input-group mb-3">
                            <button className="btn btn-outline-secondary" type="button">-</button>
                            <input type="text" className="form-control text-center" value={cart.qty} />
                            <button className="btn btn-outline-secondary" type="button">+</button>
                          </div>
                        </td>
                        <td>
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteCartItem(cart.id)}>刪除</button>
                        </td>
                      </tr>
                    )
                  }) : (
                    <tr>
                      <td colSpan={6} className="text-center">購物車無商品</td>
                    </tr>
                  )
                }
                <tr>
                  <td colSpan={6}>{cartsInfo.final_total}</td>
                </tr>
              </tbody>
            </table>

            <hr />
            {/* 訂單資料 */}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
