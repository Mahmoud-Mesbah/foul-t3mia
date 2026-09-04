import { useState } from 'react';
import Modal from '../common/Modal';
import { quickNotes } from '../../data/seedData';

export default function NoteEditorModal({ open, onClose, initialNote, onSave, productName }) {
  const [note, setNote] = useState(initialNote || '');

  const toggleChip = (chip) => {
    const parts = note
      .split('،')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.includes(chip)) {
      setNote(parts.filter((p) => p !== chip).join('، '));
    } else {
      setNote([...parts, chip].join('، '));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`ملاحظات: ${productName || ''}`}
      maxWidth="max-w-sm"
      footer={
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-300 dark:border-stone-700 py-2.5 font-medium hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              onSave(note.trim());
              onClose();
            }}
            className="flex-1 rounded-xl bg-brand-500 py-2.5 font-bold text-white hover:bg-brand-600"
          >
            حفظ الملاحظة
          </button>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {quickNotes.map((chip) => {
          const active = note.split('،').map((s) => s.trim()).includes(chip);
          return (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="اكتب ملاحظة مخصصة..."
        className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
      />
    </Modal>
  );
}
