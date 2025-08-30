
import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="prose dark:prose-invert max-w-none">
                <h1>Terms of Service</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Welcome to Grooya! These terms and conditions outline the rules and regulations for the use of Grooya's Website.</p>
                
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Grooya if you do not agree to take all of the terms and conditions stated on this page.</p>
                
                <h2>2. Intellectual Property Rights</h2>
                <p>Other than the content you own, under these Terms, Grooya and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.</p>
                
                <h2>3. Restrictions</h2>
                <p>You are specifically restricted from all of the following:</p>
                <ul>
                    <li>publishing any Website material in any other media;</li>
                    <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                    <li>publicly performing and/or showing any Website material;</li>
                    <li>using this Website in any way that is or may be damaging to this Website;</li>
                </ul>
                
                <h2>4. Your Content</h2>
                <p>In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant Grooya a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
                
                <h2>5. Limitation of liability</h2>
                <p>In no event shall Grooya, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Grooya, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
