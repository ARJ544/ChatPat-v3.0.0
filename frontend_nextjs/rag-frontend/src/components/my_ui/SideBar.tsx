import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { FiSidebar } from "react-icons/fi";

export default function Sidebar() {
    return (

        <Sheet>
            <SheetTrigger className="absolute left-[calc(100vw-88vw)] cursor-pointer justify-items-center"><FiSidebar className="dark:text-white text-2xl " /></SheetTrigger>
            <SheetContent className="rounded-xl border-amber-50 border-t-amber-50- border-t-1 border-b-amber-50- border-b-1 ">
                <SheetHeader>
                    <SheetTitle className="text-2xl border-b dark:border-b-amber-50">Sources</SheetTitle>
                    <SheetDescription className="rounded-md pb-2 border-b-2 dark:border-b-gray-600 text-amber-700 ">
                        Only the current sources are being displayed, not the previous ones. However, answers may still come from previous sources if available.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}