import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  addDays,
  format,
  isBefore,
  setHours,
  setMinutes,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ScheduleProps {
  scheduledDate: Date | undefined;
  setScheduledDate: (date: Date | undefined) => void;
}

export default function Schedule({
  scheduledDate,
  setScheduledDate,
}: ScheduleProps) {
  const [openPopover, setOpenPopover] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    scheduledDate
  );
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedDate || hour === null || minute === null) return;

    const newDate = setMinutes(setHours(new Date(selectedDate), hour), minute);

    if (isBefore(newDate, new Date())) {
      setError("Horário não pode ser no passado.");
      return;
    }

    setError(null);
    setScheduledDate(newDate);
    setOpenPopover(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[1rem] font-semibold h-5 text-[var(--text)]">
        Agendar para <span className="text-[var(--warning)] h-5">*</span>
      </Label>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-80 justify-between font-normal !px-5 !py-4 h-14 border-[var(--input-border)] rounded-lg text-[var(--text)]"
            )}
          >
            {scheduledDate ? (
              <span className="text-[16px] leading-[24px] h-6 flex items-center">
                {format(scheduledDate, "dd/MM/yyyy, HH:mm")}
              </span>
            ) : (
              <span className="text-[16px] leading-[24px] h-6 flex items-center text-muted-foreground">
                dd/mm/aaaa, --:--
              </span>
            )}
            <CalendarIcon className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col space-y-3 p-3 text-[var(--text)]">
          <Select
            onValueChange={(value) => {
              const baseDate = addDays(new Date(), parseInt(value));
              setSelectedDate(baseDate);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha um preset" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0" className="h-8 text-sm">
                Hoje
              </SelectItem>
              <SelectItem value="1" className="h-8 text-sm">
                Amanhã
              </SelectItem>
              <SelectItem value="3" className="h-8 text-sm">
                Daqui a 3 dias
              </SelectItem>
              <SelectItem value="7" className="h-8 text-sm">
                Daqui a 1 semana
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="rounded-lg border">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              className="text-[var(--text)]"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-[var(--text)]">Hora</Label>
              <Select onValueChange={(val) => setHour(parseInt(val))}>
                <SelectTrigger className="w-[80px] h-9 text-sm">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={String(i).padStart(2, "0")}
                      className="h-8 text-sm"
                    >
                      {String(i).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs text-[var(--text)]">Minuto</Label>
              <Select onValueChange={(val) => setMinute(parseInt(val))}>
                <SelectTrigger className="w-[80px] h-9 text-sm">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={String(i).padStart(2, "0")}
                      className="h-8 text-sm"
                    >
                      {String(i).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="mt-2 w-full" onClick={handleConfirm}>
            Confirmar
          </Button>

          {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </PopoverContent>
      </Popover>
    </div>
  );
}
