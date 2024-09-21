"use client";

import { useLocalPreference } from "react-local-serialization";
import { TogglePreference } from "@/components/toggle-preference";

export default function Home() {
  const prefs = useLocalPreference([{ key: "theme", fallback: false }]);
  console.log(prefs.theme);
  return (
    <div className="flex flex-col gap-4 p-4">
      <TogglePreference
        label="Theme Selector"
        isChecked={prefs.theme.value as boolean}
        onCheckedChange={function (): void {
          prefs.theme.set(!prefs.theme.value);
        }}
      />
    </div>
  );
}
