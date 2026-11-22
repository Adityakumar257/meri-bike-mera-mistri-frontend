import React from 'react';
import { FaTruckMoving } from 'react-icons/fa';

const ShippingPolicy = () => {
  return (
    <div className="container bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-orange-600 px-8 py-10 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaTruckMoving className="text-3xl"/>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide mb-2">Shipping and Delivery Policy</h1>
          <p className="text-red-100 font-medium text-lg">Brainy Toys (www.brainytoys.in)</p>
          <p className="text-sm mt-4 opacity-80">Last Updated: 10.01.2026</p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed text-sm md:text-base">
          
          {/* Introduction */}
          <section>
            <p className="mb-3">
              At <strong>Brainy Toys (www.brainytoys.in)</strong>, we are committed to delivering high-quality educational, STEM, and robotics products to our customers in a timely and secure manner.
            </p>
            <p>
              This Shipping and Delivery Policy explains how orders are processed, shipped, and delivered.
            </p>
          </section>

          {/* 1. Shipping Locations */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              1. Shipping Locations
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>We currently <strong>ship across India</strong>.</li>
                <li>For bulk orders, institutional orders, or international shipping requests, customers may contact us directly before placing an order.</li>
            </ul>
          </section>

          {/* 2. Order Processing Time */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              2. Order Processing Time
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Orders are typically <strong>processed within 1–3 business days</strong> after successful payment confirmation.</li>
                <li>Orders placed on Sundays or public holidays will be processed on the next working day.</li>
                <li>Customized kits, bulk orders, or workshop-related materials may require additional processing time, which will be communicated separately.</li>
            </ul>
          </section>

          {/* 3. Shipping Methods & Delivery Timeline */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              3. Shipping Methods & Delivery Timeline
            </h2>
            <p className="mb-3">
              We partner with <strong>reliable courier and logistics service providers</strong> to ensure safe delivery.
            </p>
            <p className="font-semibold mb-2">Estimated delivery time:</p>
            <ul className="list-disc pl-6 space-y-2 mb-3">
                <li><strong>Metro Cities:</strong> 3–5 business days</li>
                <li><strong>Non-Metro / Remote Areas:</strong> 5–10 business days</li>
            </ul>
            <p>
              Delivery timelines are estimates and may vary due to courier delays, weather conditions, public holidays, or unforeseen circumstances.
            </p>
          </section>

          {/* 4. Shipping Charges */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              4. Shipping Charges
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Shipping charges, if applicable, will be <strong>clearly mentioned at checkout</strong> before payment.</li>
                <li>Any promotional free-shipping offers will be subject to terms mentioned on the website at the time of purchase.</li>
            </ul>
          </section>

          {/* 5. Order Tracking */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              5. Order Tracking
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Once your order is shipped, <strong>tracking details</strong> will be shared via email or SMS.</li>
                <li>Customers can track their shipment using the courier partner’s tracking link.</li>
            </ul>
          </section>

          {/* 6. Delivery Guidelines */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              6. Delivery Guidelines
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Please ensure that the <strong>delivery address and contact details</strong> provided during checkout are accurate and complete.</li>
                <li>Brainy Toys will not be responsible for delays or non-delivery due to incorrect or incomplete address details.</li>
                <li>If a delivery attempt fails due to customer unavailability, re-delivery will be subject to courier partner policies.</li>
            </ul>
          </section>

          {/* 7. Damaged or Missing Shipments */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              7. Damaged or Missing Shipments
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>If you receive a <strong>damaged, tampered, or incorrect package</strong>, please notify us within <strong>48 hours of delivery</strong> along with supporting photos/videos.</li>
                <li>In case of missing items, customers must contact us within <strong>48 hours</strong> of receiving the order.</li>
                <li>Resolution will be handled as per our Return & Refund Policy.</li>
            </ul>
          </section>

          {/* 8. Delays Beyond Our Control */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
              8. Delays Beyond Our Control
            </h2>
            <p className="mb-3">Brainy Toys shall not be held liable for delays caused by:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Natural disasters, strikes, or lockdowns</li>
                <li>Courier service disruptions</li>
                <li>Government regulations or restrictions</li>
                <li>Any other circumstances beyond our reasonable control</li>
            </ul>
          </section>

          {/* 9. Contact Information */}
          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              9. Contact Information
            </h2>
            <p className="mb-4">
              For any questions related to shipping or delivery, please contact us:
            </p>
            <div className="space-y-2 text-sm md:text-base">
                <p><strong>Email:</strong> <a href="mailto:info@brainytoys.in" className="text-blue-600 hover:underline">info@brainytoys.in</a></p>
                <p><strong>Phone/WhatsApp:</strong> <a href="tel:8750052475" className="text-blue-600 hover:underline">8750052475</a></p>
                <p><strong>Website:</strong> <a href="https://www.brainytoys.in" className="text-blue-600 hover:underline">www.brainytoys.in</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;