import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ dark }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Focus Session', icon: '⏱️' },
    { path: '/ambient-sound', label: 'Ambient Focus Sound', icon: '🎵' },
    { path: '/blocked-sites', label: 'Blocked Sites', icon: '🚫' },
    { path: '/productivity-report', label: 'Productivity Report', icon: '📊' },
  ];

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 ${dark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Focus Mode</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
              location.pathname === item.path
                ? dark
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-900'
                : dark
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;