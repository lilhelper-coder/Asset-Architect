import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings, Volume2, Eye, Globe } from "lucide-react";
import { useAccessibility, type TextSize } from "@/context/accessibility-context";
import { useLanguage, type SupportedLanguage, LANGUAGES } from "@/context/language-context";
import { motion } from "framer-motion";

export function SettingsPanel() {
  const {
    textSize,
    highContrast,
    reducedMotion,
    autoRead,
    setTextSize,
    setHighContrast,
    setReducedMotion,
    setAutoRead,
  } = useAccessibility();

  const { language, setLanguage } = useLanguage();

  const textSizeOptions: { value: TextSize; label: string }[] = [
    { value: "100%", label: "Normal" },
    { value: "150%", label: "Large" },
    { value: "200%", label: "Extra Large" },
    { value: "300%", label: "Huge" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Customize your Crystal experience</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium">Language</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Select Language</Label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as SupportedLanguage)}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LANGUAGES).map(([code, config]) => (
                    <SelectItem key={code} value={code}>
                      {config.nativeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Accessibility Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium">Accessibility</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-size">Text Size</Label>
              <Select
                value={textSize}
                onValueChange={(value) => setTextSize(value as TextSize)}
              >
                <SelectTrigger id="text-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {textSizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">High Contrast</Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={setHighContrast}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduce Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
              />
            </div>
          </div>

          <Separator />

          {/* Voice Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium">Voice</h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-read">Auto Read</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically read text aloud
                </p>
              </div>
              <Switch
                id="auto-read"
                checked={autoRead}
                onCheckedChange={setAutoRead}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

