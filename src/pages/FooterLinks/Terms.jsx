import React from 'react';
import { FaFileContract } from 'react-icons/fa';

const Terms = () => {
  return (
    <div className="container bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-orange-600 px-8 py-10 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaFileContract className="text-3xl"/>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-2">Terms and Conditions</h1>
          <p className="text-red-100 font-medium text-lg">Brainy Toys (Vardhman International)</p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
          
          {/* General Terms */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              General Terms and Conditions
            </h2>
            <p className="mb-3">
              It is essential to thoroughly review these terms and conditions prior to utilizing our website, “www.brainytoys.in,” which is operated by “Vardhman International, hereinafter referred to as brainytoys.
            </p>
            <p className="mb-3">
              brainytoys reserves the right to change or revise the terms and conditions of this agreement at any time by posting updates on the website. Changes take effect immediately upon publication. Your continued use of the website indicates your acceptance of these changes.
            </p>
            <p className="mb-3">
              We recommend reviewing the agreement periodically to stay informed. This agreement does not affect any other agreements you may have with brainytoys. If you do not accept this agreement or any policies, please stop using the website immediately.
            </p>
            <p>
              By using this website, you confirm that you have read, understood, and agree to comply with the terms of this Agreement. Brainytoys grants access to this website, along with its products and services, only to those who accept its terms.
            </p>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Privacy Policy
            </h2>
            <p className="mb-3">
              Brainytoys is committed to protecting user privacy and ensuring the safety of your data during all transactions. We will never disclose your account details to any third party, regardless of the situation.
            </p>
          </section>

          {/* Age Restrictions */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Age Restrictions
            </h2>
            <p className="mb-3">
              You must be a minimum of 18 years old to access this website. By using this website, you confirm that you are at least 18 years of age and are legally capable of agreeing to this Agreement.
            </p>
            <p>
              Vardhman International accepts no liability for any issues arising from age misrepresentation. If you are accessing the website on behalf of an organization, you must possess the authority to bind that organization to these Terms.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Intellectual Property
            </h2>
            <p className="mb-3">
              Brainytoys holds proprietary rights and trade secrets for the products and services posted by sellers on created using our templates. You may not copy or reproduce product images or content without obtaining written consent from brainytoys or concerned seller on our website.
            </p>
            <p className="mb-3">
              Additionally, this website not only provides access to products and services but also offers a platform for various sellers users to sell their products/toys and showcase their offerings. All images and content posted are the proprietary rights of either brainytoys or the individual/company that published them.
            </p>
            <p>
              Unauthorized use of this material may violate copyright, trademark, and other applicable laws. By using this website, you agree not to reproduce or redistribute any published content or intellectual property in any form, including electronic, digital, or through new trademark registrations.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              User Accounts
            </h2>
            <p className="mb-3">
              As a user of this website, you may need to register and provide personal information. Registration is free. You are responsible for ensuring the accuracy of this information and for maintaining the security of your account.
            </p>
            <p className="mb-3">
              Additionally, you are accountable for all activities that occur under your account or password. If you have any concerns about the security of your account on our website, please let us know right away so we can address them.
            </p>
            <p>
              We reserve the right to terminate accounts, edit or remove content, and cancel orders at our discretion.
            </p>
          </section>

          {/* Applicable Law & Disputes */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Applicable Law & Disputes
            </h2>
            <p className="mb-3">
              By using this website, you agree that the digital laws applicable in India, without regard to conflict of law principles, will govern these terms and conditions, as well as any disputes that may arise between Vardhman International and you, or its business partners and associates.
            </p>
            <p className="mb-3">
              Any dispute related in any way to your use of this website or any subscription you purchase from a channel partner shall be arbitrated in Gurugram, Haryana, India.
            </p>
            <p>
              You consent to the exclusive jurisdiction of the courts in the District of Gurugram, Haryana, India.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Indemnification
            </h2>
            <p className="mb-3">
              You agree to release, indemnify, defend, and hold harmless brainytoys along with its contractors, agents, employees, officers, owners, shareholders, affiliates, and assigns from all liabilities, claims, damages, costs, and expenses, including reasonable attorneys' fees, arising from or related to:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>This Agreement or any breach of your warranties, representations, and obligations under it.</li>
                <li>The content of the Website or your use of that content.</li>
                <li>The Products or your use of the Products, including any Trial Products.</li>
                <li>Any intellectual property or other proprietary rights of any person or entity.</li>
                <li>Your violation of any provision of this Agreement.</li>
                <li>Any information or data you provided to brainytoys.</li>
            </ol>
          </section>

          {/* Liability Limitation & Force Majeure */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Liability & Force Majeure
            </h2>
            <p className="mb-3">
              <strong>Liability Limitation:</strong> If you misuse our website or get bad results, Vardhman International is not responsible for any damages you may sustain.
            </p>
            <p>
              <strong>Clause of Force Majeure:</strong> In the event of an earthquake, flood, fire, storm, natural catastrophe, act of God, war, terrorism, armed conflict, labor strike, lockout, or boycott, brainytoys will not be considered in default under this agreement or held accountable for any halt, interruption, or delay in the execution of its responsibilities under it.
            </p>
          </section>

          {/* Operation Termination & Governing Law */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              Operation Termination & Jurisdiction
            </h2>
            <p className="mb-3">
              Brainytoys has the right to stop operating the website and distributing the goods and services at any time, in its own discretion, and without giving you any prior notice.
            </p>
            <p>
              This website is based in Gurugram, India (Haryana State). In spite of the state's conflict of law provisions, this agreement will be regulated by the laws of Haryana State, and any disputes will only be brought before the Gurgaon District courts.
            </p>
          </section>

          {/* Contact Info */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Contact Info
            </h2>
            <div className="space-y-2 text-sm md:text-base">
                <p><strong>Regd. & Admn. Office:</strong> Vardhman International</p>
                <p>D-252, Sushant Lok-II, Gurugram: 122011 (Haryana) India</p>
                <p><strong>Email:</strong> <a href="mailto:brainytoys9@gmail.com" className="text-blue-600 hover:underline">Brainytoys9@gmail.com</a></p>
                <p><strong>Phone:</strong> +91 - 8750-052-475</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;