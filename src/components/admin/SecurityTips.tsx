import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, AlertTriangle, CheckCircle2, Ban, Eye } from "lucide-react";

const SecurityTips = () => {
  const implementedMeasures = [
    {
      title: "Cloudflare Turnstile",
      description: "Bot protection on sign-up, sign-in, and post creation",
      icon: Shield,
      status: "active"
    },
    {
      title: "Content Filtering",
      description: "Automated profanity and hate speech detection with age-based filtering",
      icon: Eye,
      status: "active"
    },
    {
      title: "Email Verification",
      description: "Users must verify email before full access",
      icon: CheckCircle2,
      status: "active"
    },
    {
      title: "Row Level Security (RLS)",
      description: "Database policies prevent unauthorized access",
      icon: Lock,
      status: "active"
    }
  ];

  const recommendedActions = [
    {
      title: "Enable Rate Limiting in Supabase",
      description: "Go to Supabase Dashboard → Project Settings → API → Rate Limiting. Set limits for anonymous and authenticated users.",
      priority: "high",
      icon: Ban
    },
    {
      title: "Configure Turnstile Site Key",
      description: "Add VITE_CLOUDFLARE_TURNSTILE_SITE_KEY to your environment variables for production bot protection.",
      priority: "high",
      icon: Shield
    },
    {
      title: "Monitor Suspicious Activity",
      description: "Check the Activity Logs regularly for unusual patterns: rapid post creation, spam content, or login attempts.",
      priority: "medium",
      icon: Eye
    },
    {
      title: "Adjust Content Filters",
      description: "Review and update the content filtering rules in src/utils/contentFilter.ts based on community needs.",
      priority: "low",
      icon: AlertTriangle
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Security & Anti-Abuse Measures</h2>
        <p className="text-muted-foreground">
          Overview of implemented security features and recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Active Security Measures
          </CardTitle>
          <CardDescription>
            These protections are currently active in your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {implementedMeasures.map((measure, index) => {
            const Icon = measure.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <Icon className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">{measure.title}</h4>
                  <p className="text-sm text-muted-foreground">{measure.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Recommended Actions
          </CardTitle>
          <CardDescription>
            Additional steps to enhance security and reduce abuse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedActions.map((action, index) => {
            const Icon = action.icon;
            const priorityColors = {
              high: "text-red-500",
              medium: "text-orange-500",
              low: "text-blue-500"
            };
            return (
              <Alert key={index}>
                <Icon className="w-4 h-4" />
                <AlertDescription>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold mb-1">{action.title}</h4>
                      <p className="text-sm">{action.description}</p>
                    </div>
                    <span className={`text-xs font-medium uppercase ${priorityColors[action.priority as keyof typeof priorityColors]}`}>
                      {action.priority}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold mb-1">1. Regular Security Audits</h4>
            <p className="text-muted-foreground">Review user activity, content moderation flags, and system logs weekly</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">2. User Reporting System</h4>
            <p className="text-muted-foreground">Encourage community reporting of suspicious content or behavior</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">3. IP-Based Rate Limiting</h4>
            <p className="text-muted-foreground">Configure Supabase Edge Functions with rate limiting headers</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">4. Account Age Restrictions</h4>
            <p className="text-muted-foreground">Consider limiting certain features to accounts older than 24 hours</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">5. Content Length Limits</h4>
            <p className="text-muted-foreground">Already enforced: Posts and comments have character limits to prevent spam</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTips;
