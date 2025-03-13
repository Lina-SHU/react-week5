import { useState } from "react";

const ProductModal = ({ productModalRef, closeProductModal, product, addCart }) => {
    const [num, setNum] = useState(1);
    console.log('product modal');

    return (
        <div className="modal fade" ref={productModalRef} id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                <h1 className="modal-title fs-5" id="productModalLabel"></h1>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeProductModal}></button>
                </div>
                <div className="modal-body">
                <div className="row">
                    <div className="col-md-6">
                    <img src={product.imageUrl} alt={product.title} className="img-fluid"/>
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-between">
                        <div>
                            <h2 className="fs-4">{product.title}</h2>
                            <p>{product.content}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                                <del>{product.origin_price}</del>
                                <p className="text-danger fs-4 mb-0">{product.price}</p>元
                            </div>
                            <div>
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setNum(num - 1)}
                                    disabled={num === 1}
                                >-</button>
                                <input type="text" className="form-control text-center" value={num} readOnly />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setNum(num + 1)}
                                >+</button>
                                <button type="button" className="btn btn-sm btn-success" onClick={() => addCart(product.id, num)}>加入購物車</button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
};

export default ProductModal;