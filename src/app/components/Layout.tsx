import { Outlet } from 'react-router';
import { useUniverse } from '../context/UniverseContext';
import { RoleSwitcher } from './RoleSwitcher';

function LayoutContent() {
  const { categoria } = useUniverse();

  return (
    <div className="universe-background min-h-screen" data-category={categoria}>
      <div className="relative z-10">
        <Outlet />
      </div>
      <RoleSwitcher />
    </div>
  );
}

export function Layout() {
  return <LayoutContent />;
}