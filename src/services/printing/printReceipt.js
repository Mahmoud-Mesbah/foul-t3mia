import { formatMoney, formatDateAr, formatTimeAr } from '../../utils/helpers';

const PAYMENT_LABELS = {
  cash: 'نقدي',
  card: 'بطاقة',
  wallet: 'محفظة إلكترونية',
};

// Opens a dedicated print window sized for common 80mm thermal receipt
// printers, then triggers the browser's native print dialog. This keeps
// printing fully offline (no external assets, no network calls).
export function printReceipt(order, settings) {
  const win = window.open('', '_blank', 'width=380,height=600');
  if (!win) {
    alert('الرجاء السماح بفتح النوافذ المنبثقة لطباعة الفاتورة');
    return;
  }

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td class="name">${escapeHtml(item.name)}${item.note ? `<div class="note">${escapeHtml(item.note)}</div>` : ''}</td>
        <td class="qty">${item.quantity}</td>
        <td class="price">${formatMoney(item.price * item.quantity)}</td>
      </tr>`
    )
    .join('');

  win.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8" />
      <title>فاتورة ${escapeHtml(order.orderNumber)}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Tahoma', 'Segoe UI', sans-serif;
          width: 80mm;
          margin: 0 auto;
          padding: 8px;
          color: #000;
          font-size: 13px;
        }
        h1 { font-size: 16px; text-align: center; margin: 4px 0; }
        .center { text-align: center; }
        .muted { color: #444; font-size: 11px; }
        hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: right; font-size: 11px; border-bottom: 1px solid #000; padding-bottom: 4px; }
        td { padding: 4px 0; vertical-align: top; }
        td.qty { text-align: center; width: 15%; }
        td.price { text-align: left; width: 30%; }
        .note { font-size: 10px; color: #555; }
        .totals td { padding: 2px 0; }
        .totals .label { text-align: right; }
        .totals .value { text-align: left; font-weight: bold; }
        .grand { font-size: 15px; font-weight: bold; }
        footer { text-align: center; margin-top: 10px; font-size: 11px; }
        @media print {
          @page { margin: 0; }
          body { width: 80mm; }
        }
      </style>
    </head>
    <body>
      ${settings.receipt?.showName !== false ? `<h1>${escapeHtml(settings.restaurantName)}</h1>` : ''}
      <div class="center muted">
        ${settings.receipt?.showAddress !== false && settings.address ? `<div>${escapeHtml(settings.address)}</div>` : ''}
        ${settings.receipt?.showPhone !== false && settings.phone ? `<div>${escapeHtml(settings.phone)}</div>` : ''}
      </div>
      <hr />
      <div>رقم الطلب: <strong>${escapeHtml(order.orderNumber)}</strong></div>
      <div class="muted">${formatDateAr(order.createdAt)} - ${formatTimeAr(order.createdAt)}</div>
      <hr />
      <table>
        <thead>
          <tr><th>المنتج</th><th class="qty">الكمية</th><th class="price">الإجمالي</th></tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
      <hr />
      <table class="totals">
        <tr><td class="label">المجموع الفرعي</td><td class="value">${formatMoney(order.subtotal)}</td></tr>
        <tr><td class="label">الخصم</td><td class="value">${formatMoney(order.discount)}</td></tr>
        <tr class="grand"><td class="label">الإجمالي</td><td class="value">${formatMoney(order.total)}</td></tr>
        <tr><td class="label">طريقة الدفع</td><td class="value">${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</td></tr>
        ${order.paymentMethod === 'cash' ? `
        <tr><td class="label">المدفوع</td><td class="value">${formatMoney(order.paidAmount)}</td></tr>
        <tr><td class="label">الباقي</td><td class="value">${formatMoney(order.change)}</td></tr>` : ''}
      </table>
      <hr />
      <footer>
        ${settings.invoiceMessage ? `<div>${escapeHtml(settings.invoiceMessage)}</div>` : ''}
        ${settings.receipt?.footerMessage ? `<div>${escapeHtml(settings.receipt.footerMessage)}</div>` : ''}
      </footer>
      <script>
        window.onload = function () {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  win.document.close();
}

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
