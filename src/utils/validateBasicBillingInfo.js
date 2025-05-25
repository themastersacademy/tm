/**
 * Validates basic billing info and throws an error if invalid.
 * @param {Object} info - The billing info to validate.
 */
export function validateBasicBillingInfo(info) {
  const errors = [];

    if (!info || typeof info !== "object") {
      throw new Error("Billing info must be a valid object.");
    }
  
    if (!info.firstName || typeof info.firstName !== "string") {
      errors.push("First name is required.");
    }
  
    if (!info.lastName || typeof info.lastName !== "string") {
      errors.push("Last name is required.");
    }
  
    if (!info.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
      errors.push("A valid email address is required.");
    }
  
    if (!info.phone || !/^\d{10}$/.test(info.phone)) {
      errors.push("A valid 10-digit phone number is required.");
    }
  
    if (!info.address || typeof info.address !== "string") {
      errors.push("Address is required.");
    }
  
    if (!info.city || typeof info.city !== "string") {
      errors.push("City is required.");
    }
  
    if (!info.state || typeof info.state !== "string") {
      errors.push("State is required.");
    }
  
    if (!info.zip || !/^\d{5,6}$/.test(info.zip)) {
      errors.push("A valid ZIP code (5-6 digits) is required.");
    }
  
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  }
  