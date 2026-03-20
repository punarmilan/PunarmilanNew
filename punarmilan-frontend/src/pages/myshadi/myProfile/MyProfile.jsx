import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
// import img from '../../../assets/image/profile.png' // Removed static image
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaChartBar, FaFilter, FaHeart, FaCamera, FaEye, FaPhone, FaStar, FaShareAlt, FaDownload, FaUserEdit, FaUserFriends, FaHome, FaGraduationCap, FaBriefcase, FaMapMarkerAlt, FaBirthdayCake, FaClock, FaCity, FaVenusMars, FaUsers, FaWallet, FaCheck, FaTimes, FaInfoCircle, FaUserCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile, updateProfile, fetchPartnerPreferences, updatePartnerPreferences, uploadIdProof } from '../../../Slice/ProfileSlice';
import { fetchDashboardSummary } from '../../../Slice/DashboardSlice';


// Inside your component function:

const MyProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, preferences, loading, error } = useSelector((state) => state.profile);
  const { summary } = useSelector((state) => state.dashboard);

  const [activeTab, setActiveTab] = useState('religious');
  const [isPremium, setIsPremium] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalSection, setModalSection] = useState('');
  const [idProofFile, setIdProofFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchMyProfile());
    dispatch(fetchPartnerPreferences());
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const hasPendingInSection = (section) => {
    return false; // No longer needed since we save immediately
  };

  // Enhanced profile data mapping from backend to frontend structure
  const [profileData, setProfileData] = useState({
    id: '', // Database internal ID
    profileId: 'PM00000000', // Display ID
    email: '',
    mobileNumber: '',
    fullName: '',
    age: '',
    height: '',
    weight: '',
    religion: '',
    community: '',
    subCommunity: '',
    maritalStatus: '',
    location: '',
    postedBy: '',
    motherTongue: '',
    education: '',
    educationField: '',
    college: '',
    profession: '',
    company: '',
    income: '',
    aboutText: '',
    workingCity: '',
    workingWith: '',
    grewUpIn: '',
    zipCode: '',
    residencyStatus: '',
    diet: '',
    bloodGroup: '',
    healthInformation: '',
    disability: '',
    drinkingHabit: '',
    smokingHabit: '',
    country: '',
    state: '',
    city: '',
    address: '',
    fatherStatus: '',
    motherStatus: '',
    brothersCount: 0,
    sistersCount: 0,
    familyFinancialStatus: '',
    familyLocation: '',
    hobbies: [],
    profileVisibility: 'Public',
    profilePhotoVisibility: 'ALL_MEMBERS',
    albumPhotoVisibility: 'LIKED_AND_PREMIUM',
    contactDisplayStatus: 'Only Premium Members',
    astroVisibility: 'ALL_MEMBERS',
    manglikStatus: 'DONT_KNOW',
    timeOfBirth: '',
    placeOfBirth: '',
    nakshatra: '',
    rashi: '',
    verificationStatus: 'UNVERIFIED',
    verificationNotes: '',
    verifiedAt: '',
    verifiedBy: '',
    idProofType: '',
    idProofNumber: '',
    idProofUrl: '',
    createdAt: '',
    updatedAt: '',
    photoCount: 0,
    profileComplete: false,
    religiousBackground: {},
    familyDetails: {},
    educationCareer: {},
    locationInfo: {},
    lifestyle: {},
    partnerPreferences: {}
  });

  useEffect(() => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        id: profile.id || '',
        profileId: profile.profileId || 'PM00000000',
        email: profile.email || '',
        mobileNumber: profile.mobileNumber || '',
        fullName: profile.fullName || '',
        age: profile.age || '',
        height: profile.height || '',
        weight: profile.weight || '',
        religion: profile.religion || '',
        community: profile.caste || '',
        subCommunity: profile.subCaste || '',
        maritalStatus: profile.maritalStatus || '',
        location: (profile.city || '') + ', ' + (profile.state || ''),
        postedBy: profile.profileCreatedBy || 'Self',
        motherTongue: profile.motherTongue || '',
        education: profile.educationLevel || '',
        educationField: profile.educationField || '',
        college: profile.college || '',
        profession: profile.occupation || '',
        company: profile.company || '',
        income: profile.annualIncome ? profile.annualIncome.toString() : 'Don\'t want to specify',
        workingCity: profile.workingCity || '',
        workingWith: profile.workingWith || '',
        grewUpIn: profile.grewUpIn || '',
        zipCode: profile.zipCode || '',
        residencyStatus: profile.residencyStatus || '',
        diet: profile.diet || '',
        bloodGroup: profile.bloodGroup || '',
        healthInformation: profile.healthInformation || '',
        disability: profile.disability || '',
        drinkingHabit: profile.drinkingHabit || '',
        smokingHabit: profile.smokingHabit || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        address: profile.address || '',
        fatherStatus: profile.fatherStatus || '',
        motherStatus: profile.motherStatus || '',
        brothersCount: profile.brothersCount || 0,
        sistersCount: profile.sistersCount || 0,
        familyFinancialStatus: profile.familyFinancialStatus || '',
        familyLocation: profile.familyLocation || '',
        hobbies: profile.hobbies ? (Array.isArray(profile.hobbies) ? profile.hobbies : profile.hobbies.split(',').map(h => h.trim())) : [],
        profileVisibility: profile.profileVisibility || 'Public',
        profilePhotoVisibility: profile.profilePhotoVisibility || 'ALL_MEMBERS',
        albumPhotoVisibility: profile.albumPhotoVisibility || 'LIKED_AND_PREMIUM',
        contactDisplayStatus: profile.contactDisplayStatus || 'Only Premium Members',
        astroVisibility: profile.astroVisibility || 'ALL_MEMBERS',
        manglikStatus: profile.manglikStatus || 'DONT_KNOW',
        timeOfBirth: profile.timeOfBirth || '',
        placeOfBirth: profile.placeOfBirth || '',
        nakshatra: profile.nakshatra || '',
        rashi: profile.rashi || '',
        verificationStatus: profile.verificationStatus || 'UNVERIFIED',
        verificationNotes: profile.verificationNotes || '',
        verifiedAt: profile.verifiedAt || '',
        verifiedBy: profile.verifiedBy || '',
        idProofType: profile.idProofType || '',
        idProofNumber: profile.idProofNumber || '',
        idProofUrl: profile.idProofUrl || '',
        createdAt: profile.createdAt || '',
        updatedAt: profile.updatedAt || '',
        photoCount: profile.photoCount || 0,
        profileComplete: profile.profileComplete || false,

        religiousBackground: {
          gender: profile.gender || '',
          religion: profile.religion || '',
          manglikChevvai: profile.manglikStatus || 'DONT_KNOW',
          community: profile.caste || '',
          subCommunity: profile.subCaste || '',
          gothra: profile.gotra || 'Not Specified',
          motherTongue: profile.motherTongue || '',
          dob: profile.dateOfBirth || '',
          timeOfBirth: profile.timeOfBirth || '',
          cityOfBirth: profile.placeOfBirth || '',
          nakshatra: profile.nakshatra || '',
          rashi: profile.rashi || '',
          astroVisibility: profile.astroVisibility || 'ALL_MEMBERS'
        },

        familyDetails: {
          mother: profile.motherStatus || 'Not specified',
          father: profile.fatherStatus || 'Not specified',
          familyLocation: profile.familyLocation || '',
          financialStatus: profile.familyFinancialStatus || 'Middle',
          sisters: profile.sistersCount !== undefined ? profile.sistersCount : 0,
          brothers: profile.brothersCount !== undefined ? profile.brothersCount : 0
        },

        educationCareer: {
          highestQualification: profile.educationLevel || '',
          educationField: profile.educationField || '',
          collegeAttended: profile.college || '',
          workingWith: profile.workingWith || 'Private Company',
          workingAs: profile.occupation || '',
          employerName: profile.company || '',
          annualIncome: profile.annualIncome ? profile.annualIncome.toString() : 'Don\'t want to specify',
          workingCity: profile.workingCity || ''
        },

        locationInfo: {
          currentResidence: `${profile.city || ''}, ${profile.state || ''}, ${profile.country || 'India'}`,
          residencyStatus: profile.residencyStatus || 'Citizen',
          state: profile.state || '',
          zipCode: profile.zipCode || 'Not Specified',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || 'India'
        },

        lifestyle: {
          diet: profile.diet || '',
          smoking: profile.smokingHabit || '',
          drinking: profile.drinkingHabit || '',
          bloodGroup: profile.bloodGroup || 'Not Specified',
          healthInfo: profile.healthInformation || 'No Health Problems',
          disability: profile.disability || 'None',
          grewUpIn: profile.grewUpIn || 'India',
          weight: profile.weight || '',
          height: profile.height || ''
        }
      }));

      setProfileImage(profile.profilePhotoUrl || null);
      setIsPremium(profile.isPremium || false);
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setProfileData(prev => ({
        ...prev,
        partnerPreferences: {
          ageRange: `${preferences.minAge || ''}-${preferences.maxAge || ''} Years`,
          maritalStatus: preferences.maritalStatus || 'Open',
          motherTongue: preferences.preferredMotherTongue || 'Open',
          religion: preferences.preferredReligion || 'Open',
          community: preferences.preferredCaste || 'Open',
          heightRange: `${preferences.minHeight || ''} to ${preferences.maxHeight || ''}`,
          country: preferences.preferredCountry || 'India',
          state: preferences.preferredState || 'Open',
          city: preferences.preferredCity || 'Open',
          education: preferences.minEducationLevel || 'Open',
          profession: preferences.occupation || 'Open',
          workingWith: preferences.workingWith || 'Open',
          annualIncome: preferences.minAnnualIncome || 'Open',
          professionArea: preferences.professionArea || 'Open',
          profileManagedBy: preferences.profileManagedBy || 'Open',
          diet: preferences.preferredDiet || 'Open',
          drinkingHabit: preferences.drinkingHabit || 'Open',
          smokingHabit: preferences.smokingHabit || 'Open',
          preferredSubCaste: preferences.preferredSubCaste || 'Open',
          preferredEducationField: preferences.preferredEducationField || 'Open',
          preferWorkingProfessional: preferences.preferWorkingProfessional || false,
          preferNri: preferences.preferNri || false,
          showVerifiedOnly: preferences.showVerifiedOnly !== false, // Default true
          enableAutoMatch: preferences.enableAutoMatch !== false, // Default true
          matchScoreThreshold: preferences.matchScoreThreshold || 0
        }
      }));
    }
  }, [preferences]);



  // Profile management options with navigation paths
  const profileOptions = [
    {
      id: 'edit-personal-profile',
      label: 'Edit Personal Profile',
      icon: <FaUserEdit />,
      color: 'text-blue-600',
      onClick: () => handleOpenEditModal('person')
    },
    {
      id: 'view-profile-stats',
      label: 'View Profile Stats',
      icon: <FaChartBar />,
      color: 'text-green-600',
      onClick: () => navigate('/my-shadi')
    },
    {
      id: 'set-contact-filters',
      label: 'Set Contact Filters',
      icon: <FaFilter />,
      color: 'text-purple-600',
      onClick: () => navigate('/my-shadi/my-contact/contact-filters')
    },
    {
      id: 'edit-partner-profile',
      label: 'Edit Partner Profile',
      icon: <FaUserFriends />,
      color: 'text-red-600',
      onClick: () => navigate('/my-shadi/partner-preferences')
    },
    {
      id: 'add-photos',
      label: 'Add Photos',
      icon: <FaCamera />,
      color: 'text-yellow-600',
      onClick: () => navigate('/my-shadi/my-photos')
    },
    {
      id: 'hide-delete-profile',
      label: 'Hide / Delete Profile',
      icon: <FaEye />,
      color: 'text-gray-600',
      onClick: () => navigate('/my-shadi/settings', { state: { openSection: 'delete' } })
    },

  ];

  // Tab sections
  const tabs = [
    { id: 'religious', label: 'Religious Background', icon: <FaStar /> },
    { id: 'family', label: 'Family Details', icon: <FaUsers /> },
    { id: 'education', label: 'Education & Career', icon: <FaGraduationCap /> },
    { id: 'location', label: 'Location', icon: <FaMapMarkerAlt /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <FaHeart /> },
    { id: 'privacy', label: 'Privacy & Metadata', icon: <FaEye /> },
    { id: 'verification', label: 'Verification Info', icon: <FaCheck /> },
    { id: 'preferences', label: 'Partner Preferences', icon: <FaUserFriends /> }
  ];

  // Commit profile updates directly to backend
  const commitProfileUpdate = async (updates) => {
    const allowedFields = [
      'fullName', 'gender', 'age', 'idProofType', 'idProofNumber', 'dateOfBirth', 'height', 'weight', 'maritalStatus', 'motherTongue',
      'religion', 'caste', 'subCaste', 'gotra',
      'educationLevel', 'educationField', 'college', 'occupation', 'company', 'workingWith', 'annualIncome', 'workingCity', 'grewUpIn', 'zipCode', 'residencyStatus',
      'diet', 'bloodGroup', 'healthInformation', 'disability', 'drinkingHabit', 'smokingHabit',
      'country', 'state', 'city', 'address',
      'fatherStatus', 'motherStatus', 'brothersCount', 'sistersCount', 'familyFinancialStatus', 'familyLocation',
      'aboutMe', 'hobbies',
      'timeOfBirth', 'placeOfBirth', 'manglikStatus', 'nakshatra', 'rashi', 'astroVisibility',
      'profileCreatedBy', 'profileVisibility', 'profilePhotoVisibility', 'albumPhotoVisibility', 'contactDisplayStatus'
    ];

    const intFields = ['age', 'brothersCount', 'sistersCount'];
    const floatFields = [];

    const formattedProfile = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        let val = updates[key];
        if (key === 'hobbies' && Array.isArray(val)) {
          val = val.join(', ');
        }
        if (intFields.includes(key)) {
          val = val === '' || val === null ? null : parseInt(val, 10);
          if (isNaN(val)) val = null;
        } else if (floatFields.includes(key)) {
          val = val === '' || val === null ? null : parseFloat(val);
          if (isNaN(val)) val = null;
        }
        obj[key] = val;
        return obj;
      }, {});

    if (Object.keys(formattedProfile).length > 0) {
      try {
        await dispatch(updateProfile(formattedProfile)).unwrap();
        toast.success('Field updated successfully!');
      } catch (err) {
        toast.error(err || 'Failed to update backend');
      }
    }
  };

  const commitPreferenceUpdate = async (updates) => {
    const allowedFields = [
      'minAge', 'maxAge', 'minHeight', 'maxHeight',
      'preferredReligion', 'preferredCaste', 'preferredSubCaste',
      'minEducationLevel', 'preferredCity', 'preferredState', 'preferredCountry',
      'preferredDiet', 'drinkingHabit', 'smokingHabit',
      'maritalStatus', 'occupation', 'workingWith', 'minAnnualIncome',
      'preferWorkingProfessional', 'preferNri', 'showVerifiedOnly',
      'enableAutoMatch', 'matchScoreThreshold',
      'preferredMotherTongue', 'professionArea', 'profileManagedBy',
      'preferredEducationField', 'preferredSubCaste'
    ];

    const prefIntFields = ['minAge', 'maxAge', 'matchScoreThreshold'];
    const prefBoolFields = ['preferWorkingProfessional', 'preferNri', 'showVerifiedOnly', 'enableAutoMatch'];

    const filteredPreferences = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        let val = updates[key];
        if (prefIntFields.includes(key)) {
          if (val === '' || val === null || val === undefined) {
            val = null;
          } else {
            const parsed = parseInt(val, 10);
            val = isNaN(parsed) ? null : parsed;
          }
        } else if (prefBoolFields.includes(key)) {
          if (typeof val === 'string') {
            val = val.toLowerCase() === 'true' || val.toLowerCase() === 'yes';
          } else {
            val = Boolean(val);
          }
        }
        obj[key] = val;
        return obj;
      }, {});

    if (Object.keys(filteredPreferences).length > 0) {
      try {
        await dispatch(updatePartnerPreferences(filteredPreferences)).unwrap();
        toast.success('Preferences updated!');
      } catch (err) {
        toast.error(err || 'Failed to update preferences');
      }
    }
  };

  // Start editing a field
  const startEditing = (section, field, value) => {
    setEditingField(`${section}.${field}`);
    setEditValue(value || '');
  };

  // Save edited field
  const saveEdit = async () => {
    if (!editingField) return;

    const [section, field] = editingField.split('.');

    // Map frontend field to backend field if necessary
    const backendFieldMap = {
      'religiousBackground.religion': 'religion',
      'religiousBackground.manglikChevvai': 'manglikStatus',
      'religiousBackground.community': 'caste',
      'religiousBackground.subCommunity': 'subCaste',
      'religiousBackground.gothra': 'gotra',
      'religiousBackground.motherTongue': 'motherTongue',
      'religiousBackground.dob': 'dateOfBirth',
      'religiousBackground.timeOfBirth': 'timeOfBirth',
      'religiousBackground.cityOfBirth': 'placeOfBirth',
      'familyDetails.mother': 'motherStatus',
      'familyDetails.father': 'fatherStatus',
      'familyDetails.sisters': 'sistersCount',
      'familyDetails.brothers': 'brothersCount',
      'educationCareer.highestQualification': 'educationLevel',
      'educationCareer.workingAs': 'occupation',
      'educationCareer.employerName': 'company',
      'educationCareer.collegeAttended': 'college',
      'lifestyle.smoking': 'smokingHabit',
      'lifestyle.drinking': 'drinkingHabit',
      'lifestyle.healthInfo': 'healthInformation',
      'locationInfo.state': 'state',
    };

    const backendField = backendFieldMap[editingField] || field;

    // Commit directly to backend
    await commitProfileUpdate({ [backendField]: editValue });

    setEditingField(null);
    setEditValue('');
  };

  // Open Edit All Modal
  const handleOpenEditModal = (section) => {
    let fields = {};
    setModalSection(section);
    if (section === 'religious') {
      fields = {
        gender: profileData.religiousBackground.gender,
        religion: profileData.religiousBackground.religion,
        manglikStatus: profileData.religiousBackground.manglikChevvai,
        caste: profileData.religiousBackground.community,
        subCaste: profileData.religiousBackground.subCommunity,
        gotra: profileData.religiousBackground.gothra,
        motherTongue: profileData.religiousBackground.motherTongue,
        timeOfBirth: profileData.religiousBackground.timeOfBirth,
        placeOfBirth: profileData.religiousBackground.cityOfBirth,
        nakshatra: profileData.religiousBackground.nakshatra,
        rashi: profileData.religiousBackground.rashi,
        astroVisibility: profileData.religiousBackground.astroVisibility
      };
    } else if (section === 'family') {
      fields = {
        fatherStatus: profileData.familyDetails.father,
        motherStatus: profileData.familyDetails.mother,
        familyFinancialStatus: profileData.familyDetails.financialStatus,
        sistersCount: profileData.familyDetails.sisters,
        brothersCount: profileData.familyDetails.brothers,
        familyLocation: profileData.familyDetails.familyLocation,
      };
    } else if (section === 'education') {
      fields = {
        educationLevel: profileData.educationCareer.highestQualification,
        educationField: profileData.educationCareer.educationField,
        college: profileData.educationCareer.collegeAttended,
        workingWith: profileData.educationCareer.workingWith,
        occupation: profileData.educationCareer.workingAs,
        company: profileData.educationCareer.employerName,
        workingCity: profileData.educationCareer.workingCity,
        annualIncome: profileData.educationCareer.annualIncome
      };
    } else if (section === 'location') {
      fields = {
        address: profileData.locationInfo.address,
        city: profileData.locationInfo.city,
        state: profileData.locationInfo.state,
        country: profileData.locationInfo.country,
        residencyStatus: profileData.locationInfo.residencyStatus,
        zipCode: profileData.locationInfo.zipCode
      };
    } else if (section === 'lifestyle') {
      fields = {
        age: profileData.age,
        dateOfBirth: profileData.religiousBackground.dob,
        maritalStatus: profileData.maritalStatus,
        height: profileData.height,
        weight: profileData.weight,
        grewUpIn: profileData.lifestyle.grewUpIn,
        diet: profileData.lifestyle.diet,
        drinkingHabit: profileData.lifestyle.drinking,
        smokingHabit: profileData.lifestyle.smoking,
        bloodGroup: profileData.lifestyle.bloodGroup,
        healthInformation: profileData.lifestyle.healthInfo,
        disability: profileData.lifestyle.disability
      };
    } else if (section === 'hobbies') {
      fields = {
        hobbies: profileData.hobbies.join(', ')
      };
    } else if (section === 'privacy') {
      fields = {
        profileVisibility: profileData.profileVisibility,
        profilePhotoVisibility: profileData.profilePhotoVisibility,
        albumPhotoVisibility: profileData.albumPhotoVisibility,
        contactDisplayStatus: profileData.contactDisplayStatus,
        astroVisibility: profileData.astroVisibility
      };
    } else if (section === 'verification') {
      fields = {
        idProofType: profileData.idProofType,
        idProofNumber: profileData.idProofNumber
      };
    } else if (section === 'preferences') {
      fields = {
        preferredMotherTongue: preferences ? preferences.preferredMotherTongue : '',
        workingWith: preferences ? preferences.workingWith : '',
        professionArea: preferences ? preferences.professionArea : '',
        profileManagedBy: preferences ? preferences.profileManagedBy : '',
        minAge: preferences ? preferences.minAge : '',
        maxAge: preferences ? preferences.maxAge : '',
        minHeight: preferences ? preferences.minHeight : '',
        maxHeight: preferences ? preferences.maxHeight : '',
        preferredReligion: preferences ? preferences.preferredReligion : '',
        preferredCaste: preferences ? preferences.preferredCaste : '',
        preferredSubCaste: preferences ? preferences.preferredSubCaste : '',
        minEducationLevel: preferences ? preferences.minEducationLevel : '',
        preferredCity: preferences ? preferences.preferredCity : '',
        preferredState: preferences ? preferences.preferredState : '',
        preferredDiet: preferences ? preferences.preferredDiet : '',
        drinkingHabit: preferences ? preferences.drinkingHabit : '',
        smokingHabit: preferences ? preferences.smokingHabit : '',
        maritalStatus: preferences ? preferences.maritalStatus : '',
        occupation: preferences ? preferences.occupation : '',
        minAnnualIncome: preferences ? preferences.minAnnualIncome : '',
        preferWorkingProfessional: preferences ? preferences.preferWorkingProfessional : false,
        preferNri: preferences ? preferences.preferNri : false,
        showVerifiedOnly: preferences ? preferences.showVerifiedOnly : true,
        enableAutoMatch: preferences ? preferences.enableAutoMatch : true,
        matchScoreThreshold: preferences ? preferences.matchScoreThreshold : 0,
        preferredEducationField: preferences ? preferences.preferredEducationField : '',
        preferredCountry: preferences ? preferences.preferredCountry : ''
      };
    } else if (section === 'personal') {
      fields = {
        fullName: profileData.fullName
      };
    } else if (section === 'about') {
      fields = {
        aboutMe: profileData.aboutText
      };
    } else if (section === 'person') {
      fields = {
        profileCreatedBy: profileData.postedBy,
        fullName: profileData.fullName,
        gender: profileData.religiousBackground.gender,
        maritalStatus: profileData.maritalStatus,
        height: profileData.height,
        weight: profileData.weight,
        diet: profileData.lifestyle.diet,
        healthInformation: profileData.lifestyle.healthInfo,
        disability: profileData.lifestyle.disability,
        bloodGroup: profileData.lifestyle.bloodGroup
      };
    }

    setModalData(fields);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const validateModalData = () => {
    let newErrors = {};
    if (modalSection === 'religious') {
      if (!modalData.gender) newErrors.gender = 'Gender is required';
      if (!modalData.religion) newErrors.religion = 'Religion is required';
      if (!modalData.caste) newErrors.caste = 'Caste/Community is required';
    }

    if (modalSection === 'personal') {
      if (!modalData.fullName) newErrors.fullName = 'Full Name is required';
    }

    if (modalSection === 'about') {
      // Validations if needed for about text
    }

    if (modalSection === 'person') {
      if (!modalData.profileCreatedBy) newErrors.profileCreatedBy = 'This field is required';
      if (!modalData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
      if (!modalData.height) newErrors.height = 'Height is required';
      if (!modalData.diet) newErrors.diet = 'Diet is required';
      if (!modalData.disability) newErrors.disability = 'Disability status is required';
    }

    if (modalSection === 'verification') {
      if (!modalData.idProofType) newErrors.idProofType = 'ID Proof Type is required';
      if (!modalData.idProofNumber) newErrors.idProofNumber = 'ID Proof Number is required';
      if (!idProofFile && !profileData.idProofUrl) newErrors.idProofFile = 'ID Proof Photo is required';
    }

    if (modalSection === 'education') {
      // Annual income can be a string like "5-10 LPA" or a number
      // If you want to enforce numbers, you can, but allow common string values
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!validateModalData()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    if (modalSection === 'verification' && idProofFile) {
      try {
        await dispatch(uploadIdProof({
          file: idProofFile,
          idProofType: modalData.idProofType,
          idProofNumber: modalData.idProofNumber
        })).unwrap();
        toast.success('Verification document uploaded successfully!');
        setIsEditModalOpen(false);
        setIdProofFile(null);
        return;
      } catch (err) {
        toast.error(err || 'Failed to upload verification document');
        return;
      }
    }

    if (modalSection === 'preferences') {
      await commitPreferenceUpdate(modalData);
    } else {
      await commitProfileUpdate(modalData);
    }
    setIsEditModalOpen(false);
  };


  const handleModalDataChange = (field, value) => {
    setModalData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };


  const handleDownloadProfile = () => {
    try {
      const content = `
PUNARMILAN PROFILE: ${profileData.id}
------------------------------------
Profile Managed By: ${profileData.postedBy}
Age: ${profileData.age} Years
Height: ${profileData.height}
Religion: ${profileData.religion}
Community: ${profileData.community}
Mother Tongue: ${profileData.motherTongue}
Marital Status: ${profileData.maritalStatus}
Location: ${profileData.location}
Education: ${profileData.education}
Profession: ${profileData.profession}
Annual Income: ${profileData.income}

About Profile:
${profileData.aboutText || 'No description provided.'}

Family Details:
- Father: ${profileData.familyDetails.father || 'Not specified'}
- Mother: ${profileData.familyDetails.mother || 'Not specified'}
- Sibling: ${profileData.familyDetails.brothers || 0} Brother(s), ${profileData.familyDetails.sisters || 0} Sister(s)

Lifestyle:
- Diet: ${profileData.lifestyle.diet || 'Not specified'}
- Blood Group: ${profileData.lifestyle.bloodGroup || 'Not specified'}

Generated on: ${new Date().toLocaleString()}
© Punarmilan Matrimony
      `.trim();

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Profile_${profileData.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('✅ Profile downloaded successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error('Failed to download profile');
    }
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `Punarmilan Profile - ${profileData.id}`,
      text: `Check out this profile on Punarmilan: ${profileData.age} Years, ${profileData.religion}, ${profileData.profession} from ${profileData.location}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Successfully shared! ✨');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('🚀 Profile link copied to clipboard!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Could not share profile');
      }
    }
  };

  // Render field with edit functionality
  const renderEditableField = (section, field, label, value, icon) => {
    const isEditing = editingField === `${section}.${field}`;

    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-2.5 sm:p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow gap-2 sm:gap-0">
        <div className="flex items-center w-full sm:w-auto">
          <div className="mr-3 text-rose-500/70 sm:text-gray-500">{icon}</div>
          <span className="text-xs sm:text-sm font-medium text-gray-600 sm:hidden">{label}</span>
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center overflow-hidden">
            <span className="hidden sm:inline text-sm font-medium text-gray-600 mr-2">{label}</span>
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              {isEditing ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 border border-rose-300 rounded text-sm focus:ring-1 focus:ring-rose-500 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="text-green-600 hover:text-green-700 p-1"
                  >
                    <FaCheck size={14} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-800 font-semibold text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                    <span className="hidden sm:inline">: </span>{value}
                  </span>
                  <button
                    onClick={() => startEditing(section, field, value)}
                    className="ml-auto sm:ml-2 text-gray-400 hover:text-rose-600 transition-colors p-1"
                    title="Edit"
                  >
                    <FaEdit size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'religious':
        return (
          <div className="space-y-4">
            {/* Header - Stack on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Religious Background
              </h3>
              <button
                onClick={() => handleOpenEditModal('religious')}
                className="flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium px-4 py-2 sm:py-0 bg-rose-50 sm:bg-transparent rounded-lg sm:rounded-none w-full sm:w-auto relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('religious') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
              </button>
            </div>

            {/* Grid - Responsive: Single column on mobile, Two columns on tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-1">
              {[
                { field: 'gender', label: 'Gender', value: profileData.religiousBackground.gender, icon: <FaVenusMars /> },
                { field: 'religion', label: 'Religion', value: profileData.religiousBackground.religion, icon: <FaStar /> },
                { field: 'manglikStatus', label: 'Manglik/Chevvai dosham', value: profileData.religiousBackground.manglikChevvai, icon: <FaVenusMars /> },
                { field: 'caste', label: 'Community', value: profileData.religiousBackground.community, icon: <FaUsers /> },
                { field: 'subCaste', label: 'Sub community', value: profileData.religiousBackground.subCommunity, icon: <FaUsers /> },
                { field: 'gotra', label: 'Gothra / Gothram', value: profileData.religiousBackground.gothra, icon: <FaStar /> },
                { field: 'motherTongue', label: 'Mother Tongue', value: profileData.religiousBackground.motherTongue, icon: <FaEdit /> },
                { field: 'timeOfBirth', label: 'Time of Birth', value: profileData.religiousBackground.timeOfBirth, icon: <FaClock /> },
                { field: 'placeOfBirth', label: 'City of Birth', value: profileData.religiousBackground.cityOfBirth, icon: <FaCity /> },
                { field: 'nakshatra', label: 'Nakshatra', value: profileData.religiousBackground.nakshatra, icon: <FaStar /> },
                { field: 'rashi', label: 'Rashi', value: profileData.religiousBackground.rashi, icon: <FaStar /> },
                { field: 'astroVisibility', label: 'Astro Visibility', value: profileData.religiousBackground.astroVisibility, icon: <FaEye /> }
              ].map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-2.5 sm:p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-shadow gap-2 sm:gap-0">
                  <div className="flex items-center w-full sm:w-auto">
                    <div className="mr-3 text-rose-500/70 sm:text-gray-500">{item.icon}</div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 sm:hidden">{item.label}</span>
                  </div>
                  <div className="flex-1 w-full flex items-center">
                    <span className="hidden sm:inline text-sm font-medium text-gray-600 mr-2 w-1/2">{item.label}</span>
                    <span className="text-gray-800 font-semibold text-sm sm:text-base truncate w-full sm:w-1/2">
                      <span className="hidden sm:inline">: </span>{item.value || 'Not Specified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'family':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Family Details</h3>
              <button
                onClick={() => handleOpenEditModal('family')}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('family') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[
                { field: 'motherStatus', label: 'Mother\'s Details', value: profileData.familyDetails.mother, icon: <FaUsers /> },
                { field: 'fatherStatus', label: 'Father\'s Details', value: profileData.familyDetails.father, icon: <FaUsers /> },
                { field: 'familyLocation', label: 'Family Location', value: profileData.familyDetails.familyLocation, icon: <FaHome /> },
                { field: 'familyFinancialStatus', label: 'Family Financial Status', value: profileData.familyDetails.financialStatus, icon: <FaWallet /> },
                { field: 'sistersCount', label: 'No. of Sisters', value: profileData.familyDetails.sisters, icon: <FaUsers /> },
                { field: 'brothersCount', label: 'No. of Brothers', value: profileData.familyDetails.brothers, icon: <FaUsers /> }
              ].map((item, index) => (
                <div key={index}>
                  {renderEditableField('familyDetails', item.field, item.label, item.value, item.icon)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Education & Career</h3>
              <button
                onClick={() => handleOpenEditModal('education')}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('education') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { field: 'educationLevel', label: 'Highest Qualification', value: profileData.educationCareer.highestQualification, icon: <FaGraduationCap /> },
                { field: 'educationField', label: 'Education Field', value: profileData.educationCareer.educationField, icon: <FaGraduationCap /> },
                { field: 'college', label: 'College(s) Attended', value: profileData.educationCareer.collegeAttended, icon: <FaGraduationCap /> },
                { field: 'workingWith', label: 'Working With', value: profileData.educationCareer.workingWith, icon: <FaBriefcase /> },
                { field: 'occupation', label: 'Working As', value: profileData.educationCareer.workingAs, icon: <FaBriefcase /> },
                { field: 'company', label: 'Employer Name', value: profileData.educationCareer.employerName, icon: <FaBriefcase /> },
                { field: 'workingCity', label: 'Working City', value: profileData.educationCareer.workingCity, icon: <FaCity /> },
                { field: 'annualIncome', label: 'Annual Income', value: profileData.educationCareer.annualIncome, icon: <FaWallet /> }
              ].map((item, index) => (
                <div key={index}>
                  {renderEditableField('educationCareer', item.field, item.label, item.value, item.icon)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Location of Groom</h3>
              <button
                onClick={() => handleOpenEditModal('location')}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium relative"
              >
                <FaEdit /> Edit All
                {hasPendingInSection('location') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { field: 'address', label: 'Residential Address', value: profileData.locationInfo.address, icon: <FaHome /> },
                { field: 'city', label: 'Current City', value: profileData.locationInfo.city, icon: <FaHome /> },
                { field: 'state', label: 'State Of Residence', value: profileData.locationInfo.state, icon: <FaMapMarkerAlt /> },
                { field: 'country', label: 'Country', value: profileData.locationInfo.country, icon: <FaMapMarkerAlt /> },
                { field: 'residencyStatus', label: 'Residency Status', value: profileData.locationInfo.residencyStatus, icon: <FaMapMarkerAlt /> },
                { field: 'zipCode', label: 'Zip / Pin code', value: profileData.locationInfo.zipCode, icon: <FaMapMarkerAlt /> }
              ].map((item, index) => (
                <div key={index}>
                  {renderEditableField('locationInfo', item.field, item.label, item.value, item.icon)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-6">
            {/* Personality & About Section */}
            <div className="space-y-1">
              <div className="flex justify-between items-center border-b border-gray-100 pb-1 mb-1">
                <h3 className="text-base sm:text-lg font-bold text-rose-500">
                  Personality.
                </h3>
                <button
                  onClick={() => handleOpenEditModal('about')}
                  className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FaEdit className="text-xs" /> Edit
                </button>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {profileData.aboutText || 'Let me introduce myself...'}
              </p>
            </div>

            {/* Basics & Lifestyle Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Basics & Lifestyle</h3>
                <button
                  onClick={() => handleOpenEditModal('lifestyle')}
                  className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium relative"
                >
                  <FaEdit /> Edit
                  {hasPendingInSection('lifestyle') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: 'Age', value: profileData.age },
                  { label: 'Date of Birth', value: profileData.religiousBackground.dob },
                  { label: 'Marital Status', value: profileData.maritalStatus },
                  { label: 'Height', value: profileData.height },
                  { label: 'Weight', value: profileData.weight },
                  { label: 'Grew up in', value: profileData.lifestyle.grewUpIn },
                  { label: 'Diet', value: profileData.lifestyle.diet },
                  { label: 'Drinking Habit', value: profileData.lifestyle.smoking }, // Note: smoking/drinking habits
                  { label: 'Smoking Habit', value: profileData.lifestyle.drinking }, // labels might be swapped in previous state mapping, checking...
                  { label: 'Blood Group', value: profileData.lifestyle.bloodGroup },
                  { label: 'Health Information', value: profileData.lifestyle.healthInfo },
                  { label: 'Disability', value: profileData.lifestyle.disability }
                ].map((item, index) => (
                  <div key={index} className="flex border-b border-gray-100 pb-1.5">
                    <span className="w-1/3 text-gray-500 text-xs sm:text-sm">{item.label}</span>
                    <span className="w-2/3 text-gray-800 font-medium text-xs sm:text-sm">: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hobbies & Interests Section */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-rose-600">Hobbies and Interests</h3>
                <button
                  onClick={() => handleOpenEditModal('hobbies')}
                  className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium relative"
                >
                  <FaEdit /> Edit
                  {hasPendingInSection('hobbies') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {profileData.hobbies.length > 0 ? (
                  profileData.hobbies.map((hobby, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm flex items-center gap-2 text-gray-700 hover:border-rose-300 transition-colors"
                    >
                      <span className="text-rose-500">
                        {/* Dynamic icons could be added here based on hobby name */}
                        {hobby.toLowerCase().includes('photo') && <FaCamera />}
                        {hobby.toLowerCase().includes('music') && <FaStar />}
                        {hobby.toLowerCase().includes('movie') && <FaStar />}
                        {hobby.toLowerCase().includes('travel') && <FaMapMarkerAlt />}
                        {!hobby.toLowerCase().includes('photo') &&
                          !hobby.toLowerCase().includes('music') &&
                          !hobby.toLowerCase().includes('movie') &&
                          !hobby.toLowerCase().includes('travel') && <FaHeart />}
                      </span>
                      <span className="font-medium text-sm">{hobby.trim()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No hobbies specified yet.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Privacy & Settings</h3>
              <button
                onClick={() => handleOpenEditModal('privacy')}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium"
              >
                <FaEdit /> Edit Settings
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Profile Visibility', value: profileData.profileVisibility },
                { label: 'Email ID', value: profileData.email || 'Not Provided' },
                { label: 'Contact Number', value: profileData.mobileNumber || 'Not Provided' },
                { label: 'Contact Details Visibility', value: profileData.contactDisplayStatus },
                { label: 'Profile Photo Visibility', value: profileData.profilePhotoVisibility },
                { label: 'Album Photos Visibility', value: profileData.albumPhotoVisibility },
                { label: 'Astro/Horoscope Visibility', value: profileData.astroVisibility },
                { label: 'Account Created At', value: profileData.createdAt ? new Date(profileData.createdAt).toLocaleString() : 'N/A' },
                { label: 'Last Updated', value: profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleString() : 'N/A' },
                { label: 'Profile ID (System)', value: profileData.id }
              ].map((item, idx) => (
                <div key={idx} className="flex border-b border-gray-100 pb-2">
                  <span className="w-1/2 text-gray-500 text-sm font-medium">{item.label}</span>
                  <span className="w-1/2 text-gray-800 text-sm font-semibold truncate">: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Verification Details</h3>
              <button
                onClick={() => handleOpenEditModal('verification')}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium"
              >
                <FaEdit /> Update Proof
              </button>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${profileData.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  <FaCheck />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status</div>
                  <div className={`text-lg font-bold ${profileData.verificationStatus === 'VERIFIED' ? 'text-green-600' : 'text-orange-600'}`}>
                    {profileData.verificationStatus}
                  </div>
                </div>
              </div>
              {profileData.verificationNotes && (
                <div className="mt-3 p-3 bg-white/50 rounded-lg text-sm text-gray-600 italic">
                  " {profileData.verificationNotes} "
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'ID Proof Type', value: profileData.idProofType || 'Not Provided' },
                { label: 'ID Proof Number', value: profileData.idProofNumber ? '********' + profileData.idProofNumber.slice(-4) : 'Not Provided' },
                { label: 'Verified By', value: profileData.verifiedBy || 'N/A' },
                { label: 'Verified At', value: profileData.verifiedAt ? new Date(profileData.verifiedAt).toLocaleString() : 'N/A' },
                { label: 'Profile Completion Score', value: profileData.profileComplete ? 'Complete' : 'Pending' }
              ].map((item, idx) => (
                <div key={idx} className="flex border-b border-gray-100 pb-2">
                  <span className="w-1/2 text-gray-500 text-sm">{item.label}</span>
                  <span className="w-1/2 text-gray-800 font-medium text-sm">: {item.value}</span>
                </div>
              ))}
            </div>
            {profileData.idProofUrl && (
              <div className="mt-4">
                <a href={profileData.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-2">
                  <FaEye /> View Uploaded Document
                </a>
              </div>
            )}
          </div>
        );

      case 'preferences':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Partner Preferences</h3>
              <button
                onClick={() => handleOpenEditModal('preferences')}
              >
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-rose-100 to-rose-50 p-2.5 rounded-xl">
                    <FaUserFriends className="text-rose-600 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Partner Preferences</h2>
                    <p className="text-gray-600 text-sm mt-1">Define your ideal partner criteria</p>
                  </div>
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-50 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    Basic Information
                  </h3>
                  <button
                    onClick={() => handleOpenEditModal('preferences')}
                    className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200"
                  >
                    <FaEdit className="text-sm" /> Edit All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Age', field: 'ageRange', defaultValue: '22 to 26', icon: '📅', color: 'bg-blue-50' },
                    { label: 'Mother Tongue', field: 'motherTongue', defaultValue: 'Marathi, Hindi, English', icon: '🗣️', color: 'bg-green-50' },
                    { label: 'Height', field: 'heightRange', defaultValue: "5' 0\"(152cm) to 5' 8\"(172cm)", icon: '📏', color: 'bg-orange-50' },
                    { label: 'Marital Status', field: 'maritalStatus', defaultValue: 'Never Married', icon: '💍', color: 'bg-pink-50' },
                  ].map((item) => (
                    <div key={item.field} className="group bg-white rounded-2xl p-3 border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences[item.field] || item.defaultValue}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenEditModal('preferences')}
                          className="opacity-0 group-hover:opacity-100 bg-rose-50 p-2 rounded-lg transition-all duration-200"
                        >
                          <FaEdit className="text-rose-500 text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Religion / Community */}
                <div className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl">
                        🕉️
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Religion / Community</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences.religion || 'Hindu, Buddhist'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sub-Community / Caste</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences.preferredSubCaste || profileData.partnerPreferences.preferredCaste || 'Open to All'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenEditModal('preferences')}
                      className="opacity-0 group-hover:opacity-100 bg-purple-50 p-2 rounded-lg transition-all duration-200"
                    >
                      <FaEdit className="text-purple-500 text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Location Details Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-green-50 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </span>
                    Location Details
                  </h3>

                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Country living in', field: 'country', defaultValue: 'India', icon: '🌍', color: 'bg-emerald-50' },
                    { label: 'State living in', field: 'state', defaultValue: 'Maharashtra', icon: '🗺️', color: 'bg-cyan-50' },
                    { label: 'City / District', field: 'city', defaultValue: 'Open to All', icon: '🏙️', color: 'bg-sky-50' },
                  ].map((item) => (
                    <div key={item.field} className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences[item.field] || item.defaultValue}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenEditModal('preferences')}
                          className="opacity-0 group-hover:opacity-100 bg-emerald-50 p-2 rounded-lg transition-all duration-200"
                        >
                          <FaEdit className="text-emerald-500 text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Career Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-purple-50 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Education & Career
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Education', field: 'education', defaultValue: 'Open to All', icon: '🎓' },
                    { label: 'Working as', field: 'profession', defaultValue: 'Open to All', icon: '💼' },
                    { label: 'Working With', field: 'workingWith', defaultValue: 'Any', icon: '🏢' },
                    { label: 'Profession Area', field: 'professionArea', defaultValue: 'Any', icon: '📊' },
                    { label: 'Annual Income', field: 'annualIncome', defaultValue: 'Any', icon: '💰' },
                    { label: 'Field of Study', field: 'preferredEducationField', defaultValue: 'Any', icon: '📚' },
                  ].map((item) => (
                    <div key={item.field} className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-xl">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences[item.field] || item.defaultValue}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenEditModal('preferences')}
                          className="opacity-0 group-hover:opacity-100 bg-purple-50 p-2 rounded-lg transition-all duration-200"
                        >
                          <FaEdit className="text-purple-500 text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle & Others Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-pink-50 p-2 rounded-lg">
                      <FaHeart className="text-pink-600" />
                    </span>
                    Lifestyle & Others
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Diet', field: 'diet', defaultValue: 'Any', icon: '🥗', color: 'bg-green-50' },
                    { label: 'Drinking', field: 'drinkingHabit', defaultValue: 'Non-Drinker', icon: '🍷', color: 'bg-red-50' },
                    { label: 'Smoking', field: 'smokingHabit', defaultValue: 'Non-Smoker', icon: '🚬', color: 'bg-gray-50' },
                    { label: 'Profile Managed By', field: 'profileManagedBy', defaultValue: 'Any', icon: '👤', color: 'bg-blue-50' },
                  ].map((item) => (
                    <div key={item.field} className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm sm:text-base font-black text-gray-800 mt-0.5">
                              {profileData.partnerPreferences[item.field] || item.defaultValue}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOpenEditModal('preferences')}
                          className="opacity-0 group-hover:opacity-100 bg-pink-50 p-2 rounded-lg transition-all duration-200"
                        >
                          <FaEdit className="text-pink-500 text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Settings Section */}
              <div className="mb-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-yellow-50 p-2 rounded-lg">
                      <FaStar className="text-yellow-600" />
                    </span>
                    Match Settings
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Verify Profiles Only</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profileData.partnerPreferences.showVerifiedOnly ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {profileData.partnerPreferences.showVerifiedOnly ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Auto Match</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profileData.partnerPreferences.enableAutoMatch ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {profileData.partnerPreferences.enableAutoMatch ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Prefer NRI</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profileData.partnerPreferences.preferNri ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {profileData.partnerPreferences.preferNri ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Working Professionals</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profileData.partnerPreferences.preferWorkingProfessional ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                      {profileData.partnerPreferences.preferWorkingProfessional ? 'Preferred' : 'Any'}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col gap-2 sm:col-span-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Match Score Threshold</span>
                      <span className="font-bold text-gray-800">{profileData.partnerPreferences.matchScoreThreshold || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: `${profileData.partnerPreferences.matchScoreThreshold || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6">
      <ToastContainer />

      {/* Main Profile Container */}
      <div className="max-w-7xl mx-auto pb-10 sm:pb-0">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl sm:rounded-2xl shadow-xl mb-4 sm:mb-6 overflow-hidden relative">
          {isPremium && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 py-0.5 sm:px-4 sm:py-1 rounded-full text-[10px] sm:text-sm font-semibold shadow-lg flex items-center gap-1 sm:gap-2 z-10">
              <FaStar className="text-white text-[10px] sm:text-xs" /> PREMIUM
            </div>
          )}

          <div className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6">
              {/* Profile Image and Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                {/* Profile Image */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full sm:rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-full h-full text-rose-200" />
                    )}
                  </div>
                  <button
                    onClick={() => profileOptions[4].onClick()}
                    className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg hover:bg-rose-600 transition-colors text-xs sm:text-sm border-2 border-white"
                  >
                    <FaCamera size={14} />
                  </button>
                </div>

                {/* Basic Info */}
                <div className="text-white text-center sm:text-left flex-1">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-2">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      {profileData.id}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-white/90 text-[10px] sm:text-xs font-medium">Online Now</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 sm:mb-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                      {profileData.fullName || 'No Name'}
                      {profile?.verificationStatus === 'VERIFIED' && (
                        <div className="relative group/verify">
                          <div className="cursor-pointer">
                            <MdVerified className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          {/* Verification Tooltip */}
                          <div className="invisible group-hover/verify:visible absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1a1a1a] text-white p-4 rounded-2xl shadow-2xl z-[60] animate-in fade-in zoom-in duration-200 font-normal">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-[#1a1a1a] rotate-45"></div>
                            <h4 className="text-sm font-bold mb-3 border-b border-white/10 pb-2">Verified Profile</h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${profile?.photoVerificationStatus === 'VERIFIED' ? 'border-green-500' : 'border-gray-600'}`}>
                                  {profile?.photoVerificationStatus === 'VERIFIED' && <FaCheck className="w-2 h-2 text-green-500" />}
                                </div>
                                <span className="text-[11px] font-medium leading-tight">Selfie verified with Profile Photo</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${profile?.mobileVerified ? 'border-green-500' : 'border-gray-600'}`}>
                                  {profile?.mobileVerified && <FaCheck className="w-2 h-2 text-green-500" />}
                                </div>
                                <span className="text-[11px] font-medium leading-tight">Mobile no. is verified</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </h1>
                    <button
                      onClick={() => handleOpenEditModal('personal')}
                      className="text-white/80 hover:text-white transition-colors p-1"
                      title="Edit Name"
                    >
                      <FaEdit size={16} />
                    </button>
                  </div>

                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white/90 mb-2">
                    {profileData.age} Years • {profileData.height}
                  </h2>

                  <div className="space-y-1 text-xs sm:text-sm md:text-base opacity-95">
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2">
                      <span>{profileData.religion}</span>
                      <span className="text-white/40">•</span>
                      <span>{profileData.community}</span>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2">
                      <span>{profileData.education}</span>
                      <span className="text-white/40">•</span>
                      <span>{profileData.profession}</span>
                    </div>
                    <div className="flex justify-center sm:justify-start items-center gap-1 text-rose-100">
                      <FaMapMarkerAlt size={12} className="opacity-70" />
                      <span>{profileData.location}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Info Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Tabs Navigation - Responsive Scrollable Underline Style */}
              <div className="bg-gray-50/50 border-b border-gray-100">
                <div className="flex overflow-x-auto no-scrollbar scroll-smooth px-2 sm:px-4">
                  <div className="flex min-w-max">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-1.5 px-4 sm:px-6 py-4 transition-all relative ${activeTab === tab.id
                          ? 'text-rose-600'
                          : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-rose-100 text-rose-600' : 'bg-transparent'
                          }`}>
                          {React.cloneElement(tab.icon, { size: 18 })}
                        </div>
                        <span className="text-xs sm:text-sm font-bold whitespace-nowrap">{tab.label}</span>
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600 rounded-t-full shadow-[0_-2px_8px_rgba(225,29,72,0.3)]"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-5 md:p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Management Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Account</h3>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <HiOutlineDotsVertical className="text-gray-400" />
                </div>
              </div>

              <div className="space-y-3">
                {profileOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={option.onClick}
                    className="w-full flex items-center p-3 rounded-xl hover:bg-rose-50 transition-all duration-300 group border border-transparent hover:border-rose-100"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${option.color.replace('text-', 'bg-').replace('-600', '-50')
                      } group-hover:bg-rose-100`}>
                      <span className={`${option.color} text-lg`}>
                        {option.icon}
                      </span>
                    </div>
                    <span className="text-left flex-1 font-bold text-gray-700 group-hover:text-rose-600 ml-4 text-sm sm:text-base">
                      {option.label}
                    </span>
                    <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-rose-500 text-xs transition-transform group-hover:translate-x-1"></i>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 mb-4 text-lg">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDownloadProfile}
                    className="flex flex-col items-center justify-center py-4 px-4 bg-blue-50/50 rounded-2xl hover:bg-blue-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-blue-100/50"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform text-blue-600">
                      <FaDownload size={20} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-600 group-hover:text-blue-700">Download</span>
                  </button>
                  <button
                    onClick={handleShareProfile}
                    className="flex flex-col items-center justify-center py-4 px-4 bg-purple-50/50 rounded-2xl hover:bg-purple-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-purple-100/50"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform text-purple-600">
                      <FaShareAlt size={20} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-600 group-hover:text-purple-700">Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Stats Card */}


            {/* Photo Gallery */}

          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-xl sm:rounded-2xl shadow-xl p-6 text-white overflow-hidden relative group">
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaChartBar className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold">Profile Statistics</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Profile Views', value: summary?.recentVisitorsCount || '0', icon: <FaEye /> },
                { label: 'Interests Recv', value: summary?.pendingInvitations || '0', icon: <FaHeart /> },
                { label: 'Interests Sent', value: summary?.interestsSentCount || '0', icon: <FaShareAlt /> },
                { label: 'Completion', value: `${summary?.profileCompletionPercentage || 0}%`, icon: <FaCheck /> }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-xs">{stat.icon}</span>
                    <span className="text-2xl font-black">{stat.value}</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-100">{stat.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => profileOptions[1].onClick()}
              className="w-full mt-6 bg-white text-rose-600 hover:bg-rose-50 py-3 rounded-xl font-bold transition-all duration-300 text-sm shadow-lg flex items-center justify-center gap-2"
            >
              <FaChartBar size={14} /> View Detailed Stats
            </button>
          </div>
        </div>
        {/* Bottom Action Bar (Mobile Only) */}

      </div>
      {/* Edit All Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-5 sm:p-6 flex justify-between items-center text-white">
              <div>
                <h3 className="text-xl font-bold">Update Information</h3>
                <p className="text-rose-100 text-xs mt-1">Please provide accurate details</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-4 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {modalSection === 'person' ? (
                <div className="space-y-4">
                  <div className="bg-cyan-50 text-cyan-800 p-3 rounded-lg flex items-start gap-2 text-sm border border-cyan-100 mb-4">
                    <FaInfoCircle className="mt-1 shrink-0" />
                    <p>Fields in bold cannot be edited. Please contact <span className="text-cyan-600 font-medium cursor-pointer">customer care</span> for any queries.</p>
                  </div>
                  <div className="text-right text-xs text-gray-500 mb-4">* Marked fields are mandatory</div>

                  {/* Profile Created By */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-gray-600 font-medium">Profile Managed by *</label>
                    <div className="sm:col-span-2">
                      <select
                        value={modalData.profileCreatedBy || ''}
                        onChange={(e) => handleModalDataChange('profileCreatedBy', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 outline-none"
                      >
                        <option value="">Select Options</option>
                        <option value="Self">Self</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Friend">Friend</option>
                        <option value="Relative">Relative</option>
                      </select>
                    </div>
                  </div>

                  {/* Gender (Read only) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-gray-600 font-medium">Gender:</label>
                    <div className="sm:col-span-2 font-bold text-gray-800">
                      {modalData.gender || 'Not Specified'}
                    </div>
                  </div>


                  {/* Marital Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-gray-600 font-medium">Marital Status *</label>
                    <div className="sm:col-span-2">
                      <select
                        value={modalData.maritalStatus || ''}
                        onChange={(e) => handleModalDataChange('maritalStatus', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 outline-none"
                      >
                        <option value="">Select Options</option>
                        {['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Height */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-gray-600 font-medium">Height *</label>
                    <div className="sm:col-span-2">
                      <select
                        value={modalData.height || ''}
                        onChange={(e) => handleModalDataChange('height', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 outline-none"
                      >
                        <option value="">Select Options</option>
                        {Array.from({ length: 41 }, (_, i) => {
                          const feet = Math.floor((i + 140) / 30.48);
                          const inches = Math.round(((i + 140) / 2.54) % 12);
                          const cm = i + 140;
                          const label = `${feet}ft ${inches}in - ${cm}cm`;
                          return <option key={cm} value={label}>{label}</option>;
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Diet */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                    <label className="text-gray-600 font-medium mt-1">Diet *</label>
                    <div className="sm:col-span-2 grid grid-cols-2 gap-y-2">
                      {['Veg', 'Non-Veg', 'Occasionally Non-Veg', 'Eggetarian', 'Jain', 'Vegan'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="radio" name="diet" value={opt} checked={modalData.diet === opt} onChange={(e) => handleModalDataChange('diet', e.target.value)} className="w-4 h-4 text-cyan-500 focus:ring-cyan-500" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Health Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-gray-600 font-medium">Health Information</label>
                    <div className="sm:col-span-2">
                      <select
                        value={modalData.healthInformation || ''}
                        onChange={(e) => handleModalDataChange('healthInformation', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 outline-none"
                      >
                        <option value="">Select Options</option>
                        {['No Health Problems', 'Minor Health Issues', 'Major Health Issues'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Disability */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-gray-600 font-medium">Any Disability? *</label>
                    <div className="sm:col-span-2 flex gap-4">
                      {['None', 'Physical Disability'].map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="radio" name="disability" value={opt} checked={modalData.disability === opt} onChange={(e) => handleModalDataChange('disability', e.target.value)} className="w-4 h-4 text-cyan-500 focus:ring-cyan-500" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <label className="text-gray-600 font-medium">Blood Group:</label>
                    <div className="sm:col-span-2">
                      <select
                        value={modalData.bloodGroup || ''}
                        onChange={(e) => handleModalDataChange('bloodGroup', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-rose-500 outline-none"
                      >
                        <option value="">Select Options</option>
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ) : modalSection === 'verification' ? (
                <div className="space-y-6">
                  <div className="bg-rose-50 text-rose-800 p-4 rounded-xl flex items-start gap-3 border border-rose-100">
                    <FaInfoCircle className="mt-1 shrink-0 text-rose-500" />
                    <div>
                      <p className="font-bold text-sm">Verify your ID</p>
                      <p className="text-xs text-rose-600 mt-0.5">Please upload a clear photo of your Govt. ID (PAN card, Voter ID, or Driving License).</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">ID Proof Type *</label>
                      <select
                        value={modalData.idProofType || ''}
                        onChange={(e) => handleModalDataChange('idProofType', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all ${errors.idProofType ? 'border-red-500' : 'border-gray-200'}`}
                      >
                        <option value="">Select ID Type</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Aadhar Card">Aadhar Card</option>
                        <option value="Passport">Passport</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">ID Proof Number *</label>
                      <input
                        type="text"
                        value={modalData.idProofNumber || ''}
                        onChange={(e) => handleModalDataChange('idProofNumber', e.target.value)}
                        placeholder="Enter your ID number"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all ${errors.idProofNumber ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Upload ID Photo *</label>
                      <div className="relative group">
                        <input
                          type="file"
                          id="id-photo-upload"
                          accept="image/*"
                          onChange={(e) => setIdProofFile(e.target.files[0])}
                          className="hidden"
                        />
                        <label
                          htmlFor="id-photo-upload"
                          className={`flex flex-col items-center justify-center border-4 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-300 ${idProofFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-rose-400 hover:bg-rose-50'}`}
                        >
                          <div className={`p-4 rounded-full mb-3 ${idProofFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-rose-100 group-hover:text-rose-500'}`}>
                            {idProofFile ? <FaCheck size={28} /> : <FaCamera size={28} />}
                          </div>
                          <p className="font-bold text-sm text-gray-700">
                            {idProofFile ? idProofFile.name : 'Click to upload ID photo'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {idProofFile ? 'Click again to change file' : 'JPEG, PNG (Max 5MB)'}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(modalData).map(([key, value]) => {
                    const fieldLabels = {
                      manglikStatus: 'Manglik/Chevvai dosham',
                      caste: 'Community',
                      subCaste: 'Sub community',
                      gotra: 'Gothra / Gothram',
                      placeOfBirth: 'City of Birth',
                      astroVisibility: 'Astro Visibility',
                      motherTongue: 'Mother Tongue',
                      dateOfBirth: 'Date of Birth',
                      timeOfBirth: 'Time of Birth',
                      grewUpIn: 'Grew up in'
                    };
                    return (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 capitalize">
                          {fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        {typeof value === 'boolean' ? (
                          <select
                            value={value}
                            onChange={(e) => handleModalDataChange(key, e.target.value === 'true')}
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all ${errors[key] ? 'border-red-500' : 'border-gray-200'}`}
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : key === 'gender' ? (
                          <select
                            value={value}
                            onChange={(e) => handleModalDataChange(key, e.target.value)}
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all ${errors[key] ? 'border-red-500' : 'border-gray-200'}`}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (key === 'diet' || key === 'preferredDiet') ? (
                          <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 py-2">
                            {['Veg', 'Non-Veg', 'Occasionally Non-Veg', 'Eggetarian', 'Jain', 'Vegan'].map(option => (
                              <label key={option} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-rose-600 transition-colors">
                                <input
                                  type="radio"
                                  name={`diet-${key}`}
                                  value={option}
                                  checked={value === option}
                                  onChange={(e) => handleModalDataChange(key, e.target.value)}
                                  className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        ) : key === 'disability' ? (
                          <div className="flex gap-4 py-2">
                            {['None', 'Physical Disability'].map(option => (
                              <label key={option} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer hover:text-rose-600 transition-colors">
                                <input
                                  type="radio"
                                  name={`disability-${key}`}
                                  value={option}
                                  checked={value === option}
                                  onChange={(e) => handleModalDataChange(key, e.target.value)}
                                  className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-gray-300"
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        ) : (key === 'profileCreatedBy' || key === 'maritalStatus' || key === 'height' || key === 'bloodGroup' || key === 'healthInformation' || key === 'manglikStatus' || key === 'astroVisibility' || key === 'profilePhotoVisibility' || key === 'albumPhotoVisibility' || key === 'profileVisibility' || key === 'drinkingHabit' || key === 'smokingHabit' || key === 'profileManagedBy' || key === 'professionArea' || key === 'workingWith' || key === 'matchScoreThreshold') ? (
                          <select
                            value={value || ''}
                            onChange={(e) => handleModalDataChange(key, e.target.value)}
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all ${errors[key] ? 'border-red-500' : 'border-gray-200'}`}
                          >
                            <option value="">Select {key.replace(/([A-Z])/g, ' $1').trim()}</option>
                            {key === 'profileCreatedBy' && ['Self', 'Parent', 'Sibling', 'Friend', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'profileManagedBy' && ['Self', 'Parent', 'Sibling', 'Friend', 'Relative'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'maritalStatus' && ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'height' && Array.from({ length: 41 }, (_, i) => {
                              const feet = Math.floor((i + 140) / 30.48);
                              const inches = Math.round(((i + 140) / 2.54) % 12);
                              const cm = i + 140;
                              const label = `${feet}ft ${inches}in - ${cm}cm`;
                              return <option key={cm} value={label}>{label}</option>;
                            })}
                            {key === 'bloodGroup' && ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'healthInformation' && ['No Health Problems', 'Minor Health Issues', 'Major Health Issues'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {(key === 'drinkingHabit') && ['Non-Drinker', 'Light / Social Drinker', 'Regular Drinker'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {(key === 'smokingHabit') && ['Non-Smoker', 'Light / Social Smoker', 'Regular Smoker'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'professionArea' && ['IT/Software', 'Medical', 'Finance', 'Engineering', 'Teaching', 'Business', 'Marketing', 'Civil Services', 'Defense', 'Arts', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'workingWith' && ['Private Company', 'Government / Public Sector', 'Defense / Civil Services', 'Business / Self Employed', 'Not Working'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            {key === 'matchScoreThreshold' && [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(opt => <option key={opt} value={opt}>{opt}%</option>)}
                            {key === 'manglikStatus' && [
                              { label: 'Yes', value: 'YES' },
                              { label: 'No', value: 'NO' },
                              { label: 'Don\'t Know', value: 'DONT_KNOW' }
                            ].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            {key === 'astroVisibility' && [
                              { label: 'All Members', value: 'ALL_MEMBERS' },
                              { label: 'Contacted and Accepted', value: 'CONTACTED_AND_ACCEPTED' }
                            ].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            {(key === 'profilePhotoVisibility' || key === 'albumPhotoVisibility') && [
                              { label: 'All Members', value: 'ALL_MEMBERS' },
                              { label: 'Only Premium Members', value: 'PREMIUM_MEMBERS' },
                              { label: 'Only Matches', value: 'MATCHES' }
                            ].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            {key === 'profileVisibility' && [
                              { label: 'Public', value: 'Public' },
                              { label: 'Registered Members', value: 'Members' },
                              { label: 'Premium Members', value: 'Premium' }
                            ].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        ) : key === 'aboutMe' ? (
                          <div className="space-y-3">
                            <p className="text-gray-500 text-sm">
                              This section will help you make a strong impression on your potential partner. So, express yourself.<br />
                              (NOTE: This section will be screened everytime you update it. Allow upto 24 hours for it to go live.)
                            </p>
                            <textarea
                              value={value || ''}
                              onChange={(e) => handleModalDataChange(key, e.target.value)}
                              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all min-h-[200px] text-gray-700 ${errors[key] ? 'border-red-500' : 'border-gray-200'}`}
                              placeholder="Let me introduce myself..."
                            />
                            <div className="flex justify-between text-gray-500 text-sm border-t border-gray-100 pt-2">
                              <span>Characters count</span>
                              <span className="font-medium">{value?.length || 0}</span>
                              <span>min. 50, max. 8000</span>
                            </div>
                          </div>
                        ) : (
                          <input
                            type={key === 'dateOfBirth' ? 'date' : key === 'timeOfBirth' ? 'time' : 'text'}
                            value={value || ''}
                            onChange={(e) => handleModalDataChange(key, e.target.value)}
                            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all ${errors[key] ? 'border-red-500' : 'border-gray-200'}`}
                          />
                        )}

                        {/* Add support for new preference fields rendering */}
                        {modalSection === 'preferences' && key === 'preferredMotherTongue' && (
                          <p className="text-xs text-gray-500">Separate multiple languages with commas</p>
                        )}
                        {errors[key] && (
                          <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg hover:shadow-rose-500/30 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;