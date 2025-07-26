import { render, screen, fireEvent } from '@testing-library/react';
import { CTAButtons } from './CTAButtons';
import { LocaleContext } from '../../../contexts/LocaleContext';

// Mock environment variables
const mockCTAButtonsConfig = {
  main: {
    title: "資料請求する",
    action: {
      type: "link",
      detail: "https://www.314community.com/inquiry/"
    }
  },
  sub: {
    title: "もう少し質問する",
    action: {
      type: "FAQ",
      detail: ""
    }
  }
};

jest.mock('../../../shared/config/app.config', () => ({
  getCTAButtonsConfig: () => mockCTAButtonsConfig,
  getAccentColor: () => 'green'
}));

jest.mock('../../../shared/config/theme.config', () => ({
  getColorClasses: () => ({
    background: 'bg-green-500',
    textWhite: 'text-white',
    bgLight: 'bg-gray-100',
    textSecondary: 'text-gray-700',
    textBlack: 'text-navi-black'
  })
}));

const mockT = (key: string) => {
  const translations: { [key: string]: string } = {
    'cta.main.title': '資料請求する',
    'cta.sub.title': 'もう少し質問する'
  };
  return translations[key] || key;
};

const MockLocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const mockValue = {
    locale: 'ja' as const,
    t: mockT,
    setLocale: jest.fn(),
    isLoading: false
  };

  return (
    <LocaleContext.Provider value={mockValue}>
      {children}
    </LocaleContext.Provider>
  );
};

describe('CTAButtons', () => {
  const mockOnMainClick = jest.fn();
  const mockOnSubClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // window.open mock
    Object.defineProperty(window, 'open', {
      writable: true,
      value: jest.fn()
    });
  });

  it('renders two CTA buttons', () => {
    render(
      <MockLocaleProvider>
        <CTAButtons 
          onMainClick={mockOnMainClick}
          onSubClick={mockOnSubClick}
          show={true}
          accentColor="green"
        />
      </MockLocaleProvider>
    );

    expect(screen.getByText('資料請求する')).toBeInTheDocument();
    expect(screen.getByText('もう少し質問する')).toBeInTheDocument();
  });

  it('does not render when show is false', () => {
    render(
      <MockLocaleProvider>
        <CTAButtons 
          onMainClick={mockOnMainClick}
          onSubClick={mockOnSubClick}
          show={false}
          accentColor="green"
        />
      </MockLocaleProvider>
    );

    expect(screen.queryByText('資料請求する')).not.toBeInTheDocument();
    expect(screen.queryByText('もう少し質問する')).not.toBeInTheDocument();
  });

  it('opens external link when main CTA is clicked', () => {
    render(
      <MockLocaleProvider>
        <CTAButtons 
          onMainClick={mockOnMainClick}
          onSubClick={mockOnSubClick}
          show={true}
          accentColor="green"
        />
      </MockLocaleProvider>
    );

    const mainButton = screen.getByText('資料請求する');
    fireEvent.click(mainButton);

    expect(window.open).toHaveBeenCalledWith('https://www.314community.com/inquiry/', '_blank');
    expect(mockOnMainClick).toHaveBeenCalled();
  });

  it('calls onSubClick when sub CTA is clicked', () => {
    render(
      <MockLocaleProvider>
        <CTAButtons 
          onMainClick={mockOnMainClick}
          onSubClick={mockOnSubClick}
          show={true}
          accentColor="green"
        />
      </MockLocaleProvider>
    );

    const subButton = screen.getByText('もう少し質問する');
    fireEvent.click(subButton);

    expect(mockOnSubClick).toHaveBeenCalled();
  });

  it('main button has primary styles', () => {
    render(
      <MockLocaleProvider>
        <CTAButtons 
          onMainClick={mockOnMainClick}
          onSubClick={mockOnSubClick}
          show={true}
          accentColor="green"
        />
      </MockLocaleProvider>
    );

    const mainButton = screen.getByText('資料請求する');
    expect(mainButton).toHaveClass('bg-green-500', 'text-white');
  });

  it('sub button has secondary styles', () => {
    render(
      <MockLocaleProvider>
        <CTAButtons 
          onMainClick={mockOnMainClick}
          onSubClick={mockOnSubClick}
          show={true}
          accentColor="green"
        />
      </MockLocaleProvider>
    );

    const subButton = screen.getByText('もう少し質問する');
    expect(subButton).toHaveClass('bg-gray-100', 'text-navi-black');
  });

  it('gets CTA configuration from environment variables', () => {
    const { getCTAButtonsConfig } = require('../../../shared/config/app.config');
    const config = getCTAButtonsConfig();
    
    expect(config.main.title).toBe('資料請求する');
    expect(config.main.action.type).toBe('link');
    expect(config.sub.title).toBe('もう少し質問する');
    expect(config.sub.action.type).toBe('FAQ');
  });

  it('uses default accent color when none provided', () => {
    render(
      <MockLocaleProvider>
        <CTAButtons 
          onMainClick={mockOnMainClick}
          onSubClick={mockOnSubClick}
          show={true}
        />
      </MockLocaleProvider>
    );

    const mainButton = screen.getByText('資料請求する');
    expect(mainButton).toHaveClass('bg-green-500', 'text-white');
  });
});