import Navbar from "./components/Navbar.component";
import { Route, Routes } from "react-router-dom";
import UserAuthForm from "./pages/UserAuthForm.page";
import EditorPage from "./pages/editor.pages";
import RequireAuth from "./common/RequireAuth";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import Error404 from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import EditorContextProvider from "./context/editor.context";
import SideNavbar from "./components/sidenavbar.component";
import EditProfile from "./pages/edit-profile.page";
import ChangePassword from "./pages/change-password.page";
import NotificationsPage from "./pages/notifications.page";
import ManageBlogPage from "./pages/manage-blogs.page";
import { useContext } from "react";
import { UserContext } from "./context/user.context";
import Payment from "./pages/payment.page";
import BecomeEditor from "./components/become-editor.component";
import BlogEditors from "./pages/blog-editors.page";
import TextToAdmin from "./pages/text-to-admin.page";
import ScrollToTop from "./common/scrollToTop";

const App = () => {
  const { userAuth } = useContext(UserContext);
  // console.log(userAuth.isEditor);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="users/:username" element={<ProfilePage />} />
          <Route path="blogs/:blogId" element={<BlogPage />} />

          {/* ======= Payment Routes ======== */}

          <Route path="payment" element={<Payment />} />
          {userAuth?.isEditor === false && (
            <Route path="becomeEditor" element={<BecomeEditor />} />
          )}

          {/* ======= Admin Dashboard Routes ======== */}

          <Route
            path="adminDashboard"
            element={
              <RequireAuth>
                <SideNavbar />
              </RequireAuth>
            }
          >
            <Route path="editors" element={<BlogEditors />} />
            <Route path="editors-blogs" element={<ManageBlogPage />} />
            <Route path="editor-activity" element={<NotificationsPage />} />
          </Route>

          {/* ======= Dashboard Routes ======== */}

          <Route
            path="dashboard"
            element={
              !userAuth?.email ? (
                <RequireAuth>
                  <SideNavbar />
                </RequireAuth>
              ) : (
                <SideNavbar />
              )
            }
          >
            <Route path="notifications" element={<NotificationsPage />} />
            {userAuth.isEditor && (
              <Route path="blogs" element={<ManageBlogPage />} />
            )}
          </Route>

          {/* ======= Messaging Routes ======== */}

          <Route
            path="message"
            element={
              !userAuth?.email ? (
                <RequireAuth>
                  <SideNavbar />
                </RequireAuth>
              ) : (
                <SideNavbar />
              )
            }
          >
            <Route path="notifying" element={<TextToAdmin />} />
          </Route>

          {/* ======= Setting Routes ======== */}

          <Route
            path="settings"
            element={
              !userAuth?.email ? (
                <RequireAuth>
                  <SideNavbar />
                </RequireAuth>
              ) : (
                <SideNavbar />
              )
            }
          >
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />{" "}
          </Route>

          {/* ======= Editor Routes ======== */}

          <Route
            path="editor"
            element={
              <RequireAuth>
                <EditorContextProvider>
                  <EditorPage />
                </EditorContextProvider>
              </RequireAuth>
            }
          />
          <Route
            path="editor/:blogId"
            element={
              <RequireAuth>
                <EditorContextProvider>
                  <EditorPage />
                </EditorContextProvider>
              </RequireAuth>
            }
          />
          {/* ======= Auth Routes ======== */}

          <Route path="login" element={<UserAuthForm type="login" />} />
          <Route path="signup" element={<UserAuthForm type="signup" />} />
          {/* ============ ERROR ROUTES ============= */}
          <Route path="*" element={<Error404 />} />
          <Route path="/error404" element={<Error404 />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
