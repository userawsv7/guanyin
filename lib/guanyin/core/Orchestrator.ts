import { UniversalContext, UniversalPipelineLayer } from './Context';
import { 
  InputNormalizationAndIntentLayer, 
  EvidenceAndObservationLayer, 
  AbstractGraphBuilderLayer
} from '../layers/CoreLayers';

export class UniversalPipelineOrchestrator {
  private readonly runningLayers: UniversalPipelineLayer[] = [
    new InputNormalizationAndIntentLayer(),
    new EvidenceAndObservationLayer(),
    new AbstractGraphBuilderLayer()
  ];

  public handlePayload(rawPayloadString: string): UniversalContext {
    let context: UniversalContext = {
      eventTokenId: `GNYN-TX-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      normalizedInput: { payloadValue: rawPayloadString, matchedTypes: [] },
      detectedIntent: "LEARNING_KNOWLEDGE",
      metadata: { requestTimestamp: Date.now(), evaluationProcessingRoute: "Serverless Vercel Node Layer" },
      observations: [],
      relationships: { coreTopologyNodes: [], coreTopologyEdges: [] },
      retrievedKnowledge: [],
      hypotheses: [],
      risksAndActions: { evaluationVerdict: "ALLOW", safeSteps: [], fallbackRollbackVectors: [] },
      finalOutputManifest: { conversationalGreeting: "", structuralSummary: "", verificationSteps: [] },
      pipelineAuditLog: []
    };

    for (const layer of this.runningLayers) {
      context = layer.execute(context);
    }

    return context;
  }
}
