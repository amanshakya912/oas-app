import axios from "axios";
import Helper from "./Helper";
import { SignInFormInputs, SignUpFormInputs } from "@/types";

axios.defaults.baseURL = Helper.API_URL

const signIn = async (data: SignInFormInputs) => {
    try {
        const res = await axios.post('/signin', data)
        return res?.data
    } catch (error) {
        throw error   
    }
}
const signUp = async (data: SignUpFormInputs) => {
    try {
        const res = await axios.post('/signup', data);
        return res?.data;
    } catch (error) {
        throw error;
    }
};

const addProduct = async (details: FormData) => {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');
    try {
        const res = await axios.post('/add-product', details, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` 
            }
        })
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const updateProduct = async (id: string, details: FormData) => {
    try {
        const res = await axios.put(`/product/${id}`, details)
        return res?.data;
    } catch(e) {
        throw e;
    }
}

const deleteProduct = async (id: string) => {
    try {
        const res = await axios.delete(`/product/${id}`)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const addProductDetail = async (features: FormData) => {
    try {
        const res = await axios.post('/product-detail/add', features)
        return res?.data
    } catch(e) {
        throw e;
    }
}

const getProducts = async () => {
    try {
        const res = await axios.get('/products')
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const getProductBySlug = async (slug: string) => {
    try {
        const res = await axios.get(`/product/${slug}`)
        return res?.data;
    } catch(e) {
        throw e;
    }
}

const getProductDetailsById = async (id: string) => {
    try {
        const res = await axios.get(`/product-detail/${id}`)
        return res?.data;
    } catch(e) {
        throw e;
    }
}

const placeBid = async (productId: string, bidAmount:string) => {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');
    try {
        const response = await axios.post('/product/placeBid', {
            productId,
            bidAmount,
            userId: userid
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });
        console.log('Bid placed successfully:', response.data);
    } catch (error) {
        throw error
    }
};

const getUser = async(username: string) => {
    try {
        const res = await axios.get(`/user?userName=${username}`)
        return res?.data;
    } catch(e) {
        throw e;
    }
}

const getUserById = async(id: string) => {
    try {
        const res = await axios.get(`/user?id=${id}`)
        return res?.data;
    } catch(e) {
        throw e;
    }
}

const getProductByUser = async(id: string) => {
    try {
        const res = await axios.get(`/products/user/${id}`)
        return res?.data;
    } catch (e) {
        throw e;
    }
}

const editUser = async (data: string) => {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');
    try {
        const res = await axios.put('/user/edit', data, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        },
        )
        return res?.data
    } catch (error) {
        throw error   
    }
}
const deleteUser = async () => {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');
    try {
        const res = await axios.delete('/user/delete', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        },
        )
        return res?.data
    } catch (error) {
        throw error   
    }
}

const handleAuctionEnd = async (prodId: string) => {
    try {
        const res = await axios.post(`/end-auction/${prodId}`)
        return res?.data
    } catch (error) {
        throw error   
    }
}
const handleBuyNow = async (prodId: string) => {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('id');
    try {
        const res = await axios.post(`/buy-now/${prodId}`, {}, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return res?.data
    } catch (error) {
        throw error   
    }
}
export default {
    signIn,
    signUp,
    addProduct,
    updateProduct,
    deleteProduct,
    addProductDetail,
    getProductDetailsById,
    getProducts,
    getProductBySlug,
    placeBid,
    getUser,
    getUserById,
    getProductByUser,
    editUser,
    deleteUser,
    handleAuctionEnd,
    handleBuyNow
}