import React from 'react';
import { motion } from 'framer-motion';

const SupabaseHelp = () => {
    return (
        <div className="pt-24 pb-12 px-6 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <motion.div
                className="max-w-4xl mx-auto space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                        Supabase Integration
                    </h1>
                    <p className="text-xl text-gray-300">
                        Powering Next-Gen Applications with Open Source Magic
                    </p>
                </div>

                {/* Introduction Card */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-300"
                    whileHover={{ y: -5 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-green-400">What is Supabase?</h2>
                    <p className="text-gray-300 leading-relaxed">
                        Supabase is an open-source Firebase alternative. We use it in this project to provide:
                    </p>
                    <ul className="list-disc list-inside mt-4 space-y-2 text-gray-300">
                        <li><span className="text-white font-medium">Real-time Database:</span> Instant data synchronization.</li>
                        <li><span className="text-white font-medium">Authentication:</span> Secure user logins and management.</li>
                        <li><span className="text-white font-medium">Storage:</span> Managing large files like artwork images.</li>
                    </ul>
                </motion.div>

                {/* Code Snippet Card */}
                <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
                >
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">How We Use It</h2>
                    <p className="text-gray-300 mb-4">
                        Here is how we initialize the connection in <code className="bg-black/30 px-2 py-1 rounded text-sm text-green-300">src/lib/supabaseClient.js</code>:
                    </p>
                    <div className="bg-black/80 rounded-lg p-6 overflow-x-auto relative group">
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <pre className="text-sm font-mono text-gray-300 pt-4">
                            {`import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);`}
                        </pre>
                    </div>
                </motion.div>

                {/* Resources Card */}
                <motion.div
                    className="grid md:grid-cols-2 gap-6"
                >
                    <a
                        href="https://supabase.com/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:bg-green-500/10 hover:border-green-500/50 transition-all group"
                    >
                        <h3 className="text-xl font-bold mb-2 group-hover:text-green-400">Documentation &rarr;</h3>
                        <p className="text-gray-400 text-sm">Read the official guides and references.</p>
                    </a>

                    <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-2 text-purple-400">Project Status</h3>
                        <div className="flex items-center space-x-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-gray-300 text-sm">Supabase Client Integrated</span>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default SupabaseHelp;
