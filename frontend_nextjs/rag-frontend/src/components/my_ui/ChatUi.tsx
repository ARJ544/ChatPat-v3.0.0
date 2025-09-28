"use client"

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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";
import { FiSidebar } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/my_ui/SideBar";
import Loader from "@/app/loading";
import MarkdownRenderer from "@/components/my_ui/MarkDownRender";



export default function ChatUi() {
    const [sourceAdded, setSourceAdded] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File[]>([]);
    const [fileuploadOpen, setFileuploadOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [query, setQuery] = useState("");
    const [userName, setUserName] = useState("");
    const [inputMsg, setDisplayedInputMsg] = useState("");
    const [BotMsg, setBotMsg] = useState("");


    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();


        if (query.trim() === "") {
            return;
        } else if (userName === "") {
            console.log("No username")
        }
        setDisplayedInputMsg(query);
        setIsGenerating(true);

        const formData = new FormData();
        formData.append("query", query);
        formData.append("userName", userName);
        setQuery("")
        try {
            const queryResponse = await fetch("http://127.0.0.1:8000/generate", {
                method: "POST",
                body: formData,
            });

            if (queryResponse.ok) {
                // console.log(queryResponse.text());
                // setInput(await queryResponse.text())
                setIsGenerating(false);
                const data = await queryResponse.json();
                setBotMsg(data.response)
            }
            if (!queryResponse.ok) {
                setIsGenerating(false);
                const data = await queryResponse.json();
                setBotMsg(data.error || "Unknown Error Occured. Try again Later or Refresh.")
            }
        }
        catch (error) {
            setIsGenerating(false);
            console.log(error)
            setBotMsg(String(error))
        }
    }
    const handleUploadSource = () => {
        setFileuploadOpen((prev) => !prev);
    }

    return (
        <>
            {fileuploadOpen && (
                <FileUploadDialog
                    sourceAdded={sourceAdded}
                    userName={userName}
                    setuserNameAction={setUserName}
                    setSourceAddedAction={setSourceAdded}
                    setUploadedFileAction={(file: File) => setUploadedFile(prev => [file, ...prev])}
                />
            )}

            <FileUploadDialog sourceAdded={sourceAdded} userName={userName} setuserNameAction={setUserName} setSourceAddedAction={setSourceAdded} setUploadedFileAction={(file: File) => setUploadedFile(prev => [file, ...prev])} />

            <Card className="w-full border-gray-300 gap-1 shadow-2xl max-w-4/5 h-[calc(100vh-17vh)] dark:bg-[#1f1f1f] dark:border-gray-500 ">
                <CardHeader>
                    <Sidebar allFiles={uploadedFile} />
                    <Button variant={"default"} className="text-xs h-6 overflow-ellipsis absolute right-[calc(100vw-88vw)] cursor-pointer justify-items-center" onClick={handleUploadSource}>Upload a Source</Button>
                    <CardDescription className="text-transparent">
                        -
                    </CardDescription>
                </CardHeader>

                <ScrollArea className="flex-1 w-full rounded-md border-t-2 dark:border-t-gray-500 p-1 overflow-y-auto">
                    <CardContent>
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-end mt-1">
                                <div className="bg-black text-white rounded-lg p-3 max-w-xs md:max-w-md break-words">
                                    {inputMsg}
                                </div>
                            </div>
                            <div className="flex justify-start">

                                {isGenerating ? (
                                    <Loader dotSize={7} dotMargin={1} justifyContent="none" alignItems="none" />
                                ) : (
                                    <MarkdownRenderer content={BotMsg} />
                                )}

                            </div>
                        </div>
                    </CardContent>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <CardFooter className="">
                    {sourceAdded ? (
                        <form onSubmit={handleGenerate} className="flex w-full gap-2 items-center-safe">
                            <textarea
                                id="query"
                                placeholder="Start Typing..."
                                autoFocus
                                autoComplete="off"
                                className="rounded-2xl flex-1 justify-center border-2 border-gray-400 dark:bg-neutral-800 dark:border resize-none overflow-y-auto min-h-[calc(3rem)] p-6 max-h-70 focus-visible:outline-2 scrollbar-thin"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleGenerate(e); // send message
                                    }
                                }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = "auto"; // reset height
                                    target.style.height = target.scrollHeight + "px"; // expand to fit content
                                }}
                            />
                            <Button type="submit">Send</Button>
                        </form>
                    ) : (
                        <Input
                            className="h-20 flex-1 placeholder:text-black placeholder:text-2xl dark:placeholder:text-white "
                            disabled
                            placeholder="Upload a source to get started."
                        />
                    )}
                </CardFooter>

            </Card>

        </>
    );
}
