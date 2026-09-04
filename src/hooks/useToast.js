import { useCallback } from 'react';
import { useAppDispatch } from '../app/hooks';
import { toastShown } from '../features/ui/uiSlice';

export function useToast() {
  const dispatch = useAppDispatch();

  const showSuccess = useCallback(
    (message) => dispatch(toastShown({ message, type: 'success' })),
    [dispatch]
  );
  const showError = useCallback(
    (message) => dispatch(toastShown({ message, type: 'error' })),
    [dispatch]
  );
  const showInfo = useCallback(
    (message) => dispatch(toastShown({ message, type: 'info' })),
    [dispatch]
  );

  return { showSuccess, showError, showInfo };
}
