import { CalculatorForm } from "./components/features/CalculatorForm";
import { HistoryList } from "./components/features/HistoryList";
import { Info, Shield, Zap } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50/20 to-slate-50 w-full">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex justify-center items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="w-full max-w-7xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <span className="text-2xl font-bold text-white">₦</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  VAT Calculator
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Professional VAT calculation tool for Nigerian businesses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg">
                <span className="text-xs font-medium text-gray-600">
                  Default Rate:
                </span>
                <span className="px-2.5 py-1 bg-orange-500 text-white rounded-md text-sm font-bold shadow-sm">
                  7.5%
                </span>
              </div>
              <div className="sm:hidden px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold">
                7.5%
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 lg:mb-12">
          {/* Calculator Section */}
          <div className="w-full">
            <CalculatorForm />
          </div>

          {/* History Section */}
          <div className="w-full">
            <HistoryList />
          </div>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12">
          {/* About VAT Card */}
          <div className="group p-5 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition-transform">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Current Rate
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The standard VAT rate in Nigeria is{" "}
                  <strong className="text-orange-600">7.5%</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Precision Card */}
          <div className="group p-5 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 bg-green-100 rounded-lg group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Financial Precision
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All calculations use proper rounding to prevent floating-point
                  errors.
                </p>
              </div>
            </div>
          </div>

          {/* Auto-save Card */}
          <div className="group p-5 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all duration-200">
            <div className="flex items-start gap-3">
              <div className="shrink-0 p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Auto-saved History
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your last 10 calculations are automatically saved and can be
                  exported.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Modes Info */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full" />
            Calculation Modes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-sm">
            <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-lg border border-gray-100">
              <div className="shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">+</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5">
                  Add VAT (Exclusive)
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Calculate the total price including VAT from a base price.
                  Example: ₦100 + 7.5% = ₦107.50
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-lg border border-gray-100">
              <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">−</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1.5">
                  Extract VAT (Inclusive)
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Separate the VAT amount from a total price. Example: ₦107.50 ÷
                  1.075 = ₦100 (VAT: ₦7.50)
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p className="text-center sm:text-left">
              Built with{" "}
              <span className="text-orange-600 font-semibold">React 19</span>,
              <span className="text-blue-600 font-semibold"> TypeScript</span>,
              and
              <span className="text-cyan-600 font-semibold"> TailwindCSS</span>
            </p>
            <p className="text-center sm:text-right text-xs">
              © 2026 VAT Calculator • Financial Precision Guaranteed
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
