import React, { useEffect, useState } from 'react';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Switch,
  Tab,
  Tabs,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes/common.routes';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from 'react-auth-kit';
import { useTheme } from '../context/Theme.context.tsx';
import { SunIcon } from '../icons/SunIcon.tsx';
import { MoonIcon } from '../icons/MoonIcon.tsx';
import useLocalStorage from '../hooks/useLocalStorage.tsx';
import { LocalStorageKeys } from '../costants/localStorage.ts';
import UserMenu from './UserMenu.component.tsx';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const userData = useAuthUser()();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [storedValue, saveValueToLocalStorage] = useLocalStorage<string>(
    LocalStorageKeys.LAST_VISITED_PAGE,
    ROUTES.Dashboard,
  );
  const [selectedKey, setSelectedKey] = useState<string>(storedValue);

  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/' && !path.includes(selectedKey)) {
      const parentRoute = path.split('/').at(1);
      setSelectedKey(`/${parentRoute}`);
    }
  }, []);

  //If i don't have the user data, it means that i'm not logged in anymore
  if (!userData) {
    navigate(ROUTES.Login);
    return;
  }

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      classNames={{
        wrapper: 'max-w-7xl',
      }}
      className="mb-0 sm:mb-10"
    >
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>
      <NavbarBrand>
        <div className="text-2xl font-extrabold">
          <p
            className="cursor-pointer select-none text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500"
            onClick={() => {
              saveValueToLocalStorage(ROUTES.Dashboard);
              setSelectedKey(ROUTES.Dashboard);
              navigate(ROUTES.Dashboard);
            }}
          >
            {t('appName').toUpperCase()}
          </p>
        </div>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <Tabs
          variant="light"
          size="lg"
          selectedKey={selectedKey}
          onSelectionChange={(key) => {
            saveValueToLocalStorage(key.toString());
            setSelectedKey(key.toString());
            navigate(key.toString());
          }}
        >
          <Tab key={ROUTES.Dashboard} title={t('menu.dashboard')} />
          <Tab key={ROUTES.Players} title={t('menu.players')} />
          <Tab key={ROUTES.Locations} title={t('menu.locations')} />
          <Tab key={ROUTES.Matches} title={t('menu.matches')} />
        </Tabs>
      </NavbarContent>
      <NavbarContent
        as="div"
        className="gap-0 md:gap-3 lg:gap-10"
        justify="end"
      >
        <UserMenu />
        <Switch
          size="md"
          color="primary"
          isSelected={theme === 'dark'}
          onChange={() => toggleTheme()}
          startContent={<SunIcon />}
          endContent={<MoonIcon />}
        ></Switch>
      </NavbarContent>
      <NavbarMenu>
        {Object.entries(ROUTES)
          .filter(([key]) => key.toLowerCase() !== 'login')
          .map(([key, value]) => (
            <NavbarMenuItem key={value}>
              <Link className="w-full" href={value} size="lg">
                {key}
              </Link>
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
