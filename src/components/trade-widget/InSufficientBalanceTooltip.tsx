import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const InSufficientBalanceTooltip = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => (
  <Tooltip>
    <TooltipTrigger>
      <div className="text-sm hover:bg-secondary text-muted-foreground uppercase rounded-full py-0.5 px-2 border font-semibold bg-secondary">
        {name}
      </div>
    </TooltipTrigger>
    <TooltipContent>{description}</TooltipContent>
  </Tooltip>
);
