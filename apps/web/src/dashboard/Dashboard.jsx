import { signOut } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createAmplifyProjectService } from "../domain/projects/amplifyProjectService.ts";
import DashboardHeader from "../components/DashboardHeader.jsx";
import ProjectsWorkspace from "../components/ProjectsWorkspace.jsx";
import SuppliesCard from "../components/SuppliesCard.jsx";
import HomeWorkspace from "../components/HomeWorkspace.jsx";
import SuppliesWorkspace from "../components/SuppliesWorkspace.jsx";
import StudioChat from "../components/StudioChat.jsx";
import AddProjectFormInline from "../components/forms/AddProjectFormInline.jsx";
import AddSupplyFormInline from "../components/forms/AddSupplyFormInline.jsx";
import InspirationWorkspace from "../components/InspirationWorkspace.jsx";
import { getTodayInArtHistory, getQuoteOfTheDay, allEntries } from "../data/inspirationFeed/index.js";
import { loadProjects, saveProjects, loadSupplies, saveSupplies, validateImportedData, normalizeProject, normalizeSupply, cleanImportedLinks } from "../utils/localStorage.js";

const isSupplyDataImage = (value) =>
  typeof value === "string" && value.startsWith("data:image");

const isSupplyDisplayImage = (value) =>
  typeof value === "string" && (
    value.startsWith("data:image") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );

async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function uploadSupplyImage(image) {
  if (!isSupplyDataImage(image)) return image || null;

  const blob = await dataUrlToBlob(image);
  const fileId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const result = await uploadData({
    path: ({ identityId }) => `supply-images/${identityId}/${fileId}.jpg`,
    data: blob,
    options: {
      contentType: "image/jpeg",
    },
  }).result;

  return result.path;
}

async function resolveSupplyDisplayImage(imageUrl) {
  if (!imageUrl) return null;
  if (isSupplyDisplayImage(imageUrl)) return imageUrl;

  try {
    const { url } = await getUrl({ path: imageUrl });
    return url.toString();
  } catch (error) {
    console.warn("[AST Studio] Failed to resolve supply image:", error);
    return null;
  }
}

async function hydrateSupply(supply) {
  const normalized = normalizeSupply(supply);
  return {
    ...normalized,
    qty: normalized.qty ?? normalized.quantity ?? "",
    image: await resolveSupplyDisplayImage(normalized.imageUrl),
  };
}

const isProjectDataImage = (value) =>
  typeof value === "string" && value.startsWith("data:image");

const isProjectDisplayImage = (value) =>
  typeof value === "string" && (
    value.startsWith("data:image") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );

// Uploads a single gallery slot if it's a freshly-picked data: URL; passes an
// already-uploaded Storage path/URL through unchanged so existing images are
// never re-uploaded or orphaned.
async function uploadProjectImage(image) {
  if (!isProjectDataImage(image)) return image || null;

  const blob = await dataUrlToBlob(image);
  const fileId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const result = await uploadData({
    path: ({ identityId }) => `project-images/${identityId}/${fileId}.jpg`,
    data: blob,
    options: {
      contentType: "image/jpeg",
    },
  }).result;

  return result.path;
}

// Uploads any new data: URLs in an ordered image list, leaving already-hosted
// paths/URLs untouched, and returns the resulting Storage-path list in order.
async function uploadProjectImages(images) {
  return Promise.all((images ?? []).map(uploadProjectImage));
}

async function resolveProjectDisplayImage(storagePath) {
  if (!storagePath) return null;
  if (isProjectDisplayImage(storagePath)) return storagePath;

  try {
    const { url } = await getUrl({ path: storagePath });
    return url.toString();
  } catch (error) {
    console.warn("[AST Studio] Failed to resolve project image:", error);
    return null;
  }
}

// Rebuilds one ordered images[] (display URLs, for rendering) plus a
// parallel imagePaths[] (Storage paths, for persistence) from
// coverImageUrl + imageKeys. Cover is always index 0 when present. Entries
// that fail to resolve are dropped from both arrays in lockstep so the
// pairing stays intact. Legacy cover-only records (imageKeys empty/absent)
// naturally hydrate to a single-image gallery.
async function hydrateProject(project) {
  const storagePaths = [project.coverImageUrl, ...(project.imageKeys ?? [])].filter(Boolean);
  const displayUrls = await Promise.all(storagePaths.map(resolveProjectDisplayImage));

  const images = [];
  const imagePaths = [];
  storagePaths.forEach((path, i) => {
    const displayUrl = displayUrls[i];
    if (displayUrl) {
      images.push(displayUrl);
      imagePaths.push(path);
    }
  });

  return {
    ...normalizeProject({
      ...project,
      images,
      imagePaths,
    }),
    budget: project.budget ?? "",
  };
}

