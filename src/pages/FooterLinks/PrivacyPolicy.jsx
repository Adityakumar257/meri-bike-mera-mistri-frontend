import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <div className="container bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-orange-600 px-8 py-10 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaShieldAlt className="text-3xl"/>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-2">Privacy Policy</h1>
          <p className="text-red-100 font-medium text-lg">Brainy Toys (operated by Vardhman International)</p>
          <p className="text-sm mt-4 opacity-80">Last updated: Jan 10, 2026</p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
          
          {/* Introduction */}
          <section>
            <p className="mb-4">
              Welcome to <strong>Brainy Toys</strong> (operated by <strong>Vardhman International</strong>).
            </p>
            <p className="mb-4">
              Your privacy is important to us, and this Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website <strong>www.brainytoys.in</strong>, purchase products, or enroll in workshops.
            </p>
            <p>
              By accessing or using our website, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              1. Information We Collect
            </h2>
            <p className="mb-4">We may collect the following types of information:</p>
            
            <div className="ml-4 md:ml-6 mb-4">
                <h3 className="font-bold text-gray-800 mb-2">a. Personal Information</h3>
                <p className="mb-2">When you register, place an order, contact us, or enroll in workshops, we may collect:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Billing and shipping address</li>
                    <li>Payment details (processed securely via third-party payment gateways)</li>
                    <li>Child’s name and age (only for workshop registration)</li>
                </ul>
            </div>

            <div className="ml-4 md:ml-6">
                <h3 className="font-bold text-gray-800 mb-2">b. Non-Personal Information</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Browser type and version</li>
                    <li>IP address</li>
                    <li>Device information</li>
                    <li>Pages visited and time spent on the website</li>
                    <li>Cookies and usage data</li>
                </ul>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              2. How We Use Your Information
            </h2>
            <p className="mb-3">We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Process orders and payments</li>
                <li>Deliver products and workshop services</li>
                <li>Communicate order updates and support requests</li>
                <li>Improve our website, products, and services</li>
                <li>Send promotional emails or offers (only if you opt in)</li>
                <li>Ensure legal and regulatory compliance</li>
            </ul>
          </section>

          {/* 3. Children’s Privacy */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              3. Children’s Privacy
            </h2>
            <p className="mb-4">
              Brainy Toys provides educational products and workshops for children. We <strong>do not knowingly collect personal data from children without parental or guardian consent</strong>.
            </p>
            <p className="mb-4">
              Any child-related information is collected <strong>only from parents or legal guardians</strong> during registration.
            </p>
            <p>
              If you believe your child’s information has been provided without consent, please contact us immediately, and we will delete it.
            </p>
          </section>

          {/* 4. Cookies and Tracking Technologies */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="mb-3">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Enhance user experience</li>
                <li>Analyze website traffic</li>
                <li>Remember user preferences</li>
            </ul>
            <p>
              You can disable cookies through your browser settings, though some features of the website may not function properly.
            </p>
          </section>

          {/* 5. Sharing of Information */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              5. Sharing of Information
            </h2>
            <p className="mb-4">
              We <strong>do not sell, rent, or trade</strong> your personal information.
            </p>
            <p className="mb-3">We may share your data only with:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Trusted service providers (payment gateways, logistics partners)</li>
                <li>Legal or regulatory authorities when required by law</li>
                <li>Internal teams for operational purposes</li>
            </ul>
            <p>All third parties are required to maintain confidentiality and security.</p>
          </section>

          {/* 6. Payment Security */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              6. Payment Security
            </h2>
            <p>
              All online payments are processed through <strong>secure, PCI-compliant third-party payment gateways</strong>. We do not store your credit/debit card details on our servers.
            </p>
          </section>

          {/* 7. Data Protection and Security */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              7. Data Protection and Security
            </h2>
            <p className="mb-3">
              We implement appropriate technical and organizational security measures to protect your personal data from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Unauthorized access</li>
                <li>Loss or misuse</li>
                <li>Alteration or disclosure</li>
            </ul>
            <p>However, no method of transmission over the internet is 100% secure.</p>
          </section>

          {/* 8. Your Rights */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              8. Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Access your personal data</li>
                <li>Request correction or deletion of your information</li>
                <li>Withdraw consent for marketing communications</li>
            </ul>
            <p>To exercise these rights, contact us using the details below.</p>
          </section>

          {/* 9. Third-Party Links */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              9. Third-Party Links
            </h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.
            </p>
          </section>

          {/* 10. Changes to This Privacy Policy */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              10. Changes to This Privacy Policy
            </h2>
            <p className="mb-4">
              We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with the updated date.
            </p>
            <p>We encourage you to review this policy periodically.</p>
          </section>

          {/* 11. Contact Us */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              11. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-2 text-sm md:text-base">
                <p><strong>Brainy Toys (Vardhman International)</strong></p>
                <p><strong>Website:</strong> <a href="https://www.brainytoys.in" className="text-blue-600 hover:underline">www.brainytoys.in</a></p>
                <p><strong>Email:</strong> <a href="mailto:info@brainytoys.in" className="text-blue-600 hover:underline">info@brainytoys.in</a></p>
                <p><strong>Phone:</strong> +91 87500 52475</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;