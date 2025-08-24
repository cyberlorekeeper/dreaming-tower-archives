import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Target, Book, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

const MythologyDialApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [audienceData, setAudienceData] = useState({
    industry: '',
    roles: [],
    culture: '',
    riskTolerance: '',
    creativity: ''
  });
  const [scenarioData, setScenarioData] = useState({
    archetype: '',
    urgency: '',
    complexity: '',
    stakes: ''
  });
  const [recommendedLevel, setRecommendedLevel] = useState('');
  const [dialPosition, setDialPosition] = useState(50);

  const industries = [
    { value: 'banking', label: 'Banking & Financial Services', conservatism: 90 },
    { value: 'insurance', label: 'Insurance', conservatism: 85 },
    { value: 'government', label: 'Government & Public Sector', conservatism: 95 },
    { value: 'healthcare', label: 'Healthcare', conservatism: 80 },
    { value: 'legal', label: 'Legal Services', conservatism: 85 },
    { value: 'manufacturing', label: 'Manufacturing', conservatism: 60 },
    { value: 'retail', label: 'Retail & E-commerce', conservatism: 50 },
    { value: 'technology', label: 'Technology', conservatism: 40 },
    { value: 'consulting', label: 'Consulting', conservatism: 45 },
    { value: 'gaming', label: 'Gaming & Entertainment', conservatism: 20 },
    { value: 'startup', label: 'Startup/Scale-up', conservatism: 25 },
    { value: 'creative', label: 'Creative/Advertising Agency', conservatism: 15 }
  ];

  const roles = [
    { value: 'ceo', label: 'CEO/President', conservatism: 70 },
    { value: 'board', label: 'Board Members', conservatism: 85 },
    { value: 'chairman', label: 'Chairman/Board Chair', conservatism: 90 },
    { value: 'cfo', label: 'CFO/Finance', conservatism: 75 },
    { value: 'coo', label: 'COO/Operations', conservatism: 65 },
    { value: 'cto', label: 'CTO/Technology', conservatism: 45 },
    { value: 'ciso', label: 'CISO/Security Leadership', conservatism: 50 },
    { value: 'cio', label: 'CIO/IT Leadership', conservatism: 55 },
    { value: 'legal', label: 'Legal/Compliance', conservatism: 80 },
    { value: 'hr', label: 'HR/People', conservatism: 55 },
    { value: 'marketing', label: 'Marketing/Communications', conservatism: 35 },
    { value: 'engineering', label: 'Engineering Leadership', conservatism: 40 },
    { value: 'developers', label: 'System Developers/Architects', conservatism: 30 },
    { value: 'vendors', label: 'External Vendors/Partners', conservatism: 60 },
    { value: 'customers', label: 'External Customers/Clients', conservatism: 75 }
  ];

  const archetypes = [
    { 
      value: 'siege', 
      label: 'The Siege Narrative', 
      intensity: 70,
      description: 'Best for ongoing threat campaigns, compliance deadlines, or sustained attacks. Frames your organization as a kingdom under prolonged pressure, with defenders holding walls but resources strained. Strategic countermeasures needed to break the siege permanently.',
      useCase: 'APT campaigns, regulatory compliance, legacy system vulnerabilities'
    },
    { 
      value: 'prophet', 
      label: 'The Prophet\'s Warning', 
      intensity: 60,
      description: 'Perfect for risk assessments, vulnerability reports, or predictive threat briefings. The oracle reveals future threats and calamities, showing three paths of fate with rituals of protection to change destiny.',
      useCase: 'Risk assessments, vulnerability scans, threat landscape briefings'
    },
    { 
      value: 'dragon', 
      label: 'The Dragon\'s Awakening', 
      intensity: 85,
      description: 'Ideal for incident response, breach presentations, or crisis communication. A powerful beast awakens and threatens the kingdom, heroes rally to face the challenge, battle is fought with courage, victory achieved.',
      useCase: 'Post-incident briefings, breach analysis, crisis communication'
    },
    { 
      value: 'quest', 
      label: 'Quest for Sacred Artifact', 
      intensity: 75,
      description: 'Great for new technology implementations, security program builds, or major initiatives. Legendary tool discovered that could protect entire kingdom, but perilous journey required to claim it.',
      useCase: 'Zero Trust projects, SIEM implementations, security transformations'
    },
    { 
      value: 'merchant', 
      label: 'The Merchant\'s Journey', 
      intensity: 50,
      description: 'Excellent for business enablement, risk vs. opportunity discussions, or new market entry. Merchants seek passage through dangerous territory to reach profitable markets, requiring proper escorts and precautions.',
      useCase: 'Cloud migrations, digital transformation, business expansion'
    },
    { 
      value: 'alliance', 
      label: 'The Alliance Formation', 
      intensity: 45,
      description: 'Perfect for third-party risk, vendor management, or partnership security. Neighboring kingdom proposes alliance with mutual benefits, but honor and strength must be tested through trials first.',
      useCase: 'Vendor assessments, M&A security, partnership evaluations'
    },
    { 
      value: 'succession', 
      label: 'The Succession Crisis', 
      intensity: 55,
      description: 'Ideal for leadership transitions, succession planning, or knowledge transfer. The realm prepares for changing of guard, with ancient wisdom preserved and new champions trained to carry forward the legacy.',
      useCase: 'Leadership transitions, knowledge transfer, team succession planning'
    }
  ];

  const calculateRecommendation = () => {
    let conservatismScore = 50;

    // Industry influence (40% weight)
    const industry = industries.find(i => i.value === audienceData.industry);
    if (industry) {
      conservatismScore = conservatismScore * 0.6 + industry.conservatism * 0.4;
    }

    // Roles influence (30% weight)
    if (audienceData.roles.length > 0) {
      const roleConservatism = audienceData.roles.reduce((sum, roleValue) => {
        const role = roles.find(r => r.value === roleValue);
        return sum + (role ? role.conservatism : 50);
      }, 0) / audienceData.roles.length;
      conservatismScore = conservatismScore * 0.7 + roleConservatism * 0.3;
    }

    // Culture adjustments
    const cultureAdjustments = {
      'traditional': 15,
      'moderate': 0,
      'innovative': -15
    };
    conservatismScore += cultureAdjustments[audienceData.culture] || 0;

    // Risk tolerance adjustments
    const riskAdjustments = {
      'low': 10,
      'medium': 0,
      'high': -10
    };
    conservatismScore += riskAdjustments[audienceData.riskTolerance] || 0;

    // Creativity adjustments
    const creativityAdjustments = {
      'skeptical': 20,
      'neutral': 0,
      'embracing': -20
    };
    conservatismScore += creativityAdjustments[audienceData.creativity] || 0;

    // Archetype intensity influence
    const archetype = archetypes.find(a => a.value === scenarioData.archetype);
    if (archetype) {
      // High-intensity archetypes need lower conservatism to work
      conservatismScore += (archetype.intensity - 60) * 0.3;
    }

    // Urgency influence
    const urgencyAdjustments = {
      'low': 5,
      'medium': 0,
      'high': -10
    };
    conservatismScore += urgencyAdjustments[scenarioData.urgency] || 0;

    // Cap the score
    conservatismScore = Math.max(0, Math.min(100, conservatismScore));

    // Convert to recommendation
    let level;
    if (conservatismScore >= 70) {
      level = 'conservative';
    } else if (conservatismScore >= 40) {
      level = 'moderate';
    } else {
      level = 'fantasy';
    }

    setRecommendedLevel(level);
    setDialPosition(100 - conservatismScore); // Invert for dial display
  };

  useEffect(() => {
    if (currentStep === 3) {
      calculateRecommendation();
    }
  }, [currentStep, audienceData, scenarioData]);

  const getDialColor = (position) => {
    if (position <= 30) return '#ef4444'; // Conservative - Red
    if (position <= 70) return '#f59e0b'; // Moderate - Orange
    return '#8b5cf6'; // Fantasy - Purple
  };

  const getDialLabel = (position) => {
    if (position <= 30) return 'CONSERVATIVE';
    if (position <= 70) return 'MODERATE';
    return 'FULL FANTASY';
  };

  const recommendations = {
    conservative: {
      title: 'Conservative Approach Recommended',
      color: 'text-red-600',
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      description: 'Your audience prefers subtle metaphors and traditional business language.',
      techniques: [
        'Use minimal fantasy elements - think "strategic metaphors" not "epic tales"',
        'Focus on phrases like "strategic assessment" and "systematic approach"',
        'Bridge with: "If we think of our network as having defensive perimeters..."',
        'Keep mythology dial at 20% - mostly business language with subtle comparisons',
        'Prepare traditional backup slides for complete fallback if needed'
      ],
      example: {
        opening: 'Our network security posture faces sustained pressure from advanced threat actors. If we consider our infrastructure as having defensive perimeters...',
        avoid: 'Dragons breathing fire across our digital kingdom...'
      }
    },
    moderate: {
      title: 'Balanced Approach Recommended',
      color: 'text-orange-600',
      icon: <Target className="w-6 h-6 text-orange-600" />,
      description: 'Your audience will appreciate clear mythological elements with business translations.',
      techniques: [
        'Use full mythological metaphors with immediate business translation',
        'Bridge phrases: "Just as a kingdom requires..., our organization needs..."',
        'Include both mythological narrative and business reality check',
        'Keep mythology dial at 50% - balanced fantasy and professional language',
        'Use visual metaphors that clearly map to technical concepts'
      ],
      example: {
        opening: 'Our digital kingdom faces a siege from the Shadow Guild. In business terms, this advanced persistent threat has been targeting our infrastructure for six months...',
        technique: 'Always follow mythology with professional translation'
      }
    },
    fantasy: {
      title: 'Full Fantasy Approach Recommended',
      color: 'text-purple-600',
      icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      description: 'Your audience will embrace rich narrative immersion and creative storytelling.',
      techniques: [
        'Use complete story arcs with detailed character development',
        'Embrace emotional engagement and dramatic tension',
        'Create immersive world-building with consistent mythology',
        'Keep mythology dial at 80% - primarily narrative with data anchors',
        'Include heroic character archetypes and epic quest structures'
      ],
      example: {
        opening: 'The ancient dragon stirred in the depths of our northern servers, its eyes glowing with malicious intent. For three days, our bravest defenders had watched the beast gather strength...',
        technique: 'Full narrative immersion with data woven naturally into the story'
      }
    }
  };

  const handleRoleToggle = (roleValue) => {
    setAudienceData(prev => ({
      ...prev,
      roles: prev.roles.includes(roleValue)
        ? prev.roles.filter(r => r !== roleValue)
        : [...prev.roles, roleValue]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            The Mythology Dial
          </h1>
          <p className="text-xl text-gray-300">
            Calibrate your security storytelling for maximum impact
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                  ${currentStep >= step ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-gray-300'}`}>
                  {step}
                </div>
                {step < 3 && <ChevronRight className="w-5 h-5 text-gray-400" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          
          {/* Step 1: Audience Analysis */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <Users className="w-8 h-8 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold">Know Your Audience</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3">Industry</label>
                  <select
                    value={audienceData.industry}
                    onChange={(e) => setAudienceData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">Select industry...</option>
                    {industries.map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Audience Roles (select all that apply)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map(role => (
                      <button
                        key={role.value}
                        onClick={() => handleRoleToggle(role.value)}
                        className={`p-2 border rounded-lg text-left transition-colors text-sm ${
                          audienceData.roles.includes(role.value)
                            ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                            : 'bg-black/20 border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Organizational Culture</label>
                  <div className="space-y-2">
                    {[
                      { value: 'traditional', label: 'Traditional - Formal, risk-averse, established processes' },
                      { value: 'moderate', label: 'Moderate - Balance of tradition and innovation' },
                      { value: 'innovative', label: 'Innovative - Open to new ideas, creative approaches' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="culture"
                          value={option.value}
                          checked={audienceData.culture === option.value}
                          onChange={(e) => setAudienceData(prev => ({ ...prev, culture: e.target.value }))}
                          className="mr-3"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Risk Tolerance</label>
                  <div className="space-y-2">
                    {[
                      { value: 'low', label: 'Low - Conservative, wants proven approaches only' },
                      { value: 'medium', label: 'Medium - Balanced approach to new ideas' },
                      { value: 'high', label: 'High - Willing to try innovative approaches' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="risk"
                          value={option.value}
                          checked={audienceData.riskTolerance === option.value}
                          onChange={(e) => setAudienceData(prev => ({ ...prev, riskTolerance: e.target.value }))}
                          className="mr-3"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Attitude Toward Creative Presentations</label>
                  <div className="space-y-2">
                    {[
                      { value: 'skeptical', label: 'Skeptical - Prefers "just the facts" approach' },
                      { value: 'neutral', label: 'Neutral - Open but needs convincing' },
                      { value: 'embracing', label: 'Embracing - Appreciates creative communication' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="creativity"
                          value={option.value}
                          checked={audienceData.creativity === option.value}
                          onChange={(e) => setAudienceData(prev => ({ ...prev, creativity: e.target.value }))}
                          className="mr-3"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Scenario Selection */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <Book className="w-8 h-8 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold">Choose Your Story</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3">Archetypal Framework</label>
                  <select
                    value={scenarioData.archetype}
                    onChange={(e) => setScenarioData(prev => ({ ...prev, archetype: e.target.value }))}
                    className="w-full p-3 bg-black/30 border border-gray-600 rounded-lg text-white mb-4"
                  >
                    <option value="">Select archetype...</option>
                    {archetypes.map(archetype => (
                      <option key={archetype.value} value={archetype.value}>
                        {archetype.label}
                      </option>
                    ))}
                  </select>
                  
                  {/* Archetype Description */}
                  {scenarioData.archetype && (
                    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-lg p-4">
                      <h4 className="font-bold text-purple-300 mb-2">
                        {archetypes.find(a => a.value === scenarioData.archetype)?.label}
                      </h4>
                      <p className="text-gray-300 mb-3">
                        {archetypes.find(a => a.value === scenarioData.archetype)?.description}
                      </p>
                      <div className="text-sm">
                        <span className="text-purple-400 font-semibold">Common Use Cases: </span>
                        <span className="text-gray-300">
                          {archetypes.find(a => a.value === scenarioData.archetype)?.useCase}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Urgency Level</label>
                  <div className="space-y-2">
                    {[
                      { value: 'low', label: 'Low - Strategic planning, future preparation' },
                      { value: 'medium', label: 'Medium - Important but not crisis-level' },
                      { value: 'high', label: 'High - Immediate action required, crisis mode' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="urgency"
                          value={option.value}
                          checked={scenarioData.urgency === option.value}
                          onChange={(e) => setScenarioData(prev => ({ ...prev, urgency: e.target.value }))}
                          className="mr-3"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Content Complexity</label>
                  <div className="space-y-2">
                    {[
                      { value: 'low', label: 'Low - Simple, straightforward security topic' },
                      { value: 'medium', label: 'Medium - Moderate technical complexity' },
                      { value: 'high', label: 'High - Complex technical or multi-faceted issue' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="complexity"
                          value={option.value}
                          checked={scenarioData.complexity === option.value}
                          onChange={(e) => setScenarioData(prev => ({ ...prev, complexity: e.target.value }))}
                          className="mr-3"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3">Business Stakes</label>
                  <div className="space-y-2">
                    {[
                      { value: 'low', label: 'Low - Minor business impact, routine security matter' },
                      { value: 'medium', label: 'Medium - Significant business considerations' },
                      { value: 'high', label: 'High - Major business impact, strategic importance' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="stakes"
                          value={option.value}
                          checked={scenarioData.stakes === option.value}
                          onChange={(e) => setScenarioData(prev => ({ ...prev, stakes: e.target.value }))}
                          className="mr-3"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Recommendations */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <Lightbulb className="w-8 h-8 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-bold">Your Calibrated Approach</h2>
              </div>

              {/* Visual Dial */}
              <div className="text-center mb-8">
                <div className="relative w-64 h-64 mx-auto mb-4">
                  <div 
                    className="w-64 h-64 rounded-full border-8 relative"
                    style={{
                      background: `conic-gradient(from -60deg, #ef4444 0deg 120deg, #f59e0b 120deg 240deg, #8b5cf6 240deg 360deg)`,
                      borderColor: '#fbbf24'
                    }}
                  >
                    <div 
                      className="absolute w-1 h-20 bg-yellow-400 origin-bottom shadow-lg"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -100%) rotate(${(dialPosition * 3.6) - 180}deg)`,
                        borderRadius: '2px'
                      }}
                    />
                    <div className="absolute inset-8 bg-slate-900 rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-400">
                          {getDialLabel(dialPosition)}
                        </div>
                        <div className="text-sm text-gray-300">
                          {Math.round(dialPosition)}% Intensity
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation Card */}
                {recommendedLevel && (
                  <div className="bg-black/30 border border-gray-600 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center mb-4">
                      {recommendations[recommendedLevel].icon}
                      <h3 className={`text-xl font-bold ml-3 ${recommendations[recommendedLevel].color}`}>
                        {recommendations[recommendedLevel].title}
                      </h3>
                    </div>
                    <p className="text-gray-300 mb-6">
                      {recommendations[recommendedLevel].description}
                    </p>

                    <div className="text-left">
                      <h4 className="font-bold text-yellow-400 mb-3">Recommended Techniques:</h4>
                      <ul className="space-y-2 text-gray-300 mb-6">
                        {recommendations[recommendedLevel].techniques.map((technique, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-1 mr-2 flex-shrink-0" />
                            {technique}
                          </li>
                        ))}
                      </ul>

                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h5 className="font-bold text-yellow-400 mb-2">Example Opening:</h5>
                        <p className="text-gray-300 mb-3 italic">
                          "{recommendations[recommendedLevel].example.opening}"
                        </p>
                        {recommendations[recommendedLevel].example.avoid && (
                          <>
                            <h5 className="font-bold text-red-400 mb-2">Avoid:</h5>
                            <p className="text-gray-300 italic">
                              "{recommendations[recommendedLevel].example.avoid}"
                            </p>
                          </>
                        )}
                        {recommendations[recommendedLevel].example.technique && (
                          <>
                            <h5 className="font-bold text-green-400 mb-2">Key Technique:</h5>
                            <p className="text-gray-300">
                              {recommendations[recommendedLevel].example.technique}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && (!audienceData.industry || !audienceData.culture)) ||
                  (currentStep === 2 && (!scenarioData.archetype || !scenarioData.urgency))
                }
                className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setAudienceData({
                    industry: '',
                    roles: [],
                    culture: '',
                    riskTolerance: '',
                    creativity: ''
                  });
                  setScenarioData({
                    archetype: '',
                    urgency: '',
                    complexity: '',
                    stakes: ''
                  });
                }}
                className="px-6 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p>Part of The Mythological Security Storytelling Framework</p>
          <p className="text-sm">Transform your security data into executive epics</p>
        </div>
      </div>
    </div>
  );
};

export default MythologyDialApp;
