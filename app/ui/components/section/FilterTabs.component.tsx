import {useEffect, useRef, useState} from "react";
import Tag from "./Tag.component";
import {IoCaretBackCircleOutline} from "react-icons/io5";

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

  const handleScroll = (amount: number) => () => {
    if (filterTabsRef.current) {
      const start = filterTabsRef.current.scrollLeft;
      const end = start + amount;
      const duration = 300; // Animation duration in ms
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1
        const easeInOutQuad = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress; // Easing function

        if (filterTabsRef.current) {
          filterTabsRef.current.scrollLeft = start + (end - start) * easeInOutQuad;
        }

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

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

  const canScrollRight = scrollLeft < filterTabsRef.current?.scrollLeftMax - 10;
  const canScrollLeft = scrollLeft > 10;


  return (
    <div className={`flex flex-row w-full sm:w-[calc(100%+4rem)] sm:-ml-[2rem]`}>

      
        <button className={`hidden sm:block sm:right-5 relative ${canScrollLeft ? "visible" : "invisible"}`}onClick={handleScroll(-200)}>
          <IoCaretBackCircleOutline className="text-3xl" />
        </button>
    

      <div ref={filterTabsRef} className='flex flex-row gap-2 overflow-x-auto no-scrollbar p-1 transition-all duration-300'>
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

      
        <button className={`hidden sm:block sm:left-5 relative ${canScrollRight ? "visible" : "invisible"}`} onClick={handleScroll(200)}>
          <IoCaretBackCircleOutline className="rotate-180 text-3xl" />
        </button>

    </div>

  );
}