import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/Login";
import Start from "./components/Start";

import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import Employee from './components/Employee'
import Category from './components/Category'
import AddCategory from './components/AddCategory'
import AddEmployee from './components/AddEmployee'
import EditEmployee from './components/EditEmployee'
import EmployeeLogin from './components/EmployeeLogin'
import EmployeeDetail from './components/EmployeeDetail'
import PrivateRoute from './components/PrivateRoute'
import AddLeave from './components/AddLeaves';
import Leaves from './components/Leaves';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Start />}></Route>
      <Route path='/admin/adminLogin' element={<Login />}></Route>
      <Route path='/emp/login' element={<EmployeeLogin />}></Route>
      <Route path='/emp/details/:id' element={<EmployeeDetail />}></Route>
      <Route path='/add_leave/:id' element={<AddLeave/>}></Route>
      <Route path='/dashboard' element={
        <PrivateRoute >
          <Dashboard />
        </PrivateRoute>
      }>
        <Route path='' element={<Home />}></Route>
        <Route path='/dashboard/getEmployee' element={<Employee />}></Route>
        <Route path='/dashboard/getCategory' element={<Category />}></Route>
        <Route path='/dashboard/leave' element={<Leaves/>}></Route>
        <Route path='/dashboard/addCategory' element={<AddCategory />}></Route>
        <Route path='/dashboard/addEmployee' element={<AddEmployee />}></Route>
        <Route path='/dashboard/editEmployee/:id' element={<EditEmployee />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App