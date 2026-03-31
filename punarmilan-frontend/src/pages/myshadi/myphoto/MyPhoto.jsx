import React, { useState, useRef, useEffect } from 'react';
import { Upload, Heart, UserPlus, MapPin, Save, HelpCircle, X, Check, Shield, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto } from '../../../Slice/ProfileSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import heic2any from 'heic2any';

// Import fallback images in case no photo is present (optional, or just use placeholders)
import img from '../../../assets/image/profile.png'
import blur from '../../../assets/image/blur-face.jpg'
import full from '../../../assets/image/full-view.jpg'
import group from '../../../assets/image/group-img.jpg'
import close from '../../../assets/image/closejpg.jpg'
import side from '../../../assets/image/side-face.jpg'
import water from '../../../assets/image/watermark.jpg'

export default function MyShadiPhotoSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Redux State
  const { profile, loading, error } = useSelector((state) => state.profile);

  // Local State
  const [activeTab, setActiveTab] = useState('photo');
  const [showGuidelines, setShowGuidelines] = useState(false);

  // These will be populated from Redux
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [optimisticPhotos, setOptimisticPhotos] = useState([]); // { src, index, file }
  const [profileId, setProfileId] = useState('');

  // Settings State
  const [profilePhotoVisibility, setProfilePhotoVisibility] = useState('ALL_MEMBERS');
  const [albumVisibility, setAlbumVisibility] = useState('LIKED_AND_PREMIUM');

  // Fetch Profile on Mount
  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  // Sync Redux Profile Data to Local State
  useEffect(() => {
    if (profile) {
      setProfileId(profile.profileId || '');
      setProfilePhotoVisibility(profile.profilePhotoVisibility || 'ALL_MEMBERS');
      setAlbumVisibility(profile.albumPhotoVisibility || 'LIKED_AND_PREMIUM');

      // Map backend photo fields to an array for easier display
      const photos = [];
      if (profile.profilePhotoUrl) photos.push({ src: profile.profilePhotoUrl, index: 0, isProfile: true });
      if (profile.photoUrl2) photos.push({ src: profile.photoUrl2, index: 1 });
      if (profile.photoUrl3) photos.push({ src: profile.photoUrl3, index: 2 });
      if (profile.photoUrl4) photos.push({ src: profile.photoUrl4, index: 3 });
      if (profile.photoUrl5) photos.push({ src: profile.photoUrl5, index: 4 });
      if (profile.photoUrl6) photos.push({ src: profile.photoUrl6, index: 5 });
      setUploadedPhotos(photos);
    }
  }, [profile]);


  const acceptablePhotos = [
    { src: [close], label: "Close Up" },
    { src: [full], label: "Full View" }
  ];

  const unacceptablePhotos = [
    { src: [side], label: "Side Face", transform: "-rotate-12" },
    { src: [blur], label: "Blur", blur: true },
    { src: [group], label: "Group" },
    { src: [water], label: "Watermark", watermark: true }
  ];

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Check if we have space for more photos (max 6 based on backend fields)
    const currentCount = uploadedPhotos.length;
    const slotsAvailable = 6 - currentCount;

    if (files.length > slotsAvailable) {
      toast.error(`You can only upload ${slotsAvailable} more photo(s).`);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      let file = files[i];

      // Handle HEIC/HEIF conversion
      const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif') || 
                     file.type === 'image/heic' || 
                     file.type === 'image/heif';

      if (isHeic) {
        const convertingToast = toast.loading(`Converting HEIC image: ${file.name}...`);
        try {
          const blob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
          });
          
          const newFileName = file.name.replace(/\.[^/.]+$/, ".jpg");
          file = new File([Array.isArray(blob) ? blob[0] : blob], newFileName, {
            type: 'image/jpeg',
            lastModified: new Date().getTime()
          });
          
          toast.update(convertingToast, { 
            render: 'Conversion successful!', 
            type: 'success', 
            isLoading: false, 
            autoClose: 2000 
          });
        } catch (err) {
          console.error("HEIC conversion error:", err);
          toast.update(convertingToast, { 
            render: `Failed to convert HEIC: ${file.name}. Please upload a JPG/PNG instead.`, 
            type: 'error', 
            isLoading: false, 
            autoClose: 4000 
          });
          continue;
        }
      }

      if (file.size > 15 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large (>15MB)`);
        continue;
      }

      // Determine next available index (logic to find first empty slot 0-5)
      const usedIndices = [...uploadedPhotos, ...optimisticPhotos].map(p => p.index);
      let targetIndex = 0;
      while (usedIndices.includes(targetIndex)) {
        targetIndex++;
      }

      // Optimistic Update: Show preview
      const previewUrl = URL.createObjectURL(file);
      const tempPhoto = { src: previewUrl, index: targetIndex, loading: true };
      setOptimisticPhotos(prev => [...prev, tempPhoto]);

      try {
        await dispatch(uploadProfilePhoto({ file, photoIndex: targetIndex })).unwrap();
        toast.success(`Photo uploaded successfully!`);
        // Remove from optimistic state
        setOptimisticPhotos(prev => prev.filter(p => p.index !== targetIndex));
      } catch (err) {
        toast.error(`Failed to upload ${file.name}: ${err}`);
        setOptimisticPhotos(prev => prev.filter(p => p.index !== targetIndex));
      } finally {
        // Clean up preview URL
        // Note: In a real app, you might wait until the image has actually loaded or just revoke after a timeout
        // Revoking immediately might break the preview if the browser hasn't rendered it yet.
        // But since we are setting it in state, we should ideally revoke when it's removed from state.
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = async (photoIndex) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      try {
        await dispatch(deleteProfilePhoto(photoIndex)).unwrap();
        toast.success("Photo deleted successfully");
      } catch (err) {
        toast.error("Failed to delete photo");
      }
    }
  };

  const hasSettingsChanged = () => {
    if (!profile) return false;
    return profilePhotoVisibility !== profile.profilePhotoVisibility ||
      albumVisibility !== profile.albumPhotoVisibility;
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(updateProfile({
        profilePhotoVisibility,
        albumPhotoVisibility: albumVisibility
      })).unwrap();
      toast.success('Photo settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const quickLinks = [
    { name: 'Shortlists & more', icon: Heart, route: '/matches?tab=more' },
    { name: 'New Matches', icon: Users, route: '/matches?tab=new' },
    { name: 'My Matches', icon: Check, route: '/matches?tab=my' },
    { name: 'Near Me', icon: MapPin, route: '/matches?tab=near' },
    { name: 'My Help', icon: HelpCircle, route: '/my-tickets' }
  ];

  const renderSettingsContent = () => {
    return (
      <div className="max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Photo Settings</h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Photo</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profilePhoto"
                    checked={profilePhotoVisibility === 'ALL_MEMBERS'}
                    onChange={() => setProfilePhotoVisibility('ALL_MEMBERS')}
                    className="mt-1 w-4 h-4 text-cyan-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Visible to all Members (Recommended)</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profilePhoto"
                    checked={profilePhotoVisibility === 'ONLY_PREMIUM'}
                    onChange={() => setProfilePhotoVisibility('ONLY_PREMIUM')}
                    className="mt-1 w-4 h-4 text-cyan-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Visible to Members I like and to all Premium Members</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Album</h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="album"
                    checked={albumVisibility === 'LIKED_AND_PREMIUM'}
                    onChange={() => setAlbumVisibility('LIKED_AND_PREMIUM')}
                    className="mt-1 w-4 h-4 text-cyan-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Visible to Members I like and to all Premium Members</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="album"
                    checked={albumVisibility === 'ONLY_LIKED'}
                    onChange={() => setAlbumVisibility('ONLY_LIKED')}
                    className="mt-1 w-4 h-4 text-cyan-500"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Only visible to members I like</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={!hasSettingsChanged() && !loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${hasSettingsChanged()
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {loading ? 'Saving...' : 'Save my settings'}
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-center text-gray-700 font-medium mb-6 italic">
              This is how your Photos will look to other Members
            </h3>

            {profilePhotoVisibility === 'ONLY_PREMIUM' && (
              <div className="mb-8">
                <p className="text-center text-sm text-gray-600 mb-3">Premium Member view</p>
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <img
                    src={uploadedPhotos.length > 0 ? uploadedPhotos[0].src : img}
                    alt="Premium view"
                    className="w-full max-w-xs mx-auto rounded-lg"
                  />
                </div>
              </div>
            )}

            <div>
              <p className="text-center text-sm text-gray-600 mb-3">
                {profilePhotoVisibility === 'ALL_MEMBERS' ? 'All Members view' : 'Free Member view'}
              </p>
              <div className="bg-white rounded-lg p-4 shadow-md relative">
                <img
                  src={uploadedPhotos.length > 0 ? uploadedPhotos[0].src : img}
                  alt="Free member view"
                  className={`w-full max-w-xs mx-auto rounded-lg ${profilePhotoVisibility === 'ONLY_PREMIUM' ? 'blur-sm' : ''}`}
                />
                {profilePhotoVisibility === 'ONLY_PREMIUM' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Visible to<br />Premium Members
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhotoContent = () => {
    return (
      <div className="max-w-6xl">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 md:p-12 mb-8 text-center shadow-lg">
          <div className="mb-6">
            <Upload className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload photos from your computer</h2>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.heic,.heif"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={handleBrowseClick}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Uploading...' : 'Browse Photo'}
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
          <p className="text-gray-700 leading-relaxed">
            <strong>Note:</strong> You can upload {6} photos to your profile. Each photo must be less than 15 MB and
            in jpg, jpeg, png or webp format. All photos uploaded are screened as per{' '}
            <button onClick={() => setShowGuidelines(true)} className="text-cyan-500 hover:underline font-semibold">Photo Guidelines</button>
            {' '}and 98% of those get activated within 2 hours.
          </p>
        </div>

        {uploadedPhotos.length === 0 && optimisticPhotos.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No photos uploaded yet. Start by browsing your computer.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...uploadedPhotos, ...optimisticPhotos].sort((a, b) => a.index - b.index).map((photo) => (
              <div key={photo.index} className="relative group">
                <div className={`aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${photo.loading ? 'opacity-50 grayscale' : ''}`}>
                  <img
                    src={photo.src}
                    alt={`Photo ${photo.index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {photo.loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    </div>
                  )}
                </div>
                {!photo.loading && (
                  <button
                    onClick={() => removePhoto(photo.index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {photo.isProfile && (
                  <div className="absolute bottom-2 left-2 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Profile Photo
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        <div className="lg:w-80 bg-white shadow-xl lg:min-h-screen p-6">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">
              Quick Links
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.route)}
                  className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 text-gray-700 hover:bg-cyan-50 hover:text-cyan-600">
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">
              Profile ID Search
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Profile ID"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                Go
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-cyan-500">
              Useful Links
            </h3>
            <div className="space-y-3">
              <Link to="/my-shadi/refer" className="flex items-center gap-3 text-cyan-500 hover:text-cyan-600 font-medium transition-all group">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                  <UserPlus className="w-4 h-4" />
                </div>
                Refer A Friend
              </Link>
              <Link to="/my-tickets" className="flex items-center gap-3 text-cyan-500 hover:text-cyan-600 font-medium transition-all group">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </div>
                Need Help?
              </Link>
              <Link to="/my-shadi/security" className="flex items-center gap-3 text-cyan-500 hover:text-cyan-600 font-medium transition-all group">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                  <Shield className="w-4 h-4" />
                </div>
                Security Tips
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Photos</h1>
              <p className="text-gray-600">Manage your profile pictures</p>
            </div>

            <div className="flex gap-1 mb-8 border-b-2 border-gray-200">
              <button
                onClick={() => setActiveTab('photo')}
                className={`px-6 py-3 font-semibold transition-all ${activeTab === 'photo'
                  ? 'text-cyan-500 border-b-4 border-cyan-500 -mb-0.5'
                  : 'text-gray-600 hover:text-cyan-500'
                  }`}
              >
                Photo
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 font-semibold transition-all ${activeTab === 'settings'
                  ? 'text-cyan-500 border-b-4 border-cyan-500 -mb-0.5'
                  : 'text-gray-600 hover:text-cyan-500'
                  }`}
              >
                Settings
              </button>
            </div>

            {activeTab === 'photo' ? renderPhotoContent() : renderSettingsContent()}

            {/* Other Ways to Upload Section */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                Other ways to upload your photos
              </h3>

              <div className="flex items-start gap-3 mb-8 p-4 bg-amber-50 rounded-xl">
                <span className="text-2xl">📮</span>
                <p className="text-gray-700">
                  Send your photos through post to our{' '}
                  <span className="text-cyan-600 font-semibold cursor-pointer hover:underline">
                    office
                  </span>
                  . Mention your Profile ID and Name at the back of the photos.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-green-500 text-2xl">✓</span>
                    <h4 className="font-bold text-gray-800 text-lg">Photos you can upload</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {acceptablePhotos.map((photo, idx) => (
                      <div key={idx} className="text-center">
                        <div className="bg-white rounded-lg shadow-md p-2 mb-2 border-2 border-green-200 hover:shadow-lg transition-all overflow-hidden">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={photo.src}
                              alt={photo.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{photo.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-red-500 text-2xl">✗</span>
                    <h4 className="font-bold text-gray-800 text-lg">Photos you cannot upload</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {unacceptablePhotos.map((photo, idx) => (
                      <div key={idx} className="text-center">
                        <div className="bg-white rounded-lg shadow-md p-2 mb-2 border-2 border-red-200 hover:shadow-lg transition-all overflow-hidden">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                            <img
                              src={photo.src}
                              alt={photo.label}
                              className={`w-full h-full object-cover ${photo.blur ? 'blur-sm' : ''} ${photo.transform || ''}`}
                            />
                            {photo.watermark && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/80 px-2 py-1 rounded text-xs font-bold text-gray-500 transform -rotate-12">
                                  ©
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-100 opacity-40"></div>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{photo.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowGuidelines(true)}
                  className="flex cursor-pointer items-center gap-2 px-6 py-3 text-cyan-500 border-2 border-cyan-500 rounded-lg hover:bg-cyan-50 transition-all duration-300 font-semibold hover:shadow-md"
                >
                  Photo Guidelines
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="flex items-center cursor-pointer gap-2 px-6 py-3 text-cyan-500 border-2 border-cyan-500 rounded-lg hover:bg-cyan-50 transition-all duration-300 font-semibold hover:shadow-md"
                >
                  Photo FAQ
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Guidelines Modal */}
      {showGuidelines && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Guidelines for adding photos to your profile
              </h2>
              <button
                onClick={() => setShowGuidelines(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                      ✓
                    </span>
                    <h3 className="font-bold text-gray-800 uppercase text-sm">
                      PHOTOS YOU CAN UPLOAD
                    </h3>
                  </div>
                  <div className="flex gap-6 justify-center">
                    {acceptablePhotos.map((photo, idx) => (
                      <div key={idx} className="text-center">
                        <div className="w-32 h-32 bg-gray-100 rounded-full shadow-lg flex items-center justify-center mb-3 border-4 border-gray-100 overflow-hidden">
                          <img
                            src={photo.src}
                            alt={photo.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-semibold text-gray-600">{photo.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
                      ✗
                    </span>
                    <h3 className="font-bold text-gray-800 uppercase text-sm">
                      PHOTOS YOU CANNOT UPLOAD
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {unacceptablePhotos.map((photo, idx) => (
                      <div key={idx} className="text-center">
                        <div className="w-28 h-28 bg-gray-100 rounded-full shadow-lg flex items-center justify-center mb-2 border-4 border-gray-100 overflow-hidden relative">
                          <img
                            src={photo.src}
                            alt={photo.label}
                            className={`w-full h-full object-cover ${photo.blur ? 'blur-sm' : ''} ${photo.transform || ''}`}
                          />
                          {photo.watermark && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/80 px-2 py-1 rounded text-xs font-bold text-gray-500 transform -rotate-12">
                                ©
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-200 opacity-30"></div>
                        </div>
                        <p className="text-xs font-semibold text-gray-600">{photo.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💡</span>
                  <h3 className="text-lg font-bold text-gray-800">Basic Rules:</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-1">→</span>
                    <span><strong>Smile.</strong> Your matches are more likely to respond.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-1">→</span>
                    <span><strong>Add recent and clear photos.</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-1">→</span>
                    <span>
                      You can upload <strong>20 photos</strong> to your profile. Each photo must be
                      less than <strong>15 MB</strong> and in <strong>jpg, jpeg, png or webp</strong> format.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🚫</span>
                  <h3 className="text-lg font-bold text-gray-800">
                    Beyond these basic rules, here are some reasons we reject photos:
                  </h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-1">→</span>
                    <span>
                      <strong>You are the focus of your profile.</strong> Do not add group photos.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-1">→</span>
                    <span>Sideways or upside-down photos are likely to be rejected.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-1">→</span>
                    <span>
                      <strong>Watermarked, digitally enhanced, morphed photos</strong> or photos
                      with your personal information will be rejected.
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-gray-400 mt-1">→</span>
                    <span>
                      Do not upload <strong>irrelevant photographs</strong> such as celebrity photos
                      or obscene photos. It may not only get your photo rejected but your account may
                      also get deactivated.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
