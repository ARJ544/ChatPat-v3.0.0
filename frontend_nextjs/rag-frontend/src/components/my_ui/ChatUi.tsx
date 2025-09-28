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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button";
import { FiSidebar } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/my_ui/SideBar";
import Loader from "@/app/loading";



export default function ChatUi() {
    const [sourceAdded, setSourceAdded] = useState(true);
    const [fileuploadOpen, setFileuploadOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [query, setQuery] = useState("");
    const [userName, setUserName] = useState("");
    const [inputMsg, setDisplayedInputMsg] = useState("");
    const [BotMsg, setBotMsg] = useState("");


    const handleGenerate = async (e: React.FormEvent) => {
        setDisplayedInputMsg(query);
        e.preventDefault();

        if (query.trim() === "") {
            return;
        } else if (userName === "") {
            console.log("No username")
        }

        setIsGenerating(true);

        const formData = new FormData();
        formData.append("query", query);
        formData.append("userName", userName);
        try {
            const queryResponse = await fetch("http://127.0.0.1:8000/generate", {
                method: "POST",
                body: formData,
            });

            if (queryResponse.ok) {
                // console.log(queryResponse.text());
                // setInput(await queryResponse.text())
                setIsGenerating(false);
                console.log(queryResponse.json())
                const data = await queryResponse.json();
                setBotMsg(data.response)
            }
            if (!queryResponse.ok) {
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
                />
            )}

            <FileUploadDialog sourceAdded={sourceAdded} userName={userName} setuserNameAction={setUserName} setSourceAddedAction={setSourceAdded} />

            <Card className="w-full border-gray-300 gap-1 shadow-2xl max-w-4/5 h-[calc(100vh-17vh)] dark:bg-[#1f1f1f] dark:border-gray-500 ">
                <CardHeader>
                    <Sidebar />
                    <Button variant={"default"} className="text-xs h-6 overflow-ellipsis absolute right-[calc(100vw-88vw)] cursor-pointer justify-items-center" onClick={handleUploadSource}>Upload a Source</Button>
                    <CardDescription className="text-transparent">
                        -
                    </CardDescription>
                </CardHeader>

                <ScrollArea className="flex-1 w-full rounded-md border-t-2 dark:border-t-gray-500 p-1 overflow-y-auto">
                    <CardContent>
                        {inputMsg}
                        <br /><br />
                        {isGenerating ? <Loader dotSize={7} dotMargin={1} justifyContent={null} alignItems={null} /> : BotMsg}
                    </CardContent>
                </ScrollArea>
                <CardFooter className="">
                    {sourceAdded ? (
                        <form onSubmit={handleGenerate} className="flex w-full gap-2 items-center-safe">
                            <Input
                                id="query"
                                autoFocus
                                autoComplete="off"
                                type="text"
                                placeholder="Start Typing..."
                                className="h-12 flex-1"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <Button type="submit">Send</Button>
                        </form>
                    ) : (
                        <Input
                            className="h-12 flex-1"
                            disabled
                            placeholder="Upload a source to get started."
                        />
                    )}
                </CardFooter>

            </Card>

        </>
    );
}
