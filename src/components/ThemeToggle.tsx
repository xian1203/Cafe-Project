import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-5 w-5 text-purple-500 transition-all duration-300 group-hover:scale-110" />;
    }
    return resolvedTheme === "dark" ? (
      <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
    ) : (
      <Moon className="h-5 w-5 text-blue-600 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110" />
    );
  };

  const getTooltipText = () => {
    if (theme === "system") {
      return `System (${resolvedTheme})`;
    }
    return `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
            className="relative w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
            aria-label={getTooltipText()}
          >
            <div className="relative w-5 h-5">
              {getIcon()}
            </div>
            
            {/* Animated background ring */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Pulse effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 animate-pulse" />
            
            {/* Theme indicator dot */}
            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-300 ${
              theme === "system" ? "bg-purple-500" :
              resolvedTheme === "dark" ? "bg-yellow-500" : "bg-blue-500"
            }`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Select your preferred theme for the application.
        </p>
      </div>
      
      <RadioGroup value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
              <Sun className="h-4 w-4 text-yellow-500" />
              Light
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
              <Moon className="h-4 w-4 text-blue-500" />
              Dark
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
              <Monitor className="h-4 w-4 text-purple-500" />
              System
              {theme === "system" && (
                <span className="text-xs text-muted-foreground">
                  ({resolvedTheme})
                </span>
              )}
            </Label>
          </div>
        </div>
      </RadioGroup>
      
      {/* Preview */}
      <div className="mt-4 p-4 rounded-lg border bg-card">
        <p className="text-sm font-medium mb-2">Preview</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          Current theme: {theme === "system" ? `System (${resolvedTheme})` : theme}
        </div>
      </div>
    </div>
  );
}