import { useState, useRef, useEffect, useCallback } from 'react';
import { renderSkillIcon } from '../../utils/skillIcons';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const PREDEFINED_SKILLS = [
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Vue.js',
  'Angular',
  'Svelte',
  'Node.js',
  'Express',
  'Django',
  'Flask',
  'FastAPI',
  'Python',
  'Java',
  'C#',
  'C++',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'Dart',
  'Flutter',
  'React Native',
  'Tailwind CSS',
  'Bootstrap',
  'Sass',
  'Git',
  'GitHub',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Firebase',
  'GraphQL',
  'REST API',
  'Jest',
  'Cypress',
  'Selenium',
  'Webpack',
  'Vite',
  'NPM',
  'Yarn',
  'Linux',
  'Windows',
  'macOS',
  'VS Code',
  'Figma',
  'Adobe XD',
  'TensorFlow',
  'PyTorch',
  'Machine Learning',
  'Data Science',
  'Blockchain',
  'Solidity',
  'Ethereum',
  'Web3',
  'NFT',
  'DevOps',
  'CI/CD',
  'Jenkins',
  'GitLab',
  'Bitbucket',
  'Jira',
  'Agile',
  'Scrum',
];

const SkillSelector = ({ value, onChange, onBlur, error, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Filter skills based on search term
  const filteredSkills = PREDEFINED_SKILLS.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if search term matches a predefined skill exactly
  const exactMatch = PREDEFINED_SKILLS.find(
    (skill) => skill.toLowerCase() === searchTerm.toLowerCase()
  );

  // Show preview if there's a value
  useEffect(() => {
    setShowPreview(searchTerm.length > 0);
  }, [searchTerm]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev < filteredSkills.length - 1 ? prev + 1 : prev;
        if (listRef.current) {
          const items = listRef.current.children;
          if (items[next]) {
            items[next].scrollIntoView({ block: 'nearest' });
          }
        }
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : -1;
        if (listRef.current && next >= 0) {
          const items = listRef.current.children;
          if (items[next]) {
            items[next].scrollIntoView({ block: 'nearest' });
          }
        }
        return next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSkills[highlightedIndex]) {
        handleSelect(filteredSkills[highlightedIndex]);
      } else if (exactMatch) {
        handleSelect(exactMatch);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSelect = (skill) => {
    setSearchTerm(skill);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onChange(skill);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // Debounced search
  const debouncedOnChange = useCallback((newValue) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 150);
  }, [onChange]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    debouncedOnChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onChange('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          required={required}
          className={`w-full px-4 py-3 pr-10 border ${
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white`}
          placeholder="Type to search or select a skill..."
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Preview */}
      {showPreview && searchTerm && (
        <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center text-2xl text-primary-600 dark:text-primary-400">
              {renderSkillIcon(searchTerm, 'w-10 h-10')}
            </div>
            <div>
              <span className="font-semibold text-gray-900 dark:text-white">{searchTerm}</span>
              {exactMatch && (
                <span className="ml-2 text-xs text-green-600 dark:text-green-400">(Predefined)</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-64 overflow-hidden"
          >
            <div
              ref={listRef}
              className="overflow-y-auto max-h-64 custom-scrollbar"
            >
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, index) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSelect(skill)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors ${
                      highlightedIndex === index
                        ? 'bg-primary-50 dark:bg-primary-900/20'
                        : ''
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-lg text-primary-600 dark:text-primary-400">
                      {renderSkillIcon(skill, 'w-6 h-6')}
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{skill}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No skills found</p>
                  <p className="text-sm mt-1">You can type a custom skill name</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default SkillSelector;

