import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import MatchProfileCard from '../../components/MatchProfileCard';
import { searchByProfileId, searchProfiles } from '../../Slice/SearchSlice';
import SearchNav from './SearchNav';

function SearchResults() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { results, totalPages, totalElements, page, loading, error } = useSelector((state) => state.search);
    const { shortlistedProfiles } = useSelector((state) => state.match);
    const [currentPage, setCurrentPage] = React.useState(1);
    const pageSize = 20;

    useEffect(() => {
        if (location.state) {
            if (location.state.profileId) {
                dispatch(searchByProfileId(location.state.profileId));
            } else if (location.state.filters) {
                dispatch(searchProfiles({ 
                    criteria: location.state.filters, 
                    page: currentPage - 1, 
                    size: pageSize 
                }));
            }
        }
    }, [dispatch, location.state, currentPage]);

    const isShortlisted = (profileId) => {
        return shortlistedProfiles.some(p => p.id === profileId);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    return (
        <div className="search-results-page min-h-screen bg-[#F8F9FA] pb-24">
            <SearchNav />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Search Results
                            {totalElements > 0 && (
                                <span className="ml-3 text-rose-500 font-medium text-lg bg-rose-50 px-3 py-1 rounded-full">
                                    {totalElements} Profiles
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Find your perfect life partner from our verified profiles</p>
                    </div>
                    <button
                        onClick={() => navigate('/search')}
                        className="flex items-center gap-2 text-rose-600 font-bold hover:text-rose-700 transition px-4 py-2 rounded-xl hover:bg-rose-50 w-fit"
                    >
                        <span className="text-xl">←</span> Back to Search
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100 shadow-sm flex flex-col md:flex-row">
                                <div className="w-full md:w-64 h-48 md:h-full bg-gray-100 rounded-l-xl"></div>
                                <div className="flex-1 p-6 space-y-4">
                                    <div className="h-8 bg-gray-100 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                                    <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold">!</span>
                        </div>
                        <p className="font-medium">
                            {typeof error === 'string' ? error : 'An error occurred during search. Please try again.'}
                        </p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">🔍</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Profiles Found</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Try adjusting your filters or expanding your search criteria to see more results.</p>
                        <button
                            onClick={() => navigate('/search')}
                            className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-700 transition shadow-lg shadow-rose-100"
                        >
                            Modify Search
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-6">
                            {results.map((profile) => (
                                <MatchProfileCard
                                    key={profile.id}
                                    profile={profile}
                                    layout="list"
                                    isShortlisted={isShortlisted(profile.id)}
                                />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                >
                                    Previous
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        // Show first, last, and pages around current
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-xl font-bold transition ${
                                                        currentPage === pageNum
                                                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-100'
                                                            : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-600'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 3 ||
                                            pageNum === currentPage + 3
                                        ) {
                                            return <span key={pageNum} className="px-1 text-gray-400">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchResults;
