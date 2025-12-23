
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Heart className="w-6 h-6 text-primary filled-current" fill="currentColor" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-purple-400">
                                Trusted Care Services
                            </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Connecting you with trusted professionals for all your care needs. From baby care to pet sitting, we've got you covered with verified experts.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Links</h3>
                        <ul className="space-y-2">
                            {['Home', 'Services', 'About', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link 
                                        href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Our Services</h3>
                        <ul className="space-y-2">
                            {['Baby Care', 'Elderly Care', 'Pet Care', 'Housekeeping'].map((item) => (
                                <li key={item}>
                                    <Link 
                                        href="/services" 
                                        className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                <span>123 Care Avenue, Suite 100<br />New York, NY 10001</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>support@trustedcareservices.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        © {currentYear} Trusted Care Services. All rights reserved.
                    </p>
                    
                    {/* Social Media */}
                    <div className="flex space-x-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a 
                                key={i}
                                href="#" 
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
