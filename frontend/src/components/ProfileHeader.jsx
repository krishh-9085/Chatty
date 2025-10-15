import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import ConfirmationModal from "./ConfirmationModal";
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
      // Reset selected image after successful update
      setSelectedImg(null);
    };
  };

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsModalOpen(false);
  };
  const [searchValue, setSearchValue] = useState("");
  // Expose searchValue for parent via prop
  if (typeof window !== "undefined") {
    window.__chatty_searchValue = searchValue;
  }
  return (
    <div className="p-3 sm:p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink min-w-0">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-10 sm:size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-[10px] sm:text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-sm sm:text-base truncate">
              {authUser.fullName}
            </h3>

              <p className="text-green-500 text-[10px] sm:text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 sm:gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-4 sm:size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-4 sm:size-5" />
            ) : (
              <VolumeOffIcon className="size-4 sm:size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Search input at the bottom of the header with clear button and improved UI */}
      <div className="mt-4 relative">
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-700 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-md border border-slate-600 transition"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmLogout}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmButtonText="Log Out"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}
export default ProfileHeader; 