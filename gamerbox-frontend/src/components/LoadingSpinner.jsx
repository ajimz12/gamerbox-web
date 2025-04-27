import { Gamepad2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin text-purple-600">
        <Gamepad2 size={60} />
      </div>
    </div>
  );
}
