import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                typing: {
                    from: { width: "0" },
                    to: { width: "100%" },
                },
                blink: {
                    "50%": { borderColor: "transparent" },
                },
            },
            animation: {
                typing: "typing 3.5s steps(40, end) infinite alternate",
                blink: "blink .75s step-end infinite",
            },
        },
    },

    plugins: [forms],
};
