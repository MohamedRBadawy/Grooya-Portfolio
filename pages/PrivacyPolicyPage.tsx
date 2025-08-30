
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="prose dark:prose-invert max-w-none">
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Your privacy is important to us. It is Grooya's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>
                
                <h2>1. Information We Collect</h2>
                <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                
                <h2>2. Log Data</h2>
                <p>When you visit our website, our servers may automatically log the standard data provided by your web browser. This data is considered “non-identifying information,” as it does not personally identify you on its own.</p>
                
                <h2>3. How We Use Information</h2>
                <p>We may use a combination of identifying and non-identifying information to understand who our visitors are, how they use our services, and how we may improve their experience of our website in future.</p>
                
                <h2>4. Data Security</h2>
                <p>We take security seriously. We use commercially acceptable means to protect your personal information from loss or theft, as well as unauthorized access, disclosure, copying, use or modification. That said, we advise that no method of electronic transmission or storage is 100% secure, and cannot guarantee absolute data security.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
