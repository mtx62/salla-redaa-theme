import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { useScrollLock } from '../../hooks/useScrollLock';
import { ReferenceIcon } from '../common/ReferenceIcon';

export function ProductOverlay({ title, onClose, children, className = '' }: {
  title: string; onClose: () => void; children: ReactNode; className?: string;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  useScrollLock(true);
  useDialogFocus(ref, true);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [onClose]);
  return createPortal(
    <div className="gs-product-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={`gs-product-dialog ${className}`}>
        <div className="gs-product-dialog__header">
        <span className="gs-product-dialog__title">{title}</span>
        <button type="button" className="gs-product-dialog__close" onClick={onClose} aria-label={t('blocks.header.close', 'Close')}>
          <ReferenceIcon name="cross" />
        </button>
        </div>
        <div className="gs-product-dialog__body">{children}</div>
      </div>
    </div>, document.body
  );
}
