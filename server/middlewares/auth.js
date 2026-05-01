import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = req.auth(); // ✅ FIX (no await)

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let hasPremiumPlan = false;

    try {
      hasPremiumPlan = await has({ plan: "premium" });
    } catch {
      hasPremiumPlan = false;
    }

    const user = await clerkClient.users.getUser(userId);

    const currentUsage = user.privateMetadata?.free_usage || 0;

    if (!hasPremiumPlan) {
      req.free_usage = currentUsage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};