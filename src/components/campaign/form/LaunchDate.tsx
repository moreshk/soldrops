import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

export const LaunchDate = () => {
  const { watch, setValue, formState, clearErrors } = useFormContext();
  const startDate = watch("startDate") as Date | undefined;
  const endDate = watch("endDate") as Date | undefined;
  const range: DateRange = {
    from: startDate,
    to: endDate,
  };

  const { errors } = formState;

  const onChange = (value: DateRange | undefined) => {
    if (value?.from) {
      setValue("startDate", value.from);
      clearErrors("startDate");
    }
    if (value?.to) {
      setValue("endDate", value.to);
      clearErrors("startDate");
    }
    if (value === undefined) {
      setValue("endDate", undefined);
      setValue("startDate", undefined);
    }
  };

  return (
    <fieldset className="border-4 rounded-xl border-solid px-6 pt-5 pb-7 hover:border-blue-300 group">
      <legend className="text-lg font-medium group-hover:text-blue-300">
        Launch details
      </legend>
      <p>Go Live Data</p>
      <br />
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !range && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {range?.from && range?.to ? (
                <>
                  {format(range?.from, "LLL dd, y")} -{" "}
                  {format(range?.to, "LLL dd, y")}
                </>
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={onChange}
            showOutsideDays={false}
            disabled={(date) =>
              date < addDays(new Date(), -1) || date < new Date("1900-01-01")
            }
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {(errors?.endDate || errors?.startDate) && (
        <p className={cn("text-sm font-medium text-destructive")}>
          Select the the range you want to Launch
        </p>
      )}
    </fieldset>
  );
};
