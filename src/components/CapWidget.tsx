import React, { useEffect, useRef } from 'react';
import '@cap.js/widget';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'cap-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'data-cap-api-endpoint'?: string;
      };
    }
  }
}

export const CAP_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cap/`;

interface CapWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  /** Change this value to force a fresh challenge (tokens are single-use). */
  resetKey?: number | string;
}

/** Self-hosted Cap CAPTCHA checkbox. Tokens are single-use and verified on the server. */
const CapWidget: React.FC<CapWidgetProps> = ({ onVerify, onExpire, onError, resetKey }) => {
  const ref = useRef<HTMLElement>(null);
  const cbs = useRef({ onVerify, onExpire, onError });
  cbs.current = { onVerify, onExpire, onError };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const solve = (e: Event) => cbs.current.onVerify((e as CustomEvent).detail.token);
    const reset = () => cbs.current.onExpire?.();
    const error = () => cbs.current.onError?.();
    el.addEventListener('solve', solve);
    el.addEventListener('reset', reset);
    el.addEventListener('error', error);
    return () => {
      el.removeEventListener('solve', solve);
      el.removeEventListener('reset', reset);
      el.removeEventListener('error', error);
    };
  }, [resetKey]);

  return (
    <div className="flex justify-center">
      <cap-widget key={resetKey} ref={ref as any} data-cap-api-endpoint={CAP_ENDPOINT} />
    </div>
  );
};

export default CapWidget;
