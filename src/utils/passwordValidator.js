/**
 * Validates a password against security requirements
 *
 * Requirements:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 *
 * @param {string} password - The password to validate
 * @returns {object} Validation result with success flag and error message
 */
export default function validatePassword(password) {
  // Define validation criteria using regular expressions
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Check if password meets all criteria
  if (password.length < minLength) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (!hasUpperCase) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  if (!hasLowerCase) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  if (!hasNumbers) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      error: "Password must contain at least one special character",
    };
  }

  // If all checks pass
  return {
    isValid: true,
    error: null,
  };
}

// Example usage:
// const result = validatePassword("Weak");
// console.log(result); // { isValid: false, error: "Password must be at least 8 characters long" }
//
// const result2 = validatePassword("StrongP@ss1");
// console.log(result2); // { isValid: true, error: null }
