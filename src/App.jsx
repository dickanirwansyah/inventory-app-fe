import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HeaderComponent from './components/HeaderComponent';
import Products from './pages/Products';
import Prices from './pages/Prices';
import PriceDetail from './pages/PricesDetail';

function App() {
  return (
    <Router>
        <HeaderComponent/>
        <Routes>
            <Route path='/' element={<Products/>}/>
            <Route path='/prices' element={<Prices/>}/>
            <Route path='/prices-details' element={<PriceDetail/>}/>
        </Routes>
    </Router>
  );
}

export default App;
