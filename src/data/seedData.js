// Initial seed data for a fresh installation of the POS.
// Prices are reasonable defaults (EGP) and fully editable from product management.

export const seedCategories = [
  { id: 'cat-foul', name: 'فول', order: 1, active: true, createdAt: Date.now() },
  { id: 'cat-taameya', name: 'طعمية', order: 2, active: true, createdAt: Date.now() },
  { id: 'cat-sandwich', name: 'ساندوتشات', order: 3, active: true, createdAt: Date.now() },
  { id: 'cat-meals', name: 'وجبات', order: 4, active: true, createdAt: Date.now() },
  { id: 'cat-potato', name: 'بطاطس', order: 5, active: true, createdAt: Date.now() },
  { id: 'cat-extras', name: 'إضافات', order: 6, active: true, createdAt: Date.now() },
  { id: 'cat-drinks', name: 'مشروبات', order: 7, active: true, createdAt: Date.now() },
  { id: 'cat-other', name: 'أخرى', order: 8, active: true, createdAt: Date.now() },
];

const now = Date.now();
let counter = 0;
const p = (name, price, categoryId, description = '') => {
  counter += 1;
  return {
    id: `prod-${counter}`,
    name,
    price,
    categoryId,
    description,
    available: true,
    createdAt: now,
    updatedAt: now,
  };
};

export const seedProducts = [
  // فول
  p('فول عادي', 15, 'cat-foul'),
  p('فول بالزيت', 18, 'cat-foul'),
  p('فول بالبيض', 22, 'cat-foul'),
  p('فول بالطحينة', 20, 'cat-foul'),
  p('فول إسكندراني', 25, 'cat-foul'),

  // طعمية
  p('ساندوتش طعمية', 10, 'cat-taameya'),
  p('طعمية عادي', 15, 'cat-taameya'),
  p('طعمية بالبيض', 20, 'cat-taameya'),
  p('طبق طعمية', 22, 'cat-taameya'),

  // ساندوتشات
  p('ساندوتش فول', 12, 'cat-sandwich'),
  p('ساندوتش طعمية', 10, 'cat-sandwich'),
  p('ساندوتش بطاطس', 12, 'cat-sandwich'),
  p('ساندوتش بيض', 14, 'cat-sandwich'),

  // وجبات
  p('وجبة فول وطعمية', 35, 'cat-meals', 'فول، طعمية، سلطة، عيش'),
  p('وجبة مشكل كبيرة', 45, 'cat-meals', 'فول، طعمية، بيض، بطاطس'),

  // بطاطس
  p('بطاطس محمرة', 20, 'cat-potato'),
  p('بطاطس بالجبنة', 28, 'cat-potato'),

  // إضافات
  p('بيضة', 8, 'cat-extras'),
  p('جبنة', 10, 'cat-extras'),
  p('طحينة', 5, 'cat-extras'),
  p('مخلل', 3, 'cat-extras'),
  p('سلطة', 5, 'cat-extras'),
  p('شطة', 2, 'cat-extras'),

  // مشروبات
  p('مياه', 5, 'cat-drinks'),
  p('شاي', 8, 'cat-drinks'),
  p('شاي بالنعناع', 10, 'cat-drinks'),
  p('مشروب غازي', 12, 'cat-drinks'),
];

export const quickNotes = ['بدون شطة', 'زيادة طحينة', 'بدون مخلل', 'زيادة سلطة'];

export const defaultSettings = {
  restaurantName: 'فول وطعمية الأصيل',
  phone: '01000000000',
  address: 'القاهرة، مصر',
  invoiceMessage: 'شكرًا لزيارتكم، بالهنا والشفا',
  theme: 'light',
  receipt: {
    showName: true,
    showPhone: true,
    showAddress: true,
    footerMessage: 'يسعدنا خدمتكم دائمًا',
  },
  pin: null,
};
