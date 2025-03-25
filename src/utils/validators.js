export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!';


export const FIELD_REQUIRED_MESSAGE = 'This field is required.';

export const USERNAME_RULE = /^[0-9a-fA-F]{8,256}$/;
export const USERNAME_RULE_MESSAGE = 'Your username must at leat 8 characters';

// ✅ Email validation rule
export const EMAIL_RULE = /^\S+@\S+\.\S+$/;
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@example.com)';

// ✅ Password validation rule: 
// - Ít nhất 1 chữ cái, 1 số, 
// - Độ dài từ 8 đến 256 ký tự
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/;
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.';
