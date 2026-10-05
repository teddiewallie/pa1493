import { Badge as UIBadge } from "@/components/ui/badge";

const badgeColor = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  purple: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  red: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  orange: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  yellow: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  lime: "bg-lime-50 text-lime-700 dark:bg-lime-950 dark:text-lime-300",
  emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  teal: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  fuchsia: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300",
  pink: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  slate: "bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
  gray: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
  zinc: "bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300",
  neutral: "bg-neutral-50 text-neutral-700 dark:bg-neutral-950 dark:text-neutral-300",
  stone: "bg-stone-50 text-stone-700 dark:bg-stone-950 dark:text-stone-300",
  mauve: "bg-mauve-50 text-mauve-700 dark:bg-mauve-950 dark:text-mauve-300",
  olive: "bg-olive-50 text-olive-700 dark:bg-olive-950 dark:text-olive-300",
  mist: "bg-mist-50 text-mist-700 dark:bg-mist-950 dark:text-mist-300",
  taupe: "bg-taupe-50 text-taupe-700 dark:bg-taupe-950 dark:text-taupe-300",
};

const Badge = ({article, articleTypes, color, label, type}) => {

  const getTypeName = (id) => articleTypes
    .find((articleType) => articleType.id == id).name;

  color = color ?? type === "item" ? "yellow" : type === "group" ? "orange" : "olive";

  return (
    <>
      {article && <UIBadge className={`ml-2 ${Object.values(badgeColor)[article.type_id]}`}>{getTypeName(article.type_id)}</UIBadge>}
      {!article && <UIBadge className={`ml-2 ${badgeColor[color]}`}>{label}</UIBadge>}
    </>
  );
};

export { Badge };

