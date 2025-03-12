import axios from "axios";
import { useRef, useEffect, useState } from "react";
import { Modal } from "bootstrap";
import ProductModal from "./components/ProductModal";
const {VITE_BASE_URL, VITE_API_PATH} = import.meta.env;

function App() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});

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
  useEffect(() => {
    getProducts();
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
  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-10">
            <table className="table">
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
                          <button type="button" className="btn btn-sm btn-success">加入購物車</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>

            {/* 商品詳細資訊 */}
            <ProductModal productModalRef={productModalRef} closeProductModal={closeProductModal} product={product} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
