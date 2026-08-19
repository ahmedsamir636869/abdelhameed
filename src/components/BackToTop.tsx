/**
 * Back-to-top control. Each page keeps its own class because the page scroll
 * scripts listen for a variant-specific event dispatched from it.
 */

type BackToTopProps = {
  variant: 'home' | 'about' | 'products' | 'manufacturing' | 'contact' | 'quote';
};

const LABELS: Record<BackToTopProps['variant'], string> = {
  home: 'Back to top',
  about: 'Back to top',
  products: 'Back to top of Products page',
  manufacturing: 'Back to top',
  contact: 'Back to top',
  quote: 'Back to top',
};

export function BackToTop({ variant }: BackToTopProps) {
  return (
    <button
      type="button"
      className={`${variant}-back-to-top`}
      aria-label={LABELS[variant]}
      title="Back to top"
    >
      <span aria-hidden="true">&#8593;</span>
    </button>
  );
}
