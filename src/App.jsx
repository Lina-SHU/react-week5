import axios from "axios";
import Swal from "sweetalert2";
import { useRef, useEffect, useState } from "react";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import Input from "./components/Input";
import Textarea from "./components/Textarea";
import ProductModal from "./components/ProductModal";
const {VITE_BASE_URL, VITE_API_PATH} = import.meta.env;

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [cartsInfo, setCartsInfo] = useState({});
  const [loadingState, setLoadingState] = useState(false);
  const [loadingListState, setLoadingListState] = useState([]);

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
      setLoadingState(true);
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PATH}/products/all`);
      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };
  // 取得購物車列表
  const getCarts = async() => {
    try {
      setLoadingState(true);
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PATH}/cart`);
      setCartsInfo(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };
  useEffect(() => {
    getProducts();
    getCarts();
  }, []);

  // 取得單一商品詳細資訊
  const getProduct = async(productId) => {
    try {
      setLoadingState(true);
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PATH}/product/${productId}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  // 加入購物車
  const addCart = async(prd) => {
    try {
      setLoadingState(true);
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
    } finally {
      setLoadingState(false);
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
        setLoadingState(true);
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
      } finally {
        setLoadingState(false);
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
        setLoadingState(true);
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
      } finally {
        setLoadingState(false);
      }
    });
  };

  // 修改購物車商品數量
  const editCartItem = async(prd, qty) => {
    try {
      setLoadingListState((preState) => [...preState, prd.id]);
      const data = {
        product_id: prd.id,
        qty: qty
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
    } finally {
      setLoadingListState((prevState) => prevState.filter((prd) => prd !== prd.id));
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onTouched'
  });

  // 建立訂單
  const createOrder = async(info) => {
    try {
      setLoadingState(true);
      // 購物車為空時提醒
      if (cartsInfo.carts.length === 0) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: '目前購物車是空的唷！',
          showConfirmButton: false,
          timer: 1500
        });
        return;
      }
      const data = {
        user: {
          name: info.name,
          email: info.email,
          tel: info.tel,
          address: info.address
        },
        message: info.message
      }
      const res = await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PATH}/order`, { data });
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      reset();
      getCarts();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
      {/* Loading 效果 */}
      {
        loadingState && (
          <div className="position-fixed top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center" style={{
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, .5)'
          }}>
            <ClipLoader
              color={'#000000'}
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )
      }

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* 商品列表 */}
            <h2 className="text-center h4">商品列表</h2>
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
            <h2 className="text-center h4">購物車列表</h2>
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
                  <th scope="col" width="20%"></th>
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
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => editCartItem(cart.product, cart.qty - 1)}
                              disabled={loadingListState.includes(cart.product?.id)}
                            >-</button>
                            <input type="text" className="form-control text-center" value={cart.qty} readOnly />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => editCartItem(cart.product, cart.qty + 1)}
                              disabled={loadingListState.includes(cart.product?.id)}
                            >+</button>
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
                  <td colSpan={6} className="text-end">總金額：{cartsInfo.final_total} 元</td>
                </tr>
              </tbody>
            </table>

            <hr />
            {/* 訂單資料 */}
            <div className="row justify-content-center mb-5">
              <div className="col-lg-8">
                <h2 className="text-center h4">訂單資料</h2>
                <form onSubmit={handleSubmit(createOrder)}>
                  <Input
                    register={register}
                    errors={errors}
                    id="name"
                    type="text"
                    labelText="姓名"
                    rules={{
                        required: {
                          value: true,
                          message: '姓名為必填'
                        }
                    }}
                    placeholder="請填寫姓名"
                  />
                  <Input
                    register={register}
                    errors={errors}
                    id="email"
                    type="email"
                    labelText="Email"
                    rules={{
                        required: {
                          value: true,
                          message: 'Email 為必填'
                        },
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Email 格式不正確'
                        }
                    }}
                    placeholder="請填寫 Email"
                  />
                  <Input
                    register={register}
                    errors={errors}
                    id="tel"
                    type="tel"
                    labelText="電話"
                    rules={{
                        required: {
                          value: true,
                          message: '電話為必填'
                        },
                        minLength: {
                          value: 8,
                          message: '電話不少於 8 碼'
                        }
                    }}
                    placeholder="請填寫電話"
                  />
                  <Input
                    register={register}
                    errors={errors}
                    id="address"
                    type="text"
                    labelText="地址"
                    rules={{
                        required: {
                          value: true,
                          message: '地址為必填'
                        }
                    }}
                    placeholder="請填寫地址"
                  />
                  <Textarea
                    register={register}
                    errors={errors}
                    id="message"
                    labelText="留言"
                    placeholder="請填寫留言"
                  />
                  <button type="submit" className="btn btn-primary w-100">送出訂單</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
