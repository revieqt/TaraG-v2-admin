import { useThemeColor } from "@/hooks/useThemeColor";
import { useSession } from "@/context/SessionContext";
import GradientBlobs from "@/components/GradientBlobs";

export default function Dashboard() {
  const { session } = useSession();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <div
      style={{ backgroundColor }}
      className="min-h-screen p-6 md:p-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 style={{ color: textColor }} className="text-4xl font-bold font-poppins mb-2">
            Welcome Back, {session?.user?.fname}! 👋
          </h1>
          <p style={{ color: textColor }} className="text-lg opacity-70 font-poppins">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: '2,543', icon: '👥' },
            { label: 'Active Sessions', value: '892', icon: '🟢' },
            { label: 'Pending Reviews', value: '24', icon: '📋' },
            { label: 'System Health', value: '98%', icon: '💚' },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: textColor,
                color: backgroundColor,
              }}
              className="p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70 font-poppins">{stat.label}</p>
                  <p className="text-3xl font-bold font-poppins mt-2">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div
          style={{
            backgroundColor: textColor,
            color: backgroundColor,
          }}
          className="rounded-lg p-8 shadow-md"
        >
          <h2 className="text-2xl font-bold font-poppins mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'User Registration', user: 'John Doe', time: '2 minutes ago' },
              { action: 'Profile Update', user: 'Jane Smith', time: '1 hour ago' },
              { action: 'Document Upload', user: 'Mike Johnson', time: '3 hours ago' },
              { action: 'Report Generated', user: 'System', time: '5 hours ago' },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b border-opacity-20"
                style={{ borderColor: backgroundColor }}
              >
                <div>
                  <p className="font-semibold font-poppins">{activity.action}</p>
                  <p className="text-sm opacity-70 font-poppins">{activity.user}</p>
                </div>
                <span className="text-sm opacity-70 font-poppins">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
