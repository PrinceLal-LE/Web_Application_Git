/**
 * Validates a full name to ensure it contains only alphanumeric characters and spaces.
 * @param {string} name - The full name string to validate.
 * @returns {string} An error message if invalid, otherwise an empty string.
 */

export const validateFullName = (name) => {
    // Regex: Allows letters (a-z, A-Z), numbers (0-9), and spaces.
    // The ^ and $ ensure the entire string matches the pattern.
    const nameRegex = /^[a-zA-Z ]*$/;

    if (!nameRegex.test(name)) {
        return 'Full Name cannot contain special characters.';
    }
    if (name.trim() === '') {
        return 'Full Name cannot be empty.'; // Basic check for empty string after trimming spaces
    }
    // Add other name specific validations here (e.g., minimum length, max length)
    if (name.length < 3) {
        return 'Full Name must be at least 3 characters long.';
    }

    return ''; // Return an empty string if valid
};

/**
 * Validates a username (similar to full name but without spaces)
 * @param {string} username - The username to validate
 * @returns {string} An error message if invalid
 */
export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]*$/;

    if (!usernameRegex.test(username)) {
        return 'Username cannot contain special characters or spaces.';
    }
    if (username.trim() === '') {
        return 'Username cannot be empty.';
    }
    if (username.length < 3) {
        return 'Username must be at least 3 characters long.';
    }
    return '';
};



/**
 * Validates an email address.
 * @param {string} email - The email string to validate.
 * @returns {string} An error message if invalid, otherwise an empty string.
 */
export const validateEmail = (email) => {
    // A common regex for email validation (can be more complex depending on requirements)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
};

/**
 * Validates a password.
 * @param {string} password - The password string to validate.
 * @returns {string} An error message if invalid, otherwise an empty string.
 */
export const validatePassword = (password) => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
    }
    // Add more complex password rules (e.g., requires uppercase, number, special char)
    // const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!strongPasswordRegex.test(password)) {
    //     return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    // }
    return '';
};

/**
 * Validates a mobile number (basic international format)
 * @param {string} mobile - The mobile number to validate
 * @returns {string} An error message if invalid
 */
export const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10,15}$/;

    if (!mobileRegex.test(mobile)) {
        return 'Please enter a valid mobile number (10-15 digits)';
    }
    return '';
};

/**
 * Validates that two passwords match.
 * @param {string} password - The first password.
 * @param {string} confirmPassword - The second password (confirmation).
 * @returns {string} An error message if they don't match, otherwise an empty string.
 */
export const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        return 'Passwords do not match.';
    }
    return '';
};