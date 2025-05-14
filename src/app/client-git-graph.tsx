'use client';

import dynamic from 'next/dynamic';

// Import the GitContributionGraph component with no SSR
const GitContributionGraph = dynamic(() => import('./git-contribution-graph'), {
  ssr: false,
});

export default GitContributionGraph;
