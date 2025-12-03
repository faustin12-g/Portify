import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle, center = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`${center ? 'text-center' : ''} mb-12`}
    >
      {subtitle && (
        <p className="text-primary-600 dark:text-primary-400 font-semibold mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mt-4 mx-auto"></div>
    </motion.div>
  );
};

export default SectionTitle;

