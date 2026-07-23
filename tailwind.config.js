/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          purple: "#9d4edd",
          pink: "#ff007f",
          cyan: "#00f0ff",
          gold: "#ffd700",
          blue: "#3a86ff",
        }
      },
      backgroundImage: {
        'holographic': 'linear-gradient(135deg, rgba(255, 0, 127, 0.15), rgba(0, 240, 255, 0.15), rgba(157, 78, 221, 0.15))',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'shimmer': 'shimmer 3s infinite linear',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 0, 127, 0.4), 0 0 30px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(255, 0, 127, 0.8), 0 0 50px rgba(0, 240, 255, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
