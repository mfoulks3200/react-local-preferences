import { Label } from "@radix-ui/react-label";
import { Switch } from "./ui/switch";

export const TogglePreference = ({
  isChecked,
  onCheckedChange,
  label,
}: {
  isChecked: boolean;
  onCheckedChange: () => void;
  label: string;
}) => {
  return (
    <div className="flex gap-2">
      <Switch checked={isChecked} onCheckedChange={onCheckedChange} />
      <Label>{label}</Label>
    </div>
  );
};