export default function Dashboard({ defaultView = 'home', user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const clientRef = useRef(null);
  if (clientRef.current === null) {
    clientRef.current = generateClient();
  }
  const client = clientRef.current;
  const projectServiceRef = useRef(null);
  if (projectServiceRef.current === null) {
    projectServiceRef.current = createAmplifyProjectService();
  }
  const projectService = projectServiceRef.current;
  const handleSignOut = async () => {
  try {
    await signOut();
    window.location.reload();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
  const fileInputRef = useRef(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    if (location.state?.selectedProjectId != null) {
      setSelectedProjectId(location.state.selectedProjectId);
    }
  }, [location.key]);
 const [showAddProjectForm, setShowAddProjectForm] = useState(false);
const [showAddSupplyForm, setShowAddSupplyForm] = useState(false);
const [leftOpen, setLeftOpen] = useState(false);
const [rightOpen, setRightOpen] = useState(false);
const [sessionProjects, setSessionProjects] = useState([]);
const [sessionSupplies, setSessionSupplies] = useState([]);
const [isLoadingProjects, setIsLoadingProjects] = useState(true);
const [isLoadingSupplies, setIsLoadingSupplies] = useState(true);
useEffect(() => {
  let isMounted = true;

  async function loadCloudProjects() {
    try {
      const { items } = await projectService.list();
      const hydrated = await Promise.all(items.map(hydrateProject));
      if (isMounted) setSessionProjects(hydrated);
    } catch (error) {
      console.error('Error loading cloud projects:', error);
    } finally {
      if (isMounted) setIsLoadingProjects(false);
    }
  }

  async function loadCloudSupplies() {
    try {
      const { data } = await client.models.Supply.list();
      const hydrated = await Promise.all((data || []).map(hydrateSupply));
      if (isMounted) setSessionSupplies(hydrated);
    } catch (error) {
      console.error('Error loading cloud supplies:', error);
    } finally {
      if (isMounted) setIsLoadingSupplies(false);
    }
  }

  loadCloudProjects();
  loadCloudSupplies();

  return () => {
    isMounted = false;
  };
}, []);
// useEffect(() => { saveProjects(sessionProjects); }, [sessionProjects]);
// useEffect(() => { saveSupplies(sessionSupplies); }, [sessionSupplies]);
  const sidebarArtHistory = getTodayInArtHistory();
  const sidebarQuote      = getQuoteOfTheDay();

 const handleAddProject = async (projectData) => {
  try {
    const uploadedPaths = await uploadProjectImages(
      Array.isArray(projectData.images) ? projectData.images : []
    );
    const [coverImageUrl = null, ...imageKeys] = uploadedPaths;

    const created = await projectService.create({
      title: projectData.title,
      description: projectData.description,
      status: projectData.status,
      notes: projectData.notes,
      coverImageUrl,
      imageKeys,
    });

    const hydratedProject = await hydrateProject(created);

    setSessionProjects((prev) => [
      ...prev,
      {
        ...hydratedProject,
        budget: projectData.budget ?? "",
        isNew: true,
      },
    ]);

    setShowAddProjectForm(false);
  } catch (error) {
    console.error("Error saving cloud project:", error);
    throw error;
  }
};

 const handleAddSupply = async (supplyData) => {
  const { assignedProjectId, ...rest } = supplyData;
  try {
    const imageUrl = await uploadSupplyImage(rest.image);
    const { data } = await client.models.Supply.create({
      name: rest.name,
category: rest.category,
subcategory: rest.subcategory,
quantity: rest.qty,
location: rest.location,
notes: rest.notes,
imageUrl,
    });
    const newId = data.id;
    const hydratedSupply = await hydrateSupply(data);
    setSessionSupplies(prev => [
      ...prev,
      {
        ...hydratedSupply,
        isNew: true,
      },
    ]);

    if (assignedProjectId) {
      setSessionProjects(prev => prev.map(p =>
        p.id === assignedProjectId && !p.supplyIds.includes(newId)
          ? { ...p, supplyIds: [...p.supplyIds, newId] }
          : p
      ));
    }
    setShowAddSupplyForm(false);
  } catch (error) {
    console.error("Error saving cloud supply:", error);
    throw error;
  }
  };

  const handleEditProject = async (projectId, updatedData) => {
    if (typeof projectId === "string") {
      try {
        // Map each still-present display URL back to its original Storage
        // path so unchanged images are neither re-uploaded nor lost; only
        // entries that are fresh data: URLs need a new upload.
        const existingProject = sessionProjects.find(p => p.id === projectId);
        const pathByDisplayUrl = new Map(
          (existingProject?.images ?? []).map((displayUrl, i) => [displayUrl, existingProject.imagePaths?.[i]])
        );

        const rawImages = Array.isArray(updatedData.images) ? updatedData.images : [];
        const resolvedPaths = await Promise.all(rawImages.map(async (image) => {
          if (isProjectDataImage(image)) return uploadProjectImage(image);
          return pathByDisplayUrl.get(image) ?? image;
        }));
        const [coverImageUrl = null, ...imageKeys] = resolvedPaths;

        const updated = await projectService.update({
          id: projectId,
          title: updatedData.title,
          status: updatedData.status,
          notes: updatedData.notes,
          coverImageUrl,
          imageKeys,
        });
        const hydratedProject = await hydrateProject(updated);
        setSessionProjects(prev => prev.map(p =>
          p.id === projectId
            ? {
                ...p,
                ...hydratedProject,
                budget: updatedData.budget ?? p.budget,
                supplyIds: p.supplyIds,
                updatedAt: Date.now(),
              }
            : p
        ));
        return;
      } catch (error) {
        console.error("Error updating cloud project:", error);
        throw error;
      }
    }

    setSessionProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, ...updatedData, id: p.id, supplyIds: p.supplyIds, updatedAt: Date.now() }
        : p
    ));
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    if (typeof projectId === "string") {
      try {
        await projectService.delete(projectId);
      } catch (error) {
        console.error("Error deleting cloud project:", error);
        return;
      }
    }

    setSessionProjects(prev => prev.filter(p => p.id !== projectId));
    setSessionSupplies(prev => prev.map(s => ({
      ...s,
      usedInProjectIds: s.usedInProjectIds.filter(id => id !== projectId),
    })));
    if (selectedProjectId === projectId) setSelectedProjectId(null);
  };

  const handleAssignSupply = (projectId, supplyId) => {
    setSessionProjects(prev => prev.map(p =>
      p.id === projectId && !p.supplyIds.includes(supplyId)
        ? { ...p, supplyIds: [...p.supplyIds, supplyId] }
        : p
    ));
    setSessionSupplies(prev => prev.map(s =>
      s.id === supplyId && !s.usedInProjectIds.includes(projectId)
        ? { ...s, usedInProjectIds: [...s.usedInProjectIds, projectId] }
        : s
    ));
  };

  const handleUnassignSupply = (projectId, supplyId) => {
    setSessionProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, supplyIds: p.supplyIds.filter(id => id !== supplyId) }
        : p
    ));
    setSessionSupplies(prev => prev.map(s =>
      s.id === supplyId
        ? { ...s, usedInProjectIds: s.usedInProjectIds.filter(id => id !== projectId) }
        : s
    ));
  };

  const handleEditSupply = async (supplyId, updatedData) => {
    if (typeof supplyId === "string") {
      try {
        const updateInput = {
          id: supplyId,
          name: updatedData.name,
          category: updatedData.category,
          subcategory: updatedData.subcategory,
          quantity: updatedData.qty,
          location: updatedData.location,
          notes: updatedData.notes,
        };

        if (isSupplyDataImage(updatedData.image)) {
          updateInput.imageUrl = await uploadSupplyImage(updatedData.image);
        } else if (updatedData.image === null) {
          updateInput.imageUrl = null;
        }

        const { data } = await client.models.Supply.update(updateInput);
        const hydratedSupply = await hydrateSupply(data);
        setSessionSupplies(prev => prev.map(s =>
          s.id === supplyId
            ? {
                ...s,
                ...hydratedSupply,
                status: updatedData.status ?? s.status,
                barcode: updatedData.barcode ?? s.barcode,
                usedInProjectIds: s.usedInProjectIds,
              }
            : s
        ));
        return;
      } catch (error) {
        console.error("Error updating cloud supply:", error);
        throw error;
      }
    }

    setSessionSupplies(prev => prev.map(s =>
      s.id === supplyId
        ? { ...s, ...updatedData, id: s.id, usedInProjectIds: s.usedInProjectIds }
        : s
    ));
  };

  const handleDeleteSupply = async (supplyId) => {
    if (!window.confirm("Delete this supply? This cannot be undone.")) return;
    if (typeof supplyId === "string") {
      try {
        await client.models.Supply.delete({ id: supplyId });
      } catch (error) {
        console.error("Error deleting cloud supply:", error);
        return;
      }
    }

    setSessionSupplies(prev => prev.filter(s => s.id !== supplyId));
    setSessionProjects(prev => prev.map(p => ({
      ...p,
      supplyIds: p.supplyIds.filter(id => id !== supplyId),
    })));
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onerror = () => alert("Could not read file. Import cancelled.");
    reader.onload = (event) => {
      let parsed;
      try {
        parsed = JSON.parse(event.target.result);
      } catch {
        alert("Invalid JSON file. Import cancelled.");
        return;
      }
      if (!validateImportedData(parsed)) {
        alert("File is missing required projects or supplies arrays. Import cancelled.");
        return;
      }
      const normalized = {
        projects: parsed.projects.map(normalizeProject),
        supplies: parsed.supplies.map(normalizeSupply),
      };
      const { projects, supplies } = cleanImportedLinks(normalized.projects, normalized.supplies);
      setSessionProjects(projects);
      setSessionSupplies(supplies);
      alert("Import successful.");
    };
    reader.readAsText(file);
  };

  const handleExportData = () => {
    const payload = {
      app: "AST Studio",
      exportedAt: new Date().toISOString(),
      version: 1,
      projects: sessionProjects,
      supplies: sessionSupplies,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ast-studio-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050009] text-white">

      <div className="relative z-10 flex min-h-screen flex-col">
        <DashboardHeader />

        {/* ── Mobile drawer overlays ── */}
        {(leftOpen || rightOpen) && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => { setLeftOpen(false); setRightOpen(false); }}
          />
        )}

        {/* Left drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs scrollbar-left rounded-r-3xl border-r border-ast_turquoise/30 bg-[#0B0018] p-4 backdrop-blur-xl overflow-y-auto transition-transform duration-300 md:hidden ${
            leftOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button onClick={() => setLeftOpen(false)} className="mb-4 text-xs text-ast_turquoise/60 hover:text-ast_turquoise transition">✕ Close</button>
          <button
            onClick={() => { navigate('/dashboard'); setLeftOpen(false); }}
            className="mb-4 w-full text-left hover:opacity-75 transition"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-ast_turquoise">Studio Tools</p>
            <h2 className="mt-2 text-xl font-semibold text-[#00E6FF]">My Studio</h2>
          </button>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => { navigate('/projects'); setLeftOpen(false); }} className={`rounded-xl border p-2.5 text-left transition ${defaultView === 'projects' ? 'border-ast_electric_blue/60 bg-ast_electric_blue/10' : 'border-ast_turquoise/30 bg-[#120724] hover:border-ast_electric_blue/40 hover:bg-ast_electric_blue/5'}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ast_turquoise">Projects</p>
                <p className="mt-0.5 text-lg font-bold text-[#00E6FF]">{sessionProjects.length}</p>
                <p className="text-[9px] text-ast_body/55 leading-tight">{sessionProjects.filter(p => p.status === 'in-progress').length} active</p>
              </button>
              <button onClick={() => { navigate('/supplies'); setLeftOpen(false); }} className={`rounded-xl border p-2.5 text-left transition ${defaultView === 'supplies' ? 'border-ast_electric_blue/60 bg-ast_electric_blue/10' : 'border-ast_lavender/30 bg-[#120724] hover:border-ast_electric_blue/40 hover:bg-ast_electric_blue/5'}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9F6BFF]">Supplies</p>
                <p className="mt-0.5 text-lg font-bold text-[#00E5FF]">{sessionSupplies.length}</p>
                <p className="text-[9px] text-[#F6B94B]/80 leading-tight">{sessionSupplies.filter(s => s.status === 'low' || s.status === 'critical').length} low</p>
              </button>
              <button onClick={() => { navigate('/inspiration'); setLeftOpen(false); }} className={`rounded-xl border p-2.5 text-left transition ${defaultView === 'inspiration' ? 'border-ast_lavender/60 bg-ast_lavender/10' : 'border-ast_purple/30 bg-[#120724] hover:border-ast_lavender/40 hover:bg-ast_lavender/5'}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender">Inspo</p>
                <p className="mt-0.5 text-lg font-bold text-ast_lavender/80">{allEntries.length}</p>
                <p className="text-[9px] text-ast_body/55 leading-tight">entries</p>
              </button>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ast_turquoise mb-2">Recent Projects</p>
              {isLoadingProjects ? (
                <div className="rounded-xl border border-ast_turquoise/15 bg-[#120724] px-4 py-5 text-center">
                  <p className="text-xs text-ast_body/40">Loading projects…</p>
                </div>
              ) : sessionProjects.length === 0 ? (
                <div className="rounded-xl border border-ast_turquoise/15 bg-[#120724] px-4 py-5 text-center">
                  <p className="text-xs text-ast_body/40 mb-3">No projects yet</p>
                  <button onClick={() => { setShowAddProjectForm(true); setLeftOpen(false); }} className="w-full rounded-lg bg-gradient-to-r from-ast_turquoise to-ast_blue px-3 py-2 text-xs font-semibold text-white hover:opacity-90 transition">+ Create Project</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  {[...sessionProjects].sort((a, b) => (b.updatedAt ?? b.id) - (a.updatedAt ?? a.id)).slice(0, 4).map(project => {
                    const cover = project.images?.[0];
                    return (
                      <button key={project.id} onClick={() => { navigate('/projects', { state: { selectedProjectId: project.id } }); setLeftOpen(false); }} className="w-full text-left rounded-xl border border-ast_turquoise/20 bg-[#120724] overflow-hidden hover:border-ast_electric_blue/50 transition group">
                        {cover ? <img src={cover} alt="" className="ast-img-safe w-full aspect-square object-cover" /> : <div className="w-full aspect-square bg-gradient-to-br from-ast_purple/20 via-ast_lavender/10 to-transparent" />}
                        <div className="px-2 py-1.5">
                          <p className="text-[10px] font-semibold text-ast_body group-hover:text-ast_cyan leading-snug truncate transition-colors">{project.title}</p>
                          <p className="text-[9px] text-ast_muted capitalize leading-tight truncate">{project.status?.replace('-', ' ')}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ast_lavender mb-2">Inspiration</p>
              <div className="space-y-1.5">
                <button onClick={() => { navigate('/inspiration', { state: { section: 'featured-artist' } }); setLeftOpen(false); }} className="w-full text-left rounded-xl border border-ast_purple/30 bg-[#120724] overflow-hidden hover:border-ast_purple/60 transition">
                  <div className="h-9 bg-gradient-to-r from-ast_electric_blue/50 via-ast_purple/50 to-ast_pink/40" />
                  <div className="px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ast_faint mb-0.5">Studio Spotlight</p>
                    <p className="text-xs font-semibold text-ast_turquoise">Kim Wyatt</p>
                    <p className="text-[10px] text-ast_muted truncate">Studio Art Labs</p>
                  </div>
                </button>
                <button onClick={() => { navigate('/inspiration', { state: { section: 'quote' } }); setLeftOpen(false); }} className="w-full text-left rounded-xl border border-ast_turquoise/20 bg-[#120724] px-3 py-2.5 hover:border-ast_turquoise/50 transition">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ast_turquoise mb-1">Quote of the Day</p>
                  {sidebarQuote ? (<><p className="text-xs text-ast_body italic leading-snug line-clamp-2">&ldquo;{sidebarQuote.body_text}&rdquo;</p><p className="text-[10px] text-ast_muted mt-1">— {sidebarQuote.artist_name}</p></>) : <p className="text-xs text-ast_body/40">Inspiration coming soon</p>}
                </button>
                <button onClick={() => { navigate('/inspiration', { state: { section: 'art-history-today' } }); setLeftOpen(false); }} className="w-full text-left rounded-xl border border-ast_lavender/20 bg-[#120724] px-3 py-2.5 hover:border-ast_lavender/50 transition">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender mb-1">Today in Art History</p>
                  {sidebarArtHistory ? <p className="text-xs font-semibold text-ast_body leading-snug line-clamp-2">{sidebarArtHistory.title}</p> : <p className="text-xs text-ast_body/40">No entry for today</p>}
                </button>
                <button onClick={() => { navigate('/inspiration', { state: { section: 'partner' } }); setLeftOpen(false); }} className="w-full text-left rounded-xl border border-ast_blue/25 bg-[#120724] px-3 py-2.5 hover:border-ast_blue/50 transition">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender mb-1">Partners</p>
                  <p className="text-xs font-semibold text-[#8D5CFF]">Retailer &amp; Manufacturer Picks</p>
                  <p className="text-[10px] text-ast_body/55 mt-1 leading-snug">Supply deals &amp; partner inspiration.</p>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Right drawer */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-4/5 max-w-xs rounded-l-3xl border-l border-ast_pink/40 bg-[#0B0018] p-4 backdrop-blur-xl overflow-y-auto transition-transform duration-300 md:hidden ${
            rightOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button onClick={() => setRightOpen(false)} className="mb-4 text-xs text-ast_pink/60 hover:text-ast_pink transition">✕ Close</button>
          <div className="sticky top-4 z-10 mb-4 space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ast_pink">Community</p>
              <h2 className="mt-2 text-lg font-semibold text-[#FF2FB3]">Studio Chat</h2>
            </div>
            <div className="rounded-2xl border border-ast_purple/35 bg-[#120724] p-3">
              <p className="text-sm font-semibold text-ast_lavender">Studio Memory</p>
              <p className="mt-1 text-xs text-ast_body/70">You were working on Watercolor Botanicals.</p>
            </div>
            <div className="rounded-2xl border border-ast_turquoise/30 bg-[#120724] p-3">
              <p className="text-sm font-semibold text-ast_turquoise">Need help?</p>
              <p className="mt-1 text-xs text-ast_body/70">Ask how to add supplies, track condition, or prep for a show.</p>
            </div>
          </div>
          <div className="space-y-4">
            <StudioChat user={user} />
          </div>
        </aside>

        {/* ── Desktop three-panel grid (hidden on mobile) ── */}
        <section className="hidden md:grid flex-1 grid-cols-12 gap-4 px-4 pb-4">
          {/* LEFT PANEL: Studio Tools */}
          <aside className="scrollbar-left col-span-3 min-h-0 rounded-3xl border border-ast_turquoise/30 bg-[#0B0018] p-4 backdrop-blur-xl overflow-y-auto">
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-4 w-full text-left hover:opacity-75 transition"
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-ast_turquoise">
                Studio Tools
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#00E6FF]">
                My Studio
              </h2>
            </button>

            <div className="space-y-3">
              {/* Compact nav buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => navigate('/projects')}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    defaultView === 'projects'
                      ? 'border-ast_electric_blue/60 bg-ast_electric_blue/10'
                      : 'border-ast_turquoise/30 bg-[#120724] hover:border-ast_electric_blue/40 hover:bg-ast_electric_blue/5'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ast_turquoise">Projects</p>
                  <p className="mt-0.5 text-lg font-bold text-[#00E6FF]">{sessionProjects.length}</p>
                  <p className="text-[9px] text-ast_body/55 leading-tight">
                    {sessionProjects.filter(p => p.status === 'in-progress').length} active
                  </p>
                </button>

                <button
                  onClick={() => navigate('/supplies')}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    defaultView === 'supplies'
                      ? 'border-ast_electric_blue/60 bg-ast_electric_blue/10'
                      : 'border-ast_lavender/30 bg-[#120724] hover:border-ast_electric_blue/40 hover:bg-ast_electric_blue/5'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9F6BFF]">Supplies</p>
                  <p className="mt-0.5 text-lg font-bold text-[#00E5FF]">{sessionSupplies.length}</p>
                  <p className="text-[9px] text-[#F6B94B]/80 leading-tight">
                    {sessionSupplies.filter(s => s.status === 'low' || s.status === 'critical').length} low
                  </p>
                </button>

                <button
                  onClick={() => navigate('/inspiration')}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    defaultView === 'inspiration'
                      ? 'border-ast_lavender/60 bg-ast_lavender/10'
                      : 'border-ast_purple/30 bg-[#120724] hover:border-ast_lavender/40 hover:bg-ast_lavender/5'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender">Inspo</p>
                  <p className="mt-0.5 text-lg font-bold text-ast_lavender/80">{allEntries.length}</p>
                  <p className="text-[9px] text-ast_body/55 leading-tight">entries</p>
                </button>
              </div>

              {/* Project list */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ast_turquoise mb-2">Recent Projects</p>
                {isLoadingProjects ? (
                  <div className="rounded-xl border border-ast_turquoise/15 bg-[#120724] px-4 py-5 text-center">
                    <p className="text-xs text-ast_body/40">Loading projects…</p>
                  </div>
                ) : sessionProjects.length === 0 ? (
                  <div className="rounded-xl border border-ast_turquoise/15 bg-[#120724] px-4 py-5 text-center">
                    <p className="text-xs text-ast_body/40 mb-3">No projects yet</p>
                    <button
                      onClick={() => setShowAddProjectForm(true)}
                      className="w-full rounded-lg bg-gradient-to-r from-ast_turquoise to-ast_blue px-3 py-2 text-xs font-semibold text-white hover:opacity-90 transition"
                    >
                      + Create Project
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {[...sessionProjects]
                      .sort((a, b) => (b.updatedAt ?? b.id) - (a.updatedAt ?? a.id))
                      .slice(0, 4)
                      .map(project => {
                        const cover = project.images?.[0];
                        return (
                          <button
                            key={project.id}
                            onClick={() => navigate('/projects', { state: { selectedProjectId: project.id } })}
                            className="w-full text-left rounded-xl border border-ast_turquoise/20 bg-[#120724] overflow-hidden hover:border-ast_electric_blue/50 transition group"
                          >
                            {cover ? (
                              <img
                                src={cover}
                                alt=""
                                className="ast-img-safe w-full aspect-square object-cover"
                              />
                            ) : (
                              <div className="w-full aspect-square bg-gradient-to-br from-ast_purple/20 via-ast_lavender/10 to-transparent" />
                            )}
                            <div className="px-2 py-1.5">
                              <p className="text-[10px] font-semibold text-ast_body group-hover:text-ast_cyan leading-snug truncate transition-colors">
                                {project.title}
                              </p>
                              <p className="text-[9px] text-ast_muted capitalize leading-tight truncate">
                                {project.status?.replace('-', ' ')}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Inspiration section */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ast_lavender mb-2">Inspiration</p>
                <div className="space-y-1.5">

                  {/* Featured Artist */}
                  <button
                    onClick={() => navigate('/inspiration', { state: { section: 'featured-artist' } })}
                    className="w-full text-left rounded-xl border border-ast_purple/30 bg-[#120724] overflow-hidden hover:border-ast_purple/60 transition"
                  >
                    <div className="h-9 bg-gradient-to-r from-ast_electric_blue/50 via-ast_purple/50 to-ast_pink/40" />
                    <div className="px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ast_faint mb-0.5">Studio Spotlight</p>
                      <p className="text-xs font-semibold text-ast_turquoise">Kim Wyatt</p>
                      <p className="text-[10px] text-ast_muted truncate">Studio Art Labs</p>
                    </div>
                  </button>

                  {/* Artist Quote of the Day */}
                  <button
                    onClick={() => navigate('/inspiration', { state: { section: 'quote' } })}
                    className="w-full text-left rounded-xl border border-ast_turquoise/20 bg-[#120724] px-3 py-2.5 hover:border-ast_turquoise/50 transition"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ast_turquoise mb-1">Quote of the Day</p>
                    {sidebarQuote ? (
                      <>
                        <p className="text-xs text-ast_body italic leading-snug line-clamp-2">&ldquo;{sidebarQuote.body_text}&rdquo;</p>
                        <p className="text-[10px] text-ast_muted mt-1">— {sidebarQuote.artist_name}</p>
                      </>
                    ) : (
                      <p className="text-xs text-ast_body/40">Inspiration coming soon</p>
                    )}
                  </button>

                  {/* Today in Art History */}
                  <button
                    onClick={() => navigate('/inspiration', { state: { section: 'art-history-today' } })}
                    className="w-full text-left rounded-xl border border-ast_lavender/20 bg-[#120724] px-3 py-2.5 hover:border-ast_lavender/50 transition"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender mb-1">Today in Art History</p>
                    {sidebarArtHistory ? (
                      <p className="text-xs font-semibold text-ast_body leading-snug line-clamp-2">{sidebarArtHistory.title}</p>
                    ) : (
                      <p className="text-xs text-ast_body/40">No entry for today</p>
                    )}
                  </button>

                  {/* Partner / Ad */}
                  <button
                    onClick={() => navigate('/inspiration', { state: { section: 'partner' } })}
                    className="w-full text-left rounded-xl border border-ast_blue/25 bg-[#120724] px-3 py-2.5 hover:border-ast_blue/50 transition"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ast_lavender mb-1">Partners</p>
                    <p className="text-xs font-semibold text-[#8D5CFF]">Retailer & Manufacturer Picks</p>
                    <p className="text-[10px] text-ast_body/55 mt-1 leading-snug">Supply deals & partner inspiration.</p>
                  </button>

                </div>
              </div>
            </div>
          </aside>

          {/* CENTER PANEL: Workspace */}
          <main className="col-span-7 min-h-0 rounded-3xl border border-ast_purple/50 bg-[#0B0018] p-6 backdrop-blur-xl">

            {/* INSPIRATION VIEW */}
            {defaultView === 'inspiration' && <InspirationWorkspace />}

            {/* HOME VIEW */}
            {defaultView === 'home' && (
              <HomeWorkspace
                onClickImport={() => fileInputRef.current?.click()}
                onExport={handleExportData}
              />
            )}

            {/* PROJECTS VIEW */}
            {defaultView === 'projects' && (
              <ProjectsWorkspace
                sessionProjects={sessionProjects}
                sessionSupplies={sessionSupplies}
                isLoading={isLoadingProjects}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
                onAddProject={() => setShowAddProjectForm(true)}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
                onAssignSupply={handleAssignSupply}
                onUnassignSupply={handleUnassignSupply}
                onImport={() => fileInputRef.current?.click()}
                onExport={handleExportData}
              />
            )}

            {/* SUPPLIES VIEW */}
            {defaultView === 'supplies' && (
              <SuppliesWorkspace
                sessionSupplies={sessionSupplies}
                sessionProjects={sessionProjects}
                isLoading={isLoadingSupplies}
                onEditSupply={handleEditSupply}
                onDeleteSupply={handleDeleteSupply}
                onAssignSupply={handleAssignSupply}
                onOpenAddSupply={() => setShowAddSupplyForm(true)}
                onImport={() => fileInputRef.current?.click()}
                onExport={handleExportData}
              />
            )}
          </main>

          {/* RIGHT PANEL: Community + Chat */}
          <aside className="col-span-2 min-h-0 rounded-3xl border border-ast_pink/40 bg-[#0B0018] p-4 backdrop-blur-xl overflow-hidden">
            <div className="sticky top-4 z-10 mb-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-ast_pink">
                  Community
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[#FF2FB3]">
                  Studio Chat
                </h2>
              </div>

              <div className="rounded-2xl border border-ast_purple/35 bg-[#120724] p-3">
                <p className="text-sm font-semibold text-ast_lavender">
                  Studio Memory
                </p>
                <p className="mt-1 text-xs text-ast_body/70">
                  You were working on Watercolor Botanicals.
                </p>
              </div>

              <div className="rounded-2xl border border-ast_turquoise/30 bg-[#120724] p-3">
                <p className="text-sm font-semibold text-ast_turquoise">
                  Need help?
                </p>
                <p className="mt-1 text-xs text-ast_body/70">
                  Ask how to add supplies, track condition, or prep for a show.
                </p>
              </div>
            </div>

            <div className="scrollbar-right max-h-[calc(100vh-16rem)] space-y-4 overflow-y-auto pr-1">
              <StudioChat user={user} />
            </div>
          </aside>
        </section>

        {/* ── Mobile center workspace (visible only on mobile) ── */}
        <section className="flex md:hidden flex-1 flex-col min-h-0 mx-4 mb-4 rounded-3xl border border-ast_purple/50 bg-[#0B0018] p-6 backdrop-blur-xl overflow-y-auto">
          {/* Mobile drawer toggle buttons */}
          <div className="flex justify-between mb-4">
            <button
              onClick={() => setLeftOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-ast_turquoise/30 bg-[#120724] px-3 py-2 text-xs font-semibold text-ast_turquoise hover:border-ast_turquoise/60 transition"
            >
              ☰ Studio Tools
            </button>
            <button
              onClick={() => setRightOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-ast_pink/30 bg-[#120724] px-3 py-2 text-xs font-semibold text-ast_pink hover:border-ast_pink/60 transition"
            >
              Chat ☰
            </button>
          </div>

          {defaultView === 'inspiration' && <InspirationWorkspace />}
          {defaultView === 'home' && <HomeWorkspace onClickImport={() => fileInputRef.current?.click()} onExport={handleExportData} />}
          {defaultView === 'projects' && (
            <ProjectsWorkspace
              sessionProjects={sessionProjects}
              sessionSupplies={sessionSupplies}
              isLoading={isLoadingProjects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onAddProject={() => setShowAddProjectForm(true)}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
              onAssignSupply={handleAssignSupply}
              onUnassignSupply={handleUnassignSupply}
              onImport={() => fileInputRef.current?.click()}
              onExport={handleExportData}
            />
          )}
          {defaultView === 'supplies' && (
            <SuppliesWorkspace
              sessionSupplies={sessionSupplies}
              sessionProjects={sessionProjects}
              isLoading={isLoadingSupplies}
              onEditSupply={handleEditSupply}
              onDeleteSupply={handleDeleteSupply}
              onAssignSupply={handleAssignSupply}
              onOpenAddSupply={() => setShowAddSupplyForm(true)}
              onImport={() => fileInputRef.current?.click()}
              onExport={handleExportData}
            />
          )}
        </section>
      </div>

      {/* Hidden file input for import — always rendered so ref is always valid */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportData}
      />

      {/* Form Modals */}
      {showAddProjectForm && (
        <AddProjectFormInline
          onSubmit={handleAddProject}
          onCancel={() => setShowAddProjectForm(false)}
          sessionProjects={sessionProjects}
          onSelectExisting={(projectId) => {
            setSelectedProjectId(projectId);
            setShowAddProjectForm(false);
          }}
        />
      )}

      {showAddSupplyForm && (
        <AddSupplyFormInline
          onSubmit={handleAddSupply}
          onCancel={() => setShowAddSupplyForm(false)}
          sessionProjects={sessionProjects}
          sessionSupplies={sessionSupplies}
        />
      )}

    </main>
  );
}
