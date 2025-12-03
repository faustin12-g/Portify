import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  BoltIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  PaintBrushIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: <CodeBracketIcon className="w-8 h-8" />,
      title: 'Easy Setup',
      description: 'Get your portfolio online in minutes with our intuitive interface.',
    },
    {
      icon: <PaintBrushIcon className="w-8 h-8" />,
      title: 'Beautiful Design',
      description: 'Professional, modern templates that showcase your work perfectly.',
    },
    {
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      title: 'Fast & Responsive',
      description: 'Lightning-fast loading times and mobile-friendly designs.',
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Secure & Reliable',
      description: 'Your data is safe with enterprise-grade security and backups.',
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: 'Custom Domain',
      description: 'Use your own domain or get a free subdomain for your portfolio.',
    },
    {
      icon: <BoltIcon className="w-8 h-8" />,
      title: 'SEO Optimized',
      description: 'Built-in SEO features to help you rank higher in search results.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      content: 'This platform made it so easy to showcase my projects. My portfolio looks professional and I got more job offers!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'UI/UX Designer',
      content: 'The design options are amazing. I love how customizable everything is. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Full Stack Developer',
      content: 'Best portfolio platform I\'ve used. The user experience is fantastic and the support is excellent.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'How do I get started?',
      answer: 'Simply sign up for a free account, verify your email, and start building your portfolio. It takes just a few minutes!',
    },
    {
      question: 'Is it really free?',
      answer: 'Yes! Our free plan includes everything you need to create a professional portfolio. No credit card required.',
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes, you can connect your own custom domain to your portfolio. We provide step-by-step instructions.',
    },
    {
      question: 'How long does approval take?',
      answer: 'Account approval typically takes 24-48 hours. Once approved, you\'ll have full access to your dashboard.',
    },
    {
      question: 'Can I export my portfolio?',
      answer: 'Yes, you can export your portfolio data at any time. We believe in data portability.',
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Our platform is fully responsive and works great on mobile browsers. A native app is coming soon!',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Build Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Portfolio
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Create a stunning portfolio in minutes. Showcase your work, skills, and experience
              with our professional platform designed for creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 1,
                    image: '/images/hero/hero-1.jpg',
                    fallback: '/images/hero/hero-1.png',
                    alt: 'Portfolio Hero Section',
                  },
                  {
                    id: 2,
                    image: '/images/hero/hero-2.jpg',
                    fallback: '/images/hero/hero-2.png',
                    alt: 'Portfolio Projects Showcase',
                  },
                  {
                    id: 3,
                    image: '/images/hero/hero-3.jpg',
                    fallback: '/images/hero/hero-3.png',
                    alt: 'Portfolio Skills Section',
                  },
                ].map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + item.id * 0.1 }}
                    className="bg-white dark:bg-gray-700 rounded-lg p-2 shadow-md overflow-hidden group hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48 rounded overflow-hidden mb-3">
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Try fallback image
                          if (e.target.src !== item.fallback) {
                            e.target.src = item.fallback;
                          } else {
                            // If both fail, show placeholder
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="h-full bg-gradient-to-br from-blue-200 to-purple-200 rounded flex items-center justify-center">
                                <div class="text-center p-4">
                                  <p class="text-gray-600 text-sm">Add image: ${item.image}</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <div className="px-2 pb-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features to showcase your work professionally
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get your portfolio online in three simple steps with Portfy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up & Verify',
                description: 'Create your account and verify your email address. Wait for admin approval.',
              },
              {
                step: '2',
                title: 'Build Your Portfolio',
                description: 'Add your projects, skills, experience, and education. Customize everything to match your style.',
              },
              {
                step: '3',
                title: 'Publish & Share',
                description: 'Generate your unique portfolio URL and share it with the world!',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Creators
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our users are saying
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start free, upgrade when you need more
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-blue-500"
            >
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Free Plan
                </h3>
                <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  $0
                  <span className="text-xl text-gray-600 dark:text-gray-400">/month</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Perfect for getting started
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited projects',
                  'Custom portfolio URL',
                  'All portfolio sections',
                  'Social media integration',
                  'Email support',
                  'Mobile responsive',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="block w-full text-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ArrowRightIcon
                    className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Build Your Portfolio with Portfy?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of creators showcasing their work
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Building Now
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

