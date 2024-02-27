import { Spinner } from "@material-tailwind/react";

function Loading() {
    return ( 
        <div className="flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 bg-[#140748a0] backdrop-blur-sm gap-2 z-[9999]">
            <Spinner className="w-[50px] h-[50px]" color="indigo"/>
            <p className="text-white">Kuting...</p>
        </div>
     );
}

export default Loading;