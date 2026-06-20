import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface ProductCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick" | "title"> {
  title: React.ReactNode;
  price: React.ReactNode;
  /** Strikethrough original price when on sale. */
  originalPrice?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  /** Short subtitle / category. */
  subtitle?: React.ReactNode;
  /** Rating 0–5. */
  rating?: number;
  reviewCount?: number;
  /** Corner badge, e.g. "Sale". */
  badge?: string;
  outOfStock?: boolean;
  addToCartLabel?: string;
  onAddToCart?: () => void;
  onClick?: () => void;
}

/** Storefront product tile with image, price, rating and add-to-cart. */
export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(function ProductCard(
  {
    title,
    price,
    originalPrice,
    image,
    imageAlt = "",
    subtitle,
    rating,
    reviewCount,
    badge,
    outOfStock,
    addToCartLabel = "Add to cart",
    onAddToCart,
    onClick,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-ProductCard", className)} data-out={outOfStock || undefined} {...rest}>
      <div className="msr-ProductCard__media" onClick={onClick} role={onClick ? "button" : undefined}>
        {image ? (
          <img src={image} alt={imageAlt} className="msr-ProductCard__img" />
        ) : (
          <div className="msr-ProductCard__placeholder" aria-hidden="true">
            <Icon name="file" size={28} />
          </div>
        )}
        {badge && <span className="msr-ProductCard__badge">{badge}</span>}
        {outOfStock && <span className="msr-ProductCard__stock">Out of stock</span>}
      </div>

      <div className="msr-ProductCard__body">
        {subtitle && <div className="msr-ProductCard__subtitle">{subtitle}</div>}
        <div className="msr-ProductCard__title" onClick={onClick} role={onClick ? "button" : undefined}>
          {title}
        </div>

        {typeof rating === "number" && (
          <div className="msr-ProductCard__rating" aria-label={`Rated ${rating} of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="star" size={14} className={cx(i < Math.round(rating) && "is-filled")} />
            ))}
            {typeof reviewCount === "number" && (
              <span className="msr-ProductCard__reviews">({reviewCount})</span>
            )}
          </div>
        )}

        <div className="msr-ProductCard__footer">
          <div className="msr-ProductCard__price">
            <span className="msr-ProductCard__amount">{price}</span>
            {originalPrice && <span className="msr-ProductCard__original">{originalPrice}</span>}
          </div>
          <button
            type="button"
            className="msr-ProductCard__add"
            disabled={outOfStock}
            aria-label={addToCartLabel}
            onClick={onAddToCart}
          >
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});
