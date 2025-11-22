import { motion } from 'framer-motion';
import { MapIcon } from '../ui/icons';

function Navbar() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-graphite/70 border-b border-slate/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-accent/10 border border-accent/40 grid place-items-center shadow-glass">
            <MapIcon className="h-6 w-6 text-accent" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Mobility AI</p>
            <h1 className="text-xl font-semibold font-display">Operaciones | Metro CDMX</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-3 py-2 rounded-xl bg-slate/70 border border-slate/60"
          >
            Línea 1 · Simulación en vivo
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
