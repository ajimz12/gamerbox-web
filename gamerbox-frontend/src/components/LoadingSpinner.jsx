import { Gamepad2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin text-[#3D5AFE]">
        <Gamepad2 size={60} />
      </div>
    </div>
  );
}
