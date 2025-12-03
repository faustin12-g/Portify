import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNode,
  FaPython,
  FaJava,
  FaGitAlt,
  FaGithub,
  FaDocker,
  FaAws,
  FaFigma,
  FaBootstrap,
  FaSass,
  FaNpm,
  FaYarn,
} from 'react-icons/fa';
import {
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiDjango,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiTailwindcss,
  SiVite,
  SiExpress,
  SiFlask,
  SiFastapi,
  SiGraphql,
  SiApollographql,
  SiFirebase,
  SiVercel,
  SiNetlify,
  SiHeroku,
  SiJest,
  SiTestinglibrary,
  SiCypress,
  SiSelenium,
  SiWebpack,
  SiBabel,
  SiEslint,
  SiPrettier,
  SiJquery,
  SiAngular,
  SiVuedotjs,
  SiNuxtdotjs,
  SiSvelte,
  SiKotlin,
  SiSwift,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiCplusplus,
  SiDotnet,
  SiTensorflow,
  SiPytorch,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
} from 'react-icons/si';
import { TbBrandReactNative } from 'react-icons/tb';

// Default icon component
const DefaultIcon = ({ className }) => (
  <div className={`${className} bg-gray-400 rounded flex items-center justify-center text-white font-bold`}>
    ?
  </div>
);

// Skill name to icon mapping
const skillIconMap = {
  // Web Technologies
  html: FaHtml5,
  html5: FaHtml5,
  css: FaCss3Alt,
  css3: FaCss3Alt,
  javascript: SiJavascript,
  js: FaJs,
  typescript: SiTypescript,
  ts: SiTypescript,
  
  // Frameworks & Libraries
  react: FaReact,
  'react.js': FaReact,
  reactjs: FaReact,
  next: SiNextdotjs,
  nextjs: SiNextdotjs,
  'next.js': SiNextdotjs,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs,
  angular: SiAngular,
  svelte: SiSvelte,
  nuxt: SiNuxtdotjs,
  nuxtjs: SiNuxtdotjs,
  jquery: SiJquery,
  
  // Mobile
  'react native': TbBrandReactNative,
  reactnative: TbBrandReactNative,
  'react-native': TbBrandReactNative,
  
  // Backend
  node: FaNode,
  nodejs: FaNode,
  'node.js': FaNode,
  express: SiExpress,
  django: SiDjango,
  flask: SiFlask,
  fastapi: SiFastapi,
  python: FaPython,
  java: FaJava,
  go: SiGo,
  rust: SiRust,
  php: SiPhp,
  ruby: SiRuby,
  'c++': SiCplusplus,
  cpp: SiCplusplus,
  csharp: SiDotnet,
  'c#': SiDotnet,
  dotnet: SiDotnet,
  '.net': SiDotnet,
  
  // Databases
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  mongodb: SiMongodb,
  mongo: SiMongodb,
  redis: SiRedis,
  
  // Tools & Services
  git: FaGitAlt,
  github: FaGithub,
  docker: FaDocker,
  aws: FaAws,
  firebase: SiFirebase,
  vercel: SiVercel,
  netlify: SiNetlify,
  heroku: SiHeroku,
  
  // Styling
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  bootstrap: FaBootstrap,
  sass: FaSass,
  
  // Build Tools
  vite: SiVite,
  webpack: SiWebpack,
  babel: SiBabel,
  npm: FaNpm,
  yarn: FaYarn,
  
  // Testing
  jest: SiJest,
  'testing library': SiTestinglibrary,
  cypress: SiCypress,
  selenium: SiSelenium,
  
  // Code Quality
  eslint: SiEslint,
  prettier: SiPrettier,
  
  // APIs
  graphql: SiGraphql,
  apollo: SiApollographql,
  
  // OS - using default icon for OS names
  
  // IDEs - using default icon for VS Code/Visual Studio
  
  // Design
  figma: FaFigma,
  
  // ML/AI
  tensorflow: SiTensorflow,
  pytorch: SiPytorch,
  pandas: SiPandas,
  numpy: SiNumpy,
  'scikit-learn': SiScikitlearn,
  sklearn: SiScikitlearn,
  
  // Mobile Native
  kotlin: SiKotlin,
  swift: SiSwift,
};

/**
 * Get icon component for a skill name
 * @param {string} skillName - The name of the skill
 * @returns {React.Component} Icon component
 */
export const getSkillIcon = (skillName) => {
  if (!skillName) return DefaultIcon;
  
  const normalizedName = skillName.toLowerCase().trim();
  
  // Direct match
  if (skillIconMap[normalizedName]) {
    return skillIconMap[normalizedName];
  }
  
  // Partial match (e.g., "React.js" contains "react")
  for (const [key, Icon] of Object.entries(skillIconMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return Icon;
    }
  }
  
  // Return default if no match
  return DefaultIcon;
};

/**
 * Render skill icon with styling
 * @param {string} skillName - The name of the skill
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} Rendered icon
 */
export const renderSkillIcon = (skillName, className = 'w-8 h-8') => {
  const Icon = getSkillIcon(skillName);
  return <Icon className={className} />;
};

export default getSkillIcon;

