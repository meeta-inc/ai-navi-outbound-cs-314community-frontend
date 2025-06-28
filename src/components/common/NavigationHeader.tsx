import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  ArrowLeft,
  Headphones
} from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

interface NavigationHeaderProps {
  title: string;
}

export default function NavigationHeader({ title }: NavigationHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocale();

  const handleHomeClick = () => {
    navigate('/');
  };

  const defaultNaviItems = [
    {
      id: 'home',
      icon: <Home className="w-6 h-6" />,
      activeIcon: <Home className="w-6 h-6 text-blue-600" />,
      label: t('common.home'),
      description: t('student.menu.home.desc'),
      onClick: handleHomeClick
    }
  ];

  const getNavItems = () => {
    return defaultNaviItems;
  };

  const shouldShowBackButton = () => {
    return location.pathname !== '/';
  };

  const navItems = getNavItems();
  const accentColor = 'blue';

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {shouldShowBackButton() && (
              <button
                onClick={() => navigate(-1)}
                className={`p-2 text-${accentColor}-600 hover:text-${accentColor}-800 transition-colors`}
                aria-label={t('common.back')}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {navItems.map((item: any) => (
              <div key={item.id} className="relative group">
                <button 
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    item.disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50'
                  }`}
                  aria-label={item.label}
                >
                  {typeof item.icon === 'string' ? (
                    <img src={item.icon} alt={item.label} className="w-6 h-6" />
                  ) : item.icon}
                  
                  {item.notification && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {item.label}
                    {item.notification && (
                      <span className="ml-2 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs rounded-full">!</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}