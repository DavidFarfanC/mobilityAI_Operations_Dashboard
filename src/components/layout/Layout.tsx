import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-graphite text-white">
      <div className="fixed inset-0 pointer-events-none opacity-60 dot-grid" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default Layout;
