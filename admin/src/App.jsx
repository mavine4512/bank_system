import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CustomerList from './pages/CustomerList';
import CustomerDependants from './pages/CustomerDependants';
import PrivateRoute from './pages/PrivateRoute';
import AdminRegister from './pages/Register';

const App = () => {
   return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<AdminRegister />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<CustomerList />} />
            <Route path="/customerDependants/:customerId" element={<CustomerDependants />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
