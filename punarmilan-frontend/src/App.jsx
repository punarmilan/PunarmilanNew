import { useEffect, useState } from "react";
// Forced reload
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ChatWindow from "./components/ChatWindow";
import { closeChatWindow, setCurrentUserId } from "./Slice/ChatSlice";
import ChatService from "./services/chatService";
import Matches from "./pages/matches/Matches";
import MatchProfileDetails from "./pages/matches/MatchProfileDetails";
import { Toaster } from "react-hot-toast";
import "./pages/myshadi/partner/partner.css";
import Home from "./pages/Home";
import Dashboard from "./pages/myshadi/dashboard/Dashboard";
import Header from "./components/Headers";
import Footer from "./components/Footer";
import AuthenticatedFooter from "./components/AuthenticatedFooter";
import OnlineMembers from "./components/OnlineMembers";
import SecondNav from "./components/SecondNav";
import { getCurrentUser } from "./Slice/UserSlice";
import MyProfile from "./pages/myshadi/myProfile/MyProfile";
import MyPhoto from "./pages/myshadi/myphoto/MyPhoto";
import PartnerPreference from "./pages/myshadi/partner/PartnerPreference";
import Register from "./components/Register";
import Login from "./components/Login";
import HeightRangePage from "./pages/myshadi/partner/HeightRange";
import MaritalStatusPage from "./pages/myshadi/partner/MaritalStatusPage";
import ReligionPage from "./pages/myshadi/partner/ReligionPage";
import Community from "./pages/myshadi/partner/Community";
import MotherTonguePage from "./pages/myshadi/partner/MotherTonguePage";
import AgeRangePage from "./pages/myshadi/partner/AgeRangePage";
import ProfessionPage from "./pages/myshadi/partner/ProfessionPage";
import QualificationPage from "./pages/myshadi/partner/QualificationPage";
import StateLivingPage from "./pages/myshadi/partner/StateLivingPage";
import CityDistrictPage from "./pages/myshadi/partner/CityDistrictPage";
import AnnualIncomePage from "./pages/myshadi/partner/AnnualIncomePage";
import WorkingWithPage from "./pages/myshadi/partner/WorkingWithPage";
import DietPage from "./pages/myshadi/partner/DietPage";
import ProfileManagedByPage from "./pages/myshadi/partner/ProfileManagedByPage";
import Settings from "./pages/myshadi/setting/Setting";
import Country from "./pages/myshadi/partner/Country";
import MoreDropdown from "./pages/myshadi/more/More";
import SearchNav from "./pages/search/SearchNav";
import AdvancedSearch from "./pages/search/AdvSearch/AdvancedSearch";
import Search from "./pages/search/Search";
import SearchResults from "./pages/search/SearchResults";
import InboxNav from "./pages/inbox/InboxNav";
import Received from "./pages/inbox/received/Received";
import Accepted from "./pages/inbox/accepted/Accepted";
import Deleted from "./pages/inbox/deleted/Deleted";
import Requests from "./pages/inbox/requests/Requests";
import Sent from "./pages/inbox/sent/Sent";
import Payment from "./pages/payment/Payment";
import ContactFilters from "./pages/myshadi/setting/ContactFilters";
import MyOrdersPage from "./pages/MyOrder/MyOrder";
import MyOrder from "./pages/MyOrder/MyOrder";
import ReferPage from "./pages/MyOrder/ReferPage";
import HelpPage from "./pages/MyOrder/HelpPage";
import SecurityPage from "./pages/MyOrder/SecurityPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MyTickets from "./pages/MyOrder/MyTickets";
import Pricing from "./pages/payment/Pricing";
import AboutUs from "./pages/AboutUs";
import VerifyEmail from "./pages/VerifyEmail";
import api from "./services/api";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Imports
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUserManagement from "./admin/pages/AdminUserManagement";
import VerificationQueue from "./admin/pages/VerificationQueue";
import PhotoModeration from "./admin/pages/PhotoModeration";
import ReportManagement from "./admin/pages/ReportManagement";
import AdminLogViewer from "./admin/pages/AdminLogViewer";
import SubscriptionManagement from "./admin/pages/SubscriptionManagement";
import SupportTickets from "./admin/pages/SupportTickets";
import EventManagement from "./pages/admin/EventManagement";


