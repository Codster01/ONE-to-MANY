"use client"
// pages/products/index.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import Link from 'next/link';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '../../../backend/src/category/category.schema';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const CategoryPage = () => {
  const [products, setProducts] = useState<Category[]>([]);
  const router = useRouter()
  const add = () => {

    console.log('Add Product');
  }

  // Fetch products from the backend
  const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/product/api/'); // Adjust the endpoint as per your backend route
        setProducts(response.data);
        
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    useEffect(() => {

    fetchProducts();
  }, []);

  const deleteit = async (id:any) =>{
    console.log(id)
    try {

      await axios.delete(`http://localhost:3001/product/api/delete/${id}`);
      fetchProducts();
      toast.success('Product deleted successfully')
    } catch (error) {
      console.log(error);
      toast.error('Error deleting product')
    }
    console.log('Delete product');
  }

  return (
    <div className="w-full container m-5 border rounded-lg align-middle p-10 mx-auto  bg-gradient-to-r from-blue-100 to-blue-200 shadow-xl hover:shadow-2xl transition duration-300 ease-in-out">
      <div className='flex justify-between items-center mt-3 mb-10'>
        <h1 className='text-5xl text-center text-primary font-bold '>Products</h1>
        <Link href="/products/add"><Button className='btn-add p-3 text-lg bg-primary text-white hover:bg-blue-100 hover:text-blue-950 border rounded-lg' onClick={add}>+ Add Product</Button></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
        {products.map(product => (
          <div key={product.id} className="card relative bg-slate-100 bg-white shadow-md rounded-lg p-4 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
            <Button onClick={() => {deleteit(product._id)}} className="absolute bottom-0 right-0 mb-2 mr-2">
              <DeleteIcon sx={{ color: 'red' }} />
            </Button>
            <img className="image-container h-48 w-full flex items-center justify-center bg-gray-200"
 src={`http://localhost:3001/${product.bannerImage}`} alt={product.name} />
            <h2 className='font-bold text-blue-900 text-2xl m-5'>{product.name}</h2>
            <h3 className='font-semibold text-blue-500 text-lg m-1'>Category: {product.category}</h3>
            <p className='text-blue-900'>Description: {product.description}</p>
          </div>
        ))}
      </div>
    </div>

  );
};

export default CategoryPage;
