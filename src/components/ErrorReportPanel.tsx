import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Bug, Copy, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  ErrorReport,
  clearReports,
  formatReportAsText,
  getReports,
  subscribe,
} from '@/utils/errorReporter';

export default function ErrorReportPanel() {
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setReports(getReports());
    refresh();
    const unsub = subscribe(refresh);
    const openHandler = () => setOpen(true);
    window.addEventListener('zenith-open-error-panel', openHandler);
    return () => {
      unsub();
      window.removeEventListener('zenith-open-error-panel', openHandler);
    };
  }, []);

  const hasReports = reports.length > 0;

  return (
    <>
      {hasReports && (
        <button
          aria-label="View error reports"
          onClick={() => setOpen(true)}
          className="fixed bottom-24 left-4 z-40 h-10 w-10 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Bug className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 text-[10px] bg-white text-destructive rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold">
            {reports.length}
          </span>
        </button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Bug className="h-4 w-4" /> Error reports
            </SheetTitle>
          </SheetHeader>

          <div className="flex justify-between items-center mt-4 mb-3">
            <p className="text-xs text-muted-foreground">
              {reports.length} captured · stored locally only
            </p>
            {hasReports && (
              <Button size="sm" variant="ghost" onClick={() => clearReports()} className="gap-1">
                <Trash2 className="h-3 w-3" /> Clear all
              </Button>
            )}
          </div>

          {!hasReports && (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No errors captured. You're all good.
            </p>
          )}

          <div className="space-y-2">
            {reports.map((r) => {
              const isOpen = expanded === r.id;
              return (
                <div key={r.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : r.id)}
                    className="w-full text-left p-3 hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs uppercase font-semibold text-muted-foreground">
                        {r.source}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(r.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mt-1 break-words">{r.message}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">on {r.route}</p>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 space-y-2">
                      {r.stack && (
                        <pre className="text-[10px] bg-muted p-2 rounded max-h-40 overflow-auto whitespace-pre-wrap break-all">
                          {r.stack}
                        </pre>
                      )}
                      {r.componentStack && (
                        <pre className="text-[10px] bg-muted p-2 rounded max-h-32 overflow-auto whitespace-pre-wrap break-all">
                          {r.componentStack}
                        </pre>
                      )}
                      {r.breadcrumbs.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold mb-1">Breadcrumbs</p>
                          <ul className="text-[10px] text-muted-foreground space-y-0.5 max-h-32 overflow-auto">
                            {r.breadcrumbs.map((b, i) => (
                              <li key={i} className="font-mono">{b}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => {
                          navigator.clipboard.writeText(formatReportAsText(r));
                          toast.success('Report copied to clipboard');
                        }}
                      >
                        <Copy className="h-3 w-3" /> Copy report
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}