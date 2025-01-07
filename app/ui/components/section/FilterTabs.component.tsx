import {useEffect, useRef, useState} from "react";
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

  const filterTabsRef = useRef(null);

  const [scrollLeft, setScrollLeft] = useState(0)

  const modifyTabs = (tab: string) => {
    if (selectedTabs.includes(tab)) {
      setSelectedTabs(selectedTabs.filter(selectedTab => selectedTab !== tab));
    } else {
      setSelectedTabs([...selectedTabs, tab]);
    }
  }

  const handleScroll = (amount) => () => {
    if (filterTabsRef.current) {
      filterTabsRef.current.scrollLeft += amount;
    }
  }

  // Add a scroll event listener to update scrollLeft state
  useEffect(() => {
    const handleScrollEvent = () => {
      if (filterTabsRef.current) {
        setScrollLeft(filterTabsRef.current.scrollLeft);
      }
    };

    const currentRef = filterTabsRef.current;
    currentRef?.addEventListener('scroll', handleScrollEvent);

    return () => {
      currentRef?.removeEventListener('scroll', handleScrollEvent);
    };
  }, [filterTabsRef]);


  return (
    <div className={`flex flex-row`}>

      {scrollLeft > 10 && (
        <button className="absolute left-0 mr-[100px] z-10" onClick={handleScroll(-50)}>
          Left
        </button>
      )}

      <div ref={filterTabsRef} className='snap-mandatory snap-x flex flex-row gap-2 overflow-x-auto no-scrollbar p-1'>
        {
          tabs.map((tab) => {
            return (
              <button key={tab} className={`snap-left`} onClick={() => modifyTabs(tab)}>
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

      {scrollLeft < filterTabsRef.current?.scrollLeftMax - 10 && (
        <button onClick={handleScroll(50)}>
          Right
        </button>
      )}

    </div>

  );
}