function App() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const activeChatUser = useSelector((state) => state.chat.activeChatUser);
  const unreadCount = useSelector((state) => state.chat.unreadCount);
  const notificationsUnreadCount = useSelector((state) => state.notifications.unreadCount);
  const isHomePage = location.pathname === "/" || location.pathname === "/home" || location.pathname === '/payment';
  const isAdminPage = location.pathname.startsWith("/admin");

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);

  // Verify session on mount if user is supposedly authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser()).unwrap().catch((err) => {
        console.warn('Session verification failed on mount:', err);
      });
    }
  }, [dispatch]); // Only on actual mount

  // Hide OnlineMembers on Home page ONLY
  useEffect(() => {
    if (isHomePage) {
      setOpen(false);
    }
  }, [isHomePage]);

  // Activity Heartbeat & CSRF Initialization
  useEffect(() => {
    // Prime CSRF token on every app load (for all users, including non-authenticated)
    api.get("/subscriptions/plans").catch(() => { });

    let intervalId;
    if (isAuthenticated) {
      // Immediate ping on mount/auth
      api.get("/activity/ping").catch(() => { });

      intervalId = setInterval(() => {
        api.get("/activity/ping").catch(() => { });
      }, 60000); // 60 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  // WebSocket Connection
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(setCurrentUserId(user.id));
      ChatService.connect(user.id);
    } else {
      ChatService.disconnect();
    }
  }, [isAuthenticated, user?.id, dispatch]);

  // Handle close button click
  const handleClose = () => {
    setOpen(false);
  };

  // Handle open button click
  const handleOpen = () => {
    if (!isHomePage) {
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen pb-safe-bottom">
      {/* Online Members Chat Button */}
      {/* ✅ DO NOT SHOW ON HOME PAGE */}
      {!isHomePage && !isAdminPage && (
        <>
          {/* Online Members Chat Button */}
          <button
            onClick={() => setOpen(!open)}
            className="fixed right-0 top-1/2 -translate-y-1/2 md:block hidden
                       z-[10000] bg-gradient-to-br from-rose-500 to-pink-600 text-white
                       px-3 py-4 rounded-l-xl shadow-2xl hover:translate-x-[-4px] transition-transform duration-300">
            <div className="relative">
              <span className="text-xl">💬</span>
              {(unreadCount + notificationsUnreadCount) > 0 && (
                <span className="absolute -top-3 -right-3 min-w-[20px] h-5 bg-yellow-400 text-rose-900 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-sm px-1">
                  {unreadCount + notificationsUnreadCount}
                </span>
              )}
            </div>
          </button>

          <OnlineMembers open={open} setOpen={setOpen} />

        </>
      )}
      {/* ROUTES */}
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/:id" element={<MatchProfileDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/about-us" element={<AboutUs />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="approvals" element={<VerificationQueue />} />
          <Route path="photos" element={<PhotoModeration />} />
          <Route path="reports" element={<ReportManagement />} />
          <Route path="logs" element={<AdminLogViewer />} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
          <Route path="support" element={<SupportTickets />} />
          <Route path="events" element={<EventManagement />} />
        </Route>

        <Route path="/my-tickets" element={<><Header /><SecondNav /><MyTickets /></>} />

        {/* DASHBOARD */}
        <Route
          path="/my-shadi"
          element={
            <ProtectedRoute>
              <Header />
              <SecondNav />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* payment */}
        <Route path="/payment" element={<Payment />} />
        {/* MY PROFILE */}
        <Route
          path="/my-shadi/my-profile"
          element={
            <ProtectedRoute>
              <Header />
              <SecondNav />
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* MY PHOTOS */}
        <Route
          path="/my-shadi/my-photos"
          element={
            <ProtectedRoute>
              <Header />
              <SecondNav />
              <MyPhoto />
            </ProtectedRoute>
          }
        />

        {/* PARTNER PREFERENCES */}
        <Route
          path="/my-shadi/partner-preferences"
          element={
            <ProtectedRoute>
              <Header />
              <SecondNav />
              <PartnerPreference />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/preferences/age-range" element={< />} /> */}
        <Route
          path="/my-shadi/partner-preferences/age-range"
          element={
            <>
              <Header />
              <SecondNav />
              <AgeRangePage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/country"
          element={
            <>
              <Header />
              <SecondNav />
              <Country />
            </>
          }
        />
        {/* my order */}
        <Route
          path="/my-shadi/my-order"
          element={
            <>
              <Header />
              <SecondNav />
              <MyOrder />
            </>
          }
        />
        <Route
          path="/my-shadi/refer"
          element={
            <>
              <Header />
              <SecondNav />
              <ReferPage />
            </>
          }
        />

        <Route
          path="/my-shadi/help"
          element={
            <>
              <Header />
              <SecondNav />
              <HelpPage />
            </>
          }
        />
        <Route path="/help" element={<><Header /><SecondNav /><HelpPage /></>} />
        <Route path="/support" element={<><Header /><SecondNav /><HelpPage /></>} />

        <Route
          path="/my-shadi/security"
          element={
            <>
              <Header />
              <SecondNav />
              <SecurityPage />
            </>
          }
        />

        <Route
          path="/my-shadi/online"
          element={
            <>
              <Header />
              <SecondNav />
              <OnlineMembers />
            </>
          }
        />


        <Route
          path="/my-shadi/partner-preferences/height-range"
          element={
            <>
              <Header />
              <SecondNav />
              <HeightRangePage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/maritalstatus"
          element={
            <>
              <Header />
              <SecondNav />
              <MaritalStatusPage />
            </>
          }
        />
        <Route
          path="/my-shadi/partner-preferences/religion"
          element={
            <>
              <Header />
              <SecondNav />
              <ReligionPage />
            </>
          }
        />
        <Route
          path="/my-shadi/partner-preferences/community"
          element={
            <>
              <Header />
              <SecondNav />
              <Community />
            </>
          }
        />

        {/* <Route path="/contact-filters" element={<ContactFilters />} /> */}


        <Route
          path="/my-shadi/partner-preferences/mothertongue"
          element={
            <>
              <Header />
              <SecondNav />
              <MotherTonguePage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/profession"
          element={
            <>
              <Header />
              <SecondNav />
              <ProfessionPage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/qualification"
          element={
            <>
              <Header />
              <SecondNav />
              <QualificationPage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/state"
          element={
            <>
              <Header />
              <SecondNav />
              <StateLivingPage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/city"
          element={
            <>
              <Header />
              <SecondNav />
              <CityDistrictPage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/annulincome"
          element={
            <>
              <Header />
              <SecondNav />
              <AnnualIncomePage />
            </>
          }
        />
        <Route
          path="/my-shadi/partner-preferences/working"
          element={
            <>
              <Header />
              <SecondNav />
              <WorkingWithPage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/diet"
          element={
            <>
              <Header />
              <SecondNav />
              <DietPage />
            </>
          }
        />

        <Route
          path="/my-shadi/partner-preferences/profile"
          element={
            <>
              <Header />
              <SecondNav />
              <ProfileManagedByPage />
            </>
          }
        />

        <Route
          path="/my-shadi/settings"
          element={
            <ProtectedRoute>
              <Header />
              <SecondNav />
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-shadi/more"
          element={
            <>
              <Header />
              <SecondNav />
              <MoreDropdown />
            </>
          }

        />

        {/* <Route path="/search"
          element={<Search />

          } /> */}



        <Route
          path="/search"
          element={
            <>
              <Header />
              <SearchNav />
              <Search />
            </>
          }
        />
        <Route
          path="/search-results"
          element={
            <>
              <Header />
              <SearchResults />
            </>
          }
        />



        <Route
          path="/inbox/pending/intrest"
          element={
            <>
              <Header />
              <InboxNav />
              <Received />
            </>
          }
        />

        <Route
          path="/inbox/accepted/intrest"
          element={
            <>
              <Header />
              <InboxNav />
              <Accepted />
            </>
          }
        />

        <Route
          path="/inbox/pending/requests"
          element={
            <>
              <Header />
              <InboxNav />
              <Requests />
            </>
          }
        />

        <Route
          path="/inbox/sent/request"
          element={
            <>
              <Header />
              <InboxNav />
              <Sent />
            </>
          }
        />


        <Route
          path="/search"
          element={
            <>
              <Header />
              <SearchNav />
              <Search />
            </>
          }
        />

        <Route
          path="/search/advance"
          element={
            <>
              <Header />
              <SearchNav />
              <AdvancedSearch />
            </>
          }
        />





        <Route
          path="/inbox/archieved/intrest"
          element={
            <>
              <Header />
              <InboxNav />
              <Deleted />
            </>
          }
        />

        <Route
          path="/my-shadi/my-contact/contact-filters"
          element={
            <>
              <Header />
              <SecondNav />
              <ContactFilters />
            </>
          }
        />

        <Route
          path="/my-shadi/setting/contact"
          element={
            <>
              <Header />
              <SecondNav />
              {/* <MyContactSettings /> */}
            </>
          }
        />

        {/* <Route
          path="/my-shadi/more"
          element={
            <>
              <Header />
              <SecondNav />
              <MyContactSettings />
            </>
          } */}
        {/* /> */}
      </Routes>
      {!isAdminPage && (isAuthenticated ? <AuthenticatedFooter /> : <Footer />)}
      <Toaster position="top-center" />

      {/* Global Chat Window — opens from anywhere via Redux openChatWith() */}
      {activeChatUser && (
        <ChatWindow
          targetUser={activeChatUser}
          onClose={() => dispatch(closeChatWindow())}
        />
      )}
    </div >
  );
}

export default App;
