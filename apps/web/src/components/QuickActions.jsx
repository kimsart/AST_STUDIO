export default function QuickActions() {
  const colorMap = {
    turquoise: { border: 'border-ast_turquoise/30 hover:border-ast_turquoise/60', text: 'text-ast_turquoise' },
    pink: { border: 'border-ast_pink/30 hover:border-ast_pink/60', text: 'text-ast_pink' },
    yellow: { border: 'border-ast_yellow/30 hover:border-ast_yellow/60', text: 'text-ast_yellow' },
    purple: { border: 'border-ast_purple/30 hover:border-ast_purple/60', text: 'text-ast_purple' },
  }

  const handleNewProject = () => {
    alert('Add Project feature coming soon! Forms will be available in Phase 2B.');
  };

  const handleAddSupply = () => {
    alert('Add Supply feature coming soon! Forms will be available in Phase 2B.');
  };

  const handleLogSession = () => {
    alert('Coming soon');
  };

  const handleTakePhoto = () => {
    alert('Coming soon');
  };

  const actions = [
    { label: 'New Project', icon: '➕', color: 'turquoise', handler: handleNewProject },
    { label: 'Add Supply', icon: '🎁', color: 'pink', handler: handleAddSupply },
    { label: 'Log Session', icon: '⏱️', color: 'yellow', handler: handleLogSession },
    { label: 'Take Photo', icon: '📸', color: 'purple', handler: handleTakePhoto },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.handler}
          className={`bg-gradient-to-br from-ast_bg_blue/50 to-ast_bg_dark border rounded-xl p-4 transition group ${colorMap[action.color].border}`}
        >
          <div className={`text-3xl mb-2 group-hover:scale-110 transition ${colorMap[action.color].text}`}>
            {action.icon}
          </div>
          <p className={`text-sm font-medium ${colorMap[action.color].text}`}>{action.label}</p>
        </button>
      ))}
    </div>
  )
}
