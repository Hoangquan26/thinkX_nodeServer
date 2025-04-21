import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 10 request trong thời gian đó
  message: "Bạn đang gửi quá nhiều yêu cầu. Vui lòng thử lại sau.",
  
});