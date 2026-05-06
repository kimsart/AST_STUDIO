import React from 'react';
import {
  WorkspaceBentoGrid,
  MetricCard,
  PreviewCard,
  ActionCard,
  ListCard,
  PartnerCard,
  GuideCard,
} from './index';

/**
 * Comprehensive example demonstrating all Bento Card variants
 * in a responsive WorkspaceBentoGrid layout
 */
export const BentoGridExample: React.FC = () => {
  const handleMetricClick = () => console.log('Metrics action clicked');
  const handleAddNew = () => console.log('Add new action clicked');
  const handleStartGuide = () => console.log('Start guide clicked');
  const handleLearnMore = () => console.log('Learn more clicked');

  return (
    <div className="w-full bg-gradient-to-br from-slate-950 to-slate-900 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Bento Grid System
          </h1>
          <p className="text-white/60">
            Responsive card system with glassmorphism and glow effects
          </p>
        </div>

        {/* Main Grid */}
        <WorkspaceBentoGrid columns={3} variant="default">
          {/* Metrics Row */}
          <MetricCard
            title="Active Users"
            value="2,547"
            unit="users"
            glowColor="blue"
            change={{ value: 12, trend: 'up' }}
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3m0 0v-3m0 3h3m0 0h3m0 0v3m0 3v3" />
              </svg>
            }
            onAction={handleMetricClick}
            actionLabel="View Details"
          />

          <MetricCard
            title="Revenue"
            value="$42.5K"
            glowColor="emerald"
            change={{ value: 8, trend: 'up' }}
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.16 2.75a.75.75 0 00-.75.75v2.5H4.5a2.5 2.5 0 000 5h.006a.75.75 0 00.75-.75v-2.5h2.91v2.5a.75.75 0 00.75.75H9a.75.75 0 00.75-.75V5.5a.75.75 0 00-.75-.75H8.16zm4.68 0a.75.75 0 00-.75.75v2.5h-2.91v-2.5a.75.75 0 00-.75-.75h-.084a.75.75 0 00-.75.75V5.5a.75.75 0 00.75.75h3.5a.75.75 0 00.75-.75v-2.5a.75.75 0 00-.75-.75h-.084z" />
              </svg>
            }
            actionLabel="View Details"
          />

          <MetricCard
            title="Completion Rate"
            value="94.2%"
            glowColor="purple"
            change={{ value: 2, trend: 'down' }}
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
            actionLabel="View Details"
          />

          {/* Preview Card - Large */}
          <PreviewCard
            title="Featured Project"
            subtitle="Latest showcase"
            size="large"
            glowColor="amber"
            imageUrl="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop"
            imageAlt="Featured project"
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 9V7a1 1 0 011-1h8a1 1 0 011 1v2M5 9c0 1.657-.895 3-2 3s-2-1.343-2-3m14 0c0 1.657.895 3 2 3s2-1.343 2-3M5 9h10m7 0a1 1 0 11-2 0m-15 0a1 1 0 11-2 0" />
              </svg>
            }
          >
            Explore new design patterns and components for your workspace
          </PreviewCard>

          {/* Action Card */}
          <ActionCard
            title="Create New"
            subtitle="Start fresh"
            size="medium"
            glowColor="rose"
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            }
            action={handleAddNew}
          >
            Start a new project, workspace, or collection
          </ActionCard>

          {/* List Card */}
          <ListCard
            title="Recent Items"
            size="medium"
            glowColor="cyan"
            items={[
              { id: '1', label: 'Project Alpha', value: 'In Progress' },
              { id: '2', label: 'Design Review', value: 'Pending' },
              { id: '3', label: 'Stakeholder Meeting', value: 'Completed' },
            ]}
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
              </svg>
            }
          />

          {/* Guide Card - Tall */}
          <GuideCard
            title="Getting Started"
            subtitle="Quick onboarding"
            size="tall"
            glowColor="emerald"
            difficulty="beginner"
            steps={[
              'Create your account',
              'Set up your profile',
              'Explore the workspace',
              'Join a team',
              'Create your first project',
            ]}
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10.519A9.965 9.965 0 015.5 14c.395 0 .78.03 1.158.087M15 4.804A7.968 7.968 0 0011.5 4m3.5.804v10.519A9.965 9.965 0 0111.5 14c-.395 0-.78-.03-1.158-.087m2.158-9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            onAction={handleStartGuide}
          />

          {/* Partner Card */}
          <PartnerCard
            title="Collaborator"
            subtitle="Partner integration"
            size="medium"
            glowColor="rose"
            logo="https://via.placeholder.com/120x40/6366f1/ffffff?text=Partner"
            description="Connect with external services and integrations"
            link="https://example.com"
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 7H7v6h6V7z" />
              </svg>
            }
          />

          {/* Another Preview Card - Wide */}
          <PreviewCard
            title="Team Workspace"
            subtitle="Collaborate with others"
            size="wide"
            glowColor="cyan"
            icon={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.5 1a1.5 1.5 0 00-1.5 1.5v15A1.5 1.5 0 002.5 19h15a1.5 1.5 0 001.5-1.5V2.5A1.5 1.5 0 0017.5 1h-15zM2 2.5a.5.5 0 01.5-.5h15a.5.5 0 01.5.5v12H2v-12zm0 13h15v2.5a.5.5 0 01-.5.5h-15a.5.5 0 01-.5-.5V15.5z" />
              </svg>
            }
          >
            <div className="grid grid-cols-3 gap-2 text-xs text-white/70">
              <div>5 Members</div>
              <div>3 Projects</div>
              <div>42 Files</div>
            </div>
          </PreviewCard>
        </WorkspaceBentoGrid>

        {/* Footer */}
        <div className="mt-12 text-center text-white/50 text-sm">
          <p>
            Resize your browser to see responsive layout adjustments across
            mobile, tablet, and desktop
          </p>
        </div>
      </div>
    </div>
  );
};

export default BentoGridExample;
