import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Global URL listener that captures referral coupon codes
 * e.g., ?coupon=CODE or ?ref=CODE across all landing pages
 * and persists them in sessionStorage/localStorage for checkout prefill.
 */
export default function AffiliateCouponListener() {
  const location = useLocation();

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const couponParam = searchParams.get("coupon") || searchParams.get("ref");
      if (couponParam && couponParam.trim()) {
        const cleanCoupon = couponParam.trim().toUpperCase();
        sessionStorage.setItem("sp_affiliate_coupon", cleanCoupon);
        localStorage.setItem("sp_affiliate_coupon", cleanCoupon);
      }
    } catch (e) {
      console.warn("Failed to capture coupon from URL:", e);
    }
  }, [location.search]);

  return null;
}
