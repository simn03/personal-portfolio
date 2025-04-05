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
    <div className={`
          flex  bg-teal-300 dark:bg-teal-500 bg-opacity-25 dark:bg-opacity-25 rounded-3xl outline-2 
          ${shouldHover && 'md:hover:outline'} 
          ${(!isSelected && !isUnselected) && 'dark:text-teal-300 text-teal-500'}
          ${isSelected && 'dark:text-teal-300 text-teal-500 outline'}
          ${isUnselected && 'outline outline-red-500 dark:outline-red-300 opacity-50 text-red-500 dark:text-red-300'}
    `}>
      <p className="text-sm px-4 p-1 select-none place-self-center whitespace-nowrap">{children}</p>
    </div>
  )
}