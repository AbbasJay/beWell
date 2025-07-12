// Public route patterns - shared between AuthenticatedLayout and auth forms
export const publicRoutePatterns = [
  /^\/$/,
  /^\/home$/,
  /^\/explore$/,
  /^\/business\/\d+\/classes$/,
  /^\/business\/\d+\/classes\/\d+$/,
  /^\/business\/\d+\/classes\/all-reviews$/,
  /^\/logIn$/,
  /^\/signUp$/,
];

// Check if a route is public
export const isPublicRoute = (route: string): boolean => {
  return publicRoutePatterns.some((pattern) => pattern.test(route));
};

// Basic public routes (for simple string matching)
export const basicPublicRoutes = [
  "/",
  "/home",
  "/explore",
  "/logIn",
  "/signUp",
];

// Check if a route is a business route (which are public)
export const isBusinessRoute = (route: string): boolean => {
  return (
    /^\/business\/\d+\/classes$/.test(route) ||
    /^\/business\/\d+\/classes\/\d+$/.test(route) ||
    /^\/business\/\d+\/classes\/all-reviews$/.test(route)
  );
};

// Combined check for public routes (includes both basic and business routes)
export const isPublicRouteCombined = (route: string): boolean => {
  return basicPublicRoutes.includes(route) || isBusinessRoute(route);
};
