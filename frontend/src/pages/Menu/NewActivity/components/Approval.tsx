import { Label } from "@/components/ui/label";

interface ApprovalProps {
  approvalRequired: boolean;
  setApprovalRequired: (value: boolean) => void;
}

export default function Approval({
  approvalRequired,
  setApprovalRequired,
}: ApprovalProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-[1rem] font-semibold h-5 text-[var(--text)]">
        Requer aprovação para participar?{" "}
        <span className="text-[var(--warning)]">*</span>
      </Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setApprovalRequired(true)}
          className={`px-4 py-2 h-11 w-19 rounded-lg text-[1rem] cursor-pointer border ${
            approvalRequired
              ? "bg-[var(--text)] text-white border-[var(--text)]"
              : "bg-white text-[var(--text)] border-gray-300"
          }`}
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => setApprovalRequired(false)}
          className={`px-4 py-2 h-11 w-19 rounded-lg text-[1rem] cursor-pointer border ${
            !approvalRequired
              ? "bg-[var(--text)] text-white border-[var(--text)]"
              : "bg-white text-[var(--text)] border-gray-300"
          }`}
        >
          Não
        </button>
      </div>
    </div>
  );
}
