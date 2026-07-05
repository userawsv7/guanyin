import { NextResponse } from 'next/server';
import { UniversalPipelineOrchestrator } from '@/lib/guanyin/core/Orchestrator';

const orchestrator = new UniversalPipelineOrchestrator();

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Payload stream data cannot be blank entries." }, { status: 400 });
    }

    const baseContext = orchestrator.handlePayload(message);
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return NextResponse.json({
        ...baseContext,
        finalOutputManifest: {
          conversationalGreeting: "System Notice: Pipeline running locally.",
          structuralSummary: "Please add your GROQ_API_KEY in the Vercel dashboard to unlock full AI reasoning.",
          verificationSteps: ["Add the environment variable in Vercel settings.", "Trigger a redeploy."]
        },
        pipelineAuditLog: [...baseContext.pipelineAuditLog, "[Inference Layer]: Missing API key. Running locally."]
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Updated to the correct active model tier
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are the core intelligence processor of the Guanyin Technical Reasoning Fabric.
            The current pipeline execution lane is: ${baseContext.detectedIntent}.
            Reply with a valid JSON object matching this exact schema:
            {
              "systemObjective": "Description of user goal",
              "observations": [{"id": "OBS-001", "literalContent": "Fact string", "derivedWeight": "HIGH/LOW"}],
              "retrievedKnowledge": [{"domainConcept": "Concept name", "mechanicsSummary": "Mechanics summary"}],
              "hypotheses": [{"targetMechanism": "Logic failure breakdown", "contradictionsIdentified": [], "isolatedConfidence": "HIGH/MEDIUM/LOW"}],
              "risksAndActions": {
                "evaluationVerdict": "ALLOW/REQUIRES_CONFIRMATION/BLOCK",
                "safeSteps": ["Step 1..."],
                "fallbackRollbackVectors": ["Fallback plan"]
              },
              "finalOutputManifest": {
                "conversationalGreeting": "Greeting",
                "structuralSummary": "Engineering summary findings",
                "verificationSteps": ["Verification steps"]
              }
            }`
          },
          {
            role: "user",
            content: `Raw Input:\n${message}`
          }
        ],
        temperature: 0.15
      })
    });

    const parsedJsonText = await response.json();
    
    if (!parsedJsonText.choices || !parsedJsonText.choices[0]) {
      throw new Error(parsedJsonText.error?.message || "Invalid response returned from Groq gateway.");
    }

    const cleanOutput = JSON.parse(parsedJsonText.choices[0].message.content);

    return NextResponse.json({
      ...baseContext,
      systemObjective: cleanOutput.systemObjective || "Agnostic validation.",
      observations: cleanOutput.observations || baseContext.observations,
      retrievedKnowledge: cleanOutput.retrievedKnowledge || [],
      hypotheses: cleanOutput.hypotheses || [],
      risksAndActions: cleanOutput.risksAndActions || baseContext.risksAndActions,
      finalOutputManifest: cleanOutput.finalOutputManifest || baseContext.finalOutputManifest,
      pipelineAuditLog: [...baseContext.pipelineAuditLog, "[Groq Inference Fabric]: Live data merged successfully."]
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Pipeline failure during live inference execution routines." 
    }, { status: 500 });
  }
}
