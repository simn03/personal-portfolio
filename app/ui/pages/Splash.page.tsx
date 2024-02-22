import RevealOnScroll from "../components/home/RevealOnScroll.component";
import TypeEffect from "../components/home/TypeEffect.component";
import ScrollButton from "../components/home/ScrollButton.component";
import CaretDown from "../components/icons/CaretDownDouble.icon";

export default function SplashPage() {
    return (
        <>
            <div className={`w-full flex flex-col absolute top-0 left-0 h-screen document-padding`}>

                <RevealOnScroll
                    className="max-sm:pt-10 flex m-auto flex-col lg:flex-row gap-10 lg:gap-16 text-3xl place-items-center ">

                    <TypeEffect
                        className='flex flex-col text-center'
                        phrase={`Sim is a student`}
                        phrases={["majoring in Computer Science at UBC", "minoring in Data Science at UBC", ""]}/>


                </RevealOnScroll>

                <ScrollButton
                    className='flex flex-col mx-auto max-sm:basis-1/4 text-teal-600 dark:text-teal-300 text-sm text-center underline underline-offset-4 hover:underline-offset-8 transition-all'
                    elementID={'projects'}>
                    Scroll to Projects

                    <CaretDown className={`animate-bounce flex mx-auto mt-3 opacity-75 animate-ease-linear`}
                               innerClassName={`stroke-teal-600 dark:stroke-teal-300`}/>

                </ScrollButton>

            </div>

            <div className='h-screen'></div>
        </>
    );
}