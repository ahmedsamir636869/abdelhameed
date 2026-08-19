import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Script from 'next/script';
import { MotionExperience } from '@/components/MotionExperience';

type StaticPageProps = {
  content: 'home' | 'about' | 'products' | 'manufacturing' | 'contact' | 'quote';
  scripts?: string[];
};

export function StaticPage({ content, scripts = [] }: StaticPageProps) {
  const markup = readFileSync(
    join(process.cwd(), 'src', 'content', `${content}.html`),
    'utf8',
  );

  return (
    <>
      <MotionExperience markup={markup} />
      {scripts.map((src) => (
        <Script key={src} src={src} strategy="afterInteractive" />
      ))}
    </>
  );
}
