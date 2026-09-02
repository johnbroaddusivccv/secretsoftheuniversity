import './globals.css';

export const metadata = {
  title: 'Secrets of the University — The heavens declare what the university withheld',
  description: 'Practical knowledge about money, health, careers, and how systems really work. The curriculum school skipped.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply theme before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (document.cookie.includes('theme=light')) {
                  document.documentElement.classList.add('light');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
