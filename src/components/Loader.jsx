import { LucideLoaderPinwheel } from 'lucide-react';

const Loader =  ({className}) => {

    return(
        <div className={`flex justify-center items-center ${className}`}>
            <LucideLoaderPinwheel className="h-20 w-20 animate-spin anima" />
        </div>
    )
}


export default Loader;