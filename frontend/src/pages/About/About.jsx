import { motion } from 'framer-motion'
import { Sparkles, Target, Users, Award, Globe, Heart } from 'lucide-react'

const About = () => {
  const values = [
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI to transform career development'
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Data-driven insights for accurate career guidance'
    },
    {
      icon: Users,
      title: 'Empowerment',
      description: 'Helping individuals achieve their career goals'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Delivering premium quality career intelligence'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making career coaching available to everyone'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Dedicated to helping people succeed in their careers'
    }
  ]

  const timeline = [
    {
      year: '2024',
      title: 'Founded',
      description: 'CareerCoach AI was born with a vision to democratize career coaching'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Integrated Google Gemini API for advanced resume analysis'
    },
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'Launched the full platform with comprehensive career tools'
    },
    {
      year: '2025',
      title: 'Global Reach',
      description: 'Expanded to serve users across multiple countries'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-16">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              About Us
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Empowering careers through AI-driven intelligence and personalized guidance
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-dark rounded-3xl p-12 mb-16 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            At CareerCoach AI, we believe everyone deserves access to quality career guidance. 
            Our mission is to democratize career coaching by leveraging artificial intelligence to 
            provide personalized, actionable insights that help individuals achieve their professional goals. 
            We combine cutting-edge technology with human expertise to deliver a platform that's both 
            powerful and easy to use.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center mb-4 shadow-xl">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-600 to-secondary-600" />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="glass-dark rounded-2xl p-6 border border-white/10">
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-semibold text-white mt-2 mb-2">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full border-4 border-slate-900" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass-dark rounded-3xl p-12 border border-white/10"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Team</h2>
          <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto">
            Our team consists of AI researchers, career coaches, software engineers, and industry experts 
            who are passionate about helping people succeed. We bring together diverse perspectives and 
            expertise to create a platform that truly makes a difference in people's careers.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default About
