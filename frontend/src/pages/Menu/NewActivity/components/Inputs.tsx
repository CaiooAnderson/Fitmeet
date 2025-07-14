import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InputsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  descriptionClassName?: string;
}

export default function Inputs({
  title,
  setTitle,
  description,
  setDescription,
  descriptionClassName,
}: InputsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="title"
          className="text-[1rem] font-semibold h-5 text-[var(--text)]"
        >
          Título <span className="text-[var(--warning)] h-5">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          placeholder="Ex.: Torneio de Futebol"
          onChange={(e) => setTitle(e.target.value)}
          className="pr-10 focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] px-5 py-4 h-14"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="description"
          className="text-[1rem] font-semibold h-5 text-[var(--text)]"
        >
          Descrição <span className="text-[var(--warning)] h-5">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Exiba as informações sobre a atividade"
          className={`w-80 resize-none rounded-lg overflow-auto pr-10 focus:shadow-green-300 focus-visible:border-[var(--primary)] border-[var(--input-border)] px-5 py-4 ${descriptionClassName ?? "h-27.5"}`}
        />
      </div>
    </>
  );
}
