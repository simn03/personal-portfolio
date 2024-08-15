type TagProps = {
  children: React.ReactNode,
  isSelected?: boolean,
  shouldHover?: boolean,
}

export default function Tag({
  children,
  isSelected = false,
  shouldHover = true,
}: TagProps) {
  return (
    <div className={`flex text-teal-500 dark:text-teal-300 bg-teal-300 dark:bg-teal-500 bg-opacity-25 dark:bg-opacity-25 rounded-3xl outline-2 ${shouldHover && 'md:hover:outline'} ${isSelected && 'outline'}`}>
      <p className="text-sm px-4 p-1 select-none place-self-center whitespace-nowrap">{children}</p>
    </div>
  )
}