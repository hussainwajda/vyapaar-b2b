// src/components/Navbar.jsx
import React, { useState } from "react";
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

const Navbar = () => {
  const theme = useMantineTheme();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = [
    {
      label: "Categories",
      key: "categories",
      component: <CategoriesMenu />,
    },
    {
      label: "Manufacturer",
      key: "manufacturer",
      component: <ManufacturerMenu />,
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
                <a
                  href="/retailer/products"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Browse Products
                </a>
              </li>
              <li>
                <a
                  href="/retailer/orders"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Manage Orders
                </a>
              </li>
              <li>
                <a
                  href="/retailer/suppliers"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Find Suppliers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Wholesaler Services
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/wholesaler/inventory"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Inventory Management
                </a>
              </li>
              <li>
                <a
                  href="/wholesaler/bulk"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Bulk Orders
                </a>
              </li>
              <li>
                <a
                  href="/wholesaler/partners"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Partner Program
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/guides/retailer"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Retailer Guide
                </a>
              </li>
              <li>
                <a
                  href="/guides/wholesaler"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Wholesaler Guide
                </a>
              </li>
            </ul>
          </div>
        </div>
      ),
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
                <a
                  href="/support/faq"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/support/contact"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/support/tickets"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Support Tickets
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Community
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/community/forums"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Forums
                </a>
              </li>
              <li>
                <a
                  href="/community/webinars"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Webinars
                </a>
              </li>
            </ul>
          </div>
        </div>
      ),
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
                <a
                  href="/about/mission"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Mission & Vision
                </a>
              </li>
              <li>
                <a
                  href="/about/team"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Our Team
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Careers
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/careers/openings"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Job Openings
                </a>
              </li>
              <li>
                <a
                  href="/careers/culture"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Our Culture
                </a>
              </li>
            </ul>
          </div>
        </div>
      ),
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
                <a
                  href="/account/settings"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="/account/orders"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  My Orders
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--color-heading)] mb-2">
              Security
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/account/password"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Change Password
                </a>
              </li>
              <li>
                <a
                  href="/account/2fa"
                  className="text-sm text-[var(--color-heading)] hover:text-[var(--color-primary)]"
                >
                  Two-Factor Auth
                </a>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <nav
      className="bg-transparent text-white shadow-md"
    >
      <Container size="xl" className="py-4">
        <div className="flex items-center justify-between">
          {/* Desktop Menu */}
          <Group className="hidden md:flex text-[var(--color-heading)]">
            {menuItems.slice(0, 3).map((item) => (
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
            {menuItems.slice(3).map((item) => (
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
          {menuItems.map((item) => (
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
          ))}
        </Stack>
      </Drawer>
    </nav>
  );
};

export default Navbar;