import Tag from "./Tag.component";

type FilterTabsProps = {
  tabs: string[],
  selectedTabs: string[],
  setSelectedTabs: (tabs: string[]) => void
}

export default function FilterTabs({
  tabs,
  selectedTabs,
  setSelectedTabs
}: FilterTabsProps) {

  const modifyTabs = (tab: string) => {
    if (selectedTabs.includes(tab)) {
      setSelectedTabs(selectedTabs.filter(selectedTab => selectedTab !== tab));
    } else {
      setSelectedTabs([...selectedTabs, tab]);
    }
  }


  return (
    <div className='flex flex-row gap-2 overflow-x-auto no-scrollbar p-1'>
      {
        tabs.map((tab) => {
          return (
            <button key={tab} onClick={() => modifyTabs(tab)}>
              <Tag
                shouldHover={false}
                isSelected={selectedTabs.includes(tab)}
              >
                {tab}
              </Tag>
            </button>
          )
        })
      }
    </div>
  );
}