"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Category {
  name: string;
  path: string;
  subcategories: string[];
}

const categories = [
  {
    name: "Video",
    path: "/video",
    subcategories: [
      "VHS Players",
      "LaserDisc Players",
      "CRT Televisions",
      "Projection TVs",
      "Video Scalers",
      "Camcorders",
      "Video Switchers",
      "Broadcast Monitors",
      "Analog Converters",
      "Movie Tapes",
    ],
  },
  {
    name: "Audio",
    path: "/audio",
    subcategories: [
      "Cassette Decks",
      "CD Players",
      "Turntables",
      "Boomboxes",
      "Stereo Receivers",
      "Graphic Equalizers",
      "Headphones",
      "Amplifiers",
      "MiniDisc Players",
      "Hi-Fi Speakers",
    ],
  },
  {
    name: "Recording",
    path: "/recording",
    subcategories: [
      "Hi-8 Camcorders",
      "VHS-C Cameras",
      "4-Track Recorders",
      "DAT Recorders",
      "Analog Mixers",
      "Tape Reels",
      "Field Microphones",
      "Portable Studios",
      "Recording Consoles",
      "Signal Processors",
    ],
  },
  {
    name: "Accessories",
    path: "/accessories",
    subcategories: [
      "RCA Cables",
      "SCART Adapters",
      "Antenna Switches",
      "Headphone Splitters",
      "Remote Controls",
      "Carrying Cases",
      "Rack Mounts",
      "Dust Covers",
      "Power Adapters",
      "Signal Boosters",
    ],
  },
  {
    name: "Miscellaneous",
    path: "/miscellaneous",
    subcategories: [
      "Floppy Disks",
      "Zip Drives",
      "Dial-Up Modems",
      "Retro Game Consoles",
      "CRT Monitors",
      "Mechanical Keyboards",
      "Trackball Mice",
      "Dot-Matrix Printers",
      "Palm PDAs",
      "Vintage Manuals",
    ],
  },
];

export default function Categories() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleCategoryClick = (cat: string, sub?: string) => {
    const query = new URLSearchParams();
    if (cat) query.set("category", cat);
    if (sub) query.set("subcategory", sub);
    router.push(`/search?${query.toString()}`); // Changed from /? to /search?
  };

  return (
    <div className="flex gap-2 relative">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="relative"
          onMouseEnter={() => setHovered(cat.name)}
          onMouseLeave={() => setHovered(null)}
        >
          <button
            className="win95-card flex flex-col gap-2 text-sm w-32"
            onClick={() => handleCategoryClick(cat.name)}
          >
            {cat.name}
          </button>

          {hovered === cat.name && cat.subcategories.length > 0 && (
            <div
              className="
                absolute top-full left-0
                min-w-[320px]
                bg-panel-light
                border border-border-dark
                shadow-lg
                grid grid-cols-2
                divide-x divide-border-dark
                z-10
              "
            >
              {cat.subcategories.map((sub) => (
                <div
                  key={sub}
                  onClick={() => handleCategoryClick(cat.name, sub)}
                  className="
                    px-4 py-2
                    text-sm
                    cursor-pointer
                    hover:bg-panel
                    border-b border-border-dark/40
                    last:border-b-0
                  "
                >
                  {sub}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}