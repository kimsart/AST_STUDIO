/**
 * Bento Cards Component Usage & Testing Guide
 * 
 * This file contains practical examples and patterns for using
 * the Bento Cards system in your application with the simplified
 * pass-through wrapper architecture and brand-aligned glow colors.
 */

import React from 'react';
import {
  WorkspaceBentoGrid,
  BentoCard,
  MetricCard,
  PreviewCard,
  ActionCard,
  ListCard,
  PartnerCard,
  GuideCard,
  type BentoSize,
  type GlowColor,
} from './index';

// ============================================================================
// EXAMPLE 1: Basic Metric with Brand Blue Glow
// ============================================================================
export function BasicMetricExample() {
  return (
    <MetricCard
      title="Total Revenue"
      value={42500}
      unit="USD"
      glowColor="blue"
      change={{ value: 15, trend: 'up' }}
      actionLabel="View Report"
      onAction={() => console.log('View revenue report')}
    />
  );
}

// ============================================================================
// EXAMPLE 2: Dynamic Metrics with 3-Color Brand Palette
// ============================================================================
interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  change: number;
  glowColor: GlowColor;
}

export function DynamicMetricsExample() {
  const metrics: MetricData[] = [
    {
      label: 'Active Users',
      value: 2547,
      unit: 'users',
      trend: 'up',
      change: 12,
      glowColor: 'blue',
    },
    {
      label: 'Success Rate',
      value: 98.5,
      unit: '%',
      trend: 'up',
      change: 2.3,
      glowColor: 'turquoise',
    },
    {
      label: 'Incidents',
      value: 2,
      unit: 'critical',
      trend: 'neutral',
      change: 0,
      glowColor: 'pink',
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
          glowColor={metric.glowColor}
          change={{ value: metric.change, trend: metric.trend }}
        />
      ))}
    </WorkspaceBentoGrid>
  );
}

// ============================================================================
// EXAMPLE 3: Interactive Action Cards with Pink & Blue Glows
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
  };

  const handleCreateTeam = () => {
    setDialog({ isOpen: true, type: 'team' });
  };

  return (
    <>
      <WorkspaceBentoGrid columns={2}>
        <ActionCard
          title="New Project"
          subtitle="Start from scratch"
          onAction={handleCreateProject}
          actionLabel="Create"
          glowColor="blue"
          size="medium"
        >
          Build a new project with templates or from blank canvas
        </ActionCard>

        <ActionCard
          title="New Team"
          subtitle="Invite members"
          onAction={handleCreateTeam}
          actionLabel="Create"
          glowColor="pink"
          size="medium"
        >
          Create a workspace for your team to collaborate
        </ActionCard>
      </WorkspaceBentoGrid>

      {dialog.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              padding: '1.5rem',
              borderRadius: '0.5rem',
            }}
          >
            <p style={{ color: 'white', marginBottom: '1rem' }}>
              Creating{' '}
              {dialog.type === 'project' ? 'new project' : 'new team'}
            </p>
            <button
              onClick={() => setDialog({ isOpen: false, type: null })}
              className="bento-button"
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
// EXAMPLE 4: List Card Display
// ============================================================================
interface Item {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
}

export function ListCardExample() {
  const items: Item[] = [
    { id: '1', name: 'Design System Update', status: 'completed' },
    { id: '2', name: 'Component Library', status: 'active' },
    { id: '3', name: 'Performance Optimization', status: 'pending' },
  ];

  return (
    <ListCard
      title="Recent Projects"
      glowColor="turquoise"
      actionLabel="View All"
      onAction={() => console.log('View all projects')}
    >
      <div className="bento-list">
        {items.map((item) => (
          <div key={item.id} className="bento-list-item">
            <span className="bento-list-item-label">{item.name}</span>
            <span className="bento-list-item-value">{item.status}</span>
          </div>
        ))}
      </div>
    </ListCard>
  );
}

