/**
 * History List Component
 * Displays calculation history with export functionality
 */

import { History, Download, Trash2, Plus, Minus, FileText, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useHistoryStore } from '../../store/useHistoryStore';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { exportHistoryAsCSV } from '../../utils/export';

export function HistoryList() {
  const history = useHistoryStore((state) => state.history);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const handleExport = () => {
    if (history.length === 0) {
      alert('No history to export');
      return;
    }
    exportHistoryAsCSV(history);
  };

  const handleClear = () => {
    if (history.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all calculation history?')) {
      clearHistory();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <History className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Calculation History</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                {history.length > 0 
                  ? `${history.length} recent calculation${history.length !== 1 ? 's' : ''}`
                  : 'No calculations yet'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              disabled={history.length === 0}
              title="Export as CSV"
              className="group"
            >
              <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={history.length === 0}
              title="Clear history"
              className="group"
            >
              <Trash2 className="w-4 h-4 group-hover:text-red-600 transition-colors" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col">
        {history.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12">
              <div className="relative inline-block mb-4">
                <FileText className="w-16 h-16 text-gray-200" />
                <Clock className="w-6 h-6 text-gray-300 absolute -bottom-1 -right-1" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                No calculations yet
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Start by entering values in the calculator. Your history will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {history.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="group relative p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      item.mode === 'add' 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                    }`}>
                      {item.mode === 'add' ? (
                        <Plus className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Minus className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </div>
                    <Badge variant={item.mode === 'add' ? 'success' : 'info'} className="text-xs">
                      {item.mode === 'add' ? 'Add VAT' : 'Extract VAT'}
                    </Badge>
                    <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      {item.vatRate}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="hidden sm:inline">{formatDateTime(item.timestamp)}</span>
                    <span className="sm:hidden">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Excl. VAT</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {formatCurrency(item.priceExcludingVat)}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-100">
                    <p className="text-xs text-orange-600 mb-1 font-medium">VAT</p>
                    <p className="text-sm font-semibold text-orange-700 truncate">
                      {formatCurrency(item.vatAmount)}
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Incl. VAT</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {formatCurrency(item.priceIncludingVat)}
                    </p>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute inset-0 border-2 border-orange-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

