import Image from "next/image";
import { FileUploadDialog } from "@/components/my_ui/FileUploadDialog";

export default function Home() {
  return (
    <div className="">
      <FileUploadDialog />
    </div>
  );
}
