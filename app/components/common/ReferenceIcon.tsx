import type { HTMLAttributes } from 'react';

export type ReferenceIconName = 'heart' | 'eye' | 'arrows-repeat' | 'shopping-basket' | 'shopping-cart' | 'user' | 'search' | 'apps' | 'phone-call' | 'envelope' | 'angle-small-down' | 'cross' | 'angle-small-left' | 'angle-small-right' | 'star';

/** The exact rounded icon family bundled with the reference, served locally. */
export function ReferenceIcon({ name, className = '', ...props }: HTMLAttributes<HTMLSpanElement> & { name: ReferenceIconName }) {
  return <span {...props} className={`ref-icon ref-icon--${name} ${className}`} aria-hidden="true" />;
}
