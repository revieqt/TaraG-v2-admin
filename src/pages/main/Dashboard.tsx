import { useThemeColor } from "@/hooks/useThemeColor";
import { useSession } from "@/context/SessionContext";
import GradientBlobs from "@/components/GradientBlobs";
import { getNumberOfAlertsToday } from "@/services/alertService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { session } = useSession();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const navigate = useNavigate();

  const [alertCount, setAlertCount] = useState<number>(0);
  const [loadingAlertCount, setLoadingAlertCount] = useState(false);

  useEffect(() => {
    const fetchAlertCount = async () => {
      if (!session?.accessToken) return;

      try {
        setLoadingAlertCount(true);
        const count = await getNumberOfAlertsToday(session.accessToken);
        setAlertCount(count);
      } catch (error) {
        console.error("Failed to fetch alert count:", error);
      } finally {
        setLoadingAlertCount(false);
      }
    };

    fetchAlertCount();
  }, [session?.accessToken]);

  return (
    <div
      style={{ backgroundColor }}
      className="min-h-screen pt-2 md:p-6 md:pt-2"
    >
      <GradientBlobs />
      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Welcome Header */}
        <div className="mb-5 mx-5">
          <h1 style={{ color: textColor }} className="text-3xl font-bold font-poppins mb-2">
            Welcome Back, {session?.user?.fname}! 👋
          </h1>
          <p style={{ color: textColor }} className="text-base opacity-70 font-poppins">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: '2,543', icon: '👥' },
            { label: 'Active Sessions', value: '892', icon: '🟢' },
            { label: 'Pending Reviews', value: '24', icon: '📋' },
            {
              label: 'Alerts Today',
              value: loadingAlertCount ? '...' : alertCount.toString(),
              icon: '🚨',
              onClick: () => navigate('/alerts'),
              clickable: true,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              onClick={stat.clickable ? stat.onClick : undefined}
              style={{
                backgroundColor: textColor,
                color: backgroundColor,
              }}
              className={`p-6 rounded-lg shadow-md ${stat.clickable ? 'cursor-pointer hover:shadow-lg hover:scale-105 transition-all' : ''}`}
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
