"use client"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { FileUploadDialog } from "@/components/my_ui/FileUploadDialog";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";
import { FiSidebar } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/my_ui/SideBar";

const handleGenerate = (e: React.FormEvent) => {

}

export default function ChatUi() {
    const [sourceAdded, setSourceAdded] = useState(false);


    return (
        <>
            <FileUploadDialog sourceAdded={sourceAdded} setSourceAddedAction={setSourceAdded} />
            <Card className="w-full border-gray-300 shadow-2xl max-w-4/5 h-[calc(100vh-17vh)] dark:bg-[#1f1f1f] dark:border-gray-500 ">
                <CardHeader>
                    <Sidebar />
                    <CardDescription className="text-transparent">
                        -
                    </CardDescription>
                </CardHeader>

                <ScrollArea className="w-full h-[calc(100vh-49vh)] rounded-md border-t-2 p-1">
                    <CardContent>

                        Jokester began sneaking into the castle in the middle of the night and leaving
                        jokes all over the place: under the king's pillow, in his soup, even in the
                        royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
                        then, one day, the people of the kingdom discovered that the jokes left by
                        Jokester were so funny that they couldn't help but laugh. And once they
                        started laughing, they couldn't stop.Jokester began sneaking into the castle in the middle of the night and leaving
                        jokes all over the place: under the king's pillow, in his soup, even in the
                        royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
                        then, one day, the people of the kingdom discovered that the jokes left by
                        Jokester were so funny that they couldn't help but laugh. And once they
                        started laughing, they couldn't stop.Jokester began sneaking into the castle in the middle of the night and leaving
                        jokes all over the place: under the king's pillow, in his soup, even in the
                        royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
                        then, one day, the people of the kingdom discovered that the jokes left by
                        Jokester were so funny that they couldn't help but laugh. And once they
                        started laughing, they couldn't stop.Jokester began sneaking into the castle in the middle of the night and leaving
                        jokes all over the place: under the king's pillow, in his soup, even in the
                        royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
                        then, one day, the people of the kingdom discovered that the jokes left by
                        Jokester were so funny that they couldn't help but laugh. And once they
                        started laughing, they couldn't stop.Jokester began sneaking into the castle in the middle of the night and leaving
                        jokes all over the place: under the king's pillow, in his soup, even in the
                        royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
                        then, one day, the people of the kingdom discovered that the jokes left by
                        Jokester were so funny that they couldn't help but laugh. And once they
                        started laughing, they couldn't stop.Jokester began sneaking into the castle in the middle of the night and leaving
                        jokes all over the place: under the king's pillow, in his soup, even in the
                        royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
                        then, one day, the people of the kingdom discovered that the jokes left by
                        Jokester were so funny that they couldn't help but laugh. And once they
                        started laughing, they couldn't stop.
                    </CardContent>
                </ScrollArea>

            </Card>
            {sourceAdded ? (
                <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl px-4 z-40">
                        <Input
                            id="query"
                            autoFocus
                            type="text"
                            placeholder="Start Typing..."
                            className="h-20"
                        />
                    </div>
                </form>
            ) : (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl px-4">
                    <Input
                        className="h-20"
                        disabled
                        placeholder="Upload a source to get started."
                    />
                </div>
            )}


        </>
    );
}
