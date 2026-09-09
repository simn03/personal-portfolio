type TagProps = {
  children: React.ReactNode,
  isSelected?: boolean,
  isUnselected?: boolean,
  shouldHover?: boolean,
}

export default function Tag({
  children,
  isSelected = false,
  isUnselected = false,
  shouldHover = true,
}: TagProps) {
  return (
    <span className={`
      flex shrink-0 rounded-full bg-teal-300/25 outline-2 dark:bg-teal-500/25
      ${shouldHover ? "md:hover:outline" : ""}
      ${!isSelected && !isUnselected ? "text-teal-600 dark:text-teal-300" : ""}
      ${isSelected ? "text-teal-600 outline dark:text-teal-300" : ""}
      ${isUnselected ? "text-red-500 opacity-50 outline outline-red-500 dark:text-red-300 dark:outline-red-300" : ""}
    `}>
      <span className="select-none whitespace-nowrap px-4 py-1 text-sm">{children}</span>
    </span>
  )
}
