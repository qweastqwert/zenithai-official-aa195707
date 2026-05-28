// Lightweight in-app error reporting store.
// Captures runtime errors (React boundary, window.onerror, unhandledrejection)
// along with route, user agent and recent breadcrumbs.

export interface ErrorReport {
  id: string;
  timestamp: number;
  message: string;
  source: 'boundary' | 'window' | 'promise' | 'manual';
  stack?: string;
  componentStack?: string;
  route: string;
  userAgent: string;
  breadcrumbs: string[];
}

const STORAGE_KEY = 'zenith-error-reports';
const MAX_REPORTS = 25;
const MAX_BREADCRUMBS = 20;

const breadcrumbs: string[] = [];
const listeners = new Set<() => void>();

export function addBreadcrumb(msg: string) {
  const stamped = `${new Date().toISOString()} ${msg}`;
  breadcrumbs.push(stamped);
  if (breadcrumbs.length > MAX_BREADCRUMBS) breadcrumbs.shift();
}

export function getReports(): ErrorReport[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearReports() {
  localStorage.removeItem(STORAGE_KEY);
  emit();
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach((l) => l());
}

export function reportError(input: {
  error: unknown;
  source: ErrorReport['source'];
  componentStack?: string;
}) {
  const err = input.error;
  const message =
    err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
  const stack = err instanceof Error ? err.stack : undefined;

  const report: ErrorReport = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    message,
    source: input.source,
    stack,
    componentStack: input.componentStack,
    route: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    breadcrumbs: [...breadcrumbs],
  };

  try {
    const all = getReports();
    all.unshift(report);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, MAX_REPORTS)));
  } catch {
    // ignore storage quota errors
  }
  emit();
  // Mirror to console for developers
  // eslint-disable-next-line no-console
  console.error('[ErrorReporter]', report);
  return report;
}

let installed = false;
export function installGlobalErrorHandlers() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('error', (e) => {
    reportError({ error: e.error || e.message, source: 'window' });
  });

  window.addEventListener('unhandledrejection', (e) => {
    reportError({ error: (e as PromiseRejectionEvent).reason, source: 'promise' });
  });

  // Route breadcrumbs via history patch
  const origPush = history.pushState;
  const origReplace = history.replaceState;
  history.pushState = function (...args) {
    addBreadcrumb(`navigate ${args[2]}`);
    return origPush.apply(this, args as any);
  };
  history.replaceState = function (...args) {
    addBreadcrumb(`replace ${args[2]}`);
    return origReplace.apply(this, args as any);
  };
  window.addEventListener('popstate', () => addBreadcrumb(`pop ${location.pathname}`));
}

export function formatReportAsText(r: ErrorReport): string {
  return [
    `Zenith Error Report`,
    `Time: ${new Date(r.timestamp).toISOString()}`,
    `Source: ${r.source}`,
    `Route: ${r.route}`,
    `Message: ${r.message}`,
    '',
    'Stack:',
    r.stack || '(none)',
    '',
    'Component stack:',
    r.componentStack || '(none)',
    '',
    'Breadcrumbs:',
    ...r.breadcrumbs,
    '',
    `User agent: ${r.userAgent}`,
  ].join('\n');
}