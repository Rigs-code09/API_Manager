export const PlanCard = ({ apiKeysCount }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-orange-400 rounded-2xl p-8 text-white mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-sm opacity-90 mb-2">CURRENT PLAN</div>
          <h2 className="text-3xl font-bold mb-4">Developer</h2>
        </div>
        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          📊 Manage Plan
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="text-sm opacity-90">API Limit</span>
          <svg className="w-4 h-4 ml-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="bg-white/20 rounded-full h-2 overflow-hidden mb-2">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min((apiKeysCount / 1000) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-sm opacity-90">{apiKeysCount}/1,000 Requests</div>
      </div>
    </div>
  );
}; 