// CareerSync AI Service powered by Google Gemini 2.0 Flash

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const getGeminiApiKey = () => {
  return localStorage.getItem('career_sync_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setGeminiApiKey = (key) => {
  if (key) {
    localStorage.setItem('career_sync_gemini_key', key.trim());
  } else {
    localStorage.removeItem('career_sync_gemini_key');
  }
};

export const hasGeminiApiKey = () => {
  return Boolean(getGeminiApiKey());
};

/**
 * Core Gemini API Caller
 */
async function callGemini(prompt, systemInstruction = '', responseJson = false) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (responseJson) {
    payload.generationConfig = {
      responseMimeType: 'application/json'
    };
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `Gemini API error (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error("Empty response from AI model.");
  }

  if (responseJson) {
    try {
      return JSON.parse(textOutput);
    } catch {
      // Fallback if model wraps in markdown codeblock
      const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  }

  return textOutput;
}

/**
 * 1. AI Magic Paste - Parses raw job posting text into structured application fields
 */
export async function parseJobDescription(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new Error("Please paste job text to extract.");
  }

  if (hasGeminiApiKey()) {
    const systemPrompt = `You are an expert career and ATS parsing assistant. Extract structured job application details from the provided text into strict JSON.
Return JSON with the following keys:
- "role": string (job title, e.g. "Senior React Developer")
- "company": string (company name, e.g. "Stripe")
- "salary": string (compensation or stipend if mentioned, or empty string)
- "applicationType": "self" (default) or "college" (if campus/university is mentioned)
- "cleanedDescription": string (concise summary of requirements & responsibilities, max 400 words)
- "keySkills": string[] (up to 6 core technical skills mentioned)`;

    const prompt = `Here is the raw job posting text:\n\n"""\n${rawText.slice(0, 5000)}\n"""`;

    try {
      const parsed = await callGemini(prompt, systemPrompt, true);
      return {
        role: parsed.role || '',
        company: parsed.company || '',
        salary: parsed.salary || '',
        applicationType: parsed.applicationType || 'self',
        jobDescription: parsed.cleanedDescription || rawText.slice(0, 1000),
        keySkills: parsed.keySkills || []
      };
    } catch (err) {
      if (err.message !== "NO_API_KEY") {
        console.warn("Gemini parsing failed, using heuristic fallback:", err);
      }
    }
  }

  // Heuristic Fallback parser if API key is not yet set or fails
  return fallbackHeuristicParser(rawText);
}

/**
 * 2. AI Interview Question Predictor & Prep
 */
export async function generateInterviewPrep(role, company, jobDescription, userSkills = []) {
  if (hasGeminiApiKey()) {
    const prompt = `Target Role: ${role || 'Software Engineer'}
Target Company: ${company || 'Tech Company'}
Candidate Skills: ${userSkills.join(', ') || 'Full Stack Development'}
Job Description Summary:
${jobDescription ? jobDescription.slice(0, 1500) : 'Standard software engineering responsibilities.'}

Generate comprehensive interview prep in strict JSON format:
{
  "technicalQuestions": [
    { "question": string, "keyTopicsToHit": string }
  ],
  "behavioralQuestions": [
    { "question": string, "starGuidance": string }
  ],
  "companyTips": string
}`;

    const systemPrompt = `You are a Principal Tech Recruiter and Engineering Hiring Manager. Predict 3 high-probability technical questions and 3 behavioral questions tailored specifically to this role and company. Return strictly JSON.`;

    try {
      return await callGemini(prompt, systemPrompt, true);
    } catch (err) {
      if (err.message !== "NO_API_KEY") {
        console.warn("Interview prep API call failed, using fallback:", err);
      }
    }
  }

  // Smart Heuristic Fallback
  return {
    technicalQuestions: [
      {
        question: `How would you architect a high-scale feature for ${role || 'this role'} using modern best practices?`,
        keyTopicsToHit: `Discuss system architecture, state management, caching, database indexing, and handling edge-case latency.`
      },
      {
        question: `Can you walk us through a recent challenging bug or performance bottleneck in ${userSkills[0] || 'your core stack'} and how you resolved it?`,
        keyTopicsToHit: `Explain root-cause diagnosis using profiling tools, the fix implemented, and tests written to avoid regressions.`
      },
      {
        question: `What security considerations (authentication, input sanitization, rate-limiting) do you prioritize at ${company || 'production scale'}?`,
        keyTopicsToHit: `Mention OWASP best practices, JWT/session invalidation, CORS, and data encryption.`
      }
    ],
    behavioralQuestions: [
      {
        question: `Tell me about a time you had a technical disagreement with a teammate or stakeholder. How was it resolved?`,
        starGuidance: `STAR: Situation, Task, Action, Result. Emphasize empathy, objective data/benchmarks, and achieving the best team outcome.`
      },
      {
        question: `Describe a scenario where requirements changed unexpectedly right before a major deadline.`,
        starGuidance: `Highlight adaptability, transparent communication with management, and ruthless prioritization of critical path items.`
      }
    ],
    companyTips: `Research ${company || 'the company'}'s recent engineering blogs, core product releases, and customer pain points before your round.`
  };
}

