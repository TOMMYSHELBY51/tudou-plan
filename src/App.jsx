import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StoolAnalysis from './pages/StoolAnalysis';
import MealRecords from './pages/MealRecords';
import DogFoodAnalysis from './pages/DogFoodAnalysis';
import Settings from './pages/Settings';
import Community from './pages/Community';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="stool" element={<StoolAnalysis />} />
          <Route path="meals" element={<MealRecords />} />
          <Route path="dog-food" element={<DogFoodAnalysis />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
