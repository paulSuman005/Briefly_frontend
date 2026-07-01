// NotFoundPage.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-base-100">
      {/* Background Loader – smaller, still centered */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Loader size={180} />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-10 max-w-md w-full text-center"
        >
          <h1 className="text-6xl font-extrabold tracking-tight text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-white/90 mb-3">
            Page not found
          </h2>
          <p className="text-base text-white/60 mb-8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-blue-500/30"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;