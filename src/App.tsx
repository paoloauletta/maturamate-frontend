import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import ExercisePage from './pages/ExercisePage';
import VirtualTutor from './pages/VirtualTutor';
import Simulations from './pages/Simulations';
import SimulationPage from './pages/SimulationPage';
import Profile from './pages/Profile';
import SavedExercises from './pages/SavedExercises';
import Statistics from './pages/Statistics';
import NotFound from './pages/NotFound';
import { UserProvider } from './context/UserContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-3xl font-bold text-blue-600">MaturaMate</div>
        <div className="mt-4 animate-pulse">
          <div className="h-2 w-24 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="exercises/:id" element={<ExercisePage />} />
          <Route path="tutor" element={<VirtualTutor />} />
          <Route path="simulations" element={<Simulations />} />
          <Route path="simulations/:id" element={<SimulationPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="saved" element={<SavedExercises />} />
          <Route path="progress" element={<Statistics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;