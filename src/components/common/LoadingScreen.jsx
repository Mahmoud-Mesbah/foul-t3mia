import { UtensilsCrossed } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-stone-50 dark:bg-stone-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white animate-pulse">
        <UtensilsCrossed size={32} />
      </div>
      <p className="text-stone-500 dark:text-stone-400 text-sm">جارِ تحميل بيانات الكاشير...</p>
    </div>
  );
}
