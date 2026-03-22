"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

function formatToLocal(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${h}:${min}`;
}

export default function DateTimePicker({ value, onChange, label }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);

  const date = value ? new Date(value) : undefined;
  const hours = date ? String(date.getHours()).padStart(2, "0") : "10";
  const minutes = date ? String(date.getMinutes()).padStart(2, "0") : "00";

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const h = date ? date.getHours() : 10;
    const m = date ? date.getMinutes() : 0;
    selectedDate.setHours(h, m, 0, 0);
    onChange(formatToLocal(selectedDate));
  };

  const handleTimeChange = (type: "hours" | "minutes", val: string) => {
    const d = date ? new Date(date) : new Date();
    if (!date) {
      // Tarih seçilmemişse bugünü al
      d.setHours(10, 0, 0, 0);
    }
    if (type === "hours") {
      d.setHours(parseInt(val), d.getMinutes(), 0, 0);
    } else {
      d.setMinutes(parseInt(val));
    }
    onChange(formatToLocal(d));
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minuteOptions = ["00", "15", "30", "45"];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon size={16} className="mr-2 shrink-0" />
            {date
              ? format(date, "d MMMM yyyy, HH:mm", { locale: tr })
              : "Tarih ve saat seçin"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            locale={tr}
          />
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">Saat:</span>
              <Select value={hours} onValueChange={(v) => handleTimeChange("hours", v)}>
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hourOptions.map((h) => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="font-bold">:</span>
              <Select value={minutes} onValueChange={(v) => handleTimeChange("minutes", v)}>
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {minuteOptions.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
