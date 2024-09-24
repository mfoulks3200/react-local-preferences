import { Switch } from "./ui/switch";
import { useLocalPreference } from "react-local-serialization";

export const ThemeSwitcher = () => {
  const prefs = useLocalPreference([{ key: "darkMode", fallback: "light" }]);

  const onCheckedChange = (checked: boolean) => {
    prefs.darkMode.set(checked ? "dark" : "light");
    console.log("Theme changed to", checked ? "dark" : "light");
  };
  return (
    <div className="flex gap-4 items-center">
      <Switch
        checked={prefs.darkMode.value === "dark"}
        onCheckedChange={onCheckedChange}
      />
      <span>Change Theme</span>
    </div>
  );
};
