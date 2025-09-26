"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import DropZone from "@/components/FileDropZone";
import { Terminal } from "lucide-react";
import DotLoader from "@/components/DotLoader";

export function FileUploadDialog() {
    const [sourceAdded, setSourceAdded] = useState(false);
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(true);
    const [files, setFiles] = useState<File[] | undefined>(undefined);
    const [showFileAlert, setShowFileAlert] = useState(false);
    const [showUserNameAlert, setShowUserNameAlert] = useState(false);
    const [showFileLimitAlert, setShowFileLimitAlert] = useState(false);
    const [showFetchFailedAlert, setShowFetchFailedAlert] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!files || files.length < 1) {
            // alert("Please add a source before proceeding!");
            setShowFileAlert(true);
            setShowUserNameAlert(false);
            setShowFileLimitAlert(false);
            return;
        } else if (files.length > 1) {
            setShowFileLimitAlert(true);
            setShowFileAlert(false);
            setShowUserNameAlert(false);
            return;
        } else if (input.trim() === "") {
            setShowUserNameAlert(true);
            setShowFileAlert(false);
            setShowFileLimitAlert(false);
            return;
        }

        setOpen(false);
        setShowFileAlert(false);
        setShowUserNameAlert(false);
        setIsLoading(true);

        // Sending to backend
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("userName", input);

        try {
            const uploadResponse = await fetch("http://127.0.0.1:8000/extract", {
                method: "POST",
                body: formData, // FormData sets headers automatically
            });

            if (uploadResponse.ok) {
                console.log("File uploaded successfully");
                setIsLoading(false);
                setSourceAdded(true);
            }
        }
        catch (error) {
            console.error("Error uploading file:", error);
            setIsLoading(false);
            setOpen(true);
            setFetchError(String(error));
            setShowFetchFailedAlert(true);
        }


    };

    return (
        <>
            isLoading ? <DotLoader backgroundColor="#ff4757" margin={10} /> :
            <Dialog
                open={open}
                onOpenChange={(flse) => {
                    // if (!sourceAdded || !open) {
                    //     setTimeout(() => setOpen(true), 0);
                    // }
                    setShowFileAlert(!flse)
                }}
            >
                <DialogContent
                    onEscapeKeyDown={(e) => {
                        e.preventDefault()
                        if (!files || files.length < 1) {
                            setShowFileAlert(true);
                            setShowUserNameAlert(false);
                        } else if (input.trim() === "") {
                            setShowUserNameAlert(true);
                            setShowFileAlert(false);
                        }
                    }}
                    onPointerDownOutside={(e) => {
                        e.preventDefault()
                        if (!files || files.length < 1) {
                            setShowFileAlert(true);
                            setShowUserNameAlert(false);
                        } else if (input.trim() === "") {
                            setShowUserNameAlert(true);
                            setShowFileAlert(false);
                        }
                    }}
                >
                    <form onSubmit={handleAdd} className="flex flex-col gap-4">
                        <DialogHeader>
                            <DialogTitle>Add 1 Source at a time. (PDF only)</DialogTitle>

                            <DialogDescription>
                                Sources let SigmARJ base its responses on the information that matters most to you.
                                (Examples: marketing plans, course reading, research notes, sales documents, etc.)
                            </DialogDescription>

                            <Input id="username" autoFocus autoComplete="on" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter UserName" />

                            <p><span className="text-sm text-emerald-500">Note: Always use the same UserName for all sources.</span></p>

                            <DropZone files={files} setFiles={setFiles} />

                            {showFileAlert && (
                                <Alert variant="destructive" className="mt-4">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Warning!</AlertTitle>
                                    <AlertDescription>
                                        Please add a source before proceeding!
                                    </AlertDescription>
                                </Alert>
                            )}
                            {showUserNameAlert && (
                                <Alert variant="destructive" className="mt-4">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Warning!</AlertTitle>
                                    <AlertDescription>
                                        Please enter a UserName before proceeding!
                                    </AlertDescription>
                                </Alert>
                            )}
                            {showFileLimitAlert && (
                                <Alert variant="destructive" className="mt-4">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Warning!</AlertTitle>
                                    <AlertDescription>
                                        Only 1 pdf file is allowed at a time!
                                    </AlertDescription>
                                </Alert>
                            )}
                            {showFetchFailedAlert && (
                                <Alert variant="destructive" className="mt-4">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Error!!!</AlertTitle>
                                    <AlertDescription>
                                        Failed to upload file. Please try again.<br />
                                        <p><span className="text-amber-600">{fetchError}</span></p>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="submit" >Add</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog >
        </>

    );
}