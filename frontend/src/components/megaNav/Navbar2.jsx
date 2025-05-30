// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Group,
  Button,
  Menu,
  Burger,
  Drawer,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import CategoriesMenu from "./CategoriesMenu";
import ManufacturerMenu from "./ManufacturerMenu";
import { ChevronDownSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const theme = useMantineTheme();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const { user, getUserRole, getEmailFromUser } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const adminEmail = "hajrawajda52@gmail.com";
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const role = await getUserRole();
        setUserRole(role);
        setIsAdmin(getEmailFromUser() === adminEmail);
      } else {
        setUserRole(null);
        setIsAdmin(false);
      }
    };

    fetchUserData();
  }, [user, getUserRole]);

  const allMenuItems = [
    {
      label: "Categories",
      key: "categories",
      component: <CategoriesMenu />,
      roles: ["manufacturer", "retailer", "wholesaler", null],
    },
    {
      label: "Manufacturer",
      key: "manufacturer",
      component: <ManufacturerMenu />,
      roles: ["manufacturer"],
    },
    {
      label: "Retailer/Wholesaler",
      key: "retailer",
      component: (
        <div className="p-6 grid grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Retailer Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/retailer/products"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Manage Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/retailer/suppliers"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Find Suppliers
                </Link>
              </li>
            </ul>
          </div>
          {/* ... (rest of Retailer/Wholesaler component with Link) */}
        </div>
      ),
      roles: ["retailer", "wholesaler"],
    },
    {
      label: "Support",
      key: "support",
      component: (
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Help Center
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/support/faq"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/support/contact"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/support/tickets"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Support Tickets
                </Link>
              </li>
            </ul>
          </div>
          {/* ... (rest of Support component with Link) */}
        </div>
      ),
      roles: ["manufacturer", "retailer", "wholesaler", null],
    },
    {
      label: "About",
      key: "about",
      component: (
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Our Story
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about/mission"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Mission & Vision
                </Link>
              </li>
              <li>
                <Link
                  to="/about/team"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Our Team
                </Link>
              </li>
            </ul>
          </div>
          {/* ... (rest of About component with Link) */}
        </div>
      ),
      roles: ["manufacturer", "retailer", "wholesaler", null],
    },
    {
      label: "Account",
      key: "account",
      component: (
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Profile
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/account/settings"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/account/orders"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
          {/* ... (rest of Account component with Link) */}
        </div>
      ),
      roles: ["manufacturer", "retailer", "wholesaler"],
    },
  ];

  const filteredMenuItems = allMenuItems.filter((item) => {
    if (isAdmin) {
      return false;
    }
    if (!item.roles) {
      return true;
    }
    return item.roles.includes(userRole);
  });

  const visibleDesktopMenuItems = filteredMenuItems.slice(0, 3);
  const visibleDropdownMenuItems = filteredMenuItems.slice(3);

  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <nav className="bg-transparent text-white shadow-md">
      <Container size="xl" className="py-4">
        <div className="flex items-center justify-between">
          {isAdmin ? (
            <button className="rounded px-4 py-2 bg-[var(--color-primary)] text-[var(--color-heading)] cursor-pointer" onClick={handleAdminClick}>
              Admin Control Panel
            </button>
          ) : (
            <>
              {/* Desktop Menu */}
              <Group className="hidden md:flex text-[var(--color-heading)]">
                {visibleDesktopMenuItems.map((item) => (
                  <Menu
                    key={item.key}
                    trigger="hover"
                    openDelay={100}
                    closeDelay={200}
                    width="100%"
                    position="bottom"
                    shadow="md"
                    offset={10}
                    zIndex={1000}
                    onOpen={() => setActiveMenu(item.key)}
                    onClose={() => setActiveMenu(null)}
                    styles={{
                      dropdown: {
                        backgroundColor: theme.colors.white,
                        color: theme.colors.white,
                        borderRadius: theme.radius.md,
                        boxShadow: theme.shadows.lg,
                        padding: 0,
                        width: "100vw",
                        left: "50%",
                        transform: "translateX(-50%)",
                        maxWidth: "100%",
                      },
                    }}
                  >
                    <Menu.Target>
                      <Button
                        variant={activeMenu === item.key ? "filled" : "subtle"}
                        color="indigo"
                        rightSection={<ChevronDownSquare size={16} />}
                        styles={{
                          root: {
                            color:
                              activeMenu === item.key
                                ? theme.colors.white
                                : theme.colors.gray[7],
                            "&:hover": {
                              backgroundColor: theme.colors.indigo[1],
                            },
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>{item.component}</Menu.Dropdown>
                  </Menu>
                ))}
              </Group>

              <Group className="hidden md:flex">
                {visibleDropdownMenuItems.map((item) => (
                  <Menu
                    key={item.key}
                    trigger="hover"
                    openDelay={100}
                    closeDelay={200}
                    width="100%"
                    position="bottom"
                    shadow="md"
                    offset={10}
                    zIndex={1000}
                    onOpen={() => setActiveMenu(item.key)}
                    onClose={() => setActiveMenu(null)}
                    styles={{
                      dropdown: {
                        backgroundColor: theme.colors.white,
                        borderRadius: theme.radius.md,
                        boxShadow: theme.shadows.lg,
                        padding: 0,
                        width: "100vw",
                        left: "50%",
                        transform: "translateX(-50%)",
                        maxWidth: "100%",
                      },
                    }}
                  >
                    <Menu.Target>
                      <Button
                        variant={activeMenu === item.key ? "filled" : "subtle"}
                        color="indigo"
                        rightSection={<ChevronDownSquare size={16} />}
                        styles={{
                          root: {
                            color:
                              activeMenu === item.key
                                ? theme.colors.white
                                : theme.colors.gray[7],
                            "&:hover": {
                              backgroundColor: theme.colors.indigo[1],
                            },
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>{item.component}</Menu.Dropdown>
                  </Menu>
                ))}
              </Group>

              {/* Mobile Menu */}
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                className="md:hidden"
                color={theme.colors.gray[7]}
              />
            </>
          )}
        </div>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title="Menu"
        padding="md"
        size="md"
        position="right"
        zIndex={1000}
      >
        <Stack spacing="sm">
          {isAdmin ? (
            <Button className="w-full bg-[var(--color-primary)]" fullWidth onClick={handleAdminClick}>
              Admin Control Panel
            </Button>
          ) : (
            filteredMenuItems.map((item) => (
              <Menu
                key={item.key}
                trigger="click"
                width="100%"
                shadow="md"
                zIndex={1000}
                styles={{
                  dropdown: {
                    backgroundColor: theme.colors.white,
                    borderRadius: theme.radius.md,
                    boxShadow: theme.shadows.lg,
                    padding: 0,
                  },
                }}
              >
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="indigo"
                    fullWidth
                    rightSection={<ChevronDownSquare size={16} />}
                  >
                    {item.label}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>{item.component}</Menu.Dropdown>
              </Menu>
            ))
          )}
        </Stack>
      </Drawer>
    </nav>
  );
};

export default Navbar;