interface WishlistHeartButtonProps {
  productId: number;
  className: string;
  ariaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
}

/** `SallaButton`'s icon markup, but keeping `data-id` like Twig's `<salla-button>`: wishlist apps find the heart by it. */
export function WishlistHeartButton({
  productId,
  className,
  ariaLabel,
  onClick,
  disabled,
  pressed,
}: WishlistHeartButtonProps) {
  return (
    <div className="s-button-wrap">
      <button
        type="button"
        className={`s-button-element s-button-icon s-button-outline s-button-light-outline s-button-loader-center ${className}`}
        data-id={productId}
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={disabled}
        aria-pressed={pressed}
      >
        <span className="s-button-text">
          <i className="sicon-heart" />
        </span>
      </button>
    </div>
  );
}
