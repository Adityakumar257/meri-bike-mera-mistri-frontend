import React from 'react';
import { FaUndo, FaExclamationTriangle } from 'react-icons/fa';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen container bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-orange-600 px-8 py-10 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaUndo className="text-3xl"/>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-2">Return & Refund Policy</h1>
          <p className="text-red-100 font-medium text-lg">BrainyToys (Vardhman International)</p>
          <p className="text-sm mt-4 opacity-80">Last updated: Jan 10, 2026</p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
          
          {/* Intro */}
          <section>
            <p className="mb-2">
              At <strong>BrainyToys (Vardhman International)</strong>, we strive to ensure complete customer satisfaction.
            </p>
            <p className="mb-2">
              If you are not fully satisfied with your purchase, we’re here to help. Please read our Return & Refund Policy carefully.
            </p>
          </section>

          {/* 1. Eligibility for Returns */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              1. Eligibility for Returns
            </h2>
            <p className="mb-3">We accept returns only under the following conditions:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>The product is <strong>damaged, defective, or incorrect</strong> at the time of delivery.</li>
                <li>The return request is raised <strong>within 7 days</strong> of receiving the product.</li>
                <li>The product is <strong>unused, unassembled, and in original condition</strong>, with all original packaging, manuals, accessories, and invoice intact.</li>
            </ul>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 flex items-start gap-3">
                <FaExclamationTriangle className="text-orange-500 mt-1 shrink-0" />
                <p className="text-sm text-orange-800">
                    <strong>Note:</strong> Products showing signs of use, damage caused after delivery, or missing parts will not be eligible for return.
                </p>
            </div>
          </section>

          {/* 2. Non-Returnable Items */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              2. Non-Returnable Items
            </h2>
            <p className="mb-3">The following items are <strong>not eligible for return or refund</strong>:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Opened or used DIY kits, robotics kits, or electronic components.</li>
                <li>Products damaged due to misuse, improper handling, or incorrect assembly.</li>
                <li>Customized or specially ordered kits.</li>
                <li>Workshop fees, training programs, online/offline classes, or digital content.</li>
                <li>Clearance or sale items (unless received damaged or defective).</li>
            </ul>
          </section>

          {/* 3. Return Process */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              3. Return Process
            </h2>
            <p className="mb-3">To initiate a return, please follow these steps:</p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>Email us at <a href="mailto:info@brainytoys.in" className="text-blue-600 hover:underline">info@brainytoys.in</a>.</li>
                <li>Mention your <strong>Order ID</strong>, reason for return, and attach <strong>clear photos/videos</strong> of the issue.</li>
                <li>Our team will review your request and respond within <strong>2–3 working days</strong>.</li>
                <li>If approved, return instructions will be shared with you.</li>
            </ol>
          </section>

          {/* 4. Refund Policy */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              4. Refund Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Once the returned product is received and inspected, we will notify you of the approval or rejection of your refund.</li>
                <li>If approved, the refund will be processed within <strong>7–10 working days</strong>.</li>
                <li>Refunds will be credited to the <strong>original mode of payment</strong>.</li>
                <li><strong>Shipping charges (if any) are non-refundable</strong>, unless the return is due to our error (wrong or defective product).</li>
            </ul>
          </section>

          {/* 5. Replacement Policy */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              5. Replacement Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>In case of defective or damaged products, we may offer a <strong>replacement instead of a refund</strong>, subject to product availability.</li>
                <li>Replacement products will be shipped at no additional cost.</li>
            </ul>
          </section>

          {/* 6. Return Shipping */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              6. Return Shipping
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>If the return is due to our mistake (damaged/incorrect product), return shipping costs will be borne by <strong>BrainyToys</strong>.</li>
                <li>For all other approved returns, return shipping costs must be borne by the customer.</li>
            </ul>
          </section>

          {/* 7. Cancellation Policy */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              7. Cancellation Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Orders can be cancelled <strong>before dispatch only</strong>.</li>
                <li>Once the order has been shipped, cancellation is not allowed.</li>
                <li>Workshop registrations and training programs <strong>cannot be cancelled or refunded</strong> once confirmed.</li>
            </ul>
          </section>

          {/* 8. Contact Us */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              8. Contact Us
            </h2>
            <p className="mb-4">
              For any questions related to returns or refunds, please contact:
            </p>
            <div className="space-y-2 text-sm md:text-base">
                <p><strong>BrainyToys (Vardhman International)</strong></p>
                <p><strong>Email:</strong> <a href="mailto:info@brainytoys.in" className="text-blue-600 hover:underline">info@brainytoys.in</a></p>
                <p><strong>Website:</strong> <a href="https://www.brainytoys.in" className="text-blue-600 hover:underline">www.brainytoys.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;