import { NextResponse } from 'next/server';
import { UniversalPipelineOrchestrator } from '@/lib/guanyin/core/Orchestrator';

const orchestrator = new UniversalPipelineOrchestrator();

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Payload stream data cannot be blank entries." }, { status: 400 });
    }

    // 1. Force the strict, local, immutable analysis logic tracking steps
    const baseContext = orchestrator.handlePayload(message);
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      // Clean dynamic operational fallback warning if Vercel secrets are not injected yet
      return NextResponse.json({
        ...baseContext,
        finalOutputManifest: {
          conversationalGreeting: "System Mode Notice: Guanyin core pipeline is active locally.",
          structuralSummary: "Please mount your [GROQ_API_KEY] environment token variable within your cloud panel configurations to toggle live intelligence loops.",
          verificationSteps: ["Mount environment variable parameters.", "Deploy code package updates."]
        },
        pipelineAuditLog: [...baseContext.pipelineAuditLog, "[Inference Layer Warning]: Missing live API target keys. Reverting configuration to baseline mock manifests."]
      });
    }

    // 2. Dispatch data payload structures directly to Groq's low-latency inference matrix
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-specdec",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are the core intelligence processor of the Guanyin Technical Reasoning Fabric.
            The current pipeline execution lane is: ${baseContext.detectedIntent}.
            
            Observe facts and system constraints directly. Avoid guessing or template answers.
            You must reply with a valid JSON object matching this exact structural schema contract:
            {
              "systemObjective": "Clear description of what the user is attempting to perform or fix",
              "observations": [{"id": "OBS-001", "literalContent": "Clean fact value extracted", "derivedWeight": "HIGH/LOW"}],
              "retrievedKnowledge": [{"domainConcept": "Technical concept/Mechanism name", "mechanicsSummary": "How it scales or behaves under the hood rules"}],
              "hypotheses": [{"targetMechanism": "Detailed breakdown of the underlying logic failure cause", "contradictionsIdentified": [], "isolatedConfidence": "HIGH/MEDIUM/LOW"}],
              "risksAndActions": {
                "evaluationVerdict": "ALLOW/REQUIRES_CONFIRMATION/BLOCK",
                "safeSteps": ["Step 1...", "Step 2..."],
                "fallbackRollbackVectors": ["Definitive rollback execution path rules"]
              },
              "finalOutputManifest": {
                "conversationalGreeting": "Professional tone greetings",
                "structuralSummary": "Pristine engineering summary of findings or explanations",
                "verificationSteps": ["How to mathematically or technically verify success status"]
              }
            }`
          },
          {
            role: "user",
            content: `Raw Input Data String:\n${message}\n\nPre-Processed Types: ${baseContext.normalizedInput.matchedTypes.join(', ')}`
          }
        ],
        temperature: 0.15
      })
    });

    const parsedJsonText = await response.json();
    const cleanOutput = JSON.parse(parsedJsonText.choices[0].message.content);

    // 3. Perform immutable context map merging
    const completeMergedContext = {
      ...baseContext,
      systemObjective: cleanOutput.systemObjective || "Agnostic validation.",
      observations: cleanOutput.observations || baseContext.observations,
      retrievedKnowledge: cleanOutput.retrievedKnowledge || [],
      hypotheses: cleanOutput.hypotheses || [],
      risksAndActions: cleanOutput.risksAndActions || baseContext.risksAndActions,
      finalOutputManifest: cleanOutput.finalOutputManifest || baseContext.finalOutputManifest,
      pipelineAuditLog: [...baseContext.pipelineAuditLog, "[Groq Inference Fabric]: Live dynamic reasoning metrics combined cleanly into immutable context maps."]
    };

    return NextResponse.json(completeMergedContext);
  } catch (error) {
    return NextResponse.json({ error: "Pipeline failure during live inference execution routines." }, { status: 500 });
  }
}
