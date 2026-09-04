import { useMemo, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAvailableProducts } from '../../features/products/productsSlice';
import { selectActiveCategories } from '../../features/categories/categoriesSlice';
import {
  itemAdded,
  selectCartItems,
  selectCartTotal,
  selectCartTotalQuantity,
  selectCartSubtotal,
  selectCartDiscountAmount,
  cartCleared,
} from '../../features/cart/cartSlice';
import { orderCompleted } from '../../features/orders/ordersSlice';
import { useToast } from '../../hooks/useToast';
import CategoryTabs from '../../components/pos/CategoryTabs';
import ProductGrid from '../../components/pos/ProductGrid';
import CartPanel from '../../components/pos/CartPanel';
import PaymentDialog from '../../components/pos/PaymentDialog';
import ReceiptModal from '../../components/pos/ReceiptModal';
import Modal from '../../components/common/Modal';
import { formatMoney } from '../../utils/helpers';

export default function POSPage() {
  const dispatch = useAppDispatch();
  const { showSuccess } = useToast();
  const products = useAppSelector(selectAvailableProducts);
  const categories = useAppSelector(selectActiveCategories);
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartQty = useAppSelector(selectCartTotalQuantity);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscountAmount);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  const cartQuantities = useMemo(() => {
    const map = {};
    cartItems.forEach((item) => {
      map[item.productId] = (map[item.productId] || 0) + item.quantity;
    });
    return map;
  }, [cartItems]);

  const handleAdd = (product) => {
    dispatch(itemAdded({ product }));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setPaymentOpen(true);
    setMobileCartOpen(false);
  };

  const handleConfirmPayment = ({ paymentMethod, paidAmount, change }) => {
    const action = orderCompleted({
      items: cartItems,
      subtotal,
      discount,
      total: cartTotal,
      paymentMethod,
      paidAmount,
      change,
    });
    dispatch(action);
    setPaymentOpen(false);
    setCompletedOrder(action.payload);
    dispatch(cartCleared());
    showSuccess('تم حفظ الطلب بنجاح');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)]">
      <div className="flex flex-1 flex-col min-w-0">
        <CategoryTabs categories={categories} activeId={activeCategory} onSelect={setActiveCategory} />
        <ProductGrid
          products={filteredProducts}
          categoriesById={categoriesById}
          onAdd={handleAdd}
          cartQuantities={cartQuantities}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Desktop cart panel */}
      <div className="hidden lg:block w-96 shrink-0 border-s border-stone-200 dark:border-stone-800">
        <CartPanel onCheckout={handleCheckout} />
      </div>

      {/* Mobile floating cart bar */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setMobileCartOpen(true)}
          className="lg:hidden fixed bottom-20 inset-x-4 z-30 flex items-center justify-between rounded-2xl bg-brand-500 px-5 py-3.5 text-white shadow-xl"
        >
          <span className="flex items-center gap-2 font-bold text-sm">
            <ShoppingCart size={18} />
            {cartQty} منتج
          </span>
          <span className="font-extrabold">{formatMoney(cartTotal)}</span>
        </button>
      )}

      {/* Mobile cart modal */}
      <Modal
        open={mobileCartOpen}
        onClose={() => setMobileCartOpen(false)}
        title="الطلب الحالي"
        maxWidth="max-w-md"
      >
        <div className="-mx-5 -my-4 h-[70vh]">
          <CartPanel onCheckout={handleCheckout} />
        </div>
      </Modal>

      <PaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={cartTotal}
        onConfirm={handleConfirmPayment}
      />

      <ReceiptModal
        open={!!completedOrder}
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onNewOrder={() => setCompletedOrder(null)}
      />
    </div>
  );
}
