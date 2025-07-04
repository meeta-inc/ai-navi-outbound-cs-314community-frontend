import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  ArrowLeft
} from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { AccentColor, getColorClasses } from '../../utils/theme';

interface NavigationHeaderProps {
  title: string;
  accentColor?: AccentColor;
}

export default function NavigationHeader({ accentColor: propAccentColor }: NavigationHeaderProps) {
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
      activeIcon: <Home className="w-6 h-6 text-orange-600" />,
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
  const accentColor = propAccentColor || 'orange';
  const colors = getColorClasses(accentColor);

  return (
    <div className={`bg-white border-b ${colors.border}`}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {shouldShowBackButton() && (
              <button
                onClick={() => navigate(-1)}
                className={`p-2 ${colors.text} ${colors.textHover} transition-colors`}
                aria-label={t('common.back')}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className={`text-2xl font-bold ${colors.accent}`}>∞</span>
                <span className="text-xl font-bold text-gray-800 ml-1">3.14</span>
                <span className={`text-lg font-medium ${colors.accentSecondary} ml-1`}>community</span>
              </div>
              <div className={`text-xs ${colors.accent} font-medium ml-2`}>
                〜学びたい気持ちを育てる〜
              </div>
            </div>
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
                      : colors.bgHover
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