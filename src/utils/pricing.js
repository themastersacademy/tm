// utils/pricing.js
export function calculatePriceBreakdownWithCoupon(
  priceWithTax,
  planDiscountPercent,
  taxPercent,
  coupon = null
) {
  // Ensure all inputs are numbers — DB may store strings
  const price = Number(priceWithTax) || 0;
  const discount = Number(planDiscountPercent) || 0;
  const taxRate = Number(taxPercent) / 100;
  const planRate = discount / 100;

  // Helper to round to two decimals
  const roundTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

  // 1) Remove tax to get base price
  const actualPriceRaw = price / (1 + taxRate);
  const actualPrice = roundTwo(actualPriceRaw);

  // 2) Plan discount off the base
  const planDiscountRaw = actualPriceRaw * planRate;
  const planDiscount = roundTwo(planDiscountRaw);
  const priceAfterPlanDiscountRaw = actualPriceRaw - planDiscountRaw;
  const priceAfterPlanDiscount = roundTwo(priceAfterPlanDiscountRaw);

  // 3) Coupon logic
  let couponDiscountRaw = 0;
  if (coupon) {
    const meetsMin =
      coupon.minOrderAmount == null || actualPriceRaw >= coupon.minOrderAmount;

    if (meetsMin) {
      const discountVal = Number(coupon.discountValue) || 0;
      if (coupon.discountType === "PERCENTAGE") {
        couponDiscountRaw =
          priceAfterPlanDiscountRaw * (discountVal / 100);
        if (
          coupon.maxDiscountPrice != null &&
          couponDiscountRaw > Number(coupon.maxDiscountPrice)
        ) {
          couponDiscountRaw = Number(coupon.maxDiscountPrice);
        }
      } else if (coupon.discountType === "FIXED") {
        couponDiscountRaw = discountVal;
      }
      couponDiscountRaw = Math.min(
        couponDiscountRaw,
        priceAfterPlanDiscountRaw
      );
    }
  }
  const couponDiscount = roundTwo(couponDiscountRaw);
  const priceAfterCouponRaw = priceAfterPlanDiscountRaw - couponDiscountRaw;
  const priceAfterCoupon = roundTwo(priceAfterCouponRaw);

  // 4) Re-apply tax
  const taxAmountRaw = priceAfterCouponRaw * taxRate;
  const taxAmount = roundTwo(taxAmountRaw);
  const totalPrice = roundTwo(priceAfterCouponRaw + taxAmountRaw);

  return {
    actualPrice,
    planDiscount,
    priceAfterPlanDiscount,
    couponDiscount,
    priceAfterCoupon,
    taxAmount,
    totalPrice,
    isMinOrderMet: coupon
      ? coupon.minOrderAmount == null || actualPriceRaw >= coupon.minOrderAmount
      : true,
    minOrderAmount: coupon?.minOrderAmount,
  };
}
