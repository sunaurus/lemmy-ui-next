"use client";

import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";

const THEMES: Record<"red" | "green" | "blue", Theme> = {
  red: {
    "--color-primary-50": "250 246 246",
    "--color-primary-100": "246 237 237",
    "--color-primary-200": "238 221 221",
    "--color-primary-300": "223 194 194",
    "--color-primary-400": "205 159 162",
    "--color-primary-500": "183 124 129",
    "--color-primary-600": "159 95 103",
    "--color-primary-700": "132 76 84",
    "--color-primary-800": "112 65 74",
    "--color-primary-900": "97 58 67",
    "--color-primary-950": "58 32 37",
  },
  green: {
    "--color-primary-50": "247 248 245",
    "--color-primary-100": "229 233 222",
    "--color-primary-200": "204 211 188",
    "--color-primary-300": "169 181 147",
    "--color-primary-400": "133 148 109",
    "--color-primary-500": "105 121 83",
    "--color-primary-600": "83 97 64",
    "--color-primary-700": "68 79 54",
    "--color-primary-800": "57 65 46",
    "--color-primary-900": "48 55 42",
    "--color-primary-950": "5 6 4",
  },
  blue: {
    "--color-primary-50": "246 247 249",
    "--color-primary-100": "236 239 242",
    "--color-primary-200": "212 219 227",
    "--color-primary-300": "175 188 202",
    "--color-primary-400": "131 152 173",
    "--color-primary-500": "100 123 147",
    "--color-primary-600": "79 99 122",
    "--color-primary-700": "65 81 99",
    "--color-primary-800": "57 69 83",
    "--color-primary-900": "51 60 71",
    "--color-primary-950": "41 48 58",
  },
};

export const ThemePicker = () => {
  const [activeTheme, setActiveTheme] = useLocalStorage<keyof typeof THEMES>(
    "theme",
    "blue",
  );

  useEffect(() => {
    const theme = THEMES[activeTheme];
    for (const key in theme) {
      document.documentElement.style.setProperty(
        key,
        theme[key as keyof Theme],
      );
    }
  }, [activeTheme]);

  return (
    <div className="flex gap-1">
      {Object.keys(THEMES).map((key) => {
        return (
          <button
            key={key}
            className={"hover:brightness-125"}
            onClick={() => setActiveTheme(key as keyof typeof THEMES)}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

type Theme = {
  "--color-primary-50": string;
  "--color-primary-100": string;
  "--color-primary-200": string;
  "--color-primary-300": string;
  "--color-primary-400": string;
  "--color-primary-500": string;
  "--color-primary-600": string;
  "--color-primary-700": string;
  "--color-primary-800": string;
  "--color-primary-900": string;
  "--color-primary-950": string;
};
