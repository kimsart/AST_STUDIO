import DashboardHeader from "../components/DashboardHeader.jsx";
import ProjectsCard from "../components/ProjectsCard.jsx";
import SuppliesCard from "../components/SuppliesCard.jsx";
import InspirationCard from "../components/InspirationCard.jsx";
import MetricsStrip from "../components/MetricsStrip.jsx";
import ProjectSummary from "../components/ProjectSummary.jsx";
import QuickActions from "../components/QuickActions.jsx";
import InventoryTable from "../components/InventoryTable.jsx";
import StudioChat from "../components/StudioChat.jsx";
import CommunitySpotlight from "../components/CommunitySpotlight.jsx";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-ast_bg_dark">
      <DashboardHeader />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Metrics Strip */}
        <div className="mb-6">
          <MetricsStrip />
        </div>

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-4">
            <ProjectsCard />
            <SuppliesCard />
            <InspirationCard />
          </div>

          {/* Center Column */}
          <div className="col-span-6 space-y-6">
            <ProjectSummary />
            <QuickActions />
            <InventoryTable />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 space-y-4">
            <StudioChat />
            <CommunitySpotlight />
          </div>
        </div>
      </div>
    </div>
  )
}
