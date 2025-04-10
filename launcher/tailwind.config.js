module.exports = {
  content: ["./src/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      backgroundImage: {
        drop: "url('/img/icon/edit-node-icons/drag-service-icon.png')",
      },
      fontSize: {
        "2xs": "10px",
      },
      gridTemplateRows: {
        7: "repeat(7 , minmax(0,1fr))",
        8: "repeat(8 , minmax(0,1fr))",
        12: "repeat(12 , minmax(0,1fr))",
        13: "repeat(13 , minmax(0,1fr))",
        14: "repeat(14 , minmax(0,1fr))",
        15: "repeat(15 , minmax(0,1fr))",
      },

      gridTemplateColumns: {
        24: "repeat(24 , minmax(0,1fr))",
      },
      gridColumnStart: {
        13: "13",
        14: "14",
        15: "15",
        16: "16",
        17: "17",
        18: "18",
        19: "19",
        20: "20",
        21: "21",
        22: "22",
        23: "23",
        24: "24",
        25: "25",
      },
      gridColumnEnd: {
        13: "13",
        14: "14",
        15: "15",
        16: "16",
        17: "17",
        18: "18",
        19: "19",
        20: "20",
        21: "21",
        22: "22",
        23: "23",
        24: "24",
        25: "25",
      },
      gridRowStart: {
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        14: "14",
      },
      gridRowEnd: {
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
        14: "14",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("tailwindcss-animated")],
};
