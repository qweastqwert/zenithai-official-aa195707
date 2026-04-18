import React from 'react';
import CommunitySupport from '@/components/community/CommunitySupport';
import { WarmBackground } from '@/components/ui/WarmBackground';

const Community: React.FC = () => {
  return (
    <WarmBackground variant="meadow">
      <CommunitySupport />
    </WarmBackground>
  );
};

export default Community;