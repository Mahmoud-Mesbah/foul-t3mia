import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { initializeApp } from './app/initializeApp';
import { selectAppReady } from './features/ui/uiSlice';
import { selectUnlocked } from './features/settings/authSlice';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/common/ToastContainer';
import LoadingScreen from './components/common/LoadingScreen';
import LockScreen from './components/common/LockScreen';

function App() {
  const dispatch = useAppDispatch();
  const appReady = useAppSelector(selectAppReady);
  const unlocked = useAppSelector(selectUnlocked);

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  if (!appReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
      {!unlocked ? <LockScreen /> : <AppRoutes />}
      <ToastContainer />
    </div>
  );
}

export default App;
