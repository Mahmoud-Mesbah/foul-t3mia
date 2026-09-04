import { useRef, useState } from 'react';
import {
  Store,
  Palette,
  Receipt,
  Database,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Lock,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectSettings,
  settingsUpdated,
  receiptSettingsUpdated,
  themeSet,
  pinSet,
  settingsReplaced,
} from '../../features/settings/settingsSlice';
import { selectAllProducts, productsReplaced } from '../../features/products/productsSlice';
import { selectAllCategories, categoriesReplaced } from '../../features/categories/categoriesSlice';
import { selectAllOrders, ordersReplaced } from '../../features/orders/ordersSlice';
import { clearAllAppData } from '../../services/storage/storage';
import {
  buildBackupPayload,
  downloadBackupFile,
  readBackupFile,
  validateBackupPayload,
} from '../../services/backup/backupService';
import { useToast } from '../../hooks/useToast';
import { inputClass } from '../../components/common/Field';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { seedCategories, seedProducts, defaultSettings } from '../../data/seedData';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
      <h3 className="mb-4 flex items-center gap-2 font-bold">
        <Icon size={18} className="text-brand-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const settings = useAppSelector(selectSettings);
  const products = useAppSelector(selectAllProducts);
  const categories = useAppSelector(selectAllCategories);
  const orders = useAppSelector(selectAllOrders);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    restaurantName: settings.restaurantName,
    phone: settings.phone,
    address: settings.address,
    invoiceMessage: settings.invoiceMessage,
  });
  const [pinInput, setPinInput] = useState(settings.pin || '');
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [importPayload, setImportPayload] = useState(null);

  const saveInfo = () => {
    dispatch(settingsUpdated(form));
    showSuccess('تم تحديث الإعدادات');
  };

  const savePin = () => {
    dispatch(pinSet(pinInput.trim() ? pinInput.trim() : null));
    showSuccess('تم تحديث الإعدادات');
  };

  const handleExport = () => {
    const payload = buildBackupPayload({ products, categories, orders, settings });
    downloadBackupFile(payload);
    showSuccess('تم تصدير البيانات بنجاح');
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = await readBackupFile(file);
      const { valid, errors } = validateBackupPayload(data);
      if (!valid) {
        showError(errors[0] || 'ملف النسخة الاحتياطية غير صالح');
        return;
      }
      setImportPayload(data);
    } catch (err) {
      showError(err.message || 'تعذر استيراد الملف');
    }
  };

  const confirmImport = () => {
    if (!importPayload) return;
    try {
      // Dispatching these actions is enough — the persistence middleware
      // (src/app/persistenceMiddleware.js) automatically writes the fresh
      // state to LocalStorage right after each of these reducers runs.
      dispatch(productsReplaced(importPayload.products));
      dispatch(categoriesReplaced(importPayload.categories));
      dispatch(ordersReplaced(importPayload.orders));
      dispatch(settingsReplaced(importPayload.settings));
      showSuccess('تم استيراد البيانات بنجاح');
    } catch (err) {
      showError('حدث خطأ أثناء استيراد البيانات');
    } finally {
      setImportPayload(null);
    }
  };

  const handleDeleteAll = () => {
    if (confirmText !== 'حذف') return;
    try {
      // Wipe every LocalStorage key this app owns, then dispatch the seed
      // data back in — the persistence middleware writes it straight back
      // to LocalStorage as part of handling each action below.
      clearAllAppData();
      dispatch(categoriesReplaced(seedCategories));
      dispatch(productsReplaced(seedProducts));
      dispatch(ordersReplaced([]));
      dispatch(settingsReplaced(defaultSettings));
      showSuccess('تم حذف جميع البيانات');
    } catch (err) {
      showError('حدث خطأ أثناء حذف البيانات');
    } finally {
      setDeleteAllOpen(false);
      setConfirmText('');
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl">
      <Section icon={Store} title="معلومات المطعم">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">اسم المطعم</span>
            <input
              className={inputClass}
              value={form.restaurantName}
              onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">رقم الهاتف</span>
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">العنوان</span>
            <input
              className={inputClass}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">رسالة الفاتورة</span>
            <input
              className={inputClass}
              value={form.invoiceMessage}
              onChange={(e) => setForm({ ...form, invoiceMessage: e.target.value })}
            />
          </label>
        </div>
        <button
          onClick={saveInfo}
          className="mt-4 rounded-xl bg-brand-500 px-5 py-2.5 font-bold text-white hover:bg-brand-600"
        >
          حفظ التغييرات
        </button>
      </Section>

      <Section icon={Palette} title="المظهر">
        <div className="flex gap-3">
          <button
            onClick={() => dispatch(themeSet('light'))}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 font-bold ${
              settings.theme === 'light'
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300'
            }`}
          >
            <Sun size={17} />
            الوضع الفاتح
          </button>
          <button
            onClick={() => dispatch(themeSet('dark'))}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 font-bold ${
              settings.theme === 'dark'
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300'
            }`}
          >
            <Moon size={17} />
            الوضع الداكن
          </button>
        </div>
      </Section>

      <Section icon={Receipt} title="إعدادات الفاتورة">
        <div className="space-y-3">
          <ToggleRow
            label="إظهار اسم المطعم"
            checked={settings.receipt.showName}
            onChange={(v) => dispatch(receiptSettingsUpdated({ showName: v }))}
          />
          <ToggleRow
            label="إظهار رقم الهاتف"
            checked={settings.receipt.showPhone}
            onChange={(v) => dispatch(receiptSettingsUpdated({ showPhone: v }))}
          />
          <ToggleRow
            label="إظهار العنوان"
            checked={settings.receipt.showAddress}
            onChange={(v) => dispatch(receiptSettingsUpdated({ showAddress: v }))}
          />
          <label className="block pt-1">
            <span className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
              رسالة أسفل الفاتورة
            </span>
            <input
              className={inputClass}
              value={settings.receipt.footerMessage}
              onChange={(e) => dispatch(receiptSettingsUpdated({ footerMessage: e.target.value }))}
            />
          </label>
        </div>
      </Section>

      <Section icon={Lock} title="قفل الكاشير (اختياري)">
        <p className="mb-3 text-sm text-stone-500 dark:text-stone-400">
          حدد رقمًا سريًا محليًا لحماية شاشة الكاشير. اتركه فارغًا لإلغاء القفل.
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            inputMode="numeric"
            className={`${inputClass} max-w-40`}
            placeholder="مثال: 1234"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
          />
          <button
            onClick={savePin}
            className="rounded-xl bg-brand-500 px-5 py-2.5 font-bold text-white hover:bg-brand-600"
          >
            حفظ
          </button>
        </div>
      </Section>

      <Section icon={Database} title="إدارة البيانات">
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 dark:border-stone-700 py-3 font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            <Download size={17} />
            تصدير البيانات
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-stone-300 dark:border-stone-700 py-3 font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            <Upload size={17} />
            استيراد البيانات
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
        <p className="mt-3 text-xs text-stone-400">
          "تصدير البيانات" ينشئ نسخة احتياطية بصيغة JSON تشمل المنتجات والتصنيفات والطلبات والإعدادات. يمكنك
          استخدام نفس الملف لاحقًا لاستعادة البيانات على هذا الجهاز أو جهاز آخر.
        </p>

        <div className="mt-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
          <p className="mb-3 text-sm font-bold text-red-700 dark:text-red-400">منطقة الخطر</p>
          <button
            onClick={() => setDeleteAllOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-bold text-white hover:bg-red-700"
          >
            <Trash2 size={17} />
            حذف جميع البيانات
          </button>
        </div>
      </Section>

      {/* Import confirmation */}
      <ConfirmDialog
        open={!!importPayload}
        onClose={() => setImportPayload(null)}
        onConfirm={confirmImport}
        title="استعادة النسخة الاحتياطية"
        message="سيؤدي الاستيراد إلى استبدال جميع البيانات الحالية (المنتجات، التصنيفات، الطلبات، الإعدادات). هل تريد المتابعة؟"
        confirmLabel="استيراد واستبدال"
        danger={false}
      />

      {/* Delete all confirmation */}
      <DeleteAllDialog
        open={deleteAllOpen}
        onClose={() => {
          setDeleteAllOpen(false);
          setConfirmText('');
        }}
        confirmText={confirmText}
        setConfirmText={setConfirmText}
        onConfirm={handleDeleteAll}
      />
    </div>
  );
}

function DeleteAllDialog({ open, onClose, confirmText, setConfirmText, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 p-0 sm:p-4">
      <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white dark:bg-stone-900 shadow-2xl p-5">
        <h2 className="mb-2 text-lg font-bold text-red-600">حذف جميع البيانات</h2>
        <p className="mb-4 text-sm text-stone-600 dark:text-stone-300">
          سيتم حذف جميع المنتجات والتصنيفات والطلبات نهائيًا واستعادة القيم المبدئية. هذا الإجراء لا يمكن
          التراجع عنه. اكتب كلمة <strong>"حذف"</strong> للتأكيد.
        </p>
        <input
          className={inputClass}
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="اكتب: حذف"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 py-2.5 font-medium hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmText !== 'حذف'}
            className="flex-1 rounded-xl bg-red-600 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            حذف نهائيًا
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-stone-300 accent-brand-500"
      />
    </label>
  );
}
