import { Link } from "react-router-dom";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-white py-16 px-4">
    <div className="max-w-3xl mx-auto bg-[#0d0d0d] rounded-xl border border-[#00ff9d]/20 p-8 shadow-xl">
      <h1 className="text-3xl font-bold text-[#00ff9d] mb-6">Privacy Policy</h1>
      <p className="mb-6 text-gray-300">
        <strong>Last updated:</strong> {new Date().toLocaleDateString()}
      </p>
      <p className="mb-6 text-gray-300">
        Welcome to Thread Lens. We are committed to protecting your privacy and
        ensuring you have a positive experience on our platform. This Privacy
        Policy describes how we collect, use, and protect your information when
        you use our website and services.
      </p>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        1. Who We Are
      </h2>
      <p className="mb-4 text-gray-300">
        Thread Lens is an advanced AML (Anti-Money Laundering) analytics and
        investigation platform. We provide tools for transaction monitoring,
        anomaly detection, network analysis, and regulatory compliance for
        financial institutions and investigators.
      </p>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        2. What Information We Collect
      </h2>
      <ul className="mb-4 text-gray-300 list-disc list-inside space-y-2">
        <li>
          <strong>Account Information:</strong> Name, email address, and
          authentication data when you create an account or sign in via
          third-party providers.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you use our
          platform, such as pages viewed, features used, and actions taken.
        </li>
        <li>
          <strong>Device & Technical Data:</strong> IP address, browser type,
          device type, operating system, and similar technical information.
        </li>
        <li>
          <strong>Uploaded Data:</strong> Transaction data, case files, or other
          documents you upload for analysis.
        </li>
        <li>
          <strong>Cookies & Tracking:</strong> We use cookies and similar
          technologies to enhance your experience and analyze usage.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        3. How We Use Your Information
      </h2>
      <ul className="mb-4 text-gray-300 list-disc list-inside space-y-2">
        <li>
          To provide, operate, and maintain the Thread Lens platform and its
          features.
        </li>
        <li>To personalize your experience and improve our services.</li>
        <li>
          To analyze usage and performance for platform optimization and
          security.
        </li>
        <li>
          To communicate with you about updates, security alerts, and support.
        </li>
        <li>
          To comply with legal and regulatory obligations, including AML laws.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        4. Data Sharing and Disclosure
      </h2>
      <ul className="mb-4 text-gray-300 list-disc list-inside space-y-2">
        <li>
          We do <strong>not</strong> sell or rent your personal information to
          third parties.
        </li>
        <li>
          We may share data with trusted service providers (e.g., cloud hosting,
          analytics) under strict confidentiality agreements, solely for
          operating and improving our services.
        </li>
        <li>
          We may disclose information if required by law, regulation, or legal
          process, or to protect the rights, property, or safety of Thread Lens,
          our users, or others.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        5. Cookies and Tracking Technologies
      </h2>
      <p className="mb-4 text-gray-300">
        We use cookies and similar technologies to remember your preferences,
        analyze site usage, and enhance your experience. You can control cookies
        through your browser settings. Disabling cookies may affect some
        platform features.
      </p>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        6. Data Security
      </h2>
      <p className="mb-4 text-gray-300">
        We take data security seriously and implement industry-standard measures
        to protect your information, including encryption, access controls, and
        regular security reviews. However, no system is 100% secure, so we
        cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        7. Data Retention
      </h2>
      <p className="mb-4 text-gray-300">
        We retain your information only as long as necessary to provide our
        services, meet legal obligations, and resolve disputes. You may request
        deletion of your account and associated data at any time.
      </p>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        8. Your Rights
      </h2>
      <ul className="mb-4 text-gray-300 list-disc list-inside space-y-2">
        <li>Access the personal data we hold about you.</li>
        <li>Request correction or deletion of your data.</li>
        <li>Object to or restrict processing of your data in certain cases.</li>
        <li>Withdraw consent at any time (where applicable).</li>
      </ul>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        9. International Data Transfers
      </h2>
      <p className="mb-4 text-gray-300">
        Your data may be stored and processed in countries outside your own. We
        ensure adequate safeguards are in place to protect your information in
        accordance with applicable laws.
      </p>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        10. Children’s Privacy
      </h2>
      <p className="mb-4 text-gray-300">
        Thread Lens is not intended for children under 16. We do not knowingly
        collect personal data from children. If you believe a child has provided
        us with personal data, please contact us for removal.
      </p>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        11. Changes to This Policy
      </h2>
      <p className="mb-4 text-gray-300">
        We may update this Privacy Policy from time to time. We will notify you
        of significant changes by posting the new policy on this page and
        updating the date above.
      </p>

      <h2 className="text-2xl font-semibold text-[#00ff9d] mt-8 mb-2">
        12. Contact Us
      </h2>
      <p className="mb-8 text-gray-300">
        If you have any questions or concerns about this Privacy Policy or your
        data, please contact us at{" "}
        <a
          href="mailto:support@threadlens.com"
          className="text-[#00ff9d] underline"
        >
          support@threadlens.com
        </a>
        .
      </p>

      <div className="flex justify-center">
        <Link
          to="/"
          className="px-6 py-2 rounded-lg border border-[#00ff9d]/30 text-[#00ff9d] hover:bg-[#00ff9d]/10 transition-colors text-sm font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
