import { useSession } from "@/context/SessionContext";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/authService";
import { MdLogout, MdPerson, MdSecurity, MdPalette } from "react-icons/md";
import { useState } from "react";
import { calculateAge } from "@/utils/calculateAge";
import { formatDateToString } from "@/utils/formatDateToString";
import GradientBlobs from "@/components/GradientBlobs";

type TabType = "profile" | "account" | "customization";

export default function Profile() {
  const { session, clearSession } = useSession();
  const navigate = useNavigate();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const secondaryColor = useThemeColor({}, "secondary");
  const primaryColor = useThemeColor({}, "primary");
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  if (!session?.user) {
    return <div>Loading...</div>;
  }

  const user = session.user;

  const handleLogout = async () => {
    logout();
    await clearSession();
    navigate("/login");
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile Information", icon: <MdPerson size={20} /> },
    { id: "account", label: "Account Control", icon: <MdSecurity size={20} /> },
    { id: "customization", label: "Customization", icon: <MdPalette size={20} /> },
  ];

  return (
    <div
      style={{ backgroundColor }}
      className="min-h-screen pt-2 md:p-6 md:pt-2"
    >
      <GradientBlobs/>
      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header with User Info and Logout Button */}
        <div
          style={{
            color: textColor,
          }}
          className="rounded-xl px-3 mb-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                style={{ backgroundColor: secondaryColor }}
                className="w-full aspect-square rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span className="text-lg font-bold text-white">
                  {user.fname?.charAt(0)}{user.lname?.charAt(0) || ''}
                </span>
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-lg font-bold font-poppins">
                  {user.fname} {user.lname || ''}
                </h1>
                <p className="text-xs opacity-70 font-poppins">@{user.username}</p>
                <div className="mt-1">
                  <span
                    style={{ backgroundColor: secondaryColor }}
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white font-poppins capitalize"
                  >
                    {user.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-opacity hover:opacity-70 flex-shrink-0"
              style={{ backgroundColor: secondaryColor, color: "white" }}
              title="Logout"
            >
              <MdLogout size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="md:rounded-[10px] p-3 mb-6 backdrop-blur-md border border-white border-opacity-20 shadow-lg"
        >
          {/* Tab Navigation */}
          <div className="flex gap-8 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 transition-colors relative flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `text-white font-semibold `
                    : `text-gray-400 hover:text-gray-300`
                }`}
                style={{
                  color: activeTab === tab.id ? "#00CAFF" : undefined,
                }}
              >
                {tab.icon}
                <span className="hidden sm:inline text-sm">{tab.label}</span>
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full"
                    style={{ backgroundColor: "#00CAFF" }}
                  ></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6" style={{ color: textColor }}>
            {/* Profile Information Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold font-poppins mb-4">Profile Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Full Name</p>
                    <p className="text-sm font-semibold font-poppins">
                      {user.fname} {user.lname || ''}
                    </p>
                  </div>

                  {/* Username */}
                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Username</p>
                    <p className="text-sm font-semibold font-poppins">@{user.username}</p>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Email</p>
                    <p className="text-sm font-semibold font-poppins break-all">{user.email}</p>
                  </div>

                  {/* Contact Number */}
                  {user.contactNumber && (
                    <div className="space-y-1">
                      <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Contact</p>
                      <p className="text-sm font-semibold font-poppins">{user.contactNumber}</p>
                    </div>
                  )}

                  {/* Gender */}
                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Gender</p>
                    <p className="text-sm font-semibold font-poppins capitalize">
                      {user.gender}
                    </p>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">DOB</p>
                    <p className="text-sm font-semibold font-poppins">
                      {formatDateToString(user.bdate)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Age</p>
                    <p className="text-sm font-semibold font-poppins">
                      {calculateAge(user.bdate)} years
                    </p>
                  </div>

                  {/* Account Type */}
                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Type</p>
                    <p
                      style={{ color: secondaryColor }}
                      className="text-sm font-semibold font-poppins capitalize"
                    >
                      {user.type}
                    </p>
                  </div>

                  {/* Account Status */}
                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Status</p>
                    <p className="text-sm font-semibold font-poppins capitalize">
                      {user.status}
                    </p>
                  </div>

                  {/* Member Since */}
                  <div className="space-y-1">
                    <p className="text-xs opacity-60 font-poppins uppercase tracking-wide">Member Since</p>
                    <p className="text-sm font-semibold font-poppins">
                      {formatDateToString(user.createdOn)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Control Tab */}
            {activeTab === "account" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold font-poppins mb-4">Account Control</h2>

                <div className="space-y-3">
                  {/* Change Password Section */}
                    <div className="flex items-start justify-between gap-3 mb-5 border-b border-opacity-40 pb-5">
                      <div>
                        <h3 className="font-semibold font-poppins text-sm mb-1">Change Password</h3>
                        <p className="text-xs opacity-70 font-poppins">
                          Update your password to keep your account secure
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/change-password")}
                        style={{
                          backgroundColor: secondaryColor,
                          color: "white",
                        }}
                        className="px-3 py-1 rounded-md font-medium font-poppins hover:opacity-90 transition-opacity whitespace-nowrap text-xs"
                      >
                        Change
                      </button>
                    </div>
                  {user.type === 'admin_super' && (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 style={{ color: "#ef4444" }} className="font-semibold font-poppins text-sm mb-1">
                          Delete Account
                        </h3>
                        <p className="text-xs opacity-70 font-poppins">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <button
                        style={{
                          backgroundColor: "#ef4444",
                          color: "white",
                        }}
                        className="px-3 py-1 rounded-md font-medium font-poppins hover:opacity-90 transition-opacity whitespace-nowrap text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  
                </div>
              </div>
            )}

            {/* Customization Tab */}
            {activeTab === "customization" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold font-poppins mb-4">Customization</h2>

                {/* Theme Selection */}
                <div>
                  <h3 className="font-semibold font-poppins text-sm mb-2">Theme Preference</h3>
                  <p className="text-xs opacity-70 font-poppins mb-3">
                    Choose how the app looks
                  </p>

                  <div className="flex gap-2">
                    {["light", "dark", "device"].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={async () => {
                          await setTheme(themeOption as any);
                        }}
                        style={{
                          backgroundColor:
                            theme === themeOption ? secondaryColor : "transparent",
                          color: theme === themeOption ? "white" : textColor,
                          borderColor: secondaryColor,
                        }}
                        className="px-4 py-2 rounded-lg font-medium font-poppins border-2 transition-all capitalize hover:opacity-80 text-xs"
                      >
                        {themeOption === "device" ? "Device" : themeOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Theme Info */}
                <div
                  style={{
                    backgroundColor: primaryColor,
                    borderColor: secondaryColor,
                  }}
                  className="rounded-lg p-4 border border-opacity-30"
                >
                  <p className="text-xs opacity-60 font-poppins mb-1 uppercase tracking-wide">Current Theme</p>
                  <p className="text-sm font-semibold font-poppins capitalize">
                    {theme === "device" ? "Device Default" : theme}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
