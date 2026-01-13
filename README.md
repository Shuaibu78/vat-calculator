# VAT Calculator - PwC Technical Assessment

A professional VAT (Value Added Tax) calculator application built with modern web technologies, designed for Nigerian businesses and financial operations.

## 🎯 Features

- **Dual Calculation Modes**

  - **Add VAT (Exclusive)**: Calculate total price from base price + VAT
  - **Extract VAT (Inclusive)**: Separate VAT amount from total price

- **Nigerian Context**: Default VAT rate set to 7.5% (customizable)

- **Financial Precision**: Proper handling of floating-point arithmetic to prevent calculation errors

- **Audit Trail**: Automatic history tracking of the last 10 calculations with localStorage persistence

- **Export Functionality**: Download calculation history as CSV for record-keeping

- **Real-time Calculations**: Instant updates as you type

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🏗️ Architecture

### Tech Stack

- **Framework**: React 19 (via Vite)
- **Language**: TypeScript (Strict Mode)
- **Styling**: TailwindCSS v4
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React
- **Testing**: Vitest
- **Build Tool**: Vite

### Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI primitives
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── features/        # Feature-specific components
│       ├── CalculatorForm.tsx
│       └── HistoryList.tsx
├── hooks/
│   └── useVatCalculator.ts  # Calculator logic hook
├── store/
│   └── useHistoryStore.ts   # Zustand store with persistence
├── utils/
│   ├── cn.ts            # Class name utility
│   ├── export.ts        # CSV export utilities
│   ├── format.ts        # Currency/date formatting
│   ├── math.ts          # VAT calculation logic
│   └── math.test.ts     # Comprehensive tests
├── App.tsx              # Main application
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build

# Preview production build
yarn preview
```

## 🧮 How It Works

### VAT Calculation Logic

#### Add VAT (Exclusive Calculation)

```
VAT Amount = Price × (VAT Rate / 100)
Total = Price + VAT Amount
```

**Example**: ₦100 with 7.5% VAT

- Price Excl. VAT: ₦100.00
- VAT Amount: ₦7.50
- Total Incl. VAT: ₦107.50

#### Extract VAT (Inclusive Calculation)

```
Price Excl. VAT = Total / (1 + VAT Rate / 100)
VAT Amount = Total - Price Excl. VAT
```

**Example**: ₦107.50 total with 7.5% VAT

- Total Incl. VAT: ₦107.50
- Price Excl. VAT: ₦100.00
- VAT Amount: ₦7.50

### Floating-Point Precision

JavaScript's standard arithmetic can produce errors like `0.1 + 0.2 !== 0.3`. This application uses a custom `roundToDecimal` function that:

1. Adds `Number.EPSILON` to handle floating-point edge cases
2. Multiplies by 10^decimals
3. Rounds to nearest integer
4. Divides back to get precise decimal

All monetary values are rounded to 2 decimal places for accuracy.

## 🧪 Testing

The application includes comprehensive unit tests for all calculation logic:

```bash
# Run tests in watch mode
yarn test

# Run tests once
yarn test:run

# Run tests with UI
yarn test:ui
```

**Test Coverage**:

- ✅ Rounding precision
- ✅ Add VAT calculations
- ✅ Extract VAT calculations
- ✅ Edge cases (zero, negative, large numbers)
- ✅ Floating-point error prevention
- ✅ Round-trip calculations
- ✅ Real-world Nigerian scenarios

## 📊 Features in Detail

### History Management

- Automatically saves the last 10 calculations
- Persisted to localStorage (survives page refresh)
- Displays calculation mode, timestamp, and all values
- Export to CSV for external record-keeping
- Clear history with confirmation dialog

### CSV Export Format

```csv
Date & Time,Mode,VAT Rate (%),Price Excl. VAT,VAT Amount,Price Incl. VAT
Jan 11, 2026, 3:45 PM,Add VAT,7.50,100.00,7.50,107.50
```

### Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- High contrast ratios (WCAG AA compliant)

## 🎨 Design Philosophy

The UI follows a clean, corporate aesthetic suitable for professional financial applications:

- **Color Scheme**: Neutral grays with orange accent (PwC-inspired)
- **Typography**: System fonts for optimal readability
- **Layout**: Card-based design with clear hierarchy
- **Responsive**: Mobile-first approach with breakpoints
- **Feedback**: Clear visual states for interactions

## 🔒 Data Privacy

- All calculations are performed client-side
- No data is sent to external servers
- History is stored locally in the browser
- Clear history option available

## 📝 Code Quality

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Configured for React and TypeScript
- **Component Architecture**: Clear separation of concerns
- **Pure Functions**: Calculation logic is side-effect free
- **Testing**: Comprehensive unit test coverage

## 🌍 Nigerian VAT Context

The Value Added Tax (VAT) in Nigeria:

- Current rate: **7.5%** (effective February 2020)
- Previous rate: 5%
- Administered by: Federal Inland Revenue Service (FIRS)
- Applies to: Most goods and services (with some exemptions)

## 📄 License

This project is created as a technical assessment for PwC.

## 👨‍💻 Development Notes

### Key Design Decisions

1. **Zustand over Redux**: Simpler API, built-in persistence, smaller bundle size
2. **Vitest over Jest**: Faster, native ESM support, better Vite integration
3. **Lucide Icons**: Tree-shakeable, consistent design, TypeScript support
4. **No UI Library**: Custom components for full control and learning demonstration

### Future Enhancements

- [ ] Multiple currency support
- [ ] Bulk calculation mode
- [ ] PDF export
- [ ] Dark mode
- [ ] Calculation templates
- [ ] API integration for tax rate updates
- [ ] Multi-language support

---
