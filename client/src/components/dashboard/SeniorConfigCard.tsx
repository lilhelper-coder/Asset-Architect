import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Edit2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SeniorConfig {
  voiceSpeed?: string;
  bioContext?: string;
  deviceType?: string;
  gifterName?: string;
}

interface SeniorConfigCardProps {
  config: SeniorConfig;
  onUpdate: (config: Partial<SeniorConfig>) => void;
}

export function SeniorConfigCard({ config, onUpdate }: SeniorConfigCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    voiceSpeed: config.voiceSpeed || "normal",
    bioContext: config.bioContext || "",
    deviceType: config.deviceType || "tablet",
    gifterName: config.gifterName || "",
  });

  const handleSave = () => {
    onUpdate(formData);
    toast({
      title: "Settings updated",
      description: "Your Crystal settings have been saved.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      voiceSpeed: config.voiceSpeed || "normal",
      bioContext: config.bioContext || "",
      deviceType: config.deviceType || "tablet",
      gifterName: config.gifterName || "",
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Mic className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle>Crystal Configuration</CardTitle>
            <CardDescription>Customize how Crystal interacts with you</CardDescription>
          </div>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">Voice Speed</p>
                <p className="text-sm text-muted-foreground capitalize">{config.voiceSpeed || "Normal"}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">Device Type</p>
                <p className="text-sm text-muted-foreground capitalize">{config.deviceType || "Tablet"}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">Gifter Name</p>
                <p className="text-sm text-muted-foreground">{config.gifterName || "Not set"}</p>
              </div>
              {config.bioContext && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Bio Context</p>
                  <p className="text-sm text-muted-foreground">{config.bioContext}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="voiceSpeed">Voice Speed</Label>
                <Select
                  value={formData.voiceSpeed}
                  onValueChange={(value) =>
                    setFormData({ ...formData, voiceSpeed: value })
                  }
                >
                  <SelectTrigger id="voiceSpeed">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceType">Device Type</Label>
                <Select
                  value={formData.deviceType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, deviceType: value })
                  }
                >
                  <SelectTrigger id="deviceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gifterName">Gifter Name</Label>
                <Input
                  id="gifterName"
                  value={formData.gifterName}
                  onChange={(e) =>
                    setFormData({ ...formData, gifterName: e.target.value })
                  }
                  placeholder="Who gave you Crystal?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bioContext">Bio Context</Label>
                <Textarea
                  id="bioContext"
                  value={formData.bioContext}
                  onChange={(e) =>
                    setFormData({ ...formData, bioContext: e.target.value })
                  }
                  placeholder="Tell Crystal about yourself (hobbies, interests, preferences...)"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This helps Crystal personalize conversations for you
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

