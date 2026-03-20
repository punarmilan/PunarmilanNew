import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile, updateProfile } from '../../../Slice/ProfileSlice';
import { logout } from '../../../Slice/UserSlice';
import toast from 'react-hot-toast';
import SettingsSection from './SettingsSection';
import AccountSettings from './AccountSettings';
import MyContactSettings from './MyContactSettings';
import AstroDetails from './AstroDetails';
import AlertsSettings from './AlertsSettings';
import PrivacyOptions from './PrivacyOptions';
import ShaadiLive from './ShaadiLive';
import DeleteHide from './DeleteHide';
import Messages from './Messages';

// Main App Component
const Settings = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { profile, loading } = useSelector((state) => state.profile);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchMyProfile());
    }
  }, [dispatch, profile]);

  // Handle deep-linking to specific sections
  useEffect(() => {
    if (location.state?.openSection) {
      setActiveSection(location.state.openSection);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleUpdateProfile = async (updates) => {
    try {
      const isSensitiveUpdate = updates.email || updates.mobileNumber;
      await dispatch(updateProfile(updates)).unwrap();

      if (isSensitiveUpdate) {
        toast.success(`${updates.email ? 'Email' : 'Mobile number'} updated successfully. Please login again with your new credentials.`);
        // Short delay to let the user read the toast, then logout
        setTimeout(() => {
          dispatch(logout());
          navigate('/');
        }, 2000);
      } else {
        toast.success('Settings updated successfully');
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      toast.error(err || 'Failed to update settings');
    }
  };

  const Header = () => (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-20 px-6 py-6 sm:py-8">
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
        Settings {loading && <span className="text-sm font-normal text-gray-400 ml-2 animate-pulse">Syncing...</span>}
      </h1>
      <p className="text-gray-500 mt-2 font-medium">Manage your account and privacy preferences</p>
    </div>
  )

  if (!profile && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="text-rose-500 font-bold animate-bounce text-xl">Loading your settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-20">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
          {/* Header */}
          <Header />

          {/* Settings Sections */}
          <div className="divide-y divide-gray-50">
            {/* Account Settings */}
            <SettingsSection
              title="Account Settings"
              status={profile?.email}
              isActive={activeSection === 'account'}
              onToggle={() => toggleSection('account')}
            >
              <AccountSettings
                email={profile?.email}
                onUpdate={handleUpdateProfile}
              />
            </SettingsSection>

            <SettingsSection
              title="My Contact Settings"
              status={profile?.contactDisplayStatus || 'Only Premium Members'}
              isActive={activeSection === 'contact'}
              onToggle={() => toggleSection('contact')}
            >
              <MyContactSettings
                profile={profile}
                onUpdate={handleUpdateProfile}
              />
            </SettingsSection>

            {/* Contact Filters - Integrated Accordion */}
            <SettingsSection
              title="Contact Filters"
              isActive={activeSection === 'filters'}
              onToggle={() => toggleSection('filters')}
            >
              <div className="space-y-4">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Control who can see your contact details based on age, religion, community, and more.
                </p>
                <button
                  onClick={() => navigate('/my-shadi/my-contact/contact-filters')}
                  className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm border border-rose-100/50"
                >
                  Manage Contact Filters
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </SettingsSection>

            {/* Astro Details */}
            <SettingsSection
              title="Astro Details"
              status={profile?.astroVisibility}
              isActive={activeSection === 'astro'}
              onToggle={() => toggleSection('astro')}
            >
              <AstroDetails
                profile={profile}
                onUpdate={handleUpdateProfile}
              />
            </SettingsSection>

            {/* Email / SMS Alerts */}
            <SettingsSection
              title="Email / SMS Alerts"
              isActive={activeSection === 'alerts'}
              onToggle={() => toggleSection('alerts')}
            >
              <AlertsSettings
                profile={profile}
                onUpdate={handleUpdateProfile}
              />
            </SettingsSection>

            {/* Privacy Options */}
            <SettingsSection
              title="Privacy Options"
              status={profile?.profileVisibility}
              isActive={activeSection === 'privacy'}
              onToggle={() => toggleSection('privacy')}
            >
              <PrivacyOptions
                profile={profile}
                onUpdate={handleUpdateProfile}
              />
            </SettingsSection>

            {/* Shaadi Live */}
            <SettingsSection
              title="Shaadi Live"
              isActive={activeSection === 'live'}
              onToggle={() => toggleSection('live')}
              isNew={true}
            >
              <ShaadiLive
                profile={profile}
                onUpdate={handleUpdateProfile}
              />
            </SettingsSection>

            {/* Hide / Delete Profile */}
            <SettingsSection
              title="Hide / Delete Profile"
              isActive={activeSection === 'delete'}
              onToggle={() => toggleSection('delete')}
            >
              <DeleteHide
                profile={profile}
                onUpdate={handleUpdateProfile}
              />
            </SettingsSection>

            {/* Messages */}
            <SettingsSection
              title="Messages"
              isActive={activeSection === 'messages'}
              onToggle={() => toggleSection('messages')}
            >
              <Messages
                profile={profile}
                onUpdate={handleUpdateProfile}
              />
            </SettingsSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings