import React, { useState, useEffect } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLocation, Link } from 'react-router-dom';
import {
  MdMenu,
  MdClose,
  MdDashboard,
  MdPeople,
  MdCellTower,
  MdEventSeat,
  MdAnalytics,
  MdContactless,
  MdSettings
} from 'react-icons/md';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const NavBar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile); // Open on desktop, closed on mobile
  const location = useLocation();
  const backgroundColor = useThemeColor({}, 'primary');
  const tintColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'secondary');

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/', icon: MdDashboard },
    { label: 'Users', path: '/users', icon: MdPeople },
    { label: 'Alerts', path: '/alerts', icon: MdCellTower },
    { label: 'Events', path: '/events', icon: MdEventSeat },
    { label: 'Content', path: '/content', icon: MdContactless },
    { label: 'Analytics', path: '/analytics', icon: MdAnalytics },
    { label: 'System', path: '/system', icon: MdSettings },
  ];

  const isActive = (path: string) => {
    // For alerts, match both /alerts and /alerts/* (subroutes)
    if (path === '/alerts') {
      return location.pathname.startsWith('/alerts');
    }
    if (path === '/content') {
      return location.pathname.startsWith('/content');
    }
    if (path === '/analytics') {
      return location.pathname.startsWith('/analytics');
    }
    if (path === '/system') {
      return location.pathname.startsWith('/system');
    }
    return location.pathname === path;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Don't change isOpen state automatically on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Menu Toggle Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-3 z-50 p-2 rounded-lg transition-colors"
        style={{ backgroundColor: backgroundColor}}
        aria-label="Toggle menu"
      >
        {isOpen ? <MdClose size={24} color={textColor} /> : <MdMenu size={24} color={textColor}/>}
      </button>

      {/* Mobile Overlay - Only on mobile when open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        style={{ backgroundColor }}
        className={`
          ${isMobile ? 'fixed' : 'static'}
          ${isMobile ? 'left-0 top-0' : ''}
          h-screen
          ${isOpen ? 'w-60' : isMobile ? '-w-0' : 'w-19'}
          z-40
          transition-all duration-300 ease-in-out
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          pt-4
          px-2
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Logo/Title - Hide on collapsed desktop */}
        {(!isMobile && isOpen) || isMobile ? (
          <div className="mb-4 ml-11">
            <h1 style={{ color: secondaryColor }} className="text-l font-bold font-poppins">
            TaraAdmin
            </h1>
            <p style={{ color: textColor }} className="text-xs font-poppins">
                TaraG Administrator Panel
            </p>
          </div>
        ) : (
          <div className="mb-4 h-10" />
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                title={!isOpen && !isMobile ? item.label : ''}
                style={{
                  backgroundColor: active ? tintColor : 'transparent',
                  color: active ? secondaryColor : textColor,
                }}
                className={`
                  flex items-center gap-3
                  px-3 py-3
                  rounded-lg
                  transition-all duration-200
                  hover:opacity-80
                  font-poppins text-sm
                  ${!isOpen && !isMobile ? 'justify-center' : ''}
                `}
              >
                <Icon size={22  } color={active ? secondaryColor : textColor} />
                {(isOpen || isMobile) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
