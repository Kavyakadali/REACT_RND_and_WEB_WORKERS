import {Outlet} from "react-router-dom";
export default BackgroundComponent

function BackgroundComponent(){
    return(
        <>
        
        <div className="relative md:w-full  ">
        <div className="flex justify-center items-center relative">
        <img src="/Logo.svg" className="flex absolute pt-[90px] pb-8 sm:w-[170.9px] sm:h-[165.833px] md:w-[180.9px] md:h-[185.833px]"/>
        
        </div>
      <img src="/stickyNotes.svg" className="absolute top-0 pl-[30px] left-0  sm:w-[180.9px] sm:h-[145.833px] md:w-[280.9px] md:h-[205.833px]  " />
       <img src="/notified.svg" className="absolute top-0 pr-[50px] right-0  sm:w-[180.9px] sm:h-[145.833px] md:w-[200.9px] h-[180.833px]"  />
       <div className="flex justify-center items-center">
      

      <Outlet/>
    
        
        </div>
       <img src="/TrackProgress.svg" className="absolute top-[300px]  pl-[30px]   sm:w-[180.9px] sm:h-[145.833px] md:w-[268.9px] h-[180.833px]" />
       <img src="/6+.svg" className="absolute top-[300px]  pr-[50px] right-0  sm:w-[180.9px] sm:h-[145.833px] md:w-[268.9px] h-[170.833px]" />
       </div>

         
        
 

         </>
       
    );
}



       
// <div className="relative md:w-full h-screen ">
//     <img src="/stickyNotes.svg" className="absolute top-0  left-0 w-[268.9px] h-[205.833px]  " />
//     <img src="/Logo.svg" className="flex  " />
//     <img src="/notified.svg" className="absolute top-0 right-0" />
//     <img src="/TrackProgress.svg" className="absolute bottom-0 pl-[20px]  w-[268.9px] h-[205.833px]" />
//     <img src="/6+.svg" className="absolute bottom-0  right-0 w-[268.9px] h-[205.833px]" /></div>
