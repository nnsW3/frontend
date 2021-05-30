const { colors } = require('tailwindcss/defaultTheme')
module.exports = {
  mode: 'jit',
  darkMood: "media",
  purge: [
    "./public/**/*.html",
    "./src/pages/**/*.{js,ts,jsx,tsx}", 
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        black:{
          ...colors.black,
        },
        gray: {
          ...colors.gray,
        },
        green:{
          ...colors.green,
        },
        blue:{
          ...colors.blue,
        },
      },
      width: {},
      transitionTimingFunction: {
        'ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)'
      },
      boxShadow: {
        outline: '0 0 0 1px rgba(229, 103, 86, 0.4)',
      },
    }
  },
  variants: {
  },
  plugins: [
		require('tailwindcss'),
		require('precss'),
		require('autoprefixer'),
    require('postcss-import'),
	],
  future: {
    removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
  },
}