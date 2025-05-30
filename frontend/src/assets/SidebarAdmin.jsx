import { useState } from 'react';
import {
  LayoutDashboard,
  Factory,
  ShoppingCart,
  Package,
  Users,
  BarChart,
  User,
  Shield,
  Settings,
  HomeIcon,
  LogOut,
} from 'lucide-react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import logo from './images/svg/vyapaar.svg';
import { Link, NavLink, useLocation } from 'react-router-dom'; // Import necessary components

function NavbarLink({ icon: Icon, label, active, onClick, expanded }) {
  return (
  <>
    <Tooltip label={mobileOpen || expanded ? '' : 'Back To Home'} position="right" transitionProps={{ duration: 0 }}>
      <Link to="/" className="flex items-center space-x-2 text-[var(--color-heading)] hover:text-purple-600 font-medium cursor-pointer md:mr-2">
      <UnstyledButton className={`relative w-12 h-12 rounded-md text-white hover:bg-blue-700 transition-colors ${mobileOpen || expanded ? 'w-full justify-start pl-4' : 'flex items-center justify-center'}`}>
        <span className="flex items-center justify-center w-full h-full">
          <HomeIcon size={20} strokeWidth={1.5} />
          {(mobileOpen || expanded) && <span className="ml-3 text-sm font-medium">Back To Home</span>}
        </span>
      </UnstyledButton>
      </Link>
    </Tooltip>
    <Tooltip label={mobileOpen || expanded ? '' : 'Logout'} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton className={`relative w-12 h-12 rounded-md text-white hover:bg-blue-700 transition-colors ${mobileOpen || expanded ? 'w-full justify-start pl-4' : 'flex items-center justify-center'}`}>
        <span className="flex items-center justify-center w-full h-full">
          <LogOut size={20} strokeWidth={1.5} />
          {(mobileOpen || expanded) && <span className="ml-3 text-sm font-medium">Logout</span>}
        </span>
      </UnstyledButton>
  </Tooltip>
</>
  );
}

const mockdata = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
  { icon: Factory, label: 'Manufacturer', to: '/admin/manufacturer' },
  { icon: ShoppingCart, label: 'Orders', to: '/admin/orders' },
  { icon: Package, label: 'Products', to: '/admin/products' },
  // { icon: Users, label: 'Customers', to: '/admin/customers' },
  // { icon: BarChart, label: 'Reports', to: '/admin/reports' },
  // { icon: User, label: 'Account', to: '/admin/account' },
  // { icon: Shield, label: 'Security', to: '/admin/security' },
  { icon: Settings, label: 'Settings', to: '/admin/settings' },
];

export function NavbarMinimalColored() {
  const [active, setActive] = useState(0); // Initialize active state
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = mockdata.map((link, index) => (
    <NavLink
        key={link.label}
        to={link.to}
        className={({ isActive }) =>
          `block relative w-full ${
            mobileOpen || expanded ? 'w-full' : 'w-12'
          } h-12 rounded-md text-white hover:bg-blue-700 transition-all duration-300 ease-in-out ${
            isActive ? 'bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-sm' : ''
          } ${mobileOpen || expanded ? 'flex items-center pl-4' : 'flex items-center justify-center'}`
        }
        onClick={() => {
          setActive(index);
          setMobileOpen(false); // Close mobile menu on link click
        }}
      >
        <Tooltip label={mobileOpen || expanded ? '' : link.label} position="right" transitionProps={{ duration: 0 }}>
          <span className="flex items-center justify-center w-full h-full"> {/* Wrap icon and label */}
            <link.icon size={20} strokeWidth={1.5} />
            {(mobileOpen || expanded) && <span className="ml-3 text-sm font-medium">{link.label}</span>}
          </span>
        </Tooltip>
      </NavLink>
  ));

  return (
    <nav
      className={`fixed top-0 left-0 h-full bg-[var(--color-primary)] text-white shadow-md z-50 transition-all duration-300 ease-in-out ${
        mobileOpen ? 'w-48' : 'w-16 sm:w-auto sm:hover:w-48'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col h-full justify-between p-4">
        <div>
          <Center className={`mb-4 ${mobileOpen || expanded ? 'block' : 'hidden sm:block'}`}>
            <Link to="/admin/dashboard">
              <img src={logo} alt="logo" className="h-8 w-auto" />
            </Link>
          </Center>

          <Stack gap={0} className="flex flex-col items-center sm:items-start">
            {links}
          </Stack>
        </div>

        <Stack gap={0} className="flex flex-col items-center sm:items-start">
          <Tooltip label={mobileOpen || expanded ? '' : 'Back To Home'} position="right" transitionProps={{ duration: 0 }}>
            <Link to={"/"} >
              <UnstyledButton className={`relative w-12 h-12 rounded-md text-white hover:bg-blue-700 transition-colors ${mobileOpen || expanded ? 'w-full justify-start pl-4' : 'flex items-center justify-center'}`}>
                <HomeIcon size={20} strokeWidth={1.5} />
                {(mobileOpen || expanded) && <span className="ml-3 text-sm font-medium">Back To Home</span>}
              </UnstyledButton>
            </Link>
          </Tooltip>
          <Tooltip label={mobileOpen || expanded ? '' : 'Logout'} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton className={`relative w-12 h-12 rounded-md text-white hover:bg-blue-700 transition-colors ${mobileOpen || expanded ? 'w-full justify-start pl-4' : 'flex items-center justify-center'}`}>
              <LogOut size={20} strokeWidth={1.5} />
              {(mobileOpen || expanded) && <span className="ml-3 text-sm font-medium">Logout</span>}
            </UnstyledButton>
          </Tooltip>
        </Stack>

        {/* Mobile Toggler */}
        <div className="md:hidden absolute top-4 right-4 z-50 mt-5">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="focus:outline-none">
            <svg
              className="h-6 w-6 text-[var(--color-heading)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarMinimalColored;