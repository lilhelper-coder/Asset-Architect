import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Contributor {
  id: string;
  name: string;
  amountPledged: number;
  email?: string;
  paidAt?: string;
}

interface ContributorsListProps {
  contributors: Contributor[];
}

export function ContributorsList({ contributors }: ContributorsListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Contributors</CardTitle>
            <p className="text-sm text-muted-foreground">
              {contributors.length} contributor{contributors.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {contributors.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No contributors yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Share your gift pool link to get started
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {contributors.map((contributor, index) => (
                <motion.div
                  key={contributor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(contributor.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{contributor.name}</p>
                      {contributor.paidAt && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      )}
                    </div>
                    {contributor.email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {contributor.email}
                      </p>
                    )}
                    {contributor.paidAt && (
                      <p className="text-xs text-muted-foreground">
                        Paid on {formatDate(contributor.paidAt)}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">
                      ${(contributor.amountPledged / 100).toFixed(2)}
                    </p>
                    <Badge
                      variant={contributor.paidAt ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {contributor.paidAt ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