/**
 * 3. AI Tailored Resume Bullets Optimizer (XYZ Formula)
 */
export async function generateResumeBullets(role, company, jobDescription, userSkills = []) {
  if (hasGeminiApiKey()) {
    const prompt = `Role: ${role} at ${company}
Candidate Skills: ${userSkills.join(', ')}
JD Requirements: ${jobDescription ? jobDescription.slice(0, 1500) : 'General software engineering'}

Generate 3 high-impact resume achievement bullets using Google's XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]") tailored specifically to this JD.
Return JSON:
{
  "bullets": [string, string, string]
}`;

    const systemPrompt = `You are an executive resume writer and FAANG ATS consultant. Generate 3 quantified, punchy resume bullets matching the requirements. Return strict JSON.`;

    try {
      const data = await callGemini(prompt, systemPrompt, true);
      return data.bullets || [];
    } catch (err) {
      if (err.message !== "NO_API_KEY") {
        console.warn("Resume bullet API call failed, using fallback:", err);
      }
    }
  }

  const primarySkill = userSkills[0] || 'modern web technologies';
  const secondarySkill = userSkills[1] || 'database architecture';

  return [
    `Architected and shipped scalable modules using ${primarySkill}, improving page responsiveness and reducing API latency by 35%.`,
    `Streamlined core data pipelines and state management with ${secondarySkill}, supporting reliable transaction throughput for 10k+ daily interactions.`,
    `Authored automated end-to-end and unit test suites across critical user flows, boosting code coverage to 92% and accelerating release cycles.`
  ];
}

/**
 * 4. AI Personalized Outreach (LinkedIn & Cold Email)
 */
export async function generatePersonalizedOutreach(role, company, jobDescription, profile = {}) {
  const candidateName = profile?.headline || 'Engineer & Builder';
  const skills = (profile?.skills || []).slice(0, 3).join(', ');

  if (hasGeminiApiKey()) {
    const prompt = `Role: ${role}
Company: ${company}
Candidate Background: ${candidateName} with skills in ${skills}
JD Context: ${jobDescription ? jobDescription.slice(0, 1000) : ''}

Generate:
1. "linkedInNote": A personalized, warm LinkedIn connection invite note (STRICTLY UNDER 300 CHARACTERS).
2. "coldEmail": A persuasive 3-paragraph cold email to the hiring manager with subject line.

Return strict JSON:
{
  "linkedInNote": string,
  "coldEmail": string
}`;

    const systemPrompt = `You are a Silicon Valley career strategist. Generate authentic, high-converting recruiter outreach messages without buzzword fluff. Return strict JSON.`;

    try {
      return await callGemini(prompt, systemPrompt, true);
    } catch (err) {
      if (err.message !== "NO_API_KEY") {
        console.warn("Outreach API call failed, using fallback:", err);
      }
    }
  }

  return {
    linkedInNote: `Hi, I noticed ${company}'s focus on high-impact products and that you're hiring for a ${role}. With hands-on experience in ${skills || 'software engineering'}, I'd love to connect and follow ${company}'s journey!`,
    coldEmail: `Subject: Application & Inquiry: ${role} - ${profile?.headline || 'Software Engineer'}

Hi Hiring Team,

I recently submitted my application for the ${role} position at ${company} and wanted to reach out directly to express my genuine enthusiasm.

Having built applications using ${skills || 'modern development stacks'}, I admire ${company}'s approach to engineering and would love to contribute to your team's upcoming initiatives.

I have attached my resume for your convenience and would welcome the opportunity to briefly speak about how my background can support your roadmap.

Thank you very much for your time.

Best regards,
${profile?.headline || 'Candidate'}
${profile?.portfolioUrl || profile?.githubUrl || ''}`
  };
}

/**
 * Heuristic fallback parser when no API key is set
 */
function fallbackHeuristicParser(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let role = '';
  let company = '';
  let salary = '';

  for (const line of lines.slice(0, 10)) {
    if (/title|role|position/i.test(line) && line.includes(':')) {
      role = line.split(':')[1].trim();
    } else if (/company|organization/i.test(line) && line.includes(':')) {
      company = line.split(':')[1].trim();
    } else if (!role && /developer|engineer|designer|manager|lead|intern/i.test(line) && line.length < 50) {
      role = line;
    } else if (!company && /at\s+([A-Z][a-zA-Z0-9&.\s]+)/.test(line)) {
      const match = line.match(/at\s+([A-Z][a-zA-Z0-9&.\s]+)/);
      if (match) company = match[1].trim();
    }
  }

  const salaryMatch = text.match(/(\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*(?:k|per year|annually|\/yr))?|\d+k(?:\s*-\s*\d+k)?)/i);
  if (salaryMatch) {
    salary = salaryMatch[0];
  }

  const commonSkills = ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'SQL', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'];
  const matchedSkills = commonSkills.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(text));

  return {
    role: role || (lines[0]?.length < 50 ? lines[0] : 'Software Engineer'),
    company: company || (lines[1]?.length < 40 ? lines[1] : ''),
    salary: salary || '',
    applicationType: /campus|college|university|grad/i.test(text) ? 'college' : 'self',
    jobDescription: text.slice(0, 1500),
    keySkills: matchedSkills
  };
}
