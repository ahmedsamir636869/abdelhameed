import { PageScripts } from '@/components/PageScripts';

type PageShellProps = {
  /** Legacy per-page scroll/interaction scripts. */
  scripts?: string[];
  children: React.ReactNode;
};

export function PageShell({ scripts = [], children }: PageShellProps) {
  return (
    <>
      {children}
      {scripts.length > 0 ? <PageScripts srcs={scripts} /> : null}
    </>
  );
}
