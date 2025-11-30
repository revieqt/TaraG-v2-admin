import { useSession } from "@/context/SessionContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigate } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import TextField from "@/components/TextField";
import { useState } from "react";

export default function TopBar() {
  const { session } = useSession();
  const navigate = useNavigate();
  const backgroundColor = useThemeColor({}, "background");
  const [searchQuery, setSearchQuery] = useState("");

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <div
      style={{ backgroundColor }}
      className="flex flex-row gap-3 md:gap-3 justify-end px-6 py-4"
    >
      {/* Search Bar - Fixed width, but grows on mobile */}
      <div className="flex-1 ml-10 md:flex-none md:w-1/4">
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </div>

      {/* Profile Button */}
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center gap-2 px-4 py-2 h-12 rounded-[15px] transition-opacity hover:opacity-80 flex-shrink-0 md:px-4 md:py-2 px-3 py-2
        md:border md:border-gray-400 md:border-opacity-30"
      >
        <MdPerson size={18} />
        <span className="text-sm font-semibold font-poppins hidden md:inline">
          {user.fname} {user.lname || ""}
        </span>
      </button>
    </div>
  );
}
