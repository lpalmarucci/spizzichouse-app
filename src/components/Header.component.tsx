import React, { useState } from 'react';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Tab,
  Tabs,
  User,
} from '@nextui-org/react';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes/common.routes';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { getInitialLetters } from '../shared/utils';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const signOut = useSignOut();
  const userData = useAuthUser()();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState<string>(
    window.location.pathname,
  );

  //If i don't have the user data, it means that i'm not logged in anymore
  if (!userData) {
    navigate(ROUTES.Login);
    return;
  }

  function handleLogout() {
    if (signOut()) {
      navigate(ROUTES.Login);
    }
  }

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="mb-0 sm:mb-10"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={() => navigate(ROUTES.Dashboard)}
        >
          {t('appName').toUpperCase()}
        </p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Tabs
          variant="light"
          size="lg"
          selectedKey={selectedKey}
          onSelectionChange={(key) => {
            setSelectedKey(key.toString());
            navigate(key.toString());
          }}
        >
          <Tab key={ROUTES.Dashboard} title={t('menu.dashboard')} />
          <Tab key={ROUTES.Players} title={t('menu.players')} />
        </Tabs>
      </NavbarContent>

      <NavbarContent as="div" className="invisible sm:visible" justify="end">
        <Dropdown placement="bottom-end" showArrow>
          <DropdownTrigger>
            <User
              name={`${userData?.firstname} ${userData?.lastname}`}
              description={`@${userData?.username}`}
              className="cursor-pointer"
              avatarProps={{
                name: getInitialLetters(
                  userData?.firstname,
                  userData?.lastname,
                ),
              }}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions">
            <DropdownSection title="Actions">
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                onClick={handleLogout}
              >
                {t('buttons.logout')}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu>
        {Object.entries(ROUTES).map(([key, value]) => (
          <NavbarMenuItem key={value}>
            <Link className="w-full" href="#" size="lg">
              {key}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
