import React, { useState } from 'react'
import './myStyles.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [values, setValues] = useState({
        name:'',
        password: ''
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const handleSubmit = (event) => {  
        event.preventDefault()
        console.log(values);
        axios.post('http://localhost:5000/admin/adminLogin', values)
        .then(result => {
            if(result.data.success) {
                localStorage.setItem("valid", true)
                navigate('/dashboard')
            } else {
                setError(result.data.message)
            }
            console.log(result);
        })
        .catch(err => console.log(err))
    }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
        <div className='p-3 rounded w-25 border loginForm'>
            <div className='text-warning'>
                {error && error}
            </div>
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="name"><strong>Name:</strong></label>
                    <input type="text" name='name' autoComplete='off' placeholder='Enter Name'
                     onChange={(e) => setValues({...values, name: e.target.value})} className='form-control rounded-0'/>
                </div>
                <div className='mb-3'> 
                    <label htmlFor="password"><strong>Password:</strong></label>
                    <input type="password" name='password' placeholder='Enter Password'
                     onChange={(e) => setValues({...values, password : e.target.value})} className='form-control rounded-0'/>
                </div>
                <button className='btn btn-success w-100 rounded-0 mb-2'>Log in</button>
                <div className='mb-1'> 
                    <input type="checkbox" name="tick" id="tick" className='me-2'/>
                    <label htmlFor="password">You are Agree with terms & conditions</label>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login