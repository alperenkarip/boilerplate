// Root layout — tum sayfalari sarar
import { Outlet } from 'react-router-dom';
import { ScreenContainer } from '@project/ui';

// @MX:ANCHOR: [AUTO] Shared layout wrapping every protected route via <Outlet/>; the single app-shell container contract for all authenticated screens.
// @MX:REASON: Shared layout component (fan_in=1: router.tsx) but renders on every protected route; changes here affect the whole app shell. Strong anchor per shared-layout rule.
export function RootLayout() {
  return (
    <ScreenContainer>
      <Outlet />
    </ScreenContainer>
  );
}
