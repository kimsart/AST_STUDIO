/**
 * Bento Cards Component Usage & Testing Guide
 * 
 * This file contains practical examples and patterns for using
 * the Bento Cards system in your application.
 */

import React from 'react';
import {
  WorkspaceBentoGrid,
  BaseBentoCard,
  MetricCard,
  PreviewCard,
  ActionCard,
  ListCard,
  PartnerCard,
  GuideCard,
  type BentoSize,
} from './index';

// ============================================================================
// EXAMPLE 1: Basic Metric Display
// ============================================================================
export function BasicMetricExample() {
  return (
    <MetricCard
      title="Total Revenue"
      value={42500}
      unit="USD"
      glowColor="emerald"
      icon={
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.16 2.75a.75.75 0 00-.75.75v2.5H4.5a2.5 2.5 0 000 5h.006a.75.75 0 00.75-.75v-2.5h2.91v2.5a.75.75 0 00.75.75H9a.75.75 0 00.75-.75V5.5a.75.75 0 00-.75-.75H8.16z" />
        </svg>
      }
      change={{ value: 15, trend: 'up' }}
      actionLabel="View Report"
      onAction={() => console.log('View revenue report')}
    />
  );
}

// ============================================================================
// EXAMPLE 2: Dynamic Metrics with State
// ============================================================================
interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  color: string;
}

export function DynamicMetricsExample() {
  const metrics: MetricData[] = [
    {
      label: 'Active Users',
      value: 2547,
      unit: 'users',
      trend: 'up',
      change: 12,
      color: 'blue',
    },
    {
      label: 'Conversion Rate',
      value: 3.24,
      unit: '%',
      trend: 'down',
      change: 0.5,
      color: 'amber',
    },
    {
      label: 'Avg. Session',
      value: 4.2,
      unit: 'min',
      trend: 'neutral',
      change: 0,
      color: 'slate',
    },
  ];

  return (
    <WorkspaceBentoGrid columns={3}>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          title={metric.label}
          value={metric.value}
          unit={metric.unit}
          glowColor={metric.color as any}
          change={{ value: metric.change, trend: metric.trend }}
        />
      ))}
    </WorkspaceBentoGrid>
  );
}

// ============================================================================
// EXAMPLE 3: Interactive Action Cards
// ============================================================================
interface DialogState {
  isOpen: boolean;
  type: 'project' | 'team' | null;
}

