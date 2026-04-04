import { Routes, Route, Outlet } from "react-router";

function RootLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return <h1>Home</h1>;
}

function NotFound() {
  return <h1>404 - Not Found</h1>;
}

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
