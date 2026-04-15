function MarketerMainContent({user}){



return(
    
        <div className="flex-1 p-8 overflow-auto flex justify-center bg-gray-50">
          <div className="max-w-8xl w-full">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome Back! {user?.name || 'Undefined'}
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your projects today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Projects', value: '24', change: '+12%', color: 'from-blue-500 to-cyan-500' },
                { label: 'Active Users', value: '1,429', change: '+5%', color: 'from-purple-500 to-pink-500' },
                { label: 'Revenue', value: '$12.5k', change: '+23%', color: 'from-orange-500 to-red-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h3>
              <p className="text-gray-600">
                Your main content goes here. The sidebar now features a clean white design with expandable/collapsible submenus and a modern top bar.
              </p>
            
            </div>
          </div>
        </div>
);
}





export default MarketerMainContent;