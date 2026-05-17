import React from 'react';
import CommunitySupport from '@/components/community/CommunitySupport';
import { WarmBackground } from '@/components/ui/WarmBackground';
import SEO from '@/components/SEO';

const Community: React.FC = () => {
  return (
    <WarmBackground variant="meadow">
      <SEO
        title="Community — Zenith AI"
        description="A safe, moderated peer-support community for sharing experiences and finding encouragement on your wellness journey."
        path="/community"
      />
      <CommunitySupport />
    </WarmBackground>
  );
};

export default Community;