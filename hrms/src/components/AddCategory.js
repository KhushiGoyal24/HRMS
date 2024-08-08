import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddCategory = () => {
    const [category, setCategory] = useState({name:''})
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        const { value } = e.target;
        setCategory({ name: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(category);
        axios.post('http://localhost:5000/admin/addCategory', category)
        .then((result) => {
            if(result.data.success) {
                console.log(result);
                navigate('/dashboard/getCategory')
            } else {
                console.log(result);
                setError(result.data.message)
            }
        })
        .catch(err => console.log(err))
    }
  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
        <div className='p-3 rounded w-25 border'>
            <h2>Add Category</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="category"><strong>Category:</strong></label>
                    <input type="text" name='category' placeholder='Enter Category'
                     onChange={handleChange} value={category.name} className='form-control rounded-0'/>
                </div>
                <button className='btn btn-success w-100 rounded-0 mb-2'>Add Category</button>
            </form>
        </div>
    </div>
  )
}

export default AddCategory