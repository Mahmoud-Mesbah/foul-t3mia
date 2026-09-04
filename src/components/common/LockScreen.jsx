import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { sessionUnlocked } from '../../features/settings/authSlice';
import { selectSettings } from '../../features/settings/settingsSlice';

export default function LockScreen() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (value === settings.pin) {
      dispatch(sessionUnlocked());
      setError('');
      setValue('');
    } else {
      setError('الرقم السري غير صحيح');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xs rounded-2xl bg-white dark:bg-stone-900 p-6 shadow-2xl text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300">
          <Lock size={22} />
        </div>
        <h1 className="mb-1 text-lg font-bold">الكاشير مقفل</h1>
        <p className="mb-4 text-sm text-stone-500 dark:text-stone-400">
          أدخل الرقم السري للمتابعة
        </p>
        <input
          type="password"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          className="mb-2 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 px-4 py-3 text-center text-xl tracking-widest outline-none focus:border-brand-500"
          placeholder="••••"
        />
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-brand-500 py-3 font-bold text-white hover:bg-brand-600 transition-colors"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
