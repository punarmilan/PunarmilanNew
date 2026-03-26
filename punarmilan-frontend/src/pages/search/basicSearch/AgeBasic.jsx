import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchProfiles } from '../../../Slice/SearchSlice';

function AgeBasic() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myProfile } = useSelector((state) => state.profile);

  // Form state
  const [formData, setFormData] = useState({
    ageFrom: '22',
    ageTo: '26',
    heightFrom: "5'0\" - 152cm",
    heightTo: "5'8\" - 172cm",
    maritalStatus: ['Never Married'],
    religion: ['Hindu', 'Buddhist'],
    motherTongue: ['English', 'Hindi', 'Marathi'],
    community: ['Open to All'],
    countryLivingIn: ['UK'],
    stateLivingIn: ['Open to All'],
  });

  // Options for dropdowns
  const ageOptions = Array.from({ length: 61 }, (_, i) => i + 18);
  const heightOptions = [
    "4'5\" - 135cm", "4'6\" - 137cm", "4'7\" - 140cm", "4'8\" - 142cm",
    "4'9\" - 145cm", "4'10\" - 147cm", "4'11\" - 150cm", "5'0\" - 152cm",
    "5'1\" - 155cm", "5'2\" - 157cm", "5'3\" - 160cm", "5'4\" - 163cm",
    "5'5\" - 165cm", "5'6\" - 168cm", "5'7\" - 170cm", "5'8\" - 172cm",
    "5'9\" - 175cm", "5'10\" - 178cm", "5'11\" - 180cm", "6'0\" - 183cm",
    "6'1\" - 185cm", "6'2\" - 188cm", "6'3\" - 191cm", "6'4\" - 193cm",
  ];

  const maritalStatusOptions = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'];
  const religionOptions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Other'];
  const languageOptions = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati', 'Punjabi'];
  const communityOptions = ['Open to All', 'Brahmin', 'Kshatriya', 'Vaishya', 'Scheduled Caste', 'Scheduled Tribe', 'OBC'];
  const countryOptions = ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Singapore', 'Malaysia'];
  const stateOptions = ['Open to All', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];

  const handleMultiSelectToggle = (field, value) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const handleRemoveTag = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((v) => v !== value),
    }));
  };

  const handleSearch = () => {
    const targetGender = myProfile ? (myProfile.gender === 'Male' ? 'Female' : 'Male') : null;

    const cleanCriteria = (list) => {
      if (!list || !Array.isArray(list)) return [];
      return list.filter(item => item !== 'Open to All');
    };

    const criteria = {
      ageFrom: parseInt(formData.ageFrom),
      ageTo: parseInt(formData.ageTo),
      heightFrom: formData.heightFrom,
      heightTo: formData.heightTo,
      maritalStatus: cleanCriteria(formData.maritalStatus),
      religion: cleanCriteria(formData.religion),
      motherTongue: cleanCriteria(formData.motherTongue),
      caste: cleanCriteria(formData.community),
      country: cleanCriteria(formData.countryLivingIn),
      state: cleanCriteria(formData.stateLivingIn),
      gender: targetGender
    };

    dispatch(searchProfiles({ criteria }));
    navigate('/search-results', { state: { filters: criteria } });
  };

  const handleReset = () => {
    setFormData({
      ageFrom: '22',
      ageTo: '26',
      heightFrom: "5'0\" - 152cm",
      heightTo: "5'8\" - 172cm",
      maritalStatus: ['Never Married'],
      religion: ['Hindu', 'Buddhist'],
      motherTongue: ['English', 'Hindi', 'Marathi'],
      community: ['Open to All'],
      countryLivingIn: ['UK'],
      stateLivingIn: ['Open to All'],
    });
  };

  const navigateToAdvancedSearch = () => {
    navigate('/search/advance');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .compact-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f5f7fa;
          min-height: 100vh;
          padding: 30px 20px;
        }

        .compact-card {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          padding: 30px;
        }

        @media (max-width: 768px) {
          .compact-card {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .compact-card {
            padding: 16px;
          }
          
          .compact-container {
            padding: 16px 12px;
          }
        }

        .form-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 20px;
          align-items: start;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e8ecef;
        }

        .form-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 130px 1fr;
            gap: 15px;
            margin-bottom: 18px;
            padding-bottom: 18px;
          }
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 8px;
            margin-bottom: 16px;
            padding-bottom: 16px;
          }
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #37474f;
          padding-top: 10px;
        }

        @media (max-width: 480px) {
          .form-label {
            padding-top: 0;
            font-size: 13px;
          }
        }

        .form-input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .range-inputs {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .range-inputs {
            gap: 8px;
          }
        }

        .range-inputs select {
          flex: 1;
        }

        .range-divider {
          color: #90a4ae;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }

        select {
          width: 100%;
          padding: 10px 35px 10px 12px;
          border: 1px solid #d1d9e0;
          border-radius: 6px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #37474f;
          background: white;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2390a4ae' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: all 0.2s ease;
        }

        @media (max-width: 480px) {
          select {
            padding: 9px 32px 9px 11px;
            font-size: 13px;
            background-position: right 10px center;
          }
        }

        select:hover {
          border-color: #00bcd4;
        }

        select:focus {
          outline: none;
          border-color: #00bcd4;
          box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
        }

        /* Multi-Select Styles */
        .multi-select-container {
          position: relative;
          width: 100%;
        }

        .dropdown-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 998;
          background: rgba(0, 0, 0, 0.15);
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .multi-select-trigger {
          min-height: 44px;
          padding: 8px 35px 8px 12px;
          border: 1px solid #d1d9e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
          transition: all 0.2s ease;
          position: relative;
        }

        @media (max-width: 480px) {
          .multi-select-trigger {
            min-height: 42px;
            padding: 7px 32px 7px 11px;
            gap: 5px;
          }
        }

        .multi-select-trigger:hover {
          border-color: #00bcd4;
        }

        .multi-select-trigger.open {
          border-color: #00bcd4;
          box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
        }

        .selected-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: #00bcd4;
          color: white;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        @media (max-width: 480px) {
          .selected-tag {
            padding: 4px 8px;
            font-size: 12px;
            gap: 5px;
          }
        }

        .selected-tag:hover {
          background: #0097a7;
        }

        .tag-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          font-size: 14px;
          line-height: 1;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        @media (max-width: 480px) {
          .tag-close {
            width: 14px;
            height: 14px;
            font-size: 13px;
          }
        }

        .tag-close:hover {
          background: rgba(255, 255, 255, 0.5);
          transform: rotate(90deg);
        }

        .dropdown-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: #90a4ae;
          transition: transform 0.2s ease;
          pointer-events: none;
        }

        @media (max-width: 480px) {
          .dropdown-icon {
            right: 10px;
            font-size: 9px;
          }
        }

        .dropdown-icon.open {
          transform: translateY(-50%) rotate(180deg);
        }

        .multi-select-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #d1d9e0;
          border-radius: 6px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          max-height: 240px;
          overflow-y: auto;
          z-index: 999;
          animation: dropdownSlide 0.2s ease;
        }

        @media (max-width: 480px) {
          .multi-select-dropdown {
            max-height: 200px;
          }
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .multi-select-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .multi-select-dropdown::-webkit-scrollbar-track {
          background: #f5f5f5;
        }

        .multi-select-dropdown::-webkit-scrollbar-thumb {
          background: #cfd8dc;
          border-radius: 3px;
        }

        .multi-select-dropdown::-webkit-scrollbar-thumb:hover {
          background: #b0bec5;
        }

        .dropdown-option {
          padding: 10px 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.15s ease;
          font-size: 14px;
          color: #37474f;
        }

        @media (max-width: 480px) {
          .dropdown-option {
            padding: 9px 11px;
            font-size: 13px;
          }
        }

        .dropdown-option:hover {
          background: #f0f9fa;
        }

        .dropdown-option.selected {
          background: #e0f7fa;
          color: #00838f;
          font-weight: 500;
        }

        .option-checkbox {
          width: 16px;
          height: 16px;
          border: 1.5px solid #cfd8dc;
          border-radius: 3px;
          transition: all 0.2s ease;
          flex-shrink: 0;
          position: relative;
        }

        @media (max-width: 480px) {
          .option-checkbox {
            width: 15px;
            height: 15px;
          }
        }

        .dropdown-option:hover .option-checkbox {
          border-color: #00bcd4;
        }

        .dropdown-option.selected .option-checkbox {
          background: #00bcd4;
          border-color: #00bcd4;
        }

        .dropdown-option.selected .option-checkbox::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 11px;
          font-weight: bold;
        }

        /* Action Buttons */
        .action-section {
          margin-top: 30px;
          padding-top: 24px;
          border-top: 1px solid #e8ecef;
        }

        @media (max-width: 480px) {
          .action-section {
            margin-top: 24px;
            padding-top: 20px;
          }
        }

        .advanced-link {
          display: block;
          text-align: right;
          color: #00bcd4;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 16px;
          transition: color 0.2s ease;
        }

        @media (max-width: 480px) {
          .advanced-link {
            text-align: center;
            font-size: 12px;
          }
        }

        .advanced-link:hover {
          color: #0097a7;
          text-decoration: underline;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .action-buttons {
            flex-direction: column-reverse;
            gap: 10px;
          }
        }

        .btn {
          flex: 1;
          padding: 11px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @media (max-width: 480px) {
          .btn {
            padding: 10px 20px;
            font-size: 13px;
          }
        }

        .btn-reset {
          background: #eceff1;
          color: #546e7a;
        }

        .btn-reset:hover {
          background: #cfd8dc;
        }

        .btn-reset:active {
          transform: scale(0.98);
        }

        .btn-search {
          background: #00bcd4;
          color: white;
        }

        .btn-search:hover {
          background: #0097a7;
        }

        .btn-search:active {
          transform: scale(0.98);
        }

        .search-icon {
          font-size: 12px;
        }

        /* Focus styles for accessibility */
        .btn:focus-visible,
        .multi-select-trigger:focus-visible,
        select:focus-visible {
          outline: 2px solid #00bcd4;
          outline-offset: 2px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="compact-container">
        <div className="compact-card">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Age */}
            <div className="form-row">
              <label className="form-label">Age</label>
              <div className="form-input-wrapper">
                <div className="range-inputs">
                  <select
                    value={formData.ageFrom}
                    onChange={(e) => setFormData({ ...formData, ageFrom: e.target.value })}
                    aria-label="Age from"
                  >
                    {ageOptions.map((age) => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                  <span className="range-divider">to</span>
                  <select
                    value={formData.ageTo}
                    onChange={(e) => setFormData({ ...formData, ageTo: e.target.value })}
                    aria-label="Age to"
                  >
                    {ageOptions.map((age) => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Height */}
            <div className="form-row">
              <label className="form-label">Height</label>
              <div className="form-input-wrapper">
                <div className="range-inputs">
                  <select
                    value={formData.heightFrom}
                    onChange={(e) => setFormData({ ...formData, heightFrom: e.target.value })}
                    aria-label="Height from"
                  >
                    {heightOptions.map((height) => (
                      <option key={height} value={height}>{height}</option>
                    ))}
                  </select>
                  <span className="range-divider">to</span>
                  <select
                    value={formData.heightTo}
                    onChange={(e) => setFormData({ ...formData, heightTo: e.target.value })}
                    aria-label="Height to"
                  >
                    {heightOptions.map((height) => (
                      <option key={height} value={height}>{height}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Marital Status */}
            <div className="form-row">
              <label className="form-label">Marital Status</label>
              <div className="form-input-wrapper">
                <MultiSelectDropdown
                  options={maritalStatusOptions}
                  selected={formData.maritalStatus}
                  onToggle={(value) => handleMultiSelectToggle('maritalStatus', value)}
                  onRemove={(value) => handleRemoveTag('maritalStatus', value)}
                  ariaLabel="Marital Status"
                />
              </div>
            </div>

            {/* Religion */}
            <div className="form-row">
              <label className="form-label">Religion</label>
              <div className="form-input-wrapper">
                <MultiSelectDropdown
                  options={religionOptions}
                  selected={formData.religion}
                  onToggle={(value) => handleMultiSelectToggle('religion', value)}
                  onRemove={(value) => handleRemoveTag('religion', value)}
                  ariaLabel="Religion"
                />
              </div>
            </div>

            {/* Mother Tongue */}
            <div className="form-row">
              <label className="form-label">Mother Tongue</label>
              <div className="form-input-wrapper">
                <MultiSelectDropdown
                  options={languageOptions}
                  selected={formData.motherTongue}
                  onToggle={(value) => handleMultiSelectToggle('motherTongue', value)}
                  onRemove={(value) => handleRemoveTag('motherTongue', value)}
                  ariaLabel="Mother Tongue"
                />
              </div>
            </div>

            {/* Community */}
            <div className="form-row">
              <label className="form-label">Community</label>
              <div className="form-input-wrapper">
                <MultiSelectDropdown
                  options={communityOptions}
                  selected={formData.community}
                  onToggle={(value) => handleMultiSelectToggle('community', value)}
                  onRemove={(value) => handleRemoveTag('community', value)}
                  ariaLabel="Community"
                />
              </div>
            </div>

            {/* Country Living In */}
            <div className="form-row">
              <label className="form-label">Country Living In</label>
              <div className="form-input-wrapper">
                <MultiSelectDropdown
                  options={countryOptions}
                  selected={formData.countryLivingIn}
                  onToggle={(value) => handleMultiSelectToggle('countryLivingIn', value)}
                  onRemove={(value) => handleRemoveTag('countryLivingIn', value)}
                  ariaLabel="Country Living In"
                />
              </div>
            </div>

            {/* State Living In */}
            <div className="form-row">
              <label className="form-label">State Living In</label>
              <div className="form-input-wrapper">
                <MultiSelectDropdown
                  options={stateOptions}
                  selected={formData.stateLivingIn}
                  onToggle={(value) => handleMultiSelectToggle('stateLivingIn', value)}
                  onRemove={(value) => handleRemoveTag('stateLivingIn', value)}
                  ariaLabel="State Living In"
                />
              </div>
            </div>

            {/* Action Section */}
            <div className="action-section">
              <a className="advanced-link" onClick={navigateToAdvancedSearch}>
                Advanced Search options →
              </a>
              <div className="action-buttons">
                <button type="button" className="btn btn-reset" onClick={handleReset}>
                  Reset
                </button>
                <button type="button" className="btn btn-search" onClick={handleSearch}>
                  <span className="search-icon">▶</span>
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Multi-Select Dropdown Component
function MultiSelectDropdown({ options, selected, onToggle, onRemove, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="dropdown-backdrop" onClick={() => setIsOpen(false)} />}
      <div className="multi-select-container" ref={dropdownRef}>
        <div
          className={`multi-select-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
        >
          {selected.length > 0 ? (
            selected.map((item) => (
              <span key={item} className="selected-tag">
                {item}
                <span
                  className="tag-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item);
                  }}
                  role="button"
                  aria-label={`Remove ${item}`}
                >
                  ×
                </span>
              </span>
            ))
          ) : (
            <span style={{ color: '#90a4ae', fontSize: '14px' }}>Select options...</span>
          )}
          <span className={`dropdown-icon ${isOpen ? 'open' : ''}`}>▼</span>
        </div>

        {isOpen && (
          <div className="multi-select-dropdown" role="listbox">
            {options.map((option) => (
              <div
                key={option}
                className={`dropdown-option ${selected.includes(option) ? 'selected' : ''}`}
                onClick={() => onToggle(option)}
                role="option"
                aria-selected={selected.includes(option)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggle(option);
                  }
                }}
              >
                <div className="option-checkbox"></div>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AgeBasic;