import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  className 
}) => {
  return (
    <motion.div 
      className={cn('mb-12 text-center', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="section-heading relative inline-block">
        {title}
        <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary-500/20 rounded-full" />
      </h2>
      {subtitle && (
        <p className="text-slate-600 dark:text-slate-400 md:text-lg max-w-2xl mx-auto mt-4">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;