export const GENDER_OPTIONS = ["Men", "Female", "Unisex"];

export const ICON_OPTIONS = [
  { value: "ri-scissors-2-line", label: "Scissors", category: "Hair" },
  { value: "ri-scissors-cut-line", label: "Scissors Cut", category: "Hair" },
  { value: "ri-palette-line", label: "Palette", category: "Hair" },
  { value: "ri-brush-3-line", label: "Brush", category: "Makeup" },
  { value: "ri-emotion-happy-line", label: "Happy Face", category: "Makeup" },
  { value: "ri-emotion-line", label: "Face", category: "Spa" },
  { value: "ri-user-heart-line", label: "User Heart", category: "Spa" },
  { value: "ri-hand-heart-line", label: "Hand Heart", category: "Nails" },
  { value: "ri-footprint-line", label: "Footprint", category: "Nails" },
  { value: "ri-heart-pulse-line", label: "Heart Pulse", category: "Spa" },
  { value: "ri-spa-line", label: "Spa", category: "Spa" },
  { value: "ri-contrast-drop-line", label: "Drop", category: "Spa" },
];

export const GRADIENT_OPTIONS = [
  {
    value: "from-rose-500 to-pink-500",
    label: "Rose to Pink",
    color: "bg-gradient-to-r from-rose-500 to-pink-500",
  },
  {
    value: "from-pink-500 to-fuchsia-500",
    label: "Pink to Fuchsia",
    color: "bg-gradient-to-r from-pink-500 to-fuchsia-500",
  },
  {
    value: "from-purple-500 to-pink-500",
    label: "Purple to Pink",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    value: "from-blue-500 to-cyan-500",
    label: "Blue to Cyan",
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
  },
  {
    value: "from-rose-400 to-pink-400",
    label: "Light Rose to Pink",
    color: "bg-gradient-to-r from-rose-400 to-pink-400",
  },
  {
    value: "from-pink-400 to-fuchsia-400",
    label: "Light Pink to Fuchsia",
    color: "bg-gradient-to-r from-pink-400 to-fuchsia-400",
  },
  {
    value: "from-fuchsia-400 to-purple-400",
    label: "Fuchsia to Purple",
    color: "bg-gradient-to-r from-fuchsia-400 to-purple-400",
  },
  {
    value: "from-purple-400 to-rose-400",
    label: "Purple to Rose",
    color: "bg-gradient-to-r from-purple-400 to-rose-400",
  },
];

export const CATEGORY_GRADIENTS = [
  "from-rose-500 to-pink-500",
  "from-pink-500 to-fuchsia-500",
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-rose-500",
  "from-emerald-500 to-teal-500",
];

export const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes("hair")) return "ri-scissors-2-line";
  if (n.includes("makeup")) return "ri-brush-3-line";
  if (n.includes("spa") || n.includes("massage")) return "ri-user-heart-line";
  if (n.includes("nail")) return "ri-hand-heart-line";
  return "ri-grid-line";
};
