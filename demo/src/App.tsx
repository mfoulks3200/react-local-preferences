import { Theme, ThemeProvider } from "./components/theme-provider";
import { ThemeSwitcher } from "./components/theme-switcher";
import { useLocalPreference } from "react-local-serialization";
import { Card } from "./components/ui/card";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

function App() {
  const prefs = useLocalPreference([{ key: "darkMode", fallback: "light" }]);

  return (
    <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
      <ThemeProvider
        theme={prefs.darkMode.value as Theme}
        storageKey="vite-ui-theme"
      >
        <ThemeSwitcher />
        <Card className="p-4">
          <SyntaxHighlighter
            language="javascript"
            style={prefs.darkMode.value == "dark" ? a11yDark : a11yLight}
            customStyle={{ background: "transparent", fontSize: "0.8rem" }}
          >
            {`const prefs = useLocalPreference([{ key: "darkMode", fallback: "light" }]);\n\n` +
              JSON.stringify(prefs.darkMode, null, 2)}
          </SyntaxHighlighter>
        </Card>
      </ThemeProvider>
    </div>
  );
}

export default App;
