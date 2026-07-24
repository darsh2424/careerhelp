import { CircleAlert, CircleCheckBig, Info, TriangleAlert } from "lucide-react";
const icons = {
    error: <CircleAlert className="h-8 w-8 text-red-500" />,
    warning: <TriangleAlert className="h-8 w-8 text-yellow-500" />,
    success: <CircleCheckBig className="h-8 w-8 text-green-500" />,
    info: <Info className="h-8 w-8 text-blue-500" />
}
const bgClasses = {
    error:"bg-red-100",
    warning:"bg-yellow-100",
    success:"bg-green-100",
    info:"bg-blue-100"
}

export default function Modal({
    open,
    type,
    title,
    message,
    primaryText,
    secondaryText,
    onPrimary,
    onSecondary
}) {
    if(!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl  text-center p-8 bg-white shadow-2xl">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center  rounded-full ${bgClasses[type]}`}>
                    {icons[type]}
                </div>

                <h2 className="mt-6 text-2xl font-bold">{title}</h2>
                <p className="mt-3 text-gray-500 leading-7">{message}</p>

                {/* <div className="my-8 border-t"></div> */}
                
                <div className="flex gap-4 mt-5">
                    <div className="flex-1">
                        <button
                            type="button"
                            className="
                                w-full
                                max-w-52
                                rounded-xl
                                bg-blue-600
                                py-3
                                font-semibold
                                text-white
                                transition
                                hover:bg-blue-700
                                active:scale-[0.98]
                            "
                            onClick={onPrimary}
                        >
                            {primaryText}
                        </button>

                    </div>

                    {secondaryText && onSecondary && 
                    <div className="flex-1">
                        <button
                            type="button"
                            className="
                                w-full
                                rounded-xl
                                bg-gray-100
                                py-3
                                font-semibold
                                text-gray-700
                                transition
                                hover:bg-gray-200
                                active:scale-[0.98]
                            "
                            onClick={onSecondary}
                        >
                            {secondaryText}
                        </button>

                    </div>
                    }
                </div>
            </div>
        </div>
    )
}
