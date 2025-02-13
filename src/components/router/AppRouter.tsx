// @ts-nocheck
// @ts-ignore
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// // no lazy loading for auth pages to avoid flickering
// const AuthLayout = React.lazy(
//   () => import("@app/components/layouts/AuthLayout/AuthLayout")
// );
// import LoginPage from "@app/pages/LoginPage";
// import SignUpPage from "@app/pages/SignUpPage";
// import ForgotPasswordPage from "@app/pages/ForgotPasswordPage";
// import SecurityCodePage from "@app/pages/SecurityCodePage";
// import NewPasswordPage from "@app/pages/NewPasswordPage";
// import LockPage from "@app/pages/LockPage";

// import MainLayout from "@app/components/layouts/main/MainLayout/MainLayout";

// import ProfileLayout from "@app/components/profile/ProfileLayout";
// import RequireAuth from "@app/components/router/RequireAuth";
// import { withLoading } from "@app/hocs/withLoading.hoc";
// import NftDashboardPage from "@app/pages/DashboardPages/HomePage";
// import MedicalDashboardPage from "@app/pages/DashboardPages/DashboardPage";

// const NewsFeedPage = React.lazy(() => import("@app/pages/NewsFeedPage"));
// const ServerErrorPage = React.lazy(() => import("@app/pages/ServerErrorPage"));
// const Error404Page = React.lazy(() => import("@app/pages/Error404Page"));
// const SecuritySettingsPage = React.lazy(
//   () => import("@app/pages/SecuritySettingsPage")
// );
// const UploadCVPage = React.lazy(() => import("@app/pages/UploadCVPage"));
// const Logout = React.lazy(() => import("./Logout"));
// const LandingPage = React.lazy(
//   () => import("@app/components/landing/LandingMain/LandingMain")
// );
// const JobsFeedPage = React.lazy(
//   () => import("@app/components/apps/jobsFeed/JobsFeed")
// );
// const HistoryJobsFeedPage = React.lazy(
//   () => import("@app/components/historyJobsFeed/HistoryJobsFeed")
// );
// const PersonalInfoPage = React.lazy(
//   () => import("@app/pages/PersonalInfoPage")
// );

// export const NFT_DASHBOARD_PATH = "/";
// export const MEDICAL_DASHBOARD_PATH = "/medical-dashboard";

// // const NewsFeed = withLoading(NewsFeedPage);
// const Landing = withLoading(LandingPage);
// const JobsFeed = withLoading(JobsFeedPage);
// const HistoryJobsFeed = withLoading(HistoryJobsFeedPage);
// const PersonalInfo = withLoading(PersonalInfoPage);

// const ServerError = withLoading(ServerErrorPage);
// const Error404 = withLoading(Error404Page);

// // Profile
// const SecuritySettings = withLoading(SecuritySettingsPage);
// const UploadCV = withLoading(UploadCVPage);

// const AuthLayoutFallback = withLoading(AuthLayout);
// const LogoutFallback = withLoading(Logout);
export const HOME_PATH = "/";

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>{/* Landing Page Route */}</Routes>
    </BrowserRouter>
  );
};
