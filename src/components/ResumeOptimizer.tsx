import React, { useState } from 'react';
import { Copy, ArrowRight, ArrowLeft, FileText, User, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import gradientBg from '@/assets/gradient-bg.jpg';

interface FormData {
  jobRole: string;
  jobDescription: string;
  promptResponse: string;
  icpResponse: string;
  userResume: string;
}

const ResumeOptimizer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    jobRole: '',
    jobDescription: '',
    promptResponse: '',
    icpResponse: '',
    userResume: `{
  "name": "John Doe",
  "email": "john@example.com",
  "experience": [
    {
      "role": "Software Engineer",
      "company": "Tech Corp",
      "duration": "2020-2023",
      "achievements": ["Built scalable applications", "Led team of 5 developers"]
    }
  ],
  "skills": ["JavaScript", "React", "Node.js", "Python"]
}`
  });
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const generatePrompt1 = () => {
    return `Analyze the following job description and extract key requirements, skills, and qualifications needed for this role:

Job Description:
${formData.jobDescription}

Please provide a comprehensive analysis including:
1. Required technical skills
2. Preferred qualifications
3. Key responsibilities
4. Company culture indicators
5. Important keywords for ATS optimization

Return the analysis in JSON format with clear categories.`;
  };

  const generatePrompt2 = () => {
    let icp = '';
    try {
      const parsed = JSON.parse(formData.promptResponse);
      icp = JSON.stringify(parsed, null, 2);
    } catch {
      icp = formData.promptResponse;
    }

    return `Based on the Ideal Candidate Profile (ICP) and current resume, optimize the resume to better match the job requirements:

Job Role: ${formData.jobRole}

Job Description: ${formData.jobDescription}

Ideal Candidate Profile (ICP):
${icp}

Current Resume:
${formData.userResume}

Please optimize the resume by:
1. Aligning experience descriptions with job requirements
2. Highlighting relevant skills prominently
3. Adding industry-specific keywords
4. Restructuring content for maximum ATS compatibility
5. Maintaining truthfulness while optimizing presentation

Return the optimized resume in the same JSON format with improved content.`;
  };

  const extractOptimizedResume = () => {
    try {
      const parsed = JSON.parse(formData.icpResponse);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return formData.icpResponse;
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "Job Details", icon: FileText },
    { number: 2, title: "Generate Prompt", icon: Star },
    { number: 3, title: "ICP Analysis", icon: User },
    { number: 4, title: "Final Resume", icon: Copy }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center font-light"
      style={{
        backgroundImage: `url(${gradientBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="relative flex flex-col overflow-hidden shadow-elegant transition-bounce max-w-4xl w-full mx-4">
        <div className="glass rounded-3xl">
          {/* Header with Progress */}
          <div className="relative text-center bg-black/10 p-8">
            <div className="mb-6">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 glass-button">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-normal text-white tracking-tighter mb-2">Resume Optimizer</h1>
              <p className="text-sm font-light text-white/80">AI-powered resume optimization for your dream job</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-3 justify-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold backdrop-blur-sm transition-smooth ${
                      currentStep >= step.number 
                        ? 'glass-button text-white' 
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {step.number}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block transition-smooth ${
                      currentStep >= step.number ? 'text-white/90' : 'text-white/60'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-6 h-px bg-white/30"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 min-h-[600px]">
            {/* Step 1: Job Details Input */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium text-white mb-2">Job Details</h2>
                  <p className="text-sm font-normal text-white/70">Enter the job role and description to get started</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Job Role</label>
                    <input
                      type="text"
                      value={formData.jobRole}
                      onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                      className="glass-input w-full px-4 py-3 text-sm text-white placeholder-gray-300 border-none focus:outline-none rounded-xl"
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Job Description</label>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                      className="glass-input w-full px-4 py-3 text-sm text-white placeholder-gray-300 border-none focus:outline-none rounded-xl min-h-[200px] resize-none"
                      placeholder="Paste the complete job description here..."
                    />
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  disabled={!formData.jobRole || !formData.jobDescription}
                  className="glass-button w-full py-3 px-4 rounded-xl text-sm font-semibold text-white transition-smooth hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Generate Analysis Prompt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Generated Prompt and Response Input */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium text-white mb-2">Analysis Prompt</h2>
                  <p className="text-sm font-normal text-white/70">Copy this prompt to your AI assistant and paste the response below</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white">Generated Prompt</label>
                      <button
                        onClick={() => copyToClipboard(generatePrompt1(), "Analysis prompt")}
                        className="glass-button px-3 py-1 rounded-lg text-xs font-medium text-white transition-smooth hover:shadow-lg flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <textarea
                      value={generatePrompt1()}
                      readOnly
                      className="glass-input w-full px-4 py-3 text-sm text-white/90 border-none focus:outline-none rounded-xl min-h-[200px] resize-none cursor-default"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">AI Response (JSON Format)</label>
                    <textarea
                      value={formData.promptResponse}
                      onChange={(e) => setFormData({...formData, promptResponse: e.target.value})}
                      className="glass-input w-full px-4 py-3 text-sm text-white placeholder-gray-300 border-none focus:outline-none rounded-xl min-h-[200px] resize-none"
                      placeholder="Paste the AI response here..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="glass-input flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-smooth hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.promptResponse}
                    className="glass-button flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-smooth hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>Generate ICP Prompt</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: ICP Prompt and Response */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium text-white mb-2">ICP Optimization Prompt</h2>
                  <p className="text-sm font-normal text-white/70">Copy this prompt to optimize your resume and paste the response</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-white">Optimization Prompt</label>
                      <button
                        onClick={() => copyToClipboard(generatePrompt2(), "Optimization prompt")}
                        className="glass-button px-3 py-1 rounded-lg text-xs font-medium text-white transition-smooth hover:shadow-lg flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <textarea
                      value={generatePrompt2()}
                      readOnly
                      className="glass-input w-full px-4 py-3 text-sm text-white/90 border-none focus:outline-none rounded-xl min-h-[250px] resize-none cursor-default"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Optimized Resume Response</label>
                    <textarea
                      value={formData.icpResponse}
                      onChange={(e) => setFormData({...formData, icpResponse: e.target.value})}
                      className="glass-input w-full px-4 py-3 text-sm text-white placeholder-gray-300 border-none focus:outline-none rounded-xl min-h-[200px] resize-none"
                      placeholder="Paste the optimized resume response here..."
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="glass-input flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-smooth hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.icpResponse}
                    className="glass-button flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-smooth hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>View Final Resume</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Final Optimized Resume */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium text-white mb-2">Optimized Resume</h2>
                  <p className="text-sm font-normal text-white/70">Your AI-optimized resume is ready for the job application</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-white">Final Optimized Resume</label>
                    <button
                      onClick={() => copyToClipboard(extractOptimizedResume(), "Optimized resume")}
                      className="glass-button px-3 py-1 rounded-lg text-xs font-medium text-white transition-smooth hover:shadow-lg flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Resume
                    </button>
                  </div>
                  <textarea
                    value={extractOptimizedResume()}
                    readOnly
                    className="glass-input w-full px-4 py-3 text-sm text-white/90 border-none focus:outline-none rounded-xl min-h-[400px] resize-none cursor-default"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="glass-input flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-smooth hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setFormData({
                        jobRole: '',
                        jobDescription: '',
                        promptResponse: '',
                        icpResponse: '',
                        userResume: formData.userResume
                      });
                    }}
                    className="glass-button flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-smooth hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Start New Optimization</span>
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeOptimizer;