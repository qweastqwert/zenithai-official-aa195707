import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCommunityBans } from '@/hooks/useCommunityBans';
import { Shield, AlertCircle } from 'lucide-react';
import BanAppealDialog from './BanAppealDialog';

const BanNotice: React.FC = () => {
  const { currentBan } = useCommunityBans();
  const [appealDialogOpen, setAppealDialogOpen] = useState(false);

  if (!currentBan) return null;

  return (
    <>
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-destructive">You are banned from the community</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Reason: {currentBan.reason}
                </p>
                {!currentBan.is_permanent && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Ban expires: {new Date(currentBan.banned_until).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAppealDialogOpen(true)}
              className="w-full"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Appeal This Ban
            </Button>
          </div>
        </CardContent>
      </Card>

      <BanAppealDialog
        open={appealDialogOpen}
        onOpenChange={setAppealDialogOpen}
        banId={currentBan.id}
      />
    </>
  );
};

export default BanNotice;
