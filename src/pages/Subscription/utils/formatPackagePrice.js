export function formatBdt(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "০";
  return Number(amount).toLocaleString("bn-BD");
}

export function getSavingsLabel(pkg) {
  if (!pkg) return null;

  if (pkg.price === 0 && pkg.originalPrice > 0) {
    return "ফ্রি";
  }

  if (!pkg.discount || pkg.price === pkg.originalPrice) {
    return null;
  }

  if (pkg.discount.discountType === "Percentage") {
    return `${pkg.discount.value}% ছাড়`;
  }

  return `${formatBdt(pkg.discount.value)}৳ ছাড়`;
}

export function hasDiscount(pkg) {
  return (
    pkg.price !== pkg.originalPrice &&
    (pkg.discount || pkg.price === 0)
  );
}
