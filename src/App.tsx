import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "@/pages/dashboard.tsx";
import {BookOpen, GraduationCap, Home, Building2} from "lucide-react";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import SubjectsList from "@/pages/subjects/list.tsx";
import SubjectsCreate from "@/pages/subjects/create.tsx";
import ClassList from "@/pages/classes/list.tsx";
import ClassesCreate from "@/pages/classes/create.tsx";
import DepartmentsList from "@/pages/departments/list.tsx";
import DepartmentCreate from "@/pages/departments/create.tsx";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "MCd8zP-RCENW6-G5ZB75",
              }}
              resources={[
                  {
                      name: 'dashboard',
                      list: '/',
                      meta: { label: 'Home', icon: <Home /> }
                  },
                  {
                      name: 'subjects',
                      list: '/subjects',
                      create: '/subjects/create',
                      show: '/subjects/show/:id',
                      meta: {
                          label: 'Subjects',
                          icon: <BookOpen />
                      }
                  },
                  {
                      name: 'classes',
                      list: '/classes',
                      create: '/classes/create',
                      show: '/classes/show/:id',
                      meta: {
                          label: 'Classes',
                          icon: <GraduationCap />
                      }
                  },
                  {
                      name: "departments",
                      list: "/departments",
                      show: "/departments/show/:id",
                      create: "/departments/create",
                      meta: {
                          label: "Departments",
                          icon: <Building2 />,
                      },
                  }
              ]}
            >
              <Routes>
                  <Route element={
                      <Layout>
                          <Outlet />
                       </Layout>
                  }>
                   <Route path={"/"} element={<Dashboard />} />
                      <Route path="subjects">
                          <Route index element={<SubjectsList />} />
                           <Route path="create" element={<SubjectsCreate />} />
                      </Route>

                      <Route path="classes">
                          <Route index element={<ClassList />} />
                          <Route path="create" element={<ClassesCreate />} />
                      </Route>

                      <Route path="departments">
                          <Route index element={<DepartmentsList />} />
                          <Route path="create" element={<DepartmentCreate />} />
                      </Route>
                  </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
