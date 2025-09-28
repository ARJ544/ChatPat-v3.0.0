"use client";
import { useState } from "react";
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
import DropZone from "@/components/my_ui/FileDropZone";
import { Terminal } from "lucide-react";
// import DotLoader from "@/components/DotLoader";
import Loader from "@/app/loading";

type FileUploadDialogProps = {
    sourceAdded: boolean;
    userName: string;
    setuserNameAction: (userName: string) => void;
    setSourceAddedAction: (sourceAdded: boolean) => void;
    setUploadedFileAction: (file: File) => void;
}

export function FileUploadDialog({ sourceAdded, userName, setuserNameAction, setSourceAddedAction,setUploadedFileAction }: FileUploadDialogProps) {
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
        } else if (userName.trim() === "") {
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
        formData.append("userName", userName);

        try {
            const uploadResponse = await fetch("http://127.0.0.1:8000/extract", {
                method: "POST",
                body: formData, // FormData sets headers automatically
            });

            if (uploadResponse.ok) {
                const data = await uploadResponse.json();
                console.log(data.message);
                setFetchError(data.message);
                setIsLoading(false);
                setSourceAddedAction(true);
                setUploadedFileAction(files[0]);
            }
            if (!uploadResponse.ok) {
                const data = await uploadResponse.json();
                setFetchError(data.error);
                setIsLoading(false);
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
            {isLoading ? <Loader justifyContent="center" alignItems="center" /> :
                <Dialog
                    defaultOpen={open}
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
                            } else if (userName.trim() === "") {
                                setShowUserNameAlert(true);
                                setShowFileAlert(false);
                            }
                        }}
                        onPointerDownOutside={(e) => {
                            e.preventDefault()
                            if (!files || files.length < 1) {
                                setShowFileAlert(true);
                                setShowUserNameAlert(false);
                            } else if (userName.trim() === "") {
                                setShowUserNameAlert(true);
                                setShowFileAlert(false);
                            }
                        }}
                        className="border-amber-50"
                    >
                        <form onSubmit={handleAdd} className="flex flex-col gap-4">
                            <DialogHeader>
                                <DialogTitle>Add 1 Source at a time. (PDF only)</DialogTitle>

                                <DialogDescription>
                                    Sources let SigmARJ base its responses on the information that matters most to you.
                                    (Examples: marketing plans, course reading, research notes, sales documents, etc.)
                                </DialogDescription>

                                <Input id="username" autoFocus autoComplete="on" type="text" value={userName} onChange={(e) => setuserNameAction(e.target.value)} placeholder="Enter UserName" />

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
            }
        </>

    );
}