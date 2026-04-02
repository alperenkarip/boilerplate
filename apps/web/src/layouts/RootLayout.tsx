// Root layout — tum sayfalari sarar
import { Outlet } from 'react-router-dom';
import { ScreenContainer } from '@project/ui';

export function RootLayout() {
  return (
    <ScreenContainer>
      <Outlet />
    </ScreenContainer>
  );
}
