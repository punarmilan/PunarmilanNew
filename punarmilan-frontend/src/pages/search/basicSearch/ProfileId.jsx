import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { searchByProfileId } from '../../../Slice/SearchSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProfileId() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [profileId, setProfileId] = useState('');
    const [expandedSearch, setExpandedSearch] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deleteSearchText, setDeleteSearchText] = useState('');
    const [recentSearches, setRecentSearches] = useState([
        {
            id: 1,
            searchText: 'Hindu+1,English+2,22-26yrs,less than 20,000-greater than 300,000',
            details: {
                Gender: 'Female',
                Age: '22 - 26',
                Height: '5ft 0in - 152 to 5ft 8in - 172',
                'Religion / Community': 'Hindu, Buddhist',
                'Marital Status': 'Never Married',
                'Annual Income': 'GBP less than 20,000 to greater than 300,000',
                'Country Living In': 'United Kingdom',
                'Mother Tongue': 'English, Hindi, Marathi',
                'Do Not Show': 'Profiles that have Filtered me out, Profiles that I have Ignored',
                'Account Type': 'Open to All'
            }
        },
        {
            id: 2,
            searchText: 'Hindu+1,English+2,22-26yrs,less than 1 lakh-greater than 1 crore',
            details: {
                Gender: 'Female',
                Age: '22 - 26',
                Height: '5ft 0in - 152 to 5ft 8in - 172',
                'Religion / Community': 'Hindu',
                'Marital Status': 'Never Married',
                'Annual Income': 'INR less than 1 lakh to greater than 1 crore',
                'Country Living In': 'India',
                'Mother Tongue': 'English, Hindi',
                'Do Not Show': 'Profiles that have Filtered me out',
                'Account Type': 'Open to All'
            }
        },
        {
            id: 3,
            searchText: 'Hindu+1,English+2,22-26yrs',
            details: {
                Gender: 'Female',
                Age: '22 - 26',
                Height: '5ft 0in - 152 to 5ft 8in - 172',
                'Religion / Community': 'Hindu',
                'Marital Status': 'Never Married',
                Keyword: 'More',
                'Country Living In': 'United Kingdom',
                'Mother Tongue': 'English, Hindi, Marathi',
                'Profile Managed By': 'Self',
                'Do Not Show': 'Profiles that have Filtered me out, Profiles that I have Ignored',
                'Account Type': 'Open to All'
            }
        }
    ]);

    const handleProfileSearch = (e) => {
        e.preventDefault();
        if (profileId.trim()) {
            toast.success(`Searching for Profile ID: ${profileId}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                className: 'custom-toast-success',
            });
            dispatch(searchByProfileId(profileId));
            navigate('/search-results', { state: { profileId } });
        } else {
            toast.warning('Please enter a Profile ID', {
                position: "top-right",
                autoClose: 2000,
                className: 'custom-toast-warning',
            });
        }
    };

    const handleViewMore = (searchId) => {
        setExpandedSearch(expandedSearch === searchId ? null : searchId);
    };

    const handleDeleteClick = (searchId, searchText) => {
        setDeleteTargetId(searchId);
        setDeleteSearchText(searchText);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setRecentSearches(recentSearches.filter(search => search.id !== deleteTargetId));
        setShowDeleteModal(false);

        toast.success('Search deleted successfully!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: 'custom-toast-delete',
        });

        setDeleteTargetId(null);
        setDeleteSearchText('');
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTargetId(null);
        setDeleteSearchText('');
    };

    const handleSearchClick = (search) => {
        navigate('/search/advance', {
            state: {
                searchParams: search.details,
                searchText: search.searchText
            }
        });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

                * {
                    box-sizing: border-box;
                }

                .profile-id-container {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    min-height: 100vh;
                    padding: 30px 20px;
                }

                @media (max-width: 768px) {
                    .profile-id-container {
                        padding: 20px 16px;
                    }
                }

                .content-wrapper {
                    max-width: 900px;
                    margin: 0 auto;
                }

                .section-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                    margin-bottom: 24px;
                    overflow: hidden;
                }

                .section-header {
                    background: linear-gradient(to right, #ffffff 0%, #fef3f2 100%);
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                @media (max-width: 480px) {
                    .section-header {
                        padding: 16px 20px;
                    }
                    .section-title {
                        font-size: 16px;
                    }
                }

                /* Profile ID Search Styles */
                .profile-search-form {
                    padding: 24px;
                    display: flex;
                    gap: 12px;
                }

                @media (max-width: 640px) {
                    .profile-search-form {
                        flex-direction: column;
                    }
                }

                @media (max-width: 480px) {
                    .profile-search-form {
                        padding: 20px;
                    }
                }

                .profile-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #334155;
                    transition: all 0.2s ease;
                }

                .profile-input:focus {
                    outline: none;
                    border-color: #06b6d4;
                    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
                }

                .profile-input::placeholder {
                    color: #94a3b8;
                }

                .btn-go {
                    padding: 12px 32px;
                    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                @media (max-width: 640px) {
                    .btn-go {
                        width: 100%;
                    }
                }

                .btn-go:hover {
                    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
                }

                .btn-go:active {
                    transform: translateY(0);
                }

                /* Recent Searches Styles */
                .searches-list {
                    border-top: 1px solid #f1f5f9;
                }

                .search-item {
                    padding: 20px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    transition: background 0.2s ease;
                }

                @media (max-width: 480px) {
                    .search-item {
                        padding: 16px 20px;
                    }
                }

                .search-item:hover {
                    background: linear-gradient(to right, #fef3f2 0%, #fef9f5 100%);
                }

                .search-item:last-child {
                    border-bottom: none;
                }

                .search-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .search-icon {
                    width: 20px;
                    height: 20px;
                    color: #94a3b8;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .search-text {
                    flex: 1;
                    font-size: 14px;
                    color: #475569;
                    line-height: 1.6;
                    word-break: break-word;
                }

                .btn-arrow {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .btn-arrow:hover {
                    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
                }

                .btn-arrow:active {
                    transform: scale(0.95);
                }

                .search-actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 16px;
                    border-top: 1px solid #f1f5f9;
                }

                .btn-view-more {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: none;
                    color: #06b6d4;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: color 0.2s ease;
                }

                .btn-view-more:hover {
                    color: #0891b2;
                }

                .chevron-icon {
                    width: 16px;
                    height: 16px;
                    transition: transform 0.3s ease;
                }

                .chevron-icon.open {
                    transform: rotate(180deg);
                }

                .btn-delete {
                    background: none;
                    border: none;
                    color: #ef4444;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: color 0.2s ease;
                }

                .btn-delete:hover {
                    color: #dc2626;
                    text-decoration: underline;
                }

                /* Expanded Details */
                .details-wrapper {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #e2e8f0;
                    animation: slideDown 0.3s ease-out;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .details-container {
                    background: linear-gradient(135deg, #f8fafc 0%, #fef3f2 100%);
                    border-radius: 8px;
                    padding: 20px;
                }

                @media (max-width: 480px) {
                    .details-container {
                        padding: 16px;
                    }
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                }

                .detail-row {
                    display: grid;
                    grid-template-columns: 160px 8px 1fr;
                    gap: 12px;
                    align-items: start;
                    font-size: 13px;
                }

                @media (max-width: 640px) {
                    .detail-row {
                        grid-template-columns: 140px 8px 1fr;
                        gap: 8px;
                    }
                }

                @media (max-width: 480px) {
                    .detail-row {
                        grid-template-columns: 1fr;
                        gap: 4px;
                    }
                    .detail-separator {
                        display: none;
                    }
                }

                .detail-label {
                    font-weight: 500;
                    color: #475569;
                }

                .detail-separator {
                    color: #cbd5e1;
                }

                .detail-value {
                    color: #1e293b;
                }

                /* Delete Modal */
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    padding: 20px;
                    animation: fadeIn 0.2s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .modal-content {
                    background: #1e293b;
                    border-radius: 12px;
                    padding: 28px;
                    max-width: 480px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideUp 0.3s ease-out;
                }

                @media (max-width: 480px) {
                    .modal-content {
                        padding: 24px;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-header {
                    font-size: 15px;
                    color: #f1f5f9;
                    margin-bottom: 6px;
                    font-weight: 500;
                }

                .modal-message {
                    font-size: 14px;
                    color: #cbd5e1;
                    line-height: 1.6;
                    margin-bottom: 24px;
                    word-break: break-word;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                @media (max-width: 480px) {
                    .modal-actions {
                        flex-direction: column-reverse;
                    }
                }

                .modal-btn {
                    padding: 10px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                @media (max-width: 480px) {
                    .modal-btn {
                        width: 100%;
                    }
                }

                .btn-ok {
                    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
                    color: white;
                    min-width: 80px;
                }

                .btn-ok:hover {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                }

                .btn-cancel {
                    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
                    color: white;
                    min-width: 80px;
                }

                .btn-cancel:hover {
                    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
                }

                .modal-btn:active {
                    transform: translateY(0);
                }

                /* Empty State */
                .empty-state {
                    padding: 60px 24px;
                    text-align: center;
                }

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .empty-title {
                    font-size: 16px;
                    color: #64748b;
                    margin-bottom: 8px;
                }

                .empty-subtitle {
                    font-size: 13px;
                    color: #94a3b8;
                }

                /* Custom Toast Styles */
                .custom-toast-success {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
                    color: white !important;
                    font-weight: 600 !important;
                }

                .custom-toast-warning {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
                    color: white !important;
                    font-weight: 600 !important;
                }

                .custom-toast-delete {
                    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%) !important;
                    color: white !important;
                    font-weight: 600 !important;
                }
            `}</style>

            <div className="profile-id-container">
                <ToastContainer />

                <div className="content-wrapper">
                    {/* Profile ID Search Section */}
                    <div className="section-card">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span>🔍</span>
                                Profile ID Search
                            </h2>
                        </div>
                        <form onSubmit={handleProfileSearch} className="profile-search-form">
                            <input
                                type="text"
                                value={profileId}
                                onChange={(e) => setProfileId(e.target.value)}
                                placeholder="Enter Profile ID"
                                className="profile-input"
                            />
                            <button type="submit" className="btn-go">
                                Go
                            </button>
                        </form>
                    </div>

                    {/* Recent Searches Section */}
                    <div className="section-card">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span>🕐</span>
                                Recent Searches
                            </h2>
                        </div>

                        {recentSearches.length > 0 ? (
                            <div className="searches-list">
                                {recentSearches.map((search) => (
                                    <div key={search.id} className="search-item">
                                        {/* Search Header */}
                                        <div className="search-header">
                                            <svg className="search-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <p className="search-text">
                                                {search.searchText}
                                            </p>
                                            <button
                                                onClick={() => handleSearchClick(search)}
                                                className="btn-arrow"
                                                title="Open in Advanced Search"
                                            >
                                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Action Buttons Row */}
                                        <div className="search-actions">
                                            <button
                                                onClick={() => handleViewMore(search.id)}
                                                className="btn-view-more"
                                            >
                                                View More
                                                <svg
                                                    className={`chevron-icon ${expandedSearch === search.id ? 'open' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleDeleteClick(search.id, search.searchText)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedSearch === search.id && (
                                            <div className="details-wrapper">
                                                <div className="details-container">
                                                    <div className="details-grid">
                                                        {Object.entries(search.details).map(([key, value]) => (
                                                            <div key={key} className="detail-row">
                                                                <div className="detail-label">{key}</div>
                                                                <div className="detail-separator">:</div>
                                                                <div className="detail-value">{value}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <p className="empty-title">No recent searches found</p>
                                <p className="empty-subtitle">Your search history will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="modal-backdrop" onClick={cancelDelete}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">my.PunarMilan.com says</div>
                            <div className="modal-message">
                                Delete search: "{deleteSearchText}". Are you sure?
                            </div>
                            <div className="modal-actions">
                                <button onClick={confirmDelete} className="modal-btn btn-ok">
                                    OK
                                </button>
                                <button onClick={cancelDelete} className="modal-btn btn-cancel">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProfileId;