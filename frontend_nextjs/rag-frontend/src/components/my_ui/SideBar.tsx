import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { FiSidebar } from "react-icons/fi"
import { useState, useEffect } from "react"

type SidebarProps = {
     allFiles: File[];     // optional list of previous files
}

export default function Sidebar({ allFiles }: SidebarProps) {


    return (
        <Sheet>
            <SheetTrigger className="absolute left-[calc(100vw-88vw)] cursor-pointer justify-items-center">
                <FiSidebar className="dark:text-white text-2xl" />
            </SheetTrigger>

            <SheetContent className="rounded-xl border-amber-50 border-t-1 border-b-1">
                <SheetHeader>
                    <SheetTitle className="text-2xl border-b dark:border-b-amber-50">Sources</SheetTitle>
                    <SheetDescription className="rounded-md pb-2 border-b-2 dark:border-b-gray-600 text-amber-700">
                        The current source is displayed first. Previous sources may still influence answers.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-4 flex flex-col gap-2">
                    {allFiles.length === 0 ? (
                        <p className="text-sm text-gray-500">No PDFs uploaded yet.</p>
                    ) : (
                        allFiles.map((f, idx) => (
                            <div key={idx} className="p-2 border rounded dark:border-gray-600">
                                {f.name}
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
