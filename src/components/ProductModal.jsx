const ProductModal = ({ productModalRef, closeProductModal, product }) => {
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
                        <div className="d-flex align-items-center">
                        <del>{product.origin_price}</del>
                        <p className="text-danger fs-4 mb-0">{product.price}</p>元
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