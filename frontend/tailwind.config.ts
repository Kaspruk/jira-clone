import plugin from "tailwindcss/plugin";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        success: {
          DEFAULT: 'hsl(142 76% 36%)',
          foreground: 'hsl(355 100% 98%)'
        },
        warning: {
          DEFAULT: 'hsl(48 96% 53%)',
          foreground: 'hsl(26 83% 14%)'
        },
        red: 'hsl(var(--red))',
        yellow: 'hsl(var(--yellow))',
        orange: 'hsl(var(--orange))',
        green: 'hsl(var(--green))',
        pink: 'hsl(var(--pink))',
        blue: 'hsl(var(--blue))',
        purple: 'hsl(var(--purple))',
        'cloud-green': 'hsl(var(--cloud-green))',
        border: {
          DEFAULT: 'hsl(var(--border))',
          sm: 'hsl(var(--border-sm))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        text: {
          main: 'hsl(var(--text-main))',
          muted: 'hsl(var(--text-muted))',
          heading: 'hsl(var(--text-heading))',
          subtle: 'hsl(var(--text-subtle))',
          inverse: 'hsl(var(--text-inverse))',
          error: 'hsl(var(--text-error))',
        },
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
        DEFAULT: '0.75rem',
      },
      blur: {
        xs: '2px',
        sm: '6px',
        md: '12px',
        lg: '24px',
      },
      spacing: {
        'top-bar': 'var(--top-bar-height)',
        'bottom-bar': 'var(--bottom-bar-height)',
        'aside-md': 'var(--aside-width-md)',
        'aside-lg': 'var(--aside-width-lg)',
        header: 'var(--header-height)',
      },
      inset: {
        'top-bar': 'var(--top-bar-height)',
        'bottom-bar': 'var(--bottom-bar-height)',
        'aside-md': 'var(--aside-width-md)',
        'aside-lg': 'var(--aside-width-lg)',
        header: 'var(--header-height)',
      },
      height: {
        'top-bar': 'var(--top-bar-height)',
        'bottom-bar': 'var(--bottom-bar-height)',
      },
      width: {
        'aside-md': 'var(--aside-width-md)',
        'aside-lg': 'var(--aside-width-lg)',
      },

      fontFamily: {
        mi: ['var(--font-material-icons)'],
      },
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--aside-width-md': '64px',
          '--aside-width-lg': '250px',
          '--top-bar-height': '60px',
          '--bottom-bar-height': '64px',
        },
      });
    }),

  ],
  safelist: ['cursor-pointer', 'text-left', 'text-center', 'text-right', 'animate-bounce-in']
};
export default config;
