import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface MarkDownProps {
    content: string;
}

export default function MarkdownRenderer({content}: MarkDownProps) {

    return (
        <div className="w-full rounded-2xl text-wrap wrap-break-word">
            <ScrollArea className="rounded-md text-wrap wrap-break-word">
                <div className="markdown-body p-[calc(1rem)] text-wrap wrap-break-word" >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
