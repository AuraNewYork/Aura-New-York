import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { Skeleton } from './components/Skeleton'

const HomePage = lazy(() => import('./pages/Home'))
const AvailabilityPage = lazy(() => import('./pages/Availability'))
const BuildingsPage = lazy(() => import('./pages/Buildings'))
const BuildingDetailPage = lazy(() => import('./pages/BuildingDetail'))
const AboutPage = lazy(() => import('./pages/About'))
const LandlordsPage = lazy(() => import('./pages/Landlords'))
const ContactPage = lazy(() => import('./pages/Contact'))
const TestimonialsPage = lazy(() => import('./pages/Testimonials'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))
const AdminBuildingsPage = lazy(() => import('./admin/AdminBuildings'))
const AdminPhotosPage = lazy(() => import('./admin/AdminPhotos'))
const AdminContentPage = lazy(() => import('./admin/AdminContent'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="space-y-4 w-full max-w-md px-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: '/availability', element: <Suspense fallback={<PageLoader />}><AvailabilityPage /></Suspense> },
      { path: '/buildings', element: <Suspense fallback={<PageLoader />}><BuildingsPage /></Suspense> },
      { path: '/buildings/:slug', element: <Suspense fallback={<PageLoader />}><BuildingDetailPage /></Suspense> },
      { path: '/about', element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
      { path: '/landlords', element: <Suspense fallback={<PageLoader />}><LandlordsPage /></Suspense> },
      { path: '/contact', element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense> },
      { path: '/testimonials', element: <Suspense fallback={<PageLoader />}><TestimonialsPage /></Suspense> },
      { path: '/admin/buildings', element: <Suspense fallback={<PageLoader />}><AdminBuildingsPage /></Suspense> },
      { path: '/admin/photos', element: <Suspense fallback={<PageLoader />}><AdminPhotosPage /></Suspense> },
      { path: '/admin/content', element: <Suspense fallback={<PageLoader />}><AdminContentPage /></Suspense> },
      { path: '*', element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense> },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