export function InteractiveActionsExample() {
  const [dialog, setDialog] = React.useState<DialogState>({
    isOpen: false,
    type: null,
  });

  const handleCreateProject = () => {
    setDialog({ isOpen: true, type: 'project' });
    // In real app, show modal dialog
  };

  const handleCreateTeam = () => {
    setDialog({ isOpen: true, type: 'team' });
    // In real app, show modal dialog
  };

  return (
    <>
      <WorkspaceBentoGrid columns={2}>
        <ActionCard
          title="New Project"
          subtitle="Start from scratch"
          action={handleCreateProject}
          actionLabel="Create"
          glowColor="purple"
          size="medium"
        >
          Build a new project with templates or from blank canvas
        </ActionCard>

        <ActionCard
          title="New Team"
          subtitle="Invite members"
          action={handleCreateTeam}
          actionLabel="Create"
          glowColor="rose"
          size="medium"
        >
          Create a workspace for your team to collaborate
        </ActionCard>
      </WorkspaceBentoGrid>

      {dialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-lg">
            <p className="text-white mb-4">
              Creating {dialog.type === 'project' ? 'new project' : 'new team'}
            </p>
            <button
              onClick={() => setDialog({ isOpen: false, type: null })}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 4: List with Filtering
// ============================================================================
interface Item {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
}

export function FilteredListExample() {
  const items: Item[] = [
    { id: '1', name: 'Design System Update', status: 'completed' },
    { id: '2', name: 'Component Library', status: 'active' },
    { id: '3', name: 'Performance Optimization', status: 'pending' },
  ];

  const listItems = items.map((item) => ({
    id: item.id,
    label: item.name,
    value: item.status.charAt(0).toUpperCase() + item.status.slice(1),
  }));

  return (
    <ListCard
      title="Recent Projects"
      glowColor="cyan"
      items={listItems}
      actionLabel="View All"
      onAction={() => console.log('View all projects')}
      icon={
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
        </svg>
      }
    />
  );
}

// ============================================================================
// EXAMPLE 5: Image Preview with Modal
// ============================================================================
export function PreviewWithModalExample() {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  return (
    <>
      <PreviewCard
        title="Featured Workspace"
        subtitle="Latest update"
        size="large"
        glowColor="amber"
        imageUrl="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop"
        imageAlt="Workspace preview"
        actionLabel="Expand"
        onAction={() =>
          setSelectedImage(
            'https://images.unsplash.com/photo-1561070791-2526d30994b5'
          )
        }
      >
        <p className="text-sm text-white/70">
          Explore the new workspace interface with advanced collaboration tools
        </p>
      </PreviewCard>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedImage}
              alt="Expanded view"
              className="w-full rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// EXAMPLE 6: Partner/Integration Cards
// ============================================================================
interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  link: string;
}

export function PartnersGridExample() {
  const partners: Partner[] = [
    {
      id: '1',
      name: 'Figma',
      logo: 'https://via.placeholder.com/120x40/0d0221/ffffff?text=Figma',
      description: 'Design collaboration platform',
      link: 'https://figma.com',
    },
    {
      id: '2',
      name: 'Slack',
      logo: 'https://via.placeholder.com/120x40/36c5f0/ffffff?text=Slack',
      description: 'Team communication',
      link: 'https://slack.com',
    },
    {
      id: '3',
      name: 'Notion',
      logo: 'https://via.placeholder.com/120x40/000000/ffffff?text=Notion',
      description: 'All-in-one workspace',
      link: 'https://notion.so',
    },
  ];

  return (
    <WorkspaceBentoGrid columns={3}>
      {partners.map((partner) => (
        <PartnerCard
          key={partner.id}
          title={partner.name}
          logo={partner.logo}
          description={partner.description}
          link={partner.link}
          glowColor="rose"
          actionLabel="Connect"
        />
      ))}
    </WorkspaceBentoGrid>
  );
}

// ============================================================================
// EXAMPLE 7: Onboarding Guides
// ============================================================================
interface Guide {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string[];
}

export function OnboardingGuidesExample() {
  const guides: Guide[] = [
    {
      id: '1',
      title: 'Getting Started',
      difficulty: 'beginner',
      steps: [
        'Create your account',
        'Set up your profile',
        'Invite first team member',
        'Create your first project',
      ],
    },
    {
      id: '2',
      title: 'Advanced Workflows',
      difficulty: 'advanced',
      steps: [
        'Set up custom pipelines',
        'Configure automation rules',
        'Create templates',
        'Set up integrations',
      ],
    },
  ];

  return (
    <WorkspaceBentoGrid columns={2}>
      {guides.map((guide) => (
        <GuideCard
          key={guide.id}
          title={guide.title}
          size="tall"
          difficulty={guide.difficulty}
          steps={guide.steps}
          glowColor={guide.difficulty === 'beginner' ? 'emerald' : 'purple'}
          onAction={() => console.log(`Starting ${guide.title}`)}
        />
      ))}
    </WorkspaceBentoGrid>
  );
}

// ============================================================================
// EXAMPLE 8: Full Dashboard Layout
// ============================================================================
export function CompleteDashboardExample() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

      <WorkspaceBentoGrid columns={4} variant="default">
        {/* Top metrics row */}
        <MetricCard
          title="Users"
          value="2,547"
          glowColor="blue"
          change={{ value: 12, trend: 'up' }}
        />
        <MetricCard
          title="Revenue"
          value="$42.5K"
          glowColor="emerald"
          change={{ value: 8, trend: 'up' }}
        />
        <MetricCard
          title="Growth"
          value="23.5%"
          glowColor="purple"
          change={{ value: 3, trend: 'down' }}
        />
        <MetricCard
          title="Retention"
          value="94.2%"
          glowColor="rose"
          change={{ value: 2, trend: 'neutral' }}
        />

        {/* Featured preview (spans 2x2) */}
        <PreviewCard
          title="Feature Release"
          size="large"
          glowColor="amber"
          imageUrl="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop"
          imageAlt="New feature"
        />

        {/* List card */}
        <ListCard
          title="Recent Activity"
          glowColor="cyan"
          items={[
            { id: '1', label: 'New user signup', value: '2 min ago' },
            { id: '2', label: 'Project completed', value: '1 hour ago' },
          ]}
        />

        {/* Action card */}
        <ActionCard
          title="Create New"
          action={() => alert('Create new')}
          glowColor="purple"
        >
          Start something new today
        </ActionCard>

        {/* Wide card */}
        <PreviewCard
          title="Team Workspace"
          size="wide"
          glowColor="cyan"
        >
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>5 Members</div>
            <div>3 Projects</div>
            <div>42 Files</div>
          </div>
        </PreviewCard>
      </WorkspaceBentoGrid>
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Custom Size Composition
// ============================================================================
export function CustomLayoutExample() {
  return (
    <WorkspaceBentoGrid columns={3}>
      {/* Small cards in first row */}
      <BaseBentoCard title="Item 1" size="small" glowColor="blue" />
      <BaseBentoCard title="Item 2" size="small" glowColor="emerald" />
      <BaseBentoCard title="Item 3" size="small" glowColor="purple" />

      {/* Large card */}
      <PreviewCard title="Large Preview" size="large" glowColor="amber" />

      {/* Tall card on the right */}
      <GuideCard
        title="Tall Guide"
        size="tall"
        glowColor="rose"
        steps={['Step 1', 'Step 2', 'Step 3']}
      />

      {/* Medium cards */}
      <ActionCard title="Action 1" size="medium" glowColor="cyan" action={() => {}} />
      <ListCard title="List" size="medium" glowColor="slate" items={[]} />
    </WorkspaceBentoGrid>
  );
}

// ============================================================================
// EXAMPLE 10: Responsive Column Behavior
// ============================================================================
export function ResponsiveGridExample() {
  return (
    <div className="w-full space-y-8 p-4">
      {/* 2 columns on desktop, 1 on mobile */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">2-Column Layout</h2>
        <WorkspaceBentoGrid columns={2}>
          <PreviewCard title="Card 1" size="medium" glowColor="blue" />
          <PreviewCard title="Card 2" size="medium" glowColor="emerald" />
          <PreviewCard title="Card 3" size="medium" glowColor="purple" />
        </WorkspaceBentoGrid>
      </div>

      {/* 3 columns on desktop, 1 on mobile */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">3-Column Layout</h2>
        <WorkspaceBentoGrid columns={3}>
          <MetricCard title="Metric 1" value="100" glowColor="blue" />
          <MetricCard title="Metric 2" value="200" glowColor="emerald" />
          <MetricCard title="Metric 3" value="300" glowColor="purple" />
        </WorkspaceBentoGrid>
      </div>

      {/* Auto-fit columns */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Compact Spacing</h2>
        <WorkspaceBentoGrid columns={3} variant="compact">
          <ActionCard title="Action 1" glowColor="blue" action={() => {}} />
          <ActionCard title="Action 2" glowColor="emerald" action={() => {}} />
          <ActionCard title="Action 3" glowColor="purple" action={() => {}} />
        </WorkspaceBentoGrid>
      </div>
    </div>
  );
}

// ============================================================================
// TESTING NOTES
// ============================================================================
/*
 * Test Checklist:
 *
 * [ ] All 6 card variants render correctly
 * [ ] Size variants apply proper grid spans
 * [ ] Glow colors display accurately
 * [ ] Action buttons are clickable
 * [ ] Keyboard navigation works (Tab, Enter, Space)
 * [ ] Focus ring visible on all interactive elements
 * [ ] Mobile responsive (1 column on small screens)
 * [ ] Tablet responsive (2+ columns on medium screens)
 * [ ] Desktop responsive (all columns available)
 * [ ] Images load correctly in PreviewCard
 * [ ] Text truncates properly in small spaces
 * [ ] Accessibility scanner passes WCAG AA
 * [ ] Glow effects visible in dark mode
 * [ ] Smooth transitions on hover
 * [ ] Icons render correctly
 * [ ] Trends (up/down/neutral) display with correct colors
 * [ ] List items show values correctly
 * [ ] Partner logos display properly
 * [ ] Guide steps truncate at 4 with "+X more" text
 * [ ] Difficulty badges show correct colors
 *
 * Performance Tests:
 * [ ] Grid layout doesn't cause layout thrashing
 * [ ] No unnecessary re-renders
 * [ ] Smooth 60fps animations
 * [ ] Fast CSS Grid layout
 * [ ] Minimal memory usage with many cards
 */
