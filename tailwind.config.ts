import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                card: "var(--card)",
                foreground: "var(--foreground)",
                border: "var(--border)",
                hover: "var(--hover)",
                skeleton: "var(--skeleton)",
                "rounded-none": "var(--rounded-none)",
                "rounded-md": "var(--rounded-md)",
                "rounded-lg": "var(--rounded-lg)",
                "rounded-xl": "var(--rounded-xl)",
            },
        },
    },
    plugins: [],
};
export default config;