/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Form, Button, Modal } from "react-bootstrap";

function Products (){

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [name, setName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [showModalInsert, setShowModalInsert] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({id : 0, name : "", product_category : "", description : ""});


    //form state
    const [fieldProductName, setFieldProductName] = useState('');
    const [fieldProductCategory, setFieldProductCategory] = useState('');
    const [fieldProductDescription, setFieldProductDescription] = useState('');

    useEffect(() => {
        fetchProductsDetails(currentPage);
    }, [currentPage]);

    const fetchProductsDetails = async (page) => {
        try{
            const response = await axios.get(
                `http://localhost:8000/api/product/search?name=${name}&product_category=${productCategory}&page=${page}` 
            );
            const data = response.data.data;
            setProducts(data.data);
            setCurrentPage(data.current_page);
            setLastPage(data.last_page);
        }catch(error){
            console.log("Error fetching product details : ",error);
        }
    };

    const handleAddProduct = async () => {
        try{
            await axios.post(`http://localhost:8000/api/product/create`, {
                name: fieldProductName,
                product_category : fieldProductCategory,
                description : fieldProductDescription
            });
            fetchProductsDetails(currentPage);
            setShowModalInsert(false);
            setFieldProductName('');
            setFieldProductDescription('');
            setFieldProductCategory('');
        }catch(error){
            console.log("Error add product : ",error);
        }
    };

    const handleEditProduct = async () => {
        try{
            await axios.put(`http://localhost:8000/api/product/edit`, {
                id : currentProduct.id,
                name: currentProduct.name,
                product_category : currentProduct.product_category,
                description : currentProduct.description
            });
            fetchProductsDetails(currentPage);
            setShowModalEdit(false);
            setFieldProductName('');
            setFieldProductDescription('');
            setFieldProductCategory('');
            setCurrentProduct({ id: 0, name: "", product_category: "", description: "" });
        }catch(error){
            console.log("Error update product : ",error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchProductsDetails(1);
    };

    const handleShowModalToEdit = (product = null) => {
        setIsEdit(!!product);
        setCurrentProduct(product || {id : 0, name: "", product_category: "", description : ""});
        setShowModalEdit(true);
    };


    const productCategories = ["Rokok", "Obat", "Lainnya"];

    return (
        <div className="container mt-4">
            <h2>Products Details</h2>
            {/* filters */}
            <Form className="mb-3">
                <div className="row">
                    <div className="col-md-4">
                        <Form.Group controlId="formName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-4">
                        <Form.Group controlId="formCategory">
                            <Form.Label>Product Category</Form.Label>
                            <Form.Select
                                value={productCategory}
                                onChange={(e) => setProductCategory(e.target.value)}>
                                    <option value="">Select Category Product</option>
                                    {productCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                        <Button variant="primary" onClick={handleSearch}>
                            Search
                        </Button>
                        &nbsp;
                        <Button variant="primary" onClick={() => setShowModalInsert(true)}>
                            Add Data
                        </Button>
                    </div>
                </div>
            </Form>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>CATEGORY</th>
                        <th>DESCRIPTION</th>
                        <th>PRICES</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.product_category}</td>
                            <td>{product.description}</td>
                            <td>{product.prices.map((price) => (
                                <div key={price.id}>
                                    <strong>{price.unit}</strong>
                                    <ul>
                                        {price.price_details.map((detail) => (
                                            <li key={detail.id}>
                                                {detail.tier} : Rp. {detail.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleShowModalToEdit(product)}>Edit</Button>
                                &nbsp;
                                <Button variant="primary">Prices</Button>
                                &nbsp;
                                <Button variant="primary">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {/* pagination table */}
            <Pagination>
                <Pagination.First
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                />
                <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                />
                {[...Array(lastPage)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    disabled={currentPage === lastPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                />
                <Pagination.Last
                    disabled={currentPage === lastPage}
                    onClick={() => handlePageChange(lastPage)}
                />
            </Pagination>

            {/* modal insert */}
            <Modal show={showModalInsert} onHide={() => setShowModalInsert(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="newProductName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={fieldProductName}
                                onChange={(e) => setFieldProductName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Product Category</Form.Label>
                            <Form.Select value={fieldProductCategory}
                                onChange={(e) => setFieldProductCategory(e.target.value)}>
                                    <option value="">Select Category</option>
                                    {productCategories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product description"
                                value={fieldProductDescription}
                                onChange={(e) => setFieldProductDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModalInsert(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddProduct}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* modal update */}
            <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="newProductName">
                        <Form.Label>Product ID</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={currentProduct.id}
                                onChange={(e) => setCurrentProduct({...currentProduct,id: e.target.value})}
                            />
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product name"
                                value={currentProduct.name}
                                onChange={(e) => setCurrentProduct({...currentProduct,name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Product Category</Form.Label>
                            <Form.Select value={currentProduct.product_category}
                                onChange={(e) => setCurrentProduct({...currentProduct,product_category: e.target.value})}>
                                    <option value="">Select Category</option>
                                    {productCategories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter product description"
                                value={currentProduct.description}
                                onChange={(e) => setCurrentProduct({...currentProduct,description: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowModalEdit(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditProduct}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Products;