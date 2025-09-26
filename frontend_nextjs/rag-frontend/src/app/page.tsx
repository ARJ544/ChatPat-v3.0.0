import Image from "next/image";
import { FileUploadDialog } from "@/components/FileUploadDialog";

export default function Home() {
  return (
    <div className="">
      <FileUploadDialog />
    </div>
  );
}