// ============================================================================
// EXAMPLE 5: Image Preview Card
// ============================================================================
export function PreviewCardExample() {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(
    null
  );

  return (
    <>
      <PreviewCard
        title="Featured Workspace"
        subtitle="Latest update"
        size="large"
        glowColor="blue"
        actionLabel="Expand"
        onAction={() =>
          setSelectedImage(
            'https://images.unsplash.com/photo-1561070791-2526d30994b5'
          )
        }
      >
        <p
          style={{
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          Explore the new workspace interface with advanced collaboration tools
        </p>
      </PreviewCard>

      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div style={{ position: 'relative', maxWidth: '56rem', width: '100%' }}>
            <img
              src={selectedImage}
              alt="Expanded view"
              style={{ width: '100%', borderRadius: '0.5rem' }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="bento-button"
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
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
// EXAMPLE 6: Partner/Integration Cards with Brand Glows
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

  const glowColors: GlowColor[] = ['blue', 'turquoise', 'pink'];

  return (
    <WorkspaceBentoGrid columns={3}>
      {partners.map((partner, index) => (
        <PartnerCard
          key={partner.id}
          title={partner.name}
          glowColor={glowColors[index % glowColors.length]}
          actionLabel="Connect"
          onAction={() => window.open(partner.link, '_blank')}
        >
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {partner.description}
            </p>
            {partner.logo && (
              <img
                src={partner.logo}
                alt={partner.name}
                style={{ maxWidth: '100%', maxHeight: '40px' }}
              />
            )}
          </div>
        </PartnerCard>
      ))}
    </WorkspaceBentoGrid>
  );
}

// ============================================================================
// EXAMPLE 7: Onboarding Guides (Blue Glow Default)
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
          onAction={() => console.log(`Starting ${guide.title}`)}
        >
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '0.75rem',
              }}
            >
              {guide.difficulty}
            </p>
            <ol
              style={{
                listStyle: 'decimal',
                paddingLeft: '1rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {guide.steps.map((step, idx) => (
                <li key={idx} style={{ marginBottom: '0.25rem' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </GuideCard>
      ))}
    </WorkspaceBentoGrid>
  );
}

// ============================================================================
// EXAMPLE 8: Complete Dashboard Layout
// ============================================================================
export function CompleteDashboardExample() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(135deg, #0f172a, #1e293b)',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '2rem',
        }}
      >
        Dashboard
      </h1>

      <WorkspaceBentoGrid columns={4} variant="default">
        {/* Top metrics row - Demonstrate 3 brand glow colors */}
        <MetricCard
          title="Users"
          value="2,547"
          glowColor="blue"
          change={{ value: 12, trend: 'up' }}
        />
        <MetricCard
          title="Revenue"
          value="$42.5K"
          glowColor="turquoise"
          change={{ value: 8, trend: 'up' }}
        />
        <MetricCard
          title="Growth"
          value="23.5%"
          glowColor="pink"
          change={{ value: 3, trend: 'down' }}
        />
        <MetricCard
          title="Retention"
          value="94.2%"
          glowColor="none"
          change={{ value: 2, trend: 'neutral' }}
        />

        {/* Featured preview */}
        <PreviewCard
          title="Feature Release"
          size="large"
          glowColor="turquoise"
        >
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Latest product features and improvements
          </p>
        </PreviewCard>

        {/* List card */}
        <ListCard title="Recent Activity" glowColor="blue">
          <div className="bento-list">
            <div className="bento-list-item">
              <span className="bento-list-item-label">New user signup</span>
              <span className="bento-list-item-value">2 min ago</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-list-item-label">Payment received</span>
              <span className="bento-list-item-value">1 hour ago</span>
            </div>
            <div className="bento-list-item">
              <span className="bento-list-item-label">Team member joined</span>
              <span className="bento-list-item-value">3 hours ago</span>
            </div>
          </div>
        </ListCard>

        {/* Action cards */}
        <ActionCard
          title="Create New"
          glowColor="pink"
          actionLabel="Create"
          onAction={() => console.log('Create action')}
        >
          Start a new project or workspace
        </ActionCard>

        {/* Guide card - Uses blue by default */}
        <GuideCard title="Quick Start" size="tall">
          <ol
            style={{
              listStyle: 'decimal',
              paddingLeft: '1rem',
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <li>Set up your account</li>
            <li>Create a project</li>
            <li>Invite team members</li>
            <li>Start collaborating</li>
          </ol>
        </GuideCard>
      </WorkspaceBentoGrid>
    </div>
  );
}

// ============================================================================
// EXAMPLE 9: Simplified Core BentoCard Usage
// ============================================================================
export function CoreBentoCardExample() {
  return (
    <WorkspaceBentoGrid columns={2}>
      <BentoCard
        title="Custom Card"
        subtitle="With direct BentoCard"
        glowColor="blue"
        size="medium"
        actionLabel="Learn More"
        onAction={() => console.log('Learn more clicked')}
      >
        Use BentoCard directly for fully custom layouts
      </BentoCard>

      <BentoCard
        title="Flexible Layout"
        subtitle="Full control over content"
        glowColor="pink"
        size="medium"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p>Build any layout structure</p>
          <p>All variants extend BentoCard</p>
          <p>Simple pass-through architecture</p>
        </div>
      </BentoCard>
    </WorkspaceBentoGrid>
  );
}
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
    <div style={{ width: '100%', minHeight: '100vh', backgroundImage: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>
        Dashboard
      </h1>

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

        {/* Featured preview */}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
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
      <BentoCard title="Item 1" size="small" glowColor="blue" />
      <BentoCard title="Item 2" size="small" glowColor="emerald" />
      <BentoCard title="Item 3" size="small" glowColor="purple" />

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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      {/* 2 columns on desktop, 1 on mobile */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
          2-Column Layout
        </h2>
        <WorkspaceBentoGrid columns={2}>
          <PreviewCard title="Card 1" size="medium" glowColor="blue" />
          <PreviewCard title="Card 2" size="medium" glowColor="emerald" />
          <PreviewCard title="Card 3" size="medium" glowColor="purple" />
        </WorkspaceBentoGrid>
      </div>

      {/* 3 columns on desktop, 1 on mobile */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
          3-Column Layout
        </h2>
        <WorkspaceBentoGrid columns={3}>
          <MetricCard title="Metric 1" value="100" glowColor="blue" />
          <MetricCard title="Metric 2" value="200" glowColor="emerald" />
          <MetricCard title="Metric 3" value="300" glowColor="purple" />
        </WorkspaceBentoGrid>
      </div>

      {/* Compact spacing */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
          Compact Spacing
        </h2>
        <WorkspaceBentoGrid columns={3} variant="compact">
          <ActionCard title="Action 1" glowColor="blue" action={() => {}} />
          <ActionCard title="Action 2" glowColor="emerald" action={() => {}} />
          <ActionCard title="Action 3" glowColor="purple" action={() => {}} />
        </WorkspaceBentoGrid>
      </div>
    </div>
  );
}
