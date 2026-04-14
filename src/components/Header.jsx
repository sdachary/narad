import { PanelLeft, PanelRight, Circle, Square, Triangle } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onSearch, 
  onClear, 
  onBrainStats,
  isConnected,
  sidebarCollapsed,
  onToggleSidebar
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col pointer-events-none">
      {/* Top Banner - Constructivist Balance */}
      <div className="flex bg-[var(--bauhaus-bg)] border-b-4 border-black pointer-events-auto h-20">
        
        {/* Left Side - The Brand Triad */}
        <div className="flex items-center gap-8 px-8 border-r-4 border-black">
          <div className="flex items-center gap-3">
            <Triangle className="text-bauhaus-red fill-current" size={24} strokeWidth={3} />
            <Square className="text-bauhaus-blue fill-current" size={24} strokeWidth={3} />
            <Circle className="text-bauhaus-yellow fill-current" size={24} strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter hidden md:block">NARAD_BAUHAUS</h1>
        </div>

        {/* Center - Utility Toggle */}
        <div className="flex-1 flex items-center px-6">
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-3 bg-black text-white px-6 py-2 border-2 border-black hover:bg-bauhaus-red hover:text-white transition-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelRight size={18} />}
            <span className="text-[0.6rem] font-bold tracking-widest uppercase hidden lg:block">LOG_ARCHIVE</span>
          </button>
        </div>

        {/* Right Side - System Status */}
        <div className="flex items-center border-l-4 border-black">
           <div className={`
             h-full px-8 flex items-center gap-4 transition-colors duration-300
             ${theme === 'dark' ? 'bg-bauhaus-blue' : 'bg-bauhaus-yellow'}
           `}>
             <div className="flex flex-col items-end">
               <span className="text-[0.5rem] font-bold tracking-widest text-black/40 uppercase">NODE_UPLINK</span>
               <span className="text-sm font-black text-black leading-none">
                 {isConnected ? 'NODE_ACTIVE' : 'OFFLINE'}
               </span>
             </div>
             <div className={`w-3 h-3 rounded-full border-2 border-black ${isConnected ? 'bg-white animate-pulse' : 'bg-bauhaus-red'}`} />
           </div>

           {/* Theme Toggle - Geometric Inversion */}
           <button
             onClick={onToggleTheme}
             className="h-full px-8 bg-black text-white hover:bg-white hover:text-black border-l-4 border-black transition-none active:bg-bauhaus-red"
           >
             <span className="text-[0.65rem] font-black tracking-widest leading-none">
               {theme === 'dark' ? 'BAUHAUS_DAY' : 'BAUHAUS_NIGHT'}
             </span>
           </button>
        </div>
      </div>

      {/* Floating Action Menu - Appears on hover interaction elsewhere or persistent here? 
          For Zen, let's keep it as secondary floating modules in the corners.
      */}
      <div className="p-8 flex justify-end gap-4">
        <GhostAction onClick={onSearch} color="blue">SEARCH_LOGS</GhostAction>
        <GhostAction onClick={onBrainStats} color="yellow">NEURAL_NET</GhostAction>
        <GhostAction onClick={onClear} color="red">PURGE_DATA</GhostAction>
      </div>
    </div>
  );
}

function GhostAction({ onClick, children, color }) {
  const colorMap = {
    red: 'hover:bg-bauhaus-red',
    blue: 'hover:bg-bauhaus-blue',
    yellow: 'hover:bg-bauhaus-yellow',
  };

  return (
    <button
      onClick={onClick}
      className={`
        pointer-events-auto bg-[var(--bauhaus-bg)] border-4 border-black px-6 py-3
        text-[0.6rem] font-black tracking-widest uppercase shadow-bauhaus-sm
        transition-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
        ${colorMap[color]} hover:text-white
      `}
    >
      [ {children} ]
    </button>
  );
}