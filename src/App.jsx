import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Signup from './pages/Signup';
import MobileNav from './components/MobileNav';
import Movies from './pages/Movies';
import Series from './pages/Series';
import SeriesDetail from './pages/SeriesDetail';
import Watchlist from './pages/Watchlist';
import Search from './pages/Search';
import Episodes from './pages/Episodes';
import Dashboard from './admin/pages/Dashboard';
import Upload from './admin/pages/Upload';
import Users from './admin/pages/Users';
import Banners from './admin/pages/Banners';
import Editors from './admin/pages/Editors';
import Footer from './components/Footer';
import Splash from './components/Splash';

const App = () => {
  const [openNav, setOpenNav] = useState(false);
  const [adminRoute, setAdminRoute] = useState(false);

  return (
    <Router>
      <AppContent openNav={openNav} setOpenNav={setOpenNav} adminRoute={adminRoute} setAdminRoute={setAdminRoute} />
    </Router>
  );
};

const AppContent = ({ openNav, setOpenNav, setAdminRoute, adminRoute }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/super-admin');

  // Authorization check for admin routes
  if (isAdmin && !adminRoute) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {!isAdmin && <MobileNav openNav={openNav} setOpenNav={setOpenNav} />}
      {!isAdmin && <Navbar openNav={openNav} setOpenNav={setOpenNav} setAdminRoute={setAdminRoute} adminRoute={adminRoute} />}
      <Splash />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/movies/detail/:id' element={<Detail />} />
        <Route path='/series/detail/:id/:episodeId' element={<SeriesDetail />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/series' element={<Series />} />
        <Route path='/series/:id' element={<Episodes />} />
        <Route path='/watchlist' element={<Watchlist />} />
        <Route path='/search' element={<Search />} />
        {adminRoute && isAdmin && (
          <>
            <Route path='/super-admin/dashboard' element={<Dashboard />} />
            <Route path='/super-admin/upload' element={<Upload />} />
            <Route path='/super-admin/users' element={<Users />} />
            <Route path='/super-admin/banners' element={<Banners />} />
            <Route path='/super-admin/editors' element={<Editors />} />
          </>
        )}
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
};

export default App;
