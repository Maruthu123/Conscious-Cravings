// This lucide-react build ships no brand/social glyphs (WhatsApp, Instagram,
// etc. were dropped from the core icon set), so these two small stand-ins
// are drawn to match the stroke weight and rounded style of the rest of the
// lucide icons used across the site.

export function InstagramIcon({ size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.08 3.18 5.05 4.46.7.3 1.25.48 1.68.62.7.22 1.34.19 1.84.12.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.86.51 3.6 1.4 5.1L2 22l5.2-1.52a9.9 9.9 0 0 0 4.84 1.23h.01c5.46 0 9.9-4.4 9.9-9.82C21.94 6.4 17.5 2 12.04 2zm5.83 15.6a8.2 8.2 0 0 1-5.83 2.4h-.01a8.25 8.25 0 0 1-4.2-1.15l-.3-.18-3.08.9.9-3-.2-.31a8.13 8.13 0 0 1-1.28-4.42c0-4.53 3.7-8.22 8.24-8.22 2.2 0 4.27.86 5.83 2.42a8.15 8.15 0 0 1 2.41 5.8 8.2 8.2 0 0 1-2.48 5.76z" />
    </svg>
  );
}
