/**
 * Analytics timing / milestone constants
 */

/** Scroll depth percentages fired once per page path */
export const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 90, 100] as const;

/** Time-on-page thresholds in seconds, fired once per page path */
export const TIME_ON_PAGE_THRESHOLDS_SECONDS = [30, 60, 120] as const;

export type ScrollDepthMilestone = (typeof SCROLL_DEPTH_MILESTONES)[number];

/** `method` parameter of the GA4 sign_up event */
export const SIGN_UP_METHODS = {
  EMAIL: 'email',
  GOOGLE: 'google',
} as const;

export type SignUpMethod = (typeof SIGN_UP_METHODS)[keyof typeof SIGN_UP_METHODS];